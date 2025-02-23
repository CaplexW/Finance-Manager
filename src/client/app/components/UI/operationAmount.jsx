import React from 'react';
import PropTypes from 'prop-types';
import { greenColor, redColor } from '../../../../constants/colors';
import { operationPropType } from '../../../../types/propTypes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../utils/console/showElement';

export default function OperationAmount({ operation }) {
  const amountColor = operation.amount > 0 ? greenColor : redColor;
  return <span style={{ color: amountColor }}>{operation.amount}</span>;
};

OperationAmount.propTypes = {
  operation: PropTypes.shape(operationPropType).isRequired
};