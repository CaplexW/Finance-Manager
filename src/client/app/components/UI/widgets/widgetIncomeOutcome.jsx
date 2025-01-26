import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../../common/widget';
import Chart from '../../common/charts/chart';
import { greenColor, redColor } from '../../../../../constants/colors';
import { operationPropType } from '../../../../../types/propTypes';
import showElement from '../../../../../utils/console/showElement';
import ContentBoard from '../../common/contentBoard';
import formChartData from '../../../../../utils/formChartData';
import { isNumber } from 'lodash';

export default function WidgetIncomeOutcome({ operations, prevOperations = null }) {
  const outcome = operations.filter((op) => op.amount < 0).reduce((acc, op) => acc + Math.abs(op.amount), 0);
  const income = operations.filter((op) => op.amount > 0).reduce((acc, op) => acc + op.amount, 0);
  const prevOutcome = prevOperations.filter((op) => op.amount < 0).reduce((acc, op) => acc + Math.abs(op.amount), 0);
  const prevIncome = prevOperations.filter((op) => op.amount > 0).reduce((acc, op) => acc + op.amount, 0);
  const labels = ["Расход", "Доход"];

  const chartData = formChartData(labels, [outcome, income], [redColor, greenColor]);

  const incomeChange = getChange(income, prevIncome);
  const outcomeChange = getChange(outcome, prevOutcome, false);

  const widgetContainerStyles = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '.5em 0'
  };
  const digitStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  };

  return (
    <div className="widget">

      <Widget name='Доход/Расход'>
        <div className="widget-container" style={widgetContainerStyles}>
          <div className="income" style={digitStyles}>
            <span style={{ color: greenColor }}>{income}</span>
            {!!prevOperations &&
              <span
                style={{
                  color: incomeChange > 0 ?
                    greenColor : redColor,
                  alignSelf: 'end'
                }}
              >
                {isNumber(incomeChange) &&
                  `${(incomeChange > 0 ? '+' : '-') + (Math.abs(incomeChange) < 1000 ? incomeChange : '1к')}%`}
              </span>}
          </div>
          <Chart data={chartData} />
          <div className="outcome" style={digitStyles}>
            <span style={{ color: redColor }}>{outcome}</span>
            {!!prevOperations &&
              <span style={{
                color: outcomeChange < 0 ?
                  greenColor : redColor,
                alignSelf: 'end'
              }}
              >
                {isNumber(outcomeChange) && `${(outcomeChange > 0 ? '+' : '-') + (Math.abs(outcomeChange) < 1000 ? outcomeChange : '1к')}%`}
              </span>}
          </div>
        </div>
      </Widget>
    </div>
  );
};

WidgetIncomeOutcome.propTypes = {
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
  prevOperations: PropTypes.arrayOf(PropTypes.shape(operationPropType)),
};

const getChange = (present, prev, isIncome = true) => {
  if (!prev || !present) return '—';

  const diff = present - prev;
  const onePersent = prev / 100;

  const result = isIncome ? (diff / onePersent) : -(diff / onePersent);

  return Math.round(result);
};
