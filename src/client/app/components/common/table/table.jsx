/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './tableHeader';
import TableBody from './tableBody';
import showElement from '../../../../../utils/console/showElement';

const dummySort = { path: '', order: '' };
const dummyOnSort = () => { };

export default function Table({
  children = null,
  selectedSort = dummySort,
  onSort = dummyOnSort,
  columns,
  data,
}) {
  if (!data || !columns) return noRequiredDataError(data, columns);

  return (
    <table className="table">
      {children
        || (
          <>
            <TableHeader
              columns={columns}
              onSort={onSort}
              selectedSort={selectedSort}
            />
            <TableBody columns={columns} data={data} />
          </>
        )}
    </table>
  );
}

Table.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onSort: PropTypes.func,
  selectedSort: PropTypes.shape({
    path: PropTypes.string,
    order: PropTypes.string,
  }),
};

function noRequiredDataError(data, columns) {
  console.error('no column config or data to display was given to this table');
  showElement(data, 'data');
  showElement(columns, 'columns');
}