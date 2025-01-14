import React, { useCallback, useState } from 'react';
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../utils/console/showElement';
import EditOperationForm from './editOperationForm';
import CategoryLabel from './categoryLabel';
import OperationAmount from './operationAmount';
import operationsService from '../../services/operations.service';
import displayError from '../../../../utils/errors/onClient/displayError';
import CreateCategoryForm from './CreateCategoryForm';
import closeModalWindow from '../../../../utils/modals/closeModalWindow';
import { updateUserBalance } from '../../store/user';
import { formatDisplayDateFromInput } from '../../../../utils/formatDate';

// TODO 1. Реализовать условный рендеринг модальных окон

export default function OperationTable({
  displayedOperations,
  onDateFilter,
  dateRange,
  onSort = null,
  sortConfig = null,
}) {
  const [editingData, setEditingData] = useState({});
  const [newCategoryName, setNewCategoryName] = useState(null);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const dispatch = useDispatch();

  const columns = {
    name: {
      path: 'name',
      name: 'Название',
    },
    amount: {
      name: 'Сумма',
      path: 'amount',
      component: renderOperationAmount,
    },
    category: {
      name: 'Категория',
      path: 'category',
      component: renderCategoryLabel,
    },
    date: {
      path: 'date',
      name: 'Дата',
      component: renderDisplayDate,
    },
    editButton: { component: renderEditButton },
    deleteButton: { component: renderDeleteButton },
  };

  async function handleDelete(id) {
    const isConfirmed = confirm('Вы хотите удалить опирацию?');
    if (isConfirmed) {
      const result = await dispatch(deleteOperation(id));
      showElement(result, 'result');
      if (result) {
        const operation = displayedOperations.find((op) => op._id === id);
        dispatch(updateUserBalance(-operation.amount));
      }
      // if (result.deleteCount) {
      //   onDelete((prevState) => prevState.filter((op) => op._id !== id)); //TODO Проверить нужно ли иди будет обновлятся с сервера и приходить в компонент обновленным?
      // }
    }
  }
  async function handleImport({ target }) {
    const file = target.files[0];
    if (!file) return displayError('Произошла ошибка! Файл не загружен!');

    const formData = new FormData();
    formData.append('file', file);

    let result;
    if (file.type === 'text/csv') result = await operationsService.uploadCSV(formData, target.name);
    // if (type === 'tinkoff/csv') result = await operationsService.uploadCSV(file, 'tinkoff');
    // if (type === 'alfa/excel') result = await operationsService.uploadEXCEL(file, 'alfa');

    if (!result) displayError('Некорректный файл');
    // TODO отправить результат в стор.
  }

  const handleOpenCreateModal = useCallback(() => setOpenCreateModal(true));
  const handleCloseCreateModal = useCallback(() => setOpenCreateModal(false));

  const handleOpenEditModal = useCallback(() => setOpenEditModal(true));
  const handleCloseEditModal = useCallback(() => setOpenEditModal(false));

  const handleOpenCategoryModal = useCallback(() => setOpenCategoryModal(true));
  const handleCloseCategoryModal = useCallback(() => setOpenCategoryModal(false));

  function OpenEditModal(operation) {
    handleOpenEditModal(true);
    setEditingData({ ...operation });
  }

  // TODO пересмотреть методы, подумать о мемоизации
  function renderDeleteButton(operation) {
    return <DeleteButton onDelete={() => handleDelete(operation._id)} />;
  }
  function renderEditButton(operation) {
    return <EditButton onClick={() => OpenEditModal(operation)} />;
  }
  function renderDisplayDate(operation) {
    return <span>{formatDisplayDateFromInput(operation.date)}</span>;
  }
  function renderOperationAmount(operation) {
    return <OperationAmount operation={operation} />;
  }
  function renderCategoryLabel(operation) {
    return <CategoryLabel categoryId={operation.category} />;
  }

  function switchModals(prevModal, nextModal) {
    closeModalWindow(prevModal);
    openModalById(nextModal.id);
  }
  function handleCreateCategory(enteredName) {
    handleOpenCategoryModal();
    setNewCategoryName(enteredName);
  }

  return (
    <div id='operations-table-container'>
      <Table
        columns={columns}
        data={displayedOperations}
        dateRange={dateRange}
        onAdd={handleOpenCreateModal}
        onDateFilter={onDateFilter}
        onDelete={handleDelete}
        onFile={handleImport}
        onSort={onSort}
        searchBar
        sortConfig={sortConfig}
        title="Операции"
      />
      <ModalWindow headTitle="Добавьте операцию" isOpen={openCreateModal} onClose={handleCloseCreateModal} >
        <CreateOperationForm onCreateCategory={handleCreateCategory} />
      </ModalWindow>
      <ModalWindow headTitle="Измените операцию" isOpen={openEditModal} onClose={handleCloseEditModal} >
        <EditOperationForm existingData={editingData} onCreateCategory={handleCreateCategory} />
      </ModalWindow>
      <ModalWindow headTitle="Создайте категорию" isOpen={openCategoryModal} onClose={handleCloseCategoryModal} >
        <CreateCategoryForm enteredName={newCategoryName} />
      </ModalWindow>
    </div>
  );
};
OperationTable.propTypes = {
  dateRange: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
  displayedOperations: PropTypes.arrayOf(PropTypes.shape(operationPropType).isRequired),
  onDateFilter: PropTypes.func,
  onSort: PropTypes.func,
  sortConfig: PropTypes.shape({
    path: PropTypes.string.isRequired,
    order: PropTypes.string.isRequired,
  })
};
