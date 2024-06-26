/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import lod from 'lodash';
import PropTypes from 'prop-types';
// Утилиты
// eslint-disable-next-line no-unused-vars
import showElement from '../../../utils/debug/showElement';

export default function TableBody({ data, columns }) {
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
  return (
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
  );
}
TableBody.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.object.isRequired,
};
