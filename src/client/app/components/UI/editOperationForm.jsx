import React from 'react';
import PropTypes from 'prop-types';
import Form from '../common/form';
import FieldInput from '../common/form/fieldInput';
import SelectInputWithCreate from '../common/form/selectInputWithCreate';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';
import closeModalWindow from '../../../../utils/modals/closeModalWindow';
import showElement from '../../../../utils/console/showElement';
import { updateOperation } from '../../store/operations';

export default function EditOperationForm({ existingData }) {
  const dispatch = useDispatch();
  const categories = useSelector(getCategoriesList());
  const validatorConfig = {
    name: {
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
  const displayedData = {
    ...existingData,
    amount: Math.abs(parseFloat(existingData.amount)),
  };
  async function handleUpdate(inputValue) {
    const normolizedData = {
      ...existingData,
      name: inputValue.name.trim(),
      date: inputValue.date,
      category: inputValue.category.value,
      amount: Math.abs(parseFloat(inputValue.amount)),
    };
    const result = await dispatch(updateOperation(normolizedData));
    if (result) handleClose();
  }
  function handleClose() {
    closeModalWindow(document.querySelector("#edit-operation-modal"));
  }

  return (
    <Form defaultData={displayedData} onSubmit={handleUpdate} validatorConfig={validatorConfig} >
      <SelectInputWithCreate data={categories} label="Категория" name="category" />
      <FieldInput autoFocus label="Название" name="name" />
      <FieldInput label="Сумма" minimumValue={1} name="amount" type="number" />
      <FieldInput label="Дата" name="date" type="date" />
      <div className="button-container">
        <button className='add-btn' type='submit' >Добавить</button>
        <button className='cancel-btn' onClick={handleClose} type='button'>Отмена</button>
      </div>
    </Form>
  );
};

EditOperationForm.propTypes = {
  existingData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
  }),
};
EditOperationForm.defaultProps = {
  existingData: undefined,
};

