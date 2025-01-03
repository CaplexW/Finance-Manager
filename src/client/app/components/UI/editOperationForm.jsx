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
import { formatDisplayDateFromInput, formatInputDateFromDisplay } from '../../../../utils/formatDate';
import { updateUserBalance } from '../../store/user';

const emptyObject = {};

export default function EditOperationForm({ onClose = null, existingData = emptyObject, }) {
  if(!existingData.date) return;

  const dispatch = useDispatch();
  const categories = useSelector(getCategoriesList());
  const oldCategory = categories.filter((c) => c._id === existingData.category)[0];
  const categoryName = oldCategory.name;
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
    category: { label: categoryName, value: existingData.category },
    date: formatInputDateFromDisplay(existingData.date),
    amount: Math.abs(parseFloat(existingData.amount)),
  };

  async function handleUpdate(inputValue) {
    const normolizedData = {
      ...existingData,
      name: inputValue.name.trim(),
      date: formatDisplayDateFromInput(inputValue.date),
      category: inputValue.category.value,
      amount: Math.abs(parseFloat(inputValue.amount)),
    };
    const result = dispatch(updateOperation(normolizedData));
    if (result) {
      const oldAmount = existingData.amount;
      const newCategory = categories.find((cat) => cat._id === normolizedData.category);
      const newAmount = newCategory.isIncome ? normolizedData.amount : -normolizedData.amount;
      const difference = newAmount - oldAmount;

      dispatch(updateUserBalance(difference));
      handleClose();
    };
  }
  function handleClose() { onClose(); }

  return (
    <Form defaultData={displayedData} id="edit-operation-form" onSubmit={handleUpdate} validatorConfig={validatorConfig} >
      <SelectInputWithCreate data={categories} label="Категория" name="category" />
      <FieldInput autoFocus label="Название" name="name" />
      <FieldInput label="Сумма" minimumValue={1} name="amount" type="number" />
      <FieldInput label="Дата" name="date" type="date" />
      <div className="button-container">
        <button className='submit-btn' type='submit' >Изменить</button>
        <button className='cancel-btn' onClick={handleClose} type='button'>Отмена</button>
      </div>
    </Form>
  );
};

EditOperationForm.propTypes = {
  existingData: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    amount: PropTypes.number,
    date: PropTypes.string,
  }),
  onClose: PropTypes.func,
};

function findDifference(oldAmount, newAmount) {
  if (oldAmount === newAmount) return 0;
}