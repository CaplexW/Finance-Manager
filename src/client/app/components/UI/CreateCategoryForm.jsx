import React from 'react';
import PropTypes from 'prop-types';
import FieldInput from '../common/form/fieldInput';
import Form, { Checkbox } from '../common/form';
import closeModalWindow from '../../../../utils/modals/closeModalWindow';
import categoriesService from '../../services/categories.service';
import showElement from '../../../../utils/console/showElement';
import openModalById from '../../../../utils/modals/openModalById';

export default function CreateCategoryForm({ enteredName, onClose }) {
  const existingData = { name: enteredName || '', color: "#fff", income: false };
  const validatorConfig = {};

  function handleClose() { onClose(); }
  async function handleCreate(data) {
    const categoryData = {
      name: data.name,
      color: data.color,
      income: data.income,
    };

    const result = await categoriesService.create(categoryData);
    showElement(result, 'result');

    handleClose();
  }
  
  return (
    <Form defaultData={existingData} onSubmit={handleCreate} validatorConfig={validatorConfig} >
      <FieldInput label="Название новой категории" name="name" />
      <FieldInput label="Цвет новой категории" name="color" type="color" />
      <Checkbox label="Категория является доходной" name='income' />
      <div className="button-container">
        <button className='add-btn' type='submit' >Создать</button>
        <button className='cancel-btn' onClick={handleClose} type='button'>Отмена</button>
      </div>
    </Form>
  );
};

CreateCategoryForm.propTypes = {
  enteredName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

