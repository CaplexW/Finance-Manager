import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../../common/widget';
import Chart from '../../common/charts/chart';
import { greenColor, redColor } from '../../../../../constants/colors';
import { operationPropType } from '../../../../../types/propTypes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../../utils/console/showElement';
import formChartData from '../../../../../utils/formChartData';
import { isNumber } from 'lodash';

export default function WidgetIncomeOutcome({ operations, prevOperations = null }) {
  if (!operations.length) return;

  const outcome = operations.filter((op) => op.amount < 0).reduce((acc, op) => acc + op.amount, 0);
  const income = operations.filter((op) => op.amount > 0).reduce((acc, op) => acc + op.amount, 0);
  const labels = ["Расход", "Доход"];

  const renderColumn = (columnNumber) => {
    const prevNumber = prevOperations
      .filter((op) => columnNumber > 0 ? op.amount > 0 : op.amount < 0)
      .reduce((acc, op) => acc + op.amount, 0);
    const changeResult = getChange(columnNumber, prevNumber);
    //TODO если расход отрицательный он должен быть зеленым
    return (
      <>
        <span
          style={getDisplayedStyles(columnNumber)}
        >
          {getDisplayedDigits(columnNumber)}
        </span>
        {!!prevNumber &&
          <span
            style={getDisplayedStyles(Math.abs(columnNumber) > Math.abs(prevNumber) ? prevNumber : prevNumber)}
          >
            {Math.abs(columnNumber) < Math.abs(prevNumber) ? '-' : '+'}{isNumber(changeResult) ? Math.abs(changeResult) : changeResult}%
          </span>}
      </>
    );
  };

  const chartData = formChartData(labels, [outcome, income], [redColor, greenColor]);

  const widgetContainerStyles = {
    height: '100%',
    display: 'grid',
    gridAutoFlow: 'column',
    gridTemplateColumns: 'minmax(0,1fr) minmax(0,3fr) minmax(0,1fr)',
    padding: '.5em 0'
  };
  const chartContainerStyles = {
    display: 'grid',
    alignItems: 'center',
  };
  const digitColumnStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  };

  return (
    <div className="widget">

      <Widget name='Доход/Расход'>
        <div className="widget-container" style={widgetContainerStyles}>
          <div className="income" style={digitColumnStyles}>
            {renderColumn(income)}
          </div>
          <div className="chart-container" style={chartContainerStyles}><Chart data={chartData} type='pie' /></div>
          <div className="outcome" style={digitColumnStyles}>
            {renderColumn(outcome)}
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

const getChange = (present, prev) => {
  if (!prev || !present) return '—';

  const diff = present - prev;
  const onePersent = prev / 100;

  const result = (diff / onePersent);

  if (result > 1_000_000) return `${Math.floor(result / 1_000_000)}m`;
  if (result > 100_000) return `${Math.floor(result / 1000)}k`;
  if (result > 1000) return `${(result / 1000).toFixed(1)}k`;
  showElement(result, 'result');
  return Math.round(result);
};
const getDisplayedStyles = (number) => {
  return {
    color: number > 0 ? 'green' : 'red',
  };
};
const getDisplayedDigits = (number) => {
  let result = '';
  result = Math.abs(number);
  if (Math.abs(number) > 1000000) result = `${Math.floor(number / 1_000_000)}m`;
  if (Math.abs(number) > 100000) result = `${Math.floor(number / 1000)}k`;

  return result;
};
