import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Table from '../common/table/table';
import { operationPropType } from '../../../../types/propTypes';
import ModalWindow from '../common/modalWindow';
import openModalById from '../../../../utils/modals/openModalById';
import CreateOperationForm from './createOperationForm';
import { useDispatch, useSelector } from 'react-redux';
import { addOperations, createOperation, deleteOperation } from '../../store/operations';
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
import { getUserBalance, updateUserBalance } from '../../store/user';
import { formatDisplayDateFromInput } from '../../../../utils/formatDate';
import { alfaIcon, uploadIcon } from '../../../assets/icons';
import T_BANK_ICON from '../../../assets/static_icons/tBankIcon.png';
import DateRangeInput from '../common/form/dateRangeInput';
import ContentBoard from '../common/contentBoard';
import roundToHundredths from '../../../../utils/math/roundToHundredths';
import displayLoading from '../../../../utils/errors/onClient/displayLoading';
import displaySuccess from '../../../../utils/errors/onClient/displaySuccess';
import { toast } from 'react-toastify';
import showError from '../../../../utils/console/showError';

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
  const [fileOptionsIsOpen, setFileOptionsIsOpen] = useState(false);

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
    if (file.type === 'text/csv') {
      const loadingToast = toast.loading('Загрузка...');
      result = await operationsService.uploadCSV(formData, target.name);
      if (result.length > 0) {
        dispatch(addOperations(result));
        const resultAmount = result.reduce((total, op) => roundToHundredths(total + op.amount), 0);
        dispatch(updateUserBalance(resultAmount));
        toast.dismiss(loadingToast);
        displaySuccess('Загрузка завершена!');
      } else {
        displayError('Загрузка не удалась');
      }
    }
    // if (type === 'tinkoff/csv') result = await operationsService.uploadCSV(file, 'tinkoff');
    // if (type === 'alfa/excel') result = await operationsService.uploadEXCEL(file, 'alfa');

    if (!result) displayError('Некорректный файл');
    // TODO отправить результат в стор.
  }
  function handleOpenFileOptions({ target }) {
    setFileOptionsIsOpen(target.checked);
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

  const tinkoffIcon = (
    <img
      alt="Т-Банк"
      height={30}
      src={T_BANK_ICON}
      style={{ borderRadius: '8px' }}
      width={30}
    />
  );
  const openState = fileOptionsIsOpen ? 'opened' : 'closed';

  const tableHeader = (
    <section className='operations__table-header__container'>
      <div className="operations__table-header__title">
        <h4 className='me-2 mb-1'>Операции за</h4>
        <DateRangeInput onPick={onDateFilter} pickValue={dateRange} />
      </div>
      <div className='operations__table-header__button-group'>
        <div className="file-section">
          <label className='operations__table-header__button-group__button--file' htmlFor="file-input" title='Импортировать файл'>{uploadIcon}</label>
          <input hidden id="file-input" onChange={handleOpenFileOptions} type="checkbox" />
          <div className={`operations__table-header__file-options ${openState}`}>
            <label className='file-options__title'>Загрузить файл</label>
            <label className='file-options__option' htmlFor="tinkoff">{tinkoffIcon} (csv)</label>
            <label className='file-options__option' htmlFor="alfa">{alfaIcon} (excel)</label>
            <input accept=".csv" hidden id='tinkoff' name="tinkoff" onChange={handleImport} type="file" />
            {/* <input accept=".xlsx" hidden id='alfa' name="alfa" onChange={handleImport} type="file" /> */}
          </div>
        </div>
        <button className="operations__table-header__button-group__button" onClick={handleOpenCreateModal} type="button">Добавить</button>
      </div>
    </section >
  );

  return (
    <div className="operations-table__container">
      <ContentBoard header={tableHeader}>
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
      </ContentBoard>
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
