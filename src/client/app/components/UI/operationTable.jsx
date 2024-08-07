import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Table from '../common/table';
import { operationPropType } from '../../../../types/propTypes';
import ModalWindow from '../common/modalWindow';
import openModalById from '../../../../utils/modals/openModalById';
import CreateOperationForm from './createOperationForm';
import { useDispatch } from 'react-redux';
import { deleteOperation } from '../../store/operations';
import DeleteButton from '../common/deleteButton';
import EditButton from '../common/editButton';
import showElement from '../../../../utils/console/showElement';
import EditOperationForm from './editOperationForm';
import CategoryLabel from './categoryLabel';
import OperationAmount from './operationAmount';
import operationsService from '../../services/operations.service';
import displayError from '../../../../utils/errors/onClient/displayError';
import CreateCategoryForm from './CreateCategoryForm';
import closeModalWindow from '../../../../utils/modals/closeModalWindow';

export default function OperationTable({ displayedOperations, onSort, sortConfig }) {
  const [editingData, setEditingData] = useState({});
  const [newCategoryName, setNewCategoryName] = useState(null);
  const dispatch = useDispatch();
  const columns = {
    name: {
      path: 'name',
      name: 'Название',
    },
    amount: {
      name: 'Сумма',
      path: 'amount',
      // eslint-disable-next-line react/no-unstable-nested-components
      component: (operation) => <OperationAmount operation={operation} />
    },
    category: {
      name: 'Категория',
      path: 'category',
      // eslint-disable-next-line react/no-unstable-nested-components
      component: (operation) => <CategoryLabel source={operation.category} />,
    },
    date: { path: 'date', name: 'Дата' },
    editButton: { component: renderEditButton },
    deleteButton: { component: renderDeleteButton },
  };

  async function handleEdit(operation) {
    showElement(operation, 'Editing operation...');
  }
  async function handleDelete(id) {
    const isConfirmed = confirm('Вы хотите удалить опирацию?');
    if (isConfirmed) {
      const result = await dispatch(deleteOperation(id));
      showElement(result, 'result');
      // if (result.deleteCount) {
      //   onDelete((prevState) => prevState.filter((op) => op._id !== id)); //TODO Проверить нужно ли иди будет обновлятся с сервера и приходить в компонент обновленным?
      // }
    }
  }
  async function handleImport({ target }) {
    const file = target.files[0];
    if (!file) return displayError('Произошла ошибка! Файл не загружен!');

    showElement(target.name, 'file');
    const formData = new FormData();
    formData.append('file', file);

    let result;
    if (file.type === 'text/csv') result = await operationsService.uploadCSV(formData, target.name);
    // if (type === 'tinkoff/csv') result = await operationsService.uploadCSV(file, 'tinkoff');
    // if (type === 'alfa/excel') result = await operationsService.uploadEXCEL(file, 'alfa');

    if (!result) displayError('Некорректный файл');
    if (result) showElement(result, 'result');
  }
  function OpenAddModal() {
    openModalById('add-operation-modal');
  }
  function OpenEditModal(operation) {
    setEditingData({ ...operation });
    openModalById('edit-operation-modal');
  }
  function renderDeleteButton(operation) {
    return <DeleteButton onDelete={() => handleDelete(operation._id)} />;
  }
  function renderEditButton(operation) {
    return <EditButton onClick={() => OpenEditModal(operation)} />;
  }
  function switchModals(prevModal, nextModal) {
    closeModalWindow(prevModal);
    openModalById(nextModal.id);
  }
  function handleCreateCategory(enteredName, prevModal) {
    const createCategoryModal = document.querySelector('#create-category-modal');
    setNewCategoryName(enteredName);
    switchModals(prevModal, createCategoryModal);
    showElement(enteredName, 'enteredName');
  }

  return (
    <div id='operations-table-container'>
      <Table
        columns={columns}
        data={displayedOperations}
        onAdd={OpenAddModal}
        onDelete={handleDelete}
        onFile={handleImport}
        onSort={onSort}
        searchBar
        sortConfig={sortConfig}
        title="Операции"
      />
      <ModalWindow headTitle="Добавьте операцию" id="add-operation-modal">
        <CreateOperationForm onCreateCategory={handleCreateCategory} />
      </ModalWindow>
      <ModalWindow headTitle="Измените операцию" id="edit-operation-modal">
        <EditOperationForm existingData={editingData} onCreateCategory={handleCreateCategory} />
      </ModalWindow>
      <ModalWindow headTitle="Создайте категорию" id="create-category-modal">
        <CreateCategoryForm enteredName={newCategoryName} />
      </ModalWindow>
    </div>
  );
};
OperationTable.propTypes = {
  displayedOperations: PropTypes.shape(operationPropType).isRequired,
  onSort: PropTypes.func,
  sortConfig: PropTypes.shape({
    path: PropTypes.string.isRequired,
    order: PropTypes.string.isRequired,
  })
};
OperationTable.defaultProps = {
  onSort: undefined,
  sortConfig: undefined,
};
