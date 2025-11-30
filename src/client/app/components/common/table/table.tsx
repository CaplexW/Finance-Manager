import React, { useState, ReactNode, ChangeEvent } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../../server/utils/console/showElement';
import ShowMoreButton from './showMoreButton';

const dummySort = { path: '', order: '' };
const dummyFunc = () => { };

export interface SortConfig {
  path: string;
  order: string;
  caret?: string;
}

export interface ColumnConfig {
  name?: string;
  path?: string;
  component?: ((item: any) => ReactNode) | ReactNode;
}

interface TableProps {
  columns: Record<string, ColumnConfig>;
  data: any[];
  sortConfig?: SortConfig;
  onSort?: (config: SortConfig) => void;
  startLimit?: number;
  dateRange?: { start: string; end: string };
  onAdd?: () => void;
  onDateFilter?: (range: { start: string; end: string }) => void;
  onDelete?: (id: string) => void;
  onFile?: (event: ChangeEvent<HTMLInputElement>) => void;
  searchBar?: boolean;
}

export default function Table({
  columns,
  data,
  sortConfig = dummySort,
  onSort = dummyFunc,
  startLimit = 50,
}: TableProps) {
  const [displayedLimit, setDisplayedLimit] = useState(startLimit);
  const displayedData = data.filter((_, i) => (i < displayedLimit));

  function noRequiredDataError() {
    console.error('no column config or data to display was given to this table');
  }
  function getValue(object: any, path?: string) {
    if (!path) return undefined;
    return path.split('.').reduce((acc: any, key) => (acc == null ? acc : acc[key]), object);
  }

  function renderContent(item: any, column: string) {
    if (columns[column].component) {
      const { component } = columns[column];
      if (typeof (component) === 'function') {
        return component(item);
      }
      return component;
    }
    return getValue(item, columns[column].path);
  }

  function handleSort(item: string) {
    if (sortConfig.path === item && sortConfig.order === 'asc') {
      onSort({ path: item, order: 'desc', caret: 'down' });
    } else {
      onSort({ path: item, order: 'asc', caret: 'up' });
    }
  }
  function handleIncreaseDisplayedData() {
    setDisplayedLimit((prevState) => prevState + 50);
  }

  if (!data || !columns) {
    noRequiredDataError();
    return null;
  }

  if (displayedData.length) return (
    <section className='table__contanier'>
      <table className='table__content'>
        <thead className='table__columns'>
          <tr>
            {Object.keys(columns).map((column) => (
              <th
                className={columns[column].path || 'button'}
                key={column}
                onClick={
                  columns[column].path
                    ? () => handleSort(columns[column].path!)
                    : undefined
                }
                role={columns[column].path ? 'button' : undefined}
                scope="col"
              >
                {columns[column].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='table__rows'>
          {displayedData.map(
            (
              item,
            ) => (
              <tr key={item._id}>
                {Object.keys(columns).map(
                  (
                    column,
                  ) => (
                    <td className={column || 'button'} key={column}>
                      {renderContent(item, column)}
                    </td>
                  ),
                )}
              </tr>
            ),
          )}
        </tbody>
      </table>
      <ShowMoreButton
        condition={data.length > displayedData.length}
        onClick={handleIncreaseDisplayedData}
      />
    </section>
  );
  return null;
}



