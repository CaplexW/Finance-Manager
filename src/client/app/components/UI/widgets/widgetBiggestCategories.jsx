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
import StatisticPlate from '../../common/statisticsPlate';
import roundToHundredths from '../../../../../utils/math/roundToHundredths';

export default function WidgetBiggestCategories({ operations }) {
  const categories = useSelector(getCategoriesList());
  const icons = useSelector(getIconsList());

  if (!operations.length) return;

  const categoriesSummary = {};

  operations.forEach((op) => {
    if(Object.hasOwn(categoriesSummary, op.category)) {
      categoriesSummary[op.category].amount = roundToHundredths(categoriesSummary[op.category].amount + op.amount);
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

  return (
    <div className="widget">
      <Widget name='Наибольшие категории'>
        <div className="widget-biggest-categories-container">
          <StatisticPlate amount={biggestIncome.amount} icon={{ src: biggestIncome.icon, color: biggestIncome.color }} name={biggestIncome.name} />
          <StatisticPlate amount={biggestExpense.amount} icon={{ src: biggestExpense.icon, color: biggestExpense.color }} name={biggestExpense.name} />
        </div>
      </Widget>
    </div>
  );
};

WidgetBiggestCategories.propTypes = {
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};