import React from 'react';
import PropTypes from 'prop-types';
import lod from 'lodash';
import { alfaIcon, uploadIcon } from '../../../assets/icons';
import T_BANK_ICON from '../../../assets/static_icons/tBankIcon.png';
import showElement from '../../../../utils/console/showElement';

const dummySort = { path: '', order: '' };
const dummyFunc = () => { };

export default function Table({
  columns,
  data,
  title = 'Таблица',
  sortConfig = dummySort,
  onSort = dummyFunc,
  onSearch = dummyFunc,
  onFile = dummyFunc,
  onAdd = dummyFunc
}) {
  const tinkoffIcon = <img alt="T-BANK" src={T_BANK_ICON} style={{ width: 30, height: 30, borderRadius: '20%'}} />;

  function noRequiredDataError() {
    console.error('no column config or data to display was given to this table');
    showElement(data, 'data');
    showElement(columns, 'columns');
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

  if(!data || !columns) return noRequiredDataError();
  
  return (
    <main className='table_layout'>
      <div className="table_container">
        <section className='table_header'>
          <h3 className='table_title'>{title}</h3>
          <div className='button-group'>
            {onAdd ?
              <button className="table_button" onClick={onAdd} type="button">Добавить</button>
              :
              ''}
            {onFile ?
              <div className="file-section">
                <label className='file-button' htmlFor="file-input" title='Импортировать файл'  >{uploadIcon}</label>
                <input id="file-input" type="checkbox" />
                <div className="file-options" >
                  <label className='file-options-title'>Загрузить файл</label>
                  <label className='file-option' htmlFor="tinkoff">{tinkoffIcon} (csv)</label>
                  <label className='file-option' htmlFor="alfa">{alfaIcon} (excel)</label>
                  <input accept=".csv" id='tinkoff' name="tinkoff" onChange={onFile} type="file" />
                  <input accept=".xlsx" id='alfa' name="alfa" onChange={onFile} type="file" />
                </div>
              </div>
              :
              ''}
          </div>
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
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  onAdd: PropTypes.func,
  onFile: PropTypes.func,
  onSearch: PropTypes.func,
  onSort: PropTypes.func,
  sortConfig: PropTypes.shape({
    path: PropTypes.string.isRequired,
    order: PropTypes.string.isRequired,
  }),
  title: PropTypes.string,
  
};
