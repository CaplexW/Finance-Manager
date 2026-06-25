import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserDataStatus } from '../store/user';
import { getOperationsList, getOperationsLoadStatus } from '../store/operations';
import { getCategoriesList, getCategoriesLoadStatus } from '../store/categories';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CategoriesList from '../components/UI/categoriesList';
import OperationTable from '../components/UI/operationTable';
import { orderBy } from 'lodash';
import OperationsChart from '../components/UI/operationsChart';
import ContentBoard from '../components/common/contentBoard';
import { getInputDate, todayInput } from '../../../server/utils/formatDate';
import ChartBar from '../components/UI/chartBar';
import { getIconsList, getIconsLoadStatus } from '../store/icons';
import showElement from '../utils/console/showElement';

// TODO Реализовать фильтрацию и сортировку.
//  1) Сортировку по всем столбцам - ГОТОВО!
//  2) Фильтрацию по категории - ГОТОВО!
//  3) Фильтрация по дате - ГОТОВО!
//  4) Фильтрация по типу (доход/расход) - В ОЧЕРЕДИ.

export default function OperationsPage() {
  const [switchPosition, setSwitchPosition] = useState('both');
  const [dateRange, setDateRange] = useState({ start: '1993-03-24', end: todayInput() });
  const [filter, setFilter] = useState({ category: null, type: null, date: null });
  const [sort, setSort] = useState({ path: 'date', order: 'desc' });

  const categories = useSelector(getCategoriesList());
  const operations = useSelector(getOperationsList());
  const icons = useSelector(getIconsList());

  const operationsIsLoaded = useSelector(getOperationsLoadStatus());
  const categoriesIsLoaded = useSelector(getCategoriesLoadStatus());
  const iconsIsLoaded = useSelector(getIconsLoadStatus());
  const userIsLoaded = useSelector(getUserDataStatus());

  const isLoaded = (
    operationsIsLoaded
    && categoriesIsLoaded
    && userIsLoaded
    && iconsIsLoaded
  );

  const filteredByDateOperations = filterOperationsByDate(operations) || [];
  const filteredByTypeOperations = filterOperationsByType(filteredByDateOperations);
  const filteredByCategoryOperations = filterOperationsByCategory(filteredByTypeOperations);

  const groupedOperations = groupOperationsByCategory(filteredByCategoryOperations);
  const categoriesInfo = groupedOperations.map((group) => {
    const category = categories.find((c) => c._id === group[0].category);
    const icon = icons.find((i) => i._id === category.icon);
    const amount = group.reduce((totalAmount, operation) => totalAmount += operation.amount, 0);
    const isFiltered = filter.category?.includes(category._id);

    return {
      category,
      icon,
      amount,
      isFiltered,
    };
  });
  categoriesInfo.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

  const displayedOperations = orderBy(filteredByCategoryOperations, [sort.path], [sort.order]);

  function filterOperationsByDate(operations) {
    return operations.filter((o) => (
      o.date >= dateRange.start && o.date <= dateRange.end
    ));
  }
  function filterOperationsByType(operations) {
    if (switchPosition === 'both') {
      return operations;
    }
    
    return operations.filter((op) => {
      const category = categories.find((c) => c._id === op.category);
      if (!category) return false;
      
      if (switchPosition === 'income') {
        return category.isIncome;
      } else if (switchPosition === 'outcome') {
        return !category.isIncome;
      }
      return true;
    });
  }
  function filterOperationsByCategory(operations) {
    if (filter.category) {
      return operations.filter((op) => !(filter.category.includes(op.category)));
    } else {
      return operations;
    }
  }

  function groupOperationsByCategory(operations) {
    const groups = {};

    for (const op of operations) {
      if (groups[op.category]) {
        groups[op.category].push(op);
      } else {
        groups[op.category] = [op];
      }
    }

    return Object.values(groups);
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
  function handleSwitchChange(position) {
    setSwitchPosition(position);
  }

  if (isLoaded) return (
    <div className='operations-page' id="operation-layout">
      <section className='side' id="side">
        <ContentBoard header={<h4>Соотношение категорий</h4>}>
          <div className="side-container">
            <CategoriesList onClick={handleCategoryFilter} categories={categoriesInfo} />
            <OperationsChart operations={filteredByCategoryOperations} switchPosition={switchPosition} />
          </div>
        </ContentBoard>
      </section>
      <section className='main' id="main">
        <OperationTable
          dateRange={dateRange}
          displayedOperations={displayedOperations}
          onDateFilter={handleDateFilter}
          onSort={handleSort}
          sortConfig={sort}
          switchPosition={switchPosition}
          onSwitchChange={handleSwitchChange}
        />
      </section>
    </div>
  );
};
