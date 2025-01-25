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

export default function WidgetBiggestOperations({ operations }) {
  if (!operations.length) return;

  const sortedOperations = operations.toSorted((a, b) => b.amount - a.amount);

  const biggestIncome = sortedOperations[0];
  const incomeCategory = useSelector(getCategoryById(biggestIncome.category));
  const incomeIcon = useSelector(getIconById(incomeCategory.icon));

  const biggestExpense = sortedOperations[sortedOperations.length - 1];
  const expenseCategory = useSelector(getCategoryById(biggestExpense.category));
  const expenseIcon = useSelector(getIconById(expenseCategory.icon));

  const cardStyles = {
    background: 'white',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    paddingInline: '.5em',
    paddingBlock: '.8em',
    marginBlock: '.3rem',
  };
  const generateDigitStyles = (isIncome) => ({
    color: isIncome ? greenColor : redColor,
    fontSize: '1.2rem',
    fontWeight: 'bold',
  });
  const generateIconStyles = (isIncome) => {
    return {
      color: isIncome ? incomeCategory.color : expenseCategory.color,
    };
  };

  const widgetContainerStyles = {
    height: '100%',
    display: 'grid',
    alignItems: 'center',
    padding: '.5em',
  };

  return (
    <div className="widget">
      <Widget name='Наибольший Доход/Расход'>
        <div className="widget-container" style={widgetContainerStyles}>
          <div style={cardStyles}>
            <span style={generateDigitStyles(true)}>{biggestIncome.amount}</span>
            <span>{biggestIncome.name}</span>
            <span style={generateIconStyles(true)}><SVGIcon size={24} source={incomeIcon} /></span>
          </div>
          <div style={cardStyles}>
            <span style={generateDigitStyles(false)}>{Math.abs(biggestExpense.amount)}</span>
            <span>{biggestExpense.name}</span>
            <span style={generateIconStyles(false)}><SVGIcon size={24} source={expenseIcon} /></span>
          </div>
        </div>
      </Widget>
    </div>
  );
};

WidgetBiggestOperations.propTypes = {
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};