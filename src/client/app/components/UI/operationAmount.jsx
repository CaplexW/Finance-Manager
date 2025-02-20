import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getCategoryById } from '../../store/categories';
import { greenColor, redColor } from '../../../../constants/colors';
import { operationPropType } from '../../../../types/propTypes';
import showElement from '../../../../utils/console/showElement';

export default function OperationAmount({ operation }) {
  const amountColor = operation.amount > 0 ? greenColor : redColor;
  return <span style={{ color: amountColor }}>{operation.amount}</span>;
};

OperationAmount.propTypes = {
  operation: PropTypes.shape(operationPropType).isRequired
};