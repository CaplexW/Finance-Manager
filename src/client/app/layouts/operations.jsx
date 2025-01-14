import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, getUserDataStatus, loadUserData } from '../store/user';
import { deleteOperation, getOperationsList, getOperationsLoadStatus, loadOperations, updateOperation } from '../store/operations';
import { getCategoriesList, getCategoriesLoadStatus, loadCategories } from '../store/categories';
import { getIconsLoadStatus, loadIcons } from '../store/icons';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../utils/console/showElement';
import CategoriesList from '../components/UI/categoriesList';
import DateRangePicker from '../components/common/dateRangePicker';
import OperationTable from '../components/UI/operationTable';
import { orderBy } from 'lodash';
import OperationsChart from '../components/UI/operationsChart';
import ContentBoard from '../components/common/contentBoard';
import { getInputDate, todayInput } from '../../../utils/formatDate';

// TODO 1. Реализовать создание и редактирование категорий.
// TODO 2. Реализовать диаграммы.
// TODO 4. Реализовать фильтрацию и сортировку.
// TODO 5. Реализовать модальные окна и формы.

export default function Operations() {
  const [switchPosition, setSwitchPosition] = useState('both');
  const [dateRange, setDateRange] = useState({ start: '1993-03-24', end: todayInput() });
  const [filter, setFilter] = useState({ category: null, type: null, date: null });
  const [sort, setSort] = useState({ path: 'date', order: 'desc' });

  const operationsIsLoaded = useSelector(getOperationsLoadStatus());
  const categoriesIsLoaded = useSelector(getCategoriesLoadStatus());
  const iconsIsLoaded = useSelector(getIconsLoadStatus());
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

  // useEffect(loadData, [isLoaded]);

  // function loadData() {
  //   if (isLoaded) return;

  //   if (!operationsIsLoaded) dispatch(loadOperations());
  //   if (!categoriesIsLoaded) dispatch(loadCategories());
  //   if (!iconsIsLoaded) dispatch(loadIcons());
  //   if (!userIsLoaded) dispatch(loadUserData());
  // }

  function filterOperationsByDate(operations) {
    let result = operations.filter((o) => (
      o.date >= dateRange.start && o.date <= dateRange.end
    ));
    showElement(result, 'result');

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

  function handleCategoryFilter(list) {
    setFilter((prevState) => {
      const newState = { ...prevState };
      newState.category = list;

      return newState;
    });
  }
  function handleDateFilter({ start, end }) {
    const startDate = getInputDate(start);
    const endDate = getInputDate(end);

    setDateRange({ start: startDate, end: endDate });
  }
  function handleSort(config) {
    setSort(config);
  }

  if (isLoaded) return (
    <div className='container row mt-3' id="operation-layout">
      <section className='col-md-4' id="side">
        <ContentBoard header={<h4>Соотношение категорий</h4>}>
          <CategoriesList onClick={handleCategoryFilter} operations={filteredByTypeOperations} />
          <OperationsChart operations={filteredByCategoryOperations} />
        </ContentBoard>
      </section>
      <section className='col-md-1' name='space' />
      <section className='col-md-7' id="main">
        {/*<DateRangePicker onPick={handlePick} pick={dateRange} /> */}
        <OperationTable
          dateRange={dateRange}
          displayedOperations={displayedOperations}
          onDateFilter={handleDateFilter}
          onSort={handleSort}
          sortConfig={sort}
        />
      </section>
      <section id="modals">
        {/* <ModalWindow onClose={closeModal} /> */}
      </section>
      <input hidden type="color" />
    </div>

    // Кнопка "Показать больше"
  );
};
