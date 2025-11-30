import React from 'react';
import Form from '../common/form';
import FieldInput from '../common/form/fieldInput';
import SelectInputWithCreate from '../common/form/selectInputWithCreate';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../server/utils/console/showElement';
import capitalize from '../../../../server/utils/capitalize';
import { createOperation } from '../../store/operations';
import { updateUserBalance } from '../../store/user';
import { Category } from '../../types/types';

type CreateOperationPayload = {
  name: string;
  date: string;
  category: string;
  amount: number;
};

interface CreateOperationFormProps {
  onCreateCategory?: (enteredName: string, parent?: React.RefObject<HTMLDialogElement>) => void;
  onClose?: () => void;
  parent?: React.RefObject<HTMLDialogElement>;
}

export default function CreateOperationForm({ onCreateCategory, onClose, parent }: CreateOperationFormProps) {
  const dispatch = useDispatch();
  const categories = useSelector(getCategoriesList) as Category[];
  const emptyFields = { operationName: '', category: '', amount: '', date: '' };
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

  async function handleCreate(rawData: Record<string, any>) {
    const normolizedData: CreateOperationPayload = {
      name: capitalize(rawData.operationName?.trim() || rawData.category.label),
      date: rawData.date,
      category: rawData.category.value,
      amount: parseFloat(rawData.amount),
    };
    const result = dispatch(createOperation(normolizedData));
    if (result) {
      const category = categories.find((cat) => cat._id === normolizedData.category);
      if (category) {
        const amount = category.isIncome ? normolizedData.amount : -normolizedData.amount;
        dispatch(updateUserBalance(amount));
      }
      handleClose();
    }
  }
  function handleCreateCategory(enteredName: string) {
    onCreateCategory?.(enteredName, parent);
  }
  function handleClose() { onClose?.(); }

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
}

