import React, { useCallback, useState, ChangeEvent } from 'react';
import Table, { ColumnConfig, SortConfig as TableSortConfig } from '../common/table/table';
import ModalWindow from '../common/modalWindow';
import CreateOperationForm from './createOperationForm';
import { useDispatch } from 'react-redux';
import { addOperations, deleteOperation } from '../../store/operations';
import DeleteButton from '../common/deleteButton';
import EditButton from '../common/editButton';
import EditOperationForm from './editOperationForm';
import CategoryLabel from './categoryLabel';
import OperationAmount from './operationAmount';
import operationsService from '../../services/operations.service';
import displayError from '../../utils/errors/onClient/displayError';
import CreateCategoryForm from './CreateCategoryForm';
import { updateUserBalance } from '../../store/user';
import { formatDisplayDateFromInput } from '../../utils/formatDate';
import { alfaIcon, uploadIcon } from '../../../assets/icons';
import T_BANK_ICON from '../../../assets/static_icons/tBankIcon.png';
import DateRangeInput from '../common/form/dateRangeInput';
import ContentBoard from '../common/contentBoard';
import roundToHundredths from '../../utils/math/roundToHundredths';
import displaySuccess from '../../utils/errors/onClient/displaySuccess';
import { toast } from 'react-toastify';
import { Operation } from '../../types/types';

interface DateRange {
  start: string;
  end: string;
}

interface OperationTableProps {
  displayedOperations: Operation[];
  onDateFilter: (range: DateRange) => void;
  dateRange: DateRange;
  onSort?: (config: TableSortConfig) => void;
  sortConfig?: TableSortConfig | null;
}

// TODO 1. Реализовать условный рендеринг модальных окон

export default function OperationTable({
  displayedOperations,
  onDateFilter,
  dateRange,
  onSort,
  sortConfig = null,
}: OperationTableProps) {
  const [editingData, setEditingData] = useState<Partial<Operation>>({});
  const [newCategoryName, setNewCategoryName] = useState<string | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [fileOptionsIsOpen, setFileOptionsIsOpen] = useState(false);

  const dispatch = useDispatch();

  const columns: Record<string, ColumnConfig> = {
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

    editButton: { component: renderEditButton },
    deleteButton: { component: renderDeleteButton },
  };

  async function handleDelete(id: string) {
    const isConfirmed = confirm('Вы хотите удалить опирацию?');
    if (isConfirmed) {
      const result = await dispatch(deleteOperation(id));
      if (result) {
        const operation = displayedOperations.find((op) => op._id === id);
        if (operation) {
          dispatch(updateUserBalance(-operation.amount));
        }
      }
    }
  }
  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const { target } = event;
    const file = target.files?.[0];
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

    if (!result) displayError('Некорректный файл');
  }
  function handleOpenFileOptions(event: ChangeEvent<HTMLInputElement>) {
    setFileOptionsIsOpen(event.target.checked);
  }

  const handleOpenCreateModal = useCallback(() => setOpenCreateModal(true), []);
  const handleCloseCreateModal = useCallback(() => setOpenCreateModal(false), []);

  const handleOpenEditModal = useCallback(() => setOpenEditModal(true), []);
  const handleCloseEditModal = useCallback(() => setOpenEditModal(false), []);

  const handleOpenCategoryModal = useCallback(() => setOpenCategoryModal(true), []);
  const handleCloseCategoryModal = useCallback(() => setOpenCategoryModal(false), []);

  function OpenEditModal(operation: Operation) {
    handleOpenEditModal();
    setEditingData({ ...operation });
  }

  function renderDeleteButton(operation: Operation) {
    return <DeleteButton onDelete={() => handleDelete(operation._id)} />;
  }
  function renderEditButton(operation: Operation) {
    return <EditButton onClick={() => OpenEditModal(operation)} />;
  }
  function renderDisplayDate(operation: Operation) {
    return <span>{formatDisplayDateFromInput(operation.date)}</span>;
  }
  function renderOperationAmount(operation: Operation) {
    return <OperationAmount operation={operation} />;
  }
  function renderCategoryLabel(operation: Operation) {
    return <CategoryLabel categoryId={operation.category} />;
  }

  function handleCreateCategory(enteredName: string) {
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
        <h4 className='me-2 mb-1 desktop-only'>Операции за</h4>
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
      <ContentBoard header={tableHeader}>
        <Table
          columns={columns}
          data={displayedOperations}
          onSort={onSort}
          sortConfig={sortConfig ?? undefined}
        />
        <ModalWindow headTitle="Добавьте операцию" isOpen={openCreateModal} onClose={handleCloseCreateModal} >
          <CreateOperationForm onCreateCategory={handleCreateCategory} />
        </ModalWindow>
        <ModalWindow headTitle="Измените операцию" isOpen={openEditModal} onClose={handleCloseEditModal} >
          <EditOperationForm existingData={editingData} onCreateCategory={handleCreateCategory} />
        </ModalWindow>
        <ModalWindow headTitle="Создайте категорию" isOpen={openCategoryModal} onClose={handleCloseCategoryModal} >
          <CreateCategoryForm enteredName={newCategoryName || undefined} />
        </ModalWindow>
      </ContentBoard>
    </div>
  );
}

