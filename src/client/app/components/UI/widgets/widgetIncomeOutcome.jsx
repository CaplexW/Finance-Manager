import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../../common/widget';
import Chart from '../../common/charts/chart';
import { greenColor, redColor } from '../../../../../constants/colors';
import { operationPropType } from '../../../../../types/propTypes';
import showElement from '../../../../../utils/console/showElement';
import ContentBoard from '../../common/contentBoard';
import formChartData from '../../../../../utils/formChartData';

export default function WidgetIncomeOutcome({ operations }) {
  const income = operations.filter((op) => op.amount < 0).reduce((acc, op) => acc + Math.abs(op.amount), 0);
  const outcome = operations.filter((op) => op.amount > 0).reduce((acc, op) => acc + op.amount, 0);
  const labels = ["Расход", "Доход"];

  const chartData = formChartData(labels, [income, outcome], [redColor, greenColor]);

  const incomeChange = -15;
  const outcomeChange = -30;

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
  const chartContainerStyles = {
    dispay: 'flex',
    // width: '65%'
  };

  return (
    <div className="widget">

      <Widget name='Доход/Расход'>
        <div className="widget-container" style={widgetContainerStyles}>
          <div className="income" style={digitStyles}>
            <span style={{ color: greenColor }}>{income}</span>
            <span style={{ color: incomeChange > 0 ? greenColor : redColor, alignSelf: 'end' }}>{incomeChange}%</span>
          </div>
          {/* <div className="chart-container" style={chartContainerStyles}> */}
            <Chart data={chartData} />
          {/* </div> */}
          <div className="outcome" style={digitStyles}>
            <span style={{ color: redColor }}>{outcome}</span>
            <span style={{ color: outcomeChange < 0 ? greenColor : redColor, alignSelf: 'end' }}>{outcomeChange}%</span>
          </div>
        </div>
      </Widget>

    </div>
  );
};

WidgetIncomeOutcome.propTypes = {
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired
};