/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes, { shape } from 'prop-types';

import TableHeader from './tableHeader';
import TableBody from './tableBody';
import { userScheme } from '../../../mockData/propTypesScheme';

export default function Table({
  children,
  selectedSort,
  onSort,
  columns,
  data,
}) {
  return (
    <table className="table">
      {children
      || (
      <>
        <TableHeader
          selectedSort={selectedSort}
          onSort={onSort}
          columns={columns}
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
  selectedSort: PropTypes.object,
  onSort: PropTypes.func,
  columns: PropTypes.array,
  data: PropTypes.arrayOf(shape(userScheme)),
};
Table.defaultProps = {
  children: null,
  selectedSort: null,
  onSort: null,
  columns: null,
  data: null,
};
