import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, getUserDataStatus, loadUserData } from '../store/user';
import { deleteOperation, getOperationsList, getOperationsLoadStatus, loadOperations, updateOperation } from '../store/operations';
import { getCategoriesList, getCategoriesLoadStatus, loadCategories } from '../store/categories';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../utils/console/showElement';
import CategoriesList from '../components/UI/categoriesList';
import Chart from '../components/UI/chart';
import Currency from '../components/UI/currency';
import DateRangePicker from '../components/common/dateRangePicker';
import BalanceCounter from '../components/UI/balanceCounter';
import OperationTable from '../components/UI/operationTable';
import ModalWindow from '../components/common/modalWindow';

// TODO 2. Забить методы категорий в лейаут.
// TODO 3. Сделать таблицу.
// TODO 4. Реализовать фильтрацию и сортировку.
// TODO 5. Реализовать модальные окна и формы.
// TODO 6. Протестить CRUD-функционал на интерфейсе.

export default function Operations() {
  const [switchPosition, setSwitchPosition] = useState('both');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filter, setFilter] = useState({ category: null, type: null, date: null });
  const [sort, setSort] = useState({ path: 'date', order: 'asc' });
  const operationsIsLoaded = useSelector(getOperationsLoadStatus());
  const categoriesIsLoaded = useSelector(getCategoriesLoadStatus());
  const userLoaded = useSelector(getUserDataStatus());
  const isLoaded = (operationsIsLoaded && categoriesIsLoaded && userLoaded);
  const user = useSelector(getUser());
  const operations = useSelector(getOperationsList());
  const categories = useSelector(getCategoriesList());
  const filteredOperations = operations;
  const dispatch = useDispatch();

  useEffect(loadData, [operationsIsLoaded, categoriesIsLoaded, userLoaded]);

  function loadData() {
    if (!operationsIsLoaded) dispatch(loadOperations());
    if (!categoriesIsLoaded) dispatch(loadCategories());
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

  function handleFilter(config) {
    setFilter(config);
  }
  function handlePick(date) {
    setFilter((prevState) => ({ ...prevState, date }));
  }
  function handleSort(config) {
    setSort(config);
  }

  // function handleOpenModal(command) { }
  function closeModal() { }

  if(isLoaded) return (
    <div className='container' id="operation-layout">
      <section id="side">
        {/* <CategoriesList onFilter={handleFilter} source={filteredOperations} />
        <Chart onSwitch={handleFilter} source={filteredOperations} /> */}
      </section>
      <section className='mt-4' id="main">
        {/* <Currency />
        <DateRangePicker onPick={handlePick} pick={dateRange} />
        <BalanceCounter source={user.currentBalance} /> */}
        <OperationTable displayedOperations={filteredOperations} onSort={handleSort} sortConfig={sort} />
      </section>
      <section id="modals">
        <ModalWindow onClose={closeModal} />
      </section>
    <input hidden type="color" />
    </div>
    // Значки категорий
    // Чарт
    //  Свитч
    // Баланс
    // Таблица
    //  Отображение:
    //    Сумма. Цвет в зависимости от типа
    //    Название.
    //    Ионка. Категория.
    //    Дата.
    //    Кнопки.
    //  Кнопка "Добавить"
    //  Кнопка "Показать больше"
  );
};