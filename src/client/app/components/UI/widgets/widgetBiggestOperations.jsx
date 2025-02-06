import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../../common/widget';
import { greenColor, redColor } from '../../../../../constants/colors';
import showElement from '../../../../../utils/console/showElement';
import { useSelector } from 'react-redux';
import { getCategoryById } from '../../../store/categories';
import { getIconById } from '../../../store/icons';
import SVGIcon from '../../common/svgIcon';
import { operationPropType } from '../../../../../types/propTypes';
import StatisticPlate from '../../common/statisticsPlate';

export default function WidgetBiggestOperations({ operations }) {
  if (!operations.length) return;

  const sortedOperations = operations.toSorted((a, b) => b.amount - a.amount);

  const biggestIncome = sortedOperations[0];
  const incomeCategory = useSelector(getCategoryById(biggestIncome.category));
  const incomeIcon = useSelector(getIconById(incomeCategory.icon));

  const biggestExpense = sortedOperations[sortedOperations.length - 1];
  const expenseCategory = useSelector(getCategoryById(biggestExpense.category));
  const expenseIcon = useSelector(getIconById(expenseCategory.icon));

  return (
    <div className="widget">
      <Widget name='Наибольшие операции'>
        <div className="widget-biggest-operations-container">
          <StatisticPlate amount={biggestIncome.amount} icon={{ src: incomeIcon, color: incomeCategory.color }} name={biggestIncome.name} />
          <StatisticPlate amount={biggestExpense.amount} icon={{ src: expenseIcon, color: expenseCategory.color }} name={biggestExpense.name} />
        </div>
      </Widget>
    </div>
  );
};

WidgetBiggestOperations.propTypes = {
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};