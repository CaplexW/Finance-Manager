import React from 'react';
import PropTypes from 'prop-types';
import FieldInput from '../common/form/fieldInput';
import Form, { Checkbox } from '../common/form';
import closeModalWindow from '../../../../utils/modals/closeModalWindow';
import categoriesService from '../../services/categories.service';
import showElement from '../../../../utils/console/showElement';
import openModalById from '../../../../utils/modals/openModalById';
import IconPicker from '../common/form/iconPicker';
import { useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';

export default function CreateCategoryForm({ enteredName, onClose }) {
  const categories = useSelector(getCategoriesList());
  const icons = categories.map((cat) => cat.icon);
  const existingData = { name: enteredName || '', color: "#fff", income: false, icon: '' };
  const validatorConfig = {};

  function handleClose() { onClose(); }
  async function handleCreate(data) {
    const categoryData = {
      name: data.name,
      color: data.color,
      isIncome: data.income,
      icon: data.icon,
    };
    await categoriesService.create(categoryData);
    handleClose();
  }
  
  return (
    <Form defaultData={existingData} onSubmit={handleCreate} validatorConfig={validatorConfig} >
      <FieldInput label="Название новой категории" name="name" />
      <FieldInput label="Цвет новой категории" name="color" type="color" />
      <IconPicker label="Выберете иконку для категории" name="icon" options={icons} pageSize={14} />
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

