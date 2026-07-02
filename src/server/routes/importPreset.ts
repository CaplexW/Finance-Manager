import express, { Response } from 'express';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import ImportPreset from '../../db/models/ImportPreset.ts';
import showError from '../utils/console/showError.ts';
import sendAuthError from '../utils/errors/fromServerToClient/sendAuthError.ts';
import sendBadRequest from '../utils/errors/fromServerToClient/sendBadRequest.ts';
import { sendNotFound } from '../utils/errors/fromServerToClient/sendNotFound.ts';
import serverError from '../utils/errors/fromServerToClient/serverError.ts';
import { sendAlreadyExists } from '../utils/errors/fromServerToClient/sendAlreadyExists.ts';

const router = express.Router({ mergeParams: true });

router.get('/', checkAuth, getList);
router.post('/', checkAuth, create);
router.delete('/:id', checkAuth, remove);

async function getList(req: AuthedRequest, res: Response) {
  const thisPlace = 'importPreset/getList';
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    const list = await ImportPreset.find({ user: req.user._id }).sort({ serialNumber: 1 });
    res.status(200).send(list);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}

async function create(req: AuthedRequest, res: Response) {
  const thisPlace = 'importPreset/create';
  try {
    if (!req.user) return sendAuthError(res, thisPlace);

    const { importConditions, assignValues } = req.body;

    // Валидация: хотя бы одно поле в importConditions и assignValues
    const hasImportConditions = importConditions && 
      (importConditions.name !== undefined || 
       importConditions.category !== undefined || 
       importConditions.amount !== undefined);
    const hasAssignValues = assignValues && 
      (assignValues.name !== undefined || 
       assignValues.category !== undefined || 
       assignValues.amount !== undefined);

    if (!hasImportConditions) {
      return sendBadRequest(res, 'Необходимо заполнить поле для импорта', thisPlace);
    }
    if (!hasAssignValues) {
      return sendBadRequest(res, 'Необходимо заполнить поле для обработки', thisPlace);
    }

    // Получаем все пресеты пользователя для проверки конфликтов
    const userPresets = await ImportPreset.find({ user: req.user._id });

    // Проверка конфликтов: если сумма указана, то должны отличаться хотя бы один из других параметров
    if (importConditions.amount !== undefined) {
      for (const preset of userPresets) {
        if (preset.importConditions.amount === importConditions.amount) {
          // Проверяем, что хотя бы один из других параметров явно отличается
          const nameDiffers = (importConditions.name !== undefined && preset.importConditions.name !== undefined) 
            ? importConditions.name !== preset.importConditions.name 
            : (importConditions.name !== undefined || preset.importConditions.name !== undefined);
          const categoryDiffers = (importConditions.category !== undefined && preset.importConditions.category !== undefined)
            ? importConditions.category.toString() !== preset.importConditions.category.toString()
            : (importConditions.category !== undefined || preset.importConditions.category !== undefined);

          if (!nameDiffers && !categoryDiffers) {
            return sendAlreadyExists(
              res,
              `Типовая операция №${preset.serialNumber}`,
              `Конфликт с Типовой операцией №${preset.serialNumber}: сумма ${importConditions.amount}, категория ${preset.importConditions.category || 'не указана'}, название ${preset.importConditions.name || 'не указано'}`
            );
          }
        }
      }
    }

    // Проверка конфликтов для других комбинаций (без суммы)
    for (const preset of userPresets) {
      if (preset.importConditions.amount === undefined && importConditions.amount === undefined) {
        const nameMatches = importConditions.name !== undefined && 
          preset.importConditions.name !== undefined &&
          importConditions.name === preset.importConditions.name;
        const categoryMatches = importConditions.category !== undefined && 
          preset.importConditions.category !== undefined &&
          importConditions.category.toString() === preset.importConditions.category.toString();

        if (nameMatches && categoryMatches) {
          return sendAlreadyExists(
            res,
            `Типовая операция №${preset.serialNumber}`,
            `Конфликт с Типовой операцией №${preset.serialNumber}: название "${importConditions.name}", категория "${preset.importConditions.category}"`
          );
        }
      }
    }

    // Получаем максимальный serialNumber для нового пресета
    const maxSerialNumber = userPresets.length > 0 
      ? Math.max(...userPresets.map(p => p.serialNumber))
      : 0;
    const newSerialNumber = maxSerialNumber + 1;

    const newPreset = await ImportPreset.create({
      user: req.user._id,
      serialNumber: newSerialNumber,
      importConditions,
      assignValues,
    });

    res.status(201).send(newPreset);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}

async function remove(req: AuthedRequest, res: Response) {
  const thisPlace = 'importPreset/remove';
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    const { id } = req.params;

    const presetToRemove = await ImportPreset.findById(id);
    if (!presetToRemove) return sendNotFound(res, 'import preset', id);

    const isPermitted = presetToRemove.user.toString() === req.user._id.toString();
    if (!isPermitted) return sendAuthError(res, thisPlace, req.user._id);

    const serialNumberToRemove = presetToRemove.serialNumber;

    // Удаляем пресет
    await ImportPreset.findByIdAndDelete(id);

    // Пересчитываем serialNumber для всех пресетов пользователя с большим номером
    const userPresets = await ImportPreset.find({ user: req.user._id }).sort({ serialNumber: 1 });
    for (let i = 0; i < userPresets.length; i++) {
      const preset = userPresets[i];
      if (preset.serialNumber > serialNumberToRemove) {
        await ImportPreset.findByIdAndUpdate(preset._id, { serialNumber: preset.serialNumber - 1 });
      }
    }

    res.status(200).send({ message: 'Import preset deleted successfully' });
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}

export default router;
