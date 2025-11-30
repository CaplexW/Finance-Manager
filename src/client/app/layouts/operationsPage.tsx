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
import { getIconsList, getIconsLoadStatus } from '../store/icons';
import { Operation, Category, Icon } from '../../types/types';

// TODO Реализовать фильтрацию и сортировку.
//  1) Сортировку по всем столбцам - ГОТОВО!
//  2) Фильтрацию по категории - ГОТОВО!
//  3) Фильтрация по дате - ГОТОВО!
//  4) Фильтрация по типу (доход/расход) - В ОЧЕРЕДИ.

interface DateRange {
  start: string;
  end: string;
}

interface Filter {
  category: string[] | null;
  type: string | null;
  date: string | null;
}

interface SortConfig {
  path: string;
  order: string;
}

export default function OperationsPage() {
  const [switchPosition, setSwitchPosition] = useState('both');
  const [dateRange, setDateRange] = useState<DateRange>({ start: '1993-03-24', end: todayInput() });
  const [filter, setFilter] = useState<Filter>({ category: null, type: null, date: null });
  const [sort, setSort] = useState<SortConfig>({ path: 'date', order: 'desc' });

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

  const groupedOperations = groupOperationsByCategory(filteredByTypeOperations);
  const categoriesInfo = groupedOperations.map((group) => {
    const category = categories.find((c) => c._id === group[0].category);
    if (!category) return null;
    const icon = icons.find((i) => i._id === category.icon);
    const amount = group.reduce((totalAmount, operation) => totalAmount += operation.amount, 0);
    const isFiltered = filter.category?.includes(category._id);

    return {
      category,
      icon: icon || null,
      amount,
      isFiltered: isFiltered || false,
    };
  }).filter((item): item is { category: Category; icon: Icon | null; amount: number; isFiltered: boolean } => item !== null);
  categoriesInfo.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

  const displayedOperations = orderBy(filteredByCategoryOperations, [sort.path], [sort.order]);

  function filterOperationsByDate(operations: Operation[]) {
    return operations.filter((o) => (
      o.date >= dateRange.start && o.date <= dateRange.end
    ));
  }
  function filterOperationsByType(operations: Operation[]) {
    // здесь доходы будут отделяться от расходов
    let result = operations.map(o => o);

    return result;
  }
  function filterOperationsByCategory(operations: Operation[]) {
    if (filter.category) {
      return operations.filter((op) => !(filter.category!.includes(op.category)));
    } else {
      return operations;
    }
  }

  function groupOperationsByCategory(operations: Operation[]): Operation[][] {
    const groups: Record<string, Operation[]> = {};

    for (const op of operations) {
      if (groups[op.category]) {
        groups[op.category].push(op);
      } else {
        groups[op.category] = [op];
      }
    }

    return Object.values(groups);
  }

  function handleCategoryFilter(list: string[]) {
    setFilter((prevState) => {
      const newState = { ...prevState };
      newState.category = list;

      return newState;
    });
  }
  function handleDateFilter({ start, end }: { start: string; end: string }) {
    const startDate = getInputDate(start);
    const endDate = getInputDate(end);

    setDateRange({ start: startDate, end: endDate });
  }
  function handleSort(config: SortConfig) {
    setSort(config);
  }

  if (isLoaded) return (
    <div className='operations-page' id="operation-layout">
      <section className='side' id="side">
        <ContentBoard header={<h4>Соотношение категорий</h4>}>
          <div className="side-container">
            <CategoriesList onClick={handleCategoryFilter} categories={categoriesInfo} />
            <OperationsChart operations={filteredByCategoryOperations} />
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
        />
      </section>
    </div>
  );
  return null;
}






