import React, { useState } from 'react';
import PropTypes from 'prop-types';
import lod from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../../server/utils/console/showElement';
import ShowMoreButton from './showMoreButton';

const dummySort = { path: '', order: '' };
const dummyFunc = () => { };

export default function Table({
  columns,
  data,
  sortConfig = dummySort,
  onSort = dummyFunc,
  startLimit = 50,
}) {
  const [displayedLimit, setDisplayedLimit] = useState(startLimit);
  const displayedData = data.filter((_, i) => (i < displayedLimit));

  function noRequiredDataError() {
    console.error('no column config or data to display was given to this table');
  }
  function renderContent(item, column) {
    if (columns[column].component) {
      const { component } = columns[column];
      if (typeof (component) === 'function') {
        return component(item);
      }
      return component;
    }
    return lod.get(item, columns[column].path);
  }

  function handleSort(item) {
    if (sortConfig.path === item && sortConfig.order === 'asc') {
      onSort({ path: item, order: 'desc', caret: 'down' });
    } else {
      onSort({ path: item, order: 'asc', caret: 'up' });
    }
  }
  function handleIncreaseDisplayedData() {
    setDisplayedLimit((prevState) => prevState + 50);
  }

  if (!data || !columns) return noRequiredDataError();

  if (displayedData.length) return (
    <section className='table__contanier'>
      <table className='table__content'>
        <thead className='table__columns'>
          <tr>
            {Object.keys(columns).map((column) => (
              <th
                key={column}
                onClick={
                  columns[column].path
                    ? () => handleSort(columns[column].path)
                    : undefined
                }
                role={columns[column].path ? 'button' : null}
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
              item, // item - объект одного пользователя
            ) => (
              <tr key={item._id}>
                {Object.keys(columns).map(
                  (
                    column, // columns - объект с информацией для отображения и сортировки
                  ) => (
                    <td key={column}>
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
};

Table.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  onSort: PropTypes.func,
  sortConfig: PropTypes.shape({
    path: PropTypes.string.isRequired,
    order: PropTypes.string.isRequired,
  }),
  startLimit: PropTypes.number,
};
