import React from 'react';
import PropTypes from 'prop-types';
import Form from '../common/form';
import FieldInput from '../common/form/fieldInput';
import SelectInputWithCreate from '../common/form/selectInputWithCreate';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../utils/console/showElement';
import { createOperation } from '../../store/operations';
import { formatDisplayDateFromInput } from '../../../../utils/formatDate';

export default function CreateOperationForm({ onCreateCategory, onClose }) {
  const dispatch = useDispatch();
  const categories = useSelector(getCategoriesList());
  const emptyFields = { operationName: '', category: '', amount: '', date: '' };
  const validatorConfig = {
    operationName: {
      isRequired: {
        message: 'Введите название',
      },
    },
    amount: {
      isRequired: {
        message: 'Введите сумму',
      },
      isPositive: {
        message: 'Сумма должна быть положительной',
      },
    },
    date: {
      isRequired: {
        message: 'Выберите дату',
      },
    },
    category: {
      isRequired: {
        message: 'Выберете категорию',
      },
    },
  };
  
  async function handleCreate(rawData) {
    const normolizedData = {
      name: rawData.operationName.trim(),
      date: formatDisplayDateFromInput(rawData.date),
      category: rawData.category.value,
      amount: parseFloat(rawData.amount),
    };
    const result = await dispatch(createOperation(normolizedData));
    if (result) handleClose();
  }
  function handleCreateCategory(enteredName) {
    onCreateCategory(enteredName, parent);
  }
  function handleClose() { onClose(); }

  return (
    <Form dataScheme={emptyFields} onSubmit={handleCreate} validatorConfig={validatorConfig} >
      <SelectInputWithCreate data={categories} label="Категория" name="category" onCreate={handleCreateCategory} />
      <FieldInput autoFocus label="Название" name="operationName" />
      <FieldInput label="Сумма" name="amount" type="number" />
      <FieldInput label="Дата" name="date" type="date" />
      <div className="button-container">
        <button className='add-btn' type='submit' >Добавить</button>
        <button className='cancel-btn' onClick={handleClose} type='button'>Отмена</button>
      </div>
    </Form>
  );
};

CreateOperationForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreateCategory: PropTypes.func.isRequired,
};