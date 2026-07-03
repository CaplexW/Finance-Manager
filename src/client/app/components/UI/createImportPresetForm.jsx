import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../common/form';
import FieldInput from '../common/form/fieldInput';
import SelectInputWithCreate from '../common/form/selectInputWithCreate';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';
import importPresetService from '../../services/importPreset.service';
import displayError from '../../utils/errors/onClient/displayError';
import displayLoading from '../../utils/errors/onClient/displayLoading';
import displaySuccess from '../../utils/errors/onClient/displaySuccess';
import { loadImportPresets } from '../../store/importPresets';

const emptyImportConditions = {
  importName: '',
  importCategory: null,
  importAmount: '',
};

const emptyAssignValues = {
  assignName: '',
  assignCategory: null,
  assignAmount: '',
};

export default function CreateImportPresetForm({ onClose = null, onCreateCategory = null, parent = null }) {
  const dispatch = useDispatch();
  const categories = useSelector(getCategoriesList());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatorConfig = {
    importName: {
      isRequired: {
        message: 'Введите название',
      },
    },
    importAmount: {
      isNumber: {
        message: 'Сумма должна быть числом',
      },
    },
    assignName: {
      isRequired: {
        message: 'Введите название',
      },
    },
    assignAmount: {
      isNumber: {
        message: 'Сумма должна быть числом',
      },
    },
  };

  function validateFormData(data) {
    const importConditions = {};
    if (data.importName !== '') importConditions.name = data.importName;
    if (data.importCategory !== null && data.importCategory !== undefined) {
      importConditions.category = data.importCategory.value;
    }
    if (data.importAmount !== '' && !isNaN(parseFloat(data.importAmount))) {
      importConditions.amount = parseFloat(data.importAmount);
    }

    const assignValues = {};
    if (data.assignName !== '') assignValues.name = data.assignName;
    if (data.assignCategory !== null && data.assignCategory !== undefined) {
      assignValues.category = data.assignCategory.value;
    }
    if (data.assignAmount !== '' && !isNaN(parseFloat(data.assignAmount))) {
      assignValues.amount = parseFloat(data.assignAmount);
    }

    if (Object.keys(importConditions).length === 0) {
      displayError('Необходимо заполнить поле для импорта');
      return null;
    }

    if (Object.keys(assignValues).length === 0) {
      displayError('Необходимо заполнить поле для обработки');
      return null;
    }

    return { importConditions, assignValues };
  }

  async function handleCreate(rawData) {
    setIsSubmitting(true);
    const loadingToast = displayLoading('Создание типовой операции...');

    try {
      const validatedData = validateFormData(rawData);
      if (!validatedData) {
        return;
      }

      const presetData = {
        importConditions: validatedData.importConditions,
        assignValues: validatedData.assignValues,
      };

      const newPreset = await importPresetService.create(presetData);
      
      if (newPreset) {
        displaySuccess('Типовая операция успешно создана!');
        dispatch(loadImportPresets());
        handleClose();
      }
    } catch (error) {
      displayError(error.message || 'Ошибка при создании типовой операции');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCreateCategory(enteredName) {
    if (onCreateCategory) {
      onCreateCategory(enteredName);
    }
  }

  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  return (
    <Form
      dataScheme={{ ...emptyImportConditions, ...emptyAssignValues }}
      onSubmit={handleCreate}
      validatorConfig={validatorConfig}
    >
      <h3>Условия импорта</h3>
      <SelectInputWithCreate
        data={categories}
        label="Категория"
        name="importCategory"
        onCreate={handleCreateCategory}
      />
      <FieldInput label="Название" name="importName" />
      <FieldInput label="Сумма" name="importAmount" type="number" step="0.01" />

      <h3>Присваиваемые значения</h3>
      <SelectInputWithCreate
        data={categories}
        label="Категория"
        name="assignCategory"
        onCreate={handleCreateCategory}
      />
      <FieldInput label="Название" name="assignName" />
      <FieldInput label="Сумма" name="assignAmount" type="number" step="0.01" />

      <div className="button-container">
        <button className='add-btn' type='submit' disabled={isSubmitting}>
          Создать
        </button>
        <button className='cancel-btn' onClick={handleClose} type='button' disabled={isSubmitting}>
          Отмена
        </button>
      </div>
    </Form>
  );
}

CreateImportPresetForm.propTypes = {
  onClose: PropTypes.func,
  onCreateCategory: PropTypes.func,
};
