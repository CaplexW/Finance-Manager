import React from 'react';
import PropTypes from 'prop-types';
import lod from 'lodash';

export default function Table({ columns, data, onSort, sortConfig, title, searchBar, importButton, addButton, onAdd }) {
  // const caretUp = <i className="bi bi-caret-up-fill" />;
  // const caretDown = <i className="bi bi-caret-down-fill" />;
  // function renderCaret(sort, path) {
  //   if (sort.path === path) {
  //     return sort.order === 'asc' ? caretUp : caretDown;
  //   }
  //   return '';
  // }

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
  return (
    <main className='table_layout'>
      <div className="table_container">
        <section className='table_header'>
          <h3 className='table_title'>{title}</h3>
          {addButton ? <button className="table_button" onClick={onAdd} type="button">Добавить</button> : ''}
        </section>
        <section className='table_body'>
          <table className='table_content'>
            <thead className='table_columns'>
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
            <tbody>
              {data.map(
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
        </section>
      </div>
    </main>
  );
};

Table.propTypes = {
  addButton: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  importButton: PropTypes.bool,
  onAdd: PropTypes.func,
  onSort: PropTypes.func,
  searchBar: PropTypes.bool,
  sortConfig: PropTypes.shape({
    path: PropTypes.string.isRequired,
    order: PropTypes.string.isRequired,
  }),
};
Table.defaultProps = {
  addButton: undefined,
  importButton: undefined,
  onAdd: undefined,
  onSort: undefined,
  searchBar: undefined,
  sortConfig: undefined,
};