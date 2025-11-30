import React from 'react';
import { greenColor, redColor } from '../../constants/colors';
import { Operation } from '../../../types/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../server/utils/console/showElement';

interface OperationAmountProps {
  operation: Operation;
}

export default function OperationAmount({ operation }: OperationAmountProps) {
  const amountColor = operation.amount > 0 ? greenColor : redColor;
  return <span style={{ color: amountColor }}>{operation.amount}</span>;
}






