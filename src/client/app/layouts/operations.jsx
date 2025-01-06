import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, getUserDataStatus, loadUserData } from '../store/user';
import { deleteOperation, getOperationsList, getOperationsLoadStatus, loadOperations, updateOperation } from '../store/operations';
import { getCategoriesList, getCategoriesLoadStatus, loadCategories } from '../store/categories';
import { getIconsLoadStatus, loadIcons } from '../store/icons';
import showElement from '../../../utils/console/showElement';
import CategoriesList from '../components/UI/categoriesList';
import Chart from '../components/UI/chart';
import UserBalance from '../components/UI/userBalance';
import DateRangePicker from '../components/common/dateRangePicker';
import BalanceCounter from '../components/UI/userBalance';
import OperationTable from '../components/UI/operationTable';
import ModalWindow from '../components/common/modalWindow';
import { orderBy } from 'lodash';

// TODO 1. Реализовать создание и редактирование категорий.
// TODO 2. Реализовать диаграммы.
// TODO 4. Реализовать фильтрацию и сортировку.
// TODO 5. Реализовать модальные окна и формы.
// TODO 7. Протестить CRUD-функционал на интерфейсе.

export default function Operations() {
  const [switchPosition, setSwitchPosition] = useState('both');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filter, setFilter] = useState({ category: null, type: null, date: null });
  const [sort, setSort] = useState({ path: 'date', order: 'desc' });

  const operationsIsLoaded = useSelector(getOperationsLoadStatus());
  const categoriesIsLoaded = useSelector(getCategoriesLoadStatus());
  const iconsIsLoaded = useSelector(getIconsLoadStatus())
  const userIsLoaded = useSelector(getUserDataStatus());
  const operations = useSelector(getOperationsList());
  const categories = useSelector(getCategoriesList());
  const user = useSelector(getUser());

  const dispatch = useDispatch();

  const isLoaded = (
    operationsIsLoaded
    && categoriesIsLoaded
    && userIsLoaded
    // && iconsIsLoaded
  );

  const filteredByDateOperations = filterOperationsByDate(operations) || [];
  const filteredByTypeOperations = filterOperationsByType(filteredByDateOperations);
  const filteredByCategoryOperations = filterOperationsByCategory(filteredByTypeOperations);

  const sortedOperations = orderBy(filteredByCategoryOperations, [sort.path], [sort.order]);

  const displayedOperations = sortedOperations;

  useEffect(loadData, [isLoaded]);

  function loadData() {
    if (isLoaded) return;

    if (!operationsIsLoaded) dispatch(loadOperations());
    if (!categoriesIsLoaded) dispatch(loadCategories());
    // if (!iconsIsLoaded) dispatch(loadIcons());
    if (!userIsLoaded) dispatch(loadUserData());
  }

  function filterOperationsByDate(operations) {
    let result = operations.filter(o => o);

    return result;
  }
  function filterOperationsByType(operations) {
    let result = operations.map(o => o);

    return result;
  }
  function filterOperationsByCategory(operations) {
    let result = operations.map(_ => _);
    if (filter.category) result = result.filter((op) => (
      !(filter.category.includes(op.category)))
    );

    return result;
  }

  async function handleCreate(payload) {
    const createdOperation = await dispatch(updateOperation(payload));
    if (createdOperation) 'Создаем на фронту';
  }
  async function handleEdit(payload) {
    const updatedOperation = await dispatch(updateOperation(payload));
    if (updatedOperation) 'Обновляем на фронте';
  }
  async function handleDelete(id) {
    const isDeleted = await dispatch(deleteOperation(id));
    if (isDeleted) 'Удаляем на фронте';
  }

  function handleCategoryFilter(list) {
    setFilter((prevState) => {
      const newState = { ...prevState };
      newState.category = list;

      return newState;
    });
  }
  function handlePick(date) {
    setFilter((prevState) => ({ ...prevState, date }));
  }
  function handleSort(config) {
    setSort(config);
  }

  // function handleOpenModal(command) { }
  function closeModal() { }

  if (isLoaded) return (
    <div className='container row' id="operation-layout">
      <section className='col-md-4' id="side">
        <CategoriesList onClick={handleCategoryFilter} operations={filteredByTypeOperations} />
        {/*<Chart onSwitch={handleFilter} source={filteredOperations} /> */}
      </section>
      <section className='mt-4 col-md-8' id="main">
        {/* <Currency />
        <DateRangePicker onPick={handlePick} pick={dateRange} />
        <BalanceCounter source={user.currentBalance} /> */}
        <OperationTable displayedOperations={displayedOperations} onSort={handleSort} sortConfig={sort} />
      </section>
      <section id="modals">
        {/* <ModalWindow onClose={closeModal} /> */}
      </section>
      <input hidden type="color" />
    </div>
    // Значки категорий
    // Чарт
    //  Свитч
    // Баланс
    // Кнопка "Показать больше"
  );
};
