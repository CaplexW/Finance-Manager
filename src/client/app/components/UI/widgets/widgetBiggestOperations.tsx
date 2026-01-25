import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../../common/widget';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getCategoryById } from '../../../store/categories';
import { getIconById } from '../../../store/icons';
import { operationPropType } from '../../../../types/propTypes';
import StatisticPlate from '../../common/statisticsPlate';
import sortOperationsByAmount from '../../../utils/sortOperationsByAmount';
import { Category, Icon, Operation } from '../../../../types/types';

interface WidgetBiggestOperationsProps {
  operations: Operation[];
}

export default function WidgetBiggestOperations({ operations }: WidgetBiggestOperationsProps): JSX.Element | null {
  if (!operations.length) return null;

  const sortedOperations = sortOperationsByAmount(operations, 'desc');

  const biggestIncome = sortedOperations[0];
  const incomeCategory = useAppSelector(getCategoryById(biggestIncome.category)) as Category;
  const incomeIcon = useAppSelector(getIconById(incomeCategory.icon)) as Icon;

  const biggestExpense = sortedOperations[sortedOperations.length - 1];
  const expenseCategory = useAppSelector(getCategoryById(biggestExpense.category)) as Category;
  const expenseIcon = useAppSelector(getIconById(expenseCategory.icon)) as Icon;

  return (
    <div className="widget">
      <Widget name="Наибольшие операции">
        <div className="widget-biggest-operations-container">
          <StatisticPlate amount={Math.round(biggestIncome.amount)} icon={{ src: incomeIcon, color: incomeCategory.color }} name={biggestIncome.name} />
          <StatisticPlate amount={Math.round(biggestExpense.amount)} icon={{ src: expenseIcon, color: expenseCategory.color }} name={biggestExpense.name} />
        </div>
      </Widget>
    </div>
  );
}

WidgetBiggestOperations.propTypes = {
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};

