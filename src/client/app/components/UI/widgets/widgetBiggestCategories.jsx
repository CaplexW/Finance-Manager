import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../../common/widget';
import { greenColor, redColor } from '../../../../../constants/colors';
import showElement from '../../../../../utils/console/showElement';
import { useSelector } from 'react-redux';
import { getCategoriesList, getCategoryById } from '../../../store/categories';
import { getIconById, getIconsList } from '../../../store/icons';
import SVGIcon from '../../common/svgIcon';
import { operationPropType } from '../../../../../types/propTypes';

export default function WidgetBiggestCategories({ operations }) {
  const categories = useSelector(getCategoriesList());
  const icons = useSelector(getIconsList());

  if (!operations.length) return;

  const categoriesSummary = {};

  operations.forEach((op) => {
    if(Object.hasOwn(categoriesSummary, op.category)) {
      categoriesSummary[op.category].amount += op.amount;
    }
    else {
      const currentCategory = categories.find((c) => c._id === op.category);
      categoriesSummary[op.category] = {
        amount: op.amount,
        name: currentCategory.name,
        color: currentCategory.color,
        icon: icons.find((i) => i._id === currentCategory.icon),
      };
    }
  });

  const categoriesArray = Object.values(categoriesSummary);
  categoriesArray.sort((a,b) => b.amount - a.amount);

  const biggestIncome = categoriesArray[0];
  const biggestExpense = categoriesArray[categoriesArray.length - 1];


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
      color: isIncome ? biggestIncome.color : biggestExpense.color,
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
      <Widget name='Наибольшие категории'>
        <div className="widget-container" style={widgetContainerStyles}>
          <div style={cardStyles}>
            <span style={generateDigitStyles(true)}>{biggestIncome.amount}</span>
            <span>{biggestIncome.name}</span>
            <span style={generateIconStyles(true)}><SVGIcon size={24} source={biggestIncome.icon} /></span>
          </div>
          <div style={cardStyles}>
            <span style={generateDigitStyles(false)}>{Math.abs(biggestExpense.amount)}</span>
            <span>{biggestExpense.name}</span>
            <span style={generateIconStyles(false)}><SVGIcon size={24} source={biggestExpense.icon} /></span>
          </div>
        </div>
      </Widget>
    </div>
  );
};

WidgetBiggestCategories.propTypes = {
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};