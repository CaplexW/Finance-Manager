import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../../common/widget';
import { operationPropType } from '../../../../../types/propTypes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../../utils/console/showElement';
import { formatDisplayDateFromInput } from '../../../../../utils/formatDate';
import { useSelector } from 'react-redux';
import { getUserBalance } from '../../../store/user';
import formChartData from '../../../../../utils/formChartData';
import { greenColor, redColor } from '../../../../../constants/colors';
import Chart from '../../common/charts/chart';
import getBalanceHistory from '../../../../../utils/getBalanceHistory';

export default function WidgetBalanceFlow({ operations, numberOfDays }) {
  const userBalance = useSelector(getUserBalance());

  if (!operations) return;
  if (!numberOfDays) return console.error('No number of days were given to balance flow');

  const dateMap = getBalanceHistory(numberOfDays, operations, userBalance);

  const labelDates = [...dateMap.keys()].map((d) => formatDisplayDateFromInput(d));
  const chartPoints = [...dateMap.values()].reverse();
  const charColor = chartPoints[0] < chartPoints[chartPoints.length - 1] ? greenColor : redColor;
  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: Math.min(...chartPoints),
        max: Math.round(Math.max(...chartPoints) * 1.1),
        ticks: {
          display: false,
        },
      },
      x: {
        ticks: {
          display: false,
        },
      }
    }
  };

  const chartData = formChartData(labelDates, chartPoints, [charColor]);
  chartData.datasets[0].tension = 1;

  const widgetContainerStyles = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '.5em',
  };

  return (
    <div className="widget">
      <Widget name='Динамика баланса'>
        <div className="widget-container" style={widgetContainerStyles} >
          <Chart data={chartData} options={chartOptions} type='line' />
        </div>
      </Widget>
    </div>
  );
};

WidgetBalanceFlow.propTypes = {
  numberOfDays: PropTypes.number.isRequired,
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};

