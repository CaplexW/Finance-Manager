import React from 'react';
import Form from '../common/form';
import FieldInput from '../common/form/fieldInput';
import SelectInputWithCreate from '../common/form/selectInputWithCreate';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';
import closeModalWindow from '../../../../utils/modals/closeModalWindow';
import showElement from '../../../../utils/console/showElement';
import { createOperation } from '../../store/operations';

export default function CreateOperationForm({ onCreateCategory, parent }) {
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
  const modalId = "add-operation-modal";
  const modal = document.querySelector(`#${modalId}`);
  async function handleCreate(rawData) {
    const normolizedData = {
      name: rawData.operationName.trim(),
      date: rawData.date,
      category: rawData.category.value,
      amount: Number(rawData.amount),
    };
    const result = await dispatch(createOperation(normolizedData));
    if (result) handleClose();
  }
  function handleCreateCategory(enteredName) {
    showElement(parent, 'parent');
    showElement(enteredName, 'enteredName');
    onCreateCategory(enteredName, parent);
  }
  function handleClose() {
    if (modal) closeModalWindow(modal);
  }

  return (
    <Form dataScheme={emptyFields} id="create-operation-form" onSubmit={handleCreate} validatorConfig={validatorConfig} >
      <SelectInputWithCreate data={categories} label="Категория" name="category" onCreate={handleCreateCategory} />
      <FieldInput autoFocus label="Название" name="operationName" />
      <FieldInput label="Сумма" minimumValue={1} name="amount" type="number" />
      <FieldInput label="Дата" name="date" type="date" />
      <div className="button-container">
        <button className='add-btn' type='submit' >Добавить</button>
        <button className='cancel-btn' onClick={handleClose} type='button'>Отмена</button>
      </div>
    </Form>
  );
};