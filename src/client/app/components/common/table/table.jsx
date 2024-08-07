/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './tableHeader';
import TableBody from './tableBody';

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
  columns: PropTypes.array,
  data: PropTypes.array,
  onSort: PropTypes.func,
  selectedSort: PropTypes.object,
};
Table.defaultProps = {
  children: null,
  columns: null,
  data: null,
  onSort: null,
  selectedSort: null,
};
