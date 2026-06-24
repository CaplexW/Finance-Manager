import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Table from '../common/table/table';
import { operationPropType } from '../../../types/propTypes';
import ModalWindow from '../common/modalWindow';
import CreateOperationForm from './createOperationForm';
import { useDispatch } from 'react-redux';
import { addOperations, deleteOperation } from '../../store/operations';
import DeleteButton from '../common/deleteButton';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../utils/console/showElement';
import EditOperationForm from './editOperationForm';
import CategoryLabel from './categoryLabel';
import OperationAmount from './operationAmount';
import operationsService from '../../services/operations.service';
import displayError from '../../utils/errors/onClient/displayError';
import CreateCategoryForm from './CreateCategoryForm';
import OperationCard from './operationCard';
import closeModalWindow from '../../utils/modals/closeModalWindow';
import { updateUserBalance } from '../../store/user';
import { formatDisplayDateFromInput } from '../../utils/formatDate';
import { alfaIcon, uploadIcon } from '../../../assets/icons';
import T_BANK_ICON from '../../../assets/static_icons/tBankIcon.png';
import openModalById from '../../utils/modals/openModalById';
import DateRangeInput from '../common/form/dateRangeInput';
import ContentBoard from '../common/contentBoard';
import roundToHundredths from '../../utils/math/roundToHundredths';
import displaySuccess from '../../utils/errors/onClient/displaySuccess';
import { toast } from 'react-toastify';
import SearchBar from '../common/searchBar';
import IncomeOutcomeSwitch from './incomeOutcomeSwitch';

// TODO 1. Реализовать условный рендеринг модальных окон

export default function OperationTable({
  displayedOperations,
  onDateFilter,
  dateRange,
  onSort = null,
  sortConfig = null,
  switchPosition = 'both',
  onSwitchChange,
}) {
  const [editingData, setEditingData] = useState({});
  const [newCategoryName, setNewCategoryName] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openOperationCard, setOpenOperationCard] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [fileOptionsIsOpen, setFileOptionsIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  const columns = {
    name: {
      path: 'name',
      name: 'Название',
    },
    date: {
      path: 'date',
      name: 'Дата',
      component: renderDisplayDate,
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
    setFileOptionsIsOpen(false);

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
  function handleOpenFileOptions() {
    setFileOptionsIsOpen(prev => !prev);
  }

  const handleOpenCreateModal = useCallback(() => setOpenCreateModal(true));
  const handleCloseCreateModal = useCallback(() => setOpenCreateModal(false));

  const handleOpenEditModal = useCallback(() => setOpenEditModal(true));
  const handleCloseEditModal = useCallback(() => setOpenEditModal(false));

  const handleOpenCategoryModal = useCallback(() => setOpenCategoryModal(true));
  const handleCloseCategoryModal = useCallback(() => setOpenCategoryModal(false));

  const handleOpenOperationCard = useCallback((operation) => {
    setSelectedOperation(operation);
    setOpenOperationCard(true);
  }, []);

  const handleCloseOperationCard = useCallback(() => {
    setOpenOperationCard(false);
    setSelectedOperation(null);
  }, []);

  function OpenEditModal(operation) {
    handleOpenEditModal(true);
    setEditingData({ ...operation });
  }

  // TODO пересмотреть методы, подумать о мемоизации
  function renderDeleteButton(operation) {
    return <DeleteButton onDelete={(e) => { e.stopPropagation(); handleDelete(operation._id); }} />;
  }
  function handleRowClick(operation) {
    handleOpenOperationCard(operation);
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

  const filteredOperations = useMemo(() => {
    if (!searchQuery) return displayedOperations;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return displayedOperations.filter((operation) =>
      operation.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [displayedOperations, searchQuery]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleSwitchChange = (position) => {
    if (onSwitchChange) {
      onSwitchChange(position);
    }
  };

  const tableControls = (
    <section className='operations__table-header__container'>
      <div className="operations__table-header__title">
        <h4 className='me-2 desktop-only'>Операции за</h4>
        <DateRangeInput onPick={onDateFilter} pickValue={dateRange} />
        <SearchBar onSearch={handleSearch} placeholder="Поиск операций..." />
      </div>
      <div className='operations__table-header__button-group'>
        <IncomeOutcomeSwitch value={switchPosition} onChange={handleSwitchChange} />
        <div className="file-section">
          <label className='operations__table-header__button-group__button--file' htmlFor="file-input" title='Импортировать файл'>{uploadIcon}</label>
          <input hidden id="file-input" value={fileOptionsIsOpen} onChange={handleOpenFileOptions} type="checkbox" />
          <div className={`operations__table-header__file-options ${openState}`}>
            <label className='file-options__title'>Загрузить файл</label>
            <label className='file-options__option' htmlFor="tinkoff">{tinkoffIcon} (csv)</label>
            {/* <label className='file-options__option' htmlFor="alfa">{alfaIcon} (excel)</label> */}
            <input accept=".csv" hidden id='tinkoff' name="tinkoff" onChange={handleImport} type="file" />
          </div>
        </div>
        <button className="operations__table-header__button-group__button" onClick={handleOpenCreateModal} type="button">
          <span className='desktop-only'>Добавить</span>
          <span className='mobile-only'>+</span>
        </button>
      </div>
    </section >
  );

  return (
    <div className="operations-table__container">
      <ContentBoard header={tableControls}>
        <Table
          columns={columns}
          data={filteredOperations}
          dateRange={dateRange}
          onAdd={handleOpenCreateModal}
          onDateFilter={onDateFilter}
          onDelete={handleDelete}
          onFile={handleImport}
          onSort={onSort}
          onRowClick={handleRowClick}
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
        <ModalWindow headTitle={selectedOperation?.name} isOpen={openOperationCard} onClose={handleCloseOperationCard}>
          <OperationCard
            operation={selectedOperation}
            onEdit={OpenEditModal}
            onDelete={handleDelete}
          />
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
  }),
  switchPosition: PropTypes.oneOf(['both', 'income', 'outcome']),
  onSwitchChange: PropTypes.func,
};
