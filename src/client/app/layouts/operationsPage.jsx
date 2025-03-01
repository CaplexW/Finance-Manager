import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserDataStatus } from '../store/user';
import { getOperationsList, getOperationsLoadStatus } from '../store/operations';
import { getCategoriesLoadStatus } from '../store/categories';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../server/utils/console/showElement';
import CategoriesList from '../components/UI/categoriesList';
import OperationTable from '../components/UI/operationTable';
import { orderBy } from 'lodash';
import OperationsChart from '../components/UI/operationsChart';
import ContentBoard from '../components/common/contentBoard';
import { getInputDate, todayInput } from '../../../server/utils/formatDate';

// TODO 1. Реализовать создание и редактирование категорий.
// TODO 4. Реализовать фильтрацию и сортировку.

export default function OperationsPage() {
  const [switchPosition, setSwitchPosition] = useState('both');
  const [dateRange, setDateRange] = useState({ start: '1993-03-24', end: todayInput() });
  const [filter, setFilter] = useState({ category: null, type: null, date: null });
  const [sort, setSort] = useState({ path: 'date', order: 'desc' });

  const operationsIsLoaded = useSelector(getOperationsLoadStatus());
  const categoriesIsLoaded = useSelector(getCategoriesLoadStatus());
  const userIsLoaded = useSelector(getUserDataStatus());
  const operations = useSelector(getOperationsList());

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

  function filterOperationsByDate(operations) {
    let result = operations.filter((o) => (
      o.date >= dateRange.start && o.date <= dateRange.end
    ));

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
    <div className='operations-page' id="operation-layout">
      <section className='' id="side">
        <ContentBoard header={<h4>Соотношение категорий</h4>}>
          <div className="side-container">
            <CategoriesList onClick={handleCategoryFilter} operations={filteredByTypeOperations} />
            <OperationsChart operations={filteredByCategoryOperations} />
          </div>
        </ContentBoard>
      </section>
      <section className='' id="main">
        <OperationTable
          dateRange={dateRange}
          displayedOperations={displayedOperations}
          onDateFilter={handleDateFilter}
          onSort={handleSort}
          sortConfig={sort}
        />
      </section>
    </div>

    // Кнопка "Показать больше"
  );
};
