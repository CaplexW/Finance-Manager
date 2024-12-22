import React from 'react';
import PropTypes from 'prop-types';
// Утилиты

export default function TableHeader({ onSort, selectedSort, columns }) {
  const caretUp = <i className="bi bi-caret-up-fill" />;
  const caretDown = <i className="bi bi-caret-down-fill" />;
  function renderCaret(sort, path) {
    if (sort.path === path) {
      return sort.order === 'asc' ? caretUp : caretDown;
    }
    return '';
  }
  function handleSort(item) {
    if (selectedSort.path === item && selectedSort.order === 'asc') {
      onSort({ path: item, order: 'desc', caret: 'down' });
    } else {
      onSort({ path: item, order: 'asc', caret: 'up' });
    }
  }

  return (
    <thead>
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
              {renderCaret(selectedSort, columns[column].path)}
            </th>
          ))}
      </tr>
    </thead>
  );
}
TableHeader.propTypes = {
  columns: PropTypes.object.isRequired,
  onSort: PropTypes.func.isRequired,
  selectedSort: PropTypes.object.isRequired,
};
