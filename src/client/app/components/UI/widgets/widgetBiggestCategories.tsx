import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../../common/widget';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getCategoriesList } from '../../../store/categories';
import { getIconsList } from '../../../store/icons';
import { operationPropType } from '../../../../types/propTypes';
import StatisticPlate from '../../common/statisticsPlate';
import roundToHundredths from '../../../../../server/utils/math/roundToHundredths';
import { Category, Icon, Operation } from '../../../../types/types';

interface WidgetBiggestCategoriesProps {
  operations: Operation[];
}

type CategorySummary = {
  amount: number;
  name: string;
  color: string;
  icon: Icon;
};

export default function WidgetBiggestCategories({ operations }: WidgetBiggestCategoriesProps): JSX.Element | null {
  const categories = useAppSelector(getCategoriesList()) as Category[];
  const icons = useAppSelector(getIconsList()) as Icon[];

  if (!operations.length) return null;

  const categoriesSummary: Record<string, CategorySummary> = {};

  operations.forEach((op) => {
    if (Object.hasOwn(categoriesSummary, op.category)) {
      categoriesSummary[op.category].amount = roundToHundredths(categoriesSummary[op.category].amount + op.amount);
    } else {
      const currentCategory = categories.find((c) => c._id === op.category);
      if (!currentCategory) return;
      categoriesSummary[op.category] = {
        amount: op.amount,
        name: currentCategory.name,
        color: currentCategory.color,
        icon: icons.find((i) => i._id === currentCategory.icon)!,
      };
    }
  });

  const categoriesArray = Object.values(categoriesSummary);
  categoriesArray.sort((a, b) => b.amount - a.amount);

  const biggestIncome = categoriesArray[0];
  const biggestExpense = categoriesArray[categoriesArray.length - 1];

  return (
    <div className="widget">
      <Widget name="Наибольшие категории">
        <div className="widget-biggest-categories-container">
          <StatisticPlate amount={Math.round(biggestIncome.amount)} icon={{ src: biggestIncome.icon, color: biggestIncome.color }} name={biggestIncome.name} />
          <StatisticPlate amount={Math.round(biggestExpense.amount)} icon={{ src: biggestExpense.icon, color: biggestExpense.color }} name={biggestExpense.name} />
        </div>
      </Widget>
    </div>
  );
}

WidgetBiggestCategories.propTypes = {
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};

