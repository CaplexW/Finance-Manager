import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from '../common/form';
import Checkbox from '../common/form/checkbox';
import FieldInput from '../common/form/fieldInput';
import SelectInputWithCreate from '../common/form/selectInputWithCreate';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../server/utils/console/showElement';
import { updateOperation, updateOperationsCategoryByName } from '../../store/operations';
import { updateUserBalance } from '../../store/user';
import capitalize from '../../../../server/utils/capitalize';

const emptyObject = {};

export default function EditOperationForm({ onClose = null, existingData = emptyObject, onCreateCategory }) {
  if (!existingData.date) return null;

  const dispatch = useDispatch();
  const categories = useSelector(getCategoriesList());
  const oldCategory = categories.find((c) => c._id === existingData.category);
  const categoryName = oldCategory?.name || '';

  // Состояния для чекбокса массового обновления
  const [applyToAllWithSameName, setApplyToAllWithSameName] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [initialCategoryId, setInitialCategoryId] = useState(existingData.category);

  // Показываем чекбокс, если категория изменилась
  useEffect(() => {
    setShowCheckbox(existingData.category !== initialCategoryId);
  }, [existingData.category, initialCategoryId]);

  const validatorConfig = {
    amount: {
      isRequired: { message: 'Введите сумму' },
      isPositive: { message: 'Сумма должна быть положительной' },
    },
    date: { isRequired: { message: 'Выберите дату' } },
    category: { isRequired: { message: 'Выберите категорию' } },
  };

  const displayedData = {
    ...existingData,
    category: { label: categoryName, value: existingData.category },
    date: existingData.date,
    amount: Math.abs(parseFloat(existingData.amount)),
  };

  async function handleUpdate(inputValue) {
    const normalizedData = {
      ...existingData,
      name: capitalize(inputValue.name?.trim() || inputValue.category.label),
      date: inputValue.date || existingData.date,
      category: inputValue.category.value,
      amount: Math.abs(parseFloat(inputValue.amount)),
    };

    // Обновляем текущую операцию
    const updateResult = await dispatch(updateOperation(normalizedData));

    if (!updateResult) {
      return;
    }

    // Если нужно применить ко всем операциям с таким же именем и изначальной категорией
    if (inputValue.bulk) {
      const bulkUpdateResult = await dispatch(updateOperationsCategoryByName(
        normalizedData.name,
        normalizedData.category,
        existingData.category
      ));
      if (!bulkUpdateResult) {
        console.error('Не удалось обновить категории для всех операций');
      }
    }

    const oldAmount = existingData.amount;
    const newCategory = categories.find((cat) => cat._id === normalizedData.category);
    const newAmount = newCategory?.isIncome ? normalizedData.amount : -normalizedData.amount;
    const difference = newAmount - oldAmount;
    dispatch(updateUserBalance(difference));

    handleClose();
  }

  function handleClose() {
    onClose?.();
  }

  function handleCreateCategory(enteredName) {
    onCreateCategory?.(enteredName);
  }

  function handleCategoryChange(selectedOption) {
    if (selectedOption && selectedOption.value.value !== initialCategoryId) {
      setShowCheckbox(true);
    } else {
      setShowCheckbox(false);
      setApplyToAllWithSameName(false);
    }
  }

  return (
    <Form defaultData={displayedData} onSubmit={handleUpdate} validatorConfig={validatorConfig}>
      <SelectInputWithCreate
        data={categories}
        label="Категория"
        name="category"
        onValueChange={handleCategoryChange}
        onCreate={handleCreateCategory}
      />
      <FieldInput autoFocus label="Название" name="name" />
      <FieldInput label="Сумма" minimumValue={0.01} name="amount" type="number" />
      <FieldInput label="Дата" name="date" type="date" />
      <Checkbox label="Изменить категорию одноименных" name='bulk' hidden={!showCheckbox} />

      <div className="button-container">
        <button className='submit-btn' type='submit'>Изменить</button>
        <button className='cancel-btn' onClick={handleClose} type='button'>Отмена</button>
      </div>
    </Form>
  );
}

EditOperationForm.propTypes = {
  existingData: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    amount: PropTypes.number,
    date: PropTypes.string,
  }),
  onClose: PropTypes.func,
  onCreateCategory: PropTypes.func,
};