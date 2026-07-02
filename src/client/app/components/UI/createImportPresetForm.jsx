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

export default function CreateImportPresetForm({ onClose = null, onCreateCategory = null }) {
  const dispatch = useDispatch();
  const categories = useSelector(getCategoriesList());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatorConfig = {
    importConditions: {
      custom: {
        message: 'Необходимо заполнить поле для импорта',
        isValid: (value) => {
          return value.importName !== '' || value.importCategory !== null || value.importAmount !== '';
        },
      },
    },
    assignValues: {
      custom: {
        message: 'Необходимо заполнить поле для обработки',
        isValid: (value) => {
          return value.assignName !== '' || value.assignCategory !== null || value.assignAmount !== '';
        },
      },
    },
    importAmount: {
      isNumber: {
        message: 'Сумма должна быть числом',
      },
    },
    assignAmount: {
      isNumber: {
        message: 'Сумма должна быть числом',
      },
    },
  };

  async function handleCreate(rawData) {
    setIsSubmitting(true);
    const loadingToast = displayLoading('Создание типовой операции...');

    try {
      const importConditions = {};
      if (rawData.importName !== '') importConditions.name = rawData.importName;
      if (rawData.importCategory !== null) importConditions.category = rawData.importCategory.value;
      if (rawData.importAmount !== '') importConditions.amount = parseFloat(rawData.importAmount);

      const assignValues = {};
      if (rawData.assignName !== '') assignValues.name = rawData.assignName;
      if (rawData.assignCategory !== null) assignValues.category = rawData.assignCategory.value;
      if (rawData.assignAmount !== '') assignValues.amount = parseFloat(rawData.assignAmount);

      const presetData = {
        importConditions,
        assignValues,
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
    onCreateCategory(enteredName);
  }

  function handleClose() {
    onClose();
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
      <FieldInput label="Сумма" name="importAmount" type="number" />

      <h3>Присваиваемые значения</h3>
      <SelectInputWithCreate
        data={categories}
        label="Категория"
        name="assignCategory"
        onCreate={handleCreateCategory}
      />
      <FieldInput label="Название" name="assignName" />
      <FieldInput label="Сумма" name="assignAmount" type="number" />

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
