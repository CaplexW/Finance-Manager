import React from 'react';
import Form from '../common/form';
import FieldInput from '../common/form/fieldInput';
import SelectInputWithCreate from '../common/form/selectInputWithCreate';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../server/utils/console/showElement';
import { updateOperation } from '../../store/operations';
import { updateUserBalance } from '../../store/user';
import capitalize from '../../../../server/utils/capitalize';
import { Category, Operation } from '../../types/types';

const emptyObject: Partial<Operation> = {};

interface EditOperationFormProps {
  onClose?: () => void;
  existingData?: Partial<Operation>;
  onCreateCategory?: (enteredName: string, parent?: React.RefObject<HTMLDialogElement>) => void;
  parent?: React.RefObject<HTMLDialogElement>;
}

export default function EditOperationForm({
  onClose,
  existingData = emptyObject,
  onCreateCategory,
  parent,
}: EditOperationFormProps) {
  if (!existingData.date) return null;

  const dispatch = useDispatch();
  const categories = useSelector(getCategoriesList) as Category[];
  const oldCategory = categories.find((c) => c._id === existingData.category);
  if (!oldCategory) return null;
  const categoryName = oldCategory.name;
  const validatorConfig = {
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
    date: existingData.date,
    amount: Math.abs(parseFloat(String(existingData.amount ?? 0))),
  };

  async function handleUpdate(inputValue: Record<string, any>) {
    const normolizedData = {
      ...existingData,
      name: capitalize(inputValue.name?.trim() || inputValue.category.label),
      date: inputValue.date || existingData.date,
      category: inputValue.category.value,
      amount: Math.abs(parseFloat(inputValue.amount)),
    } as Operation;
    const result = dispatch(updateOperation(normolizedData));
    if (result) {
      const oldAmount = existingData.amount ?? 0;
      const newCategory = categories.find((cat) => cat._id === normolizedData.category);
      if (!newCategory) return;
      const newAmount = newCategory.isIncome ? normolizedData.amount : -normolizedData.amount;
      const difference = newAmount - oldAmount;

      dispatch(updateUserBalance(difference));
      handleClose();
    };
  }
  function handleClose() { onClose?.(); }
  function handleCreateCategory(enteredName: string) {
    onCreateCategory?.(enteredName, parent);
  }

  return (
    <Form defaultData={displayedData} onSubmit={handleUpdate} validatorConfig={validatorConfig} >
      <SelectInputWithCreate data={categories} label="Категория" name="category" onCreate={handleCreateCategory} />
      <FieldInput autoFocus label="Название" name="name" />
      <FieldInput label="Сумма" minimumValue={0.01} name="amount" type="number" />
      <FieldInput label="Дата" name="date" type="date" />
      <div className="button-container">
        <button className='submit-btn' type='submit' >Изменить</button>
        <button className='cancel-btn' onClick={handleClose} type='button'>Отмена</button>
      </div>
    </Form>
  );
}


