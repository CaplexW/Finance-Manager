import express, { Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { AuthedRequest, checkAuth } from '../middleware/auth.middleware.ts';
import Operation, { OperationDocument } from '../../db/models/Operation.ts';
import { getDisplayDate } from '../utils/formatDate.ts';
import showError from '../utils/console/showError.ts';
import User from '../../db/models/User.ts';
import Category from '../../db/models/Category.ts';
import calculateAmount from '../../client/app/utils/calculateAmount.ts';
import checkRequest from '../utils/checkRequest.ts';
import serverError from '../utils/errors/fromServerToClient/serverError.ts';
import sendBadRequest from '../utils/errors/fromServerToClient/sendBadRequest.ts';
import sendForbidden from '../utils/errors/fromServerToClient/sendForbidden.ts';
import sendAuthError from '../utils/errors/fromServerToClient/sendAuthError.ts';
import showElement from '../utils/console/showElement.ts';
import extractDataFromCSV from '../utils/import/extractDataFromCSV.ts';
import createOperationFromTinkoffData, { OperationData } from '../utils/import/createOperationFromTinkoffData.ts';
import DefaultCategory from '../../db/models/DefaultCategory.ts';
import forEachAsync from '../utils/iterators/forEachAsync.ts';
import { cyanLog } from '../utils/console/coloredLogs.ts';
import roundToHundredths from '../utils/math/roundToHundredths.ts';

const router = express.Router({ mergeParams: true });
const upload = multer({ dest: './src/server/uploads' });

router.get('/', checkAuth, sendList);
router.post('/', checkAuth, create);
router.patch('/', checkAuth, update);
router.patch('/update-category-by-name', checkAuth, updateCategoryByName);
router.delete('/:operationId', checkAuth, remove);
router.post('/upload/csv/tinkoff', checkAuth, upload.single('file'), importCSVTinkoff);

async function sendList(req: AuthedRequest, res: Response) {
  const thisPlace = 'operation/sendList';
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    const list = await Operation.find({ user: req.user._id });

    res.status(200).send(list);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}

async function create(req: AuthedRequest, res: Response) {
  // request = {
  //   name: string,
  //   amount: number,
  //   category: string,
  //   date?: string,
  // }
  const thisPlace = 'operation/create';
  const requestBody = ['name', 'amount', 'category'];
  const requestIsOk = checkRequest(req, requestBody);
  try {
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const categoryId: string = req.body.category;
    const authedownerId: string = req.user?._id;
    const operationCategory = await findCategoryById(req.body.category);
    if (!operationCategory) return sendNotFound(res, 'category', categoryId);

    const operationData = {
      ...req.body,
      user: authedownerId,
      amount: await calculateAmount(req.body, operationCategory.isIncome),
      date: req.body.date ? req.body.date : getDisplayDate(new Date),
    };
    const newOperation = await Operation.create(operationData);
    const hostUser = await User.findById(newOperation.user);
    if (hostUser) {
      hostUser.operations.push(newOperation._id);
      await hostUser.updateOne({ currentBalance: roundToHundredths(hostUser.currentBalance + newOperation.amount) });
      await hostUser.save();
    }

    res.status(201).send(newOperation);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}

async function importCSVTinkoff(req: AuthedRequest, res: Response) {
  const thisPlace = 'operation/import/csv/tinkoff';

  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    if (!req.file) return sendNotFound(res, 'imported file');

    const authedUser = req.user._id;
    const rawData = await extractDataFromCSV(req.file);
    if (!rawData) return serverError(res, 'rawData');

    rawData.shift();
    const operationsData = await createOperationFromTinkoffData(rawData);
    const existingOperations = await Operation.find({
      user: authedUser,
      time: { $exists: true }
    });
    const uniqOperationsData = operationsData.filter((newOperation) => {
      const result = existingOperations.some((operation: OperationDocument) => isOperationDuplicate(newOperation, operation));
      return !result;
    });
    

    const operations = await Promise.all(uniqOperationsData.map(async (operationData) => {
      operationData.user = authedUser;
      const operation = await Operation.create(operationData);
      return operation;
    }));
    if (operations) {
      const hostUser = await User.findById(req.user);
      let balanceChange = 0;
      if (hostUser) {
        await forEachAsync(operations, async (newOperation) => {
          await hostUser.operations.push(newOperation._id);
          balanceChange = roundToHundredths(balanceChange + newOperation.amount);
        });
        await hostUser.updateOne({ currentBalance: roundToHundredths(hostUser.currentBalance + balanceChange) });
        await hostUser.save();
      }
    }

    res.status(200).send(operations);
    fs.rm(req.file.path, cyanLog);
  } catch (err) {
    showElement(err, 'err');
    serverError(res, 'operation/import');
  }
}

async function update(req: AuthedRequest, res: Response) {
  // HINT
  // request = {
  //   _id: string,
  //   user: string,
  //   name?: string,
  //   amount?: number,
  //   category?: string,
  // }
  const thisPlace = 'operation/update';
  const body = ['_id', 'user'];
  const requestIsOk = checkRequest(req, body);
  try {
    if (!requestIsOk) return sendBadRequest(res, thisPlace);
    const authedUser = req.user?._id;
    const isPermitted: boolean = authedUser === req.body.user;
    if (!isPermitted) return sendForbidden(res, thisPlace);
    const currentOperation = await Operation.findById(req.body._id);
    if (!currentOperation) return sendNotFound(res, 'operation', req.body._id);
    const hostUser = await User.findById(authedUser);
    if (!hostUser) return sendNotFound(res, 'user', authedUser);
    const operationCategory = await findCategoryById(req.body.category);
    if (!operationCategory) return sendNotFound(res, 'category', req.body.category);

    const newAmount = calculateAmount(req.body, operationCategory.isIncome);
    const balanceDifference = newAmount - currentOperation.amount;
    const newData = { ...req.body, amount: newAmount };
    const updatedOperation = await Operation.findByIdAndUpdate(req.body._id, newData, { new: true });
    await hostUser.updateOne({ currentBalance: hostUser.currentBalance + balanceDifference });
    await hostUser.save(); //TODO Проверить надобность строчки.

    res.status(203).send(updatedOperation);
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }

}

/**
 * Обновляет категорию для операций с заданным именем и изначальной категорией
 * PATCH /operations/update-category-by-name
 * Тело запроса: { name: string, newCategoryId: string, initialCategoryId: string }
 */
async function updateCategoryByName(req: AuthedRequest, res: Response) {
  const thisPlace = 'operation/update-category-by-name';
  const { name, newCategoryId, initialCategoryId } = req.body;

  try {
    // Проверка авторизации
    if (!req.user) return sendAuthError(res, thisPlace);
    
    // Валидация входных данных
    if (!name || !newCategoryId || !initialCategoryId) {
      return sendBadRequest(res, 'Отсутствует имя операции, ID новой категории или ID изначальной категории', thisPlace);
    }

    const userId = req.user._id;

    // 1. Проверяем, существует ли новая категория
    const newCategory = await findCategoryById(newCategoryId);
    if (!newCategory) {
      return sendNotFound(res, 'category', newCategoryId);
    }

    // 2. Проверяем, существует ли изначальная категория
    const initialCategory = await findCategoryById(initialCategoryId);
    if (!initialCategory) {
      return sendNotFound(res, 'initial category', initialCategoryId);
    }

    // 3. Находим все операции пользователя с указанным именем И изначальной категорией
    const operations = await Operation.find({
      user: userId,
      name: name,
      category: initialCategoryId,
    });

    if (!operations.length) {
      return sendNotFound(res, 'operations with this name and initial category', name);
    }

    // 4. Массовое обновление категорий через bulkWrite (эффективно)
    const bulkOps = operations.map((op) => ({
      updateOne: {
        filter: { _id: op._id },
        update: { category: newCategoryId },
      },
    }));

    await Operation.bulkWrite(bulkOps);

    // 5. Корректируем баланс пользователя, если изменился тип категории (доход ↔ расход)
    if (initialCategory.isIncome !== newCategory.isIncome) {
      const hostUser = await User.findById(userId);
      if (!hostUser) {
        return sendNotFound(res, 'user', userId);
      }

      // Сумма всех операций с данным именем и изначальной категорией
      const totalAmount = operations.reduce((sum, op) => roundToHundredths(sum + op.amount), 0);

      // Если старая категория была доходом, а новая — расходом (или наоборот),
      // нужно скорректировать баланс на удвоенную сумму
      const balanceChange = newCategory.isIncome
        ? totalAmount * 2  // Было -totalAmount, стало +totalAmount → разница +2*totalAmount
        : -totalAmount * 2; // Было +totalAmount, стало -totalAmount → разница -2*totalAmount

      await hostUser.updateOne({
        currentBalance: roundToHundredths(hostUser.currentBalance + balanceChange),
      });
      await hostUser.save();
    }

    res.status(200).send({ 
      success: true, 
      updatedCount: operations.length,
      message: `Категория обновлена для ${operations.length} операций`
    });
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}

async function remove(req: AuthedRequest, res: Response) {
  const thisPlace = 'operation/remove';
  const { operationId } = req.params;
  try {
    if (!req.user) return sendAuthError(res, thisPlace);
    const removingOperation = await Operation.findById(operationId);
    if (!removingOperation) return sendNotFound(res, 'operation', operationId);
    const ownerId = removingOperation.user.toString();
    const authedId = req.user._id;
    const isPermitted = (authedId === ownerId);
    if (!isPermitted) sendForbidden(res, thisPlace);
    const hostUser = await User.findById(ownerId);
    if (!hostUser) return sendNotFound(res, 'user', ownerId);

    const result = await removingOperation.deleteOne();
    const filtered = hostUser.operations.filter((op) => op.toString() !== operationId);
    const newBalance = roundToHundredths(hostUser.currentBalance - removingOperation.amount);
    await hostUser.updateOne({ currentBalance: newBalance, operations: filtered });

    res.status(200).send({ result: result.deletedCount, newBalance });
  } catch (err) {
    showError(err);
    serverError(res, thisPlace);
  }
}


function sendNotFound(response: Response, object: string, id: string = '') {
  const message: string = id ? `${object} with id ${id} not found` : `${object} not found`;
  response.status(404).send({ message });
}


async function findCategoryById(categoryId: string) {
  const defaultCategory = await DefaultCategory.findById(categoryId);
  if (defaultCategory) return defaultCategory;

  const customCategory = await Category.findById(categoryId);
  if (customCategory) return customCategory;

  return null;
}

function isOperationDuplicate(newOperation: OperationData, existingOperations: OperationDocument) {
  return (
    newOperation.date === existingOperations.date
    && newOperation.time === existingOperations.time
    && newOperation.amount === existingOperations.amount
  );
}


export default router;