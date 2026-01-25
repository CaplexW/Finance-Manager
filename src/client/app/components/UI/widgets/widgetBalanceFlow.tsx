import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../../common/widget';
import { operationPropType } from '../../../../types/propTypes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../utils/console/showElement';
import { formatDisplayDateFromInput } from '../../../utils/formatDate';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getUserBalance } from '../../../store/user';
import formChartData from '../../../utils/formChartData';
import { greenColor, redColor } from '../../../constants/colors';
import Chart from '../../common/charts/chart';
import getBalanceHistory from '../../../utils/getBalanceHistory';
import { Operation } from '../../../../types/types';

interface WidgetBalanceFlowProps {
  operations: Operation[];
  dateRange: number;
}

export default function WidgetBalanceFlow({ operations, dateRange }: WidgetBalanceFlowProps): JSX.Element | null {
  const userBalance = useAppSelector(getUserBalance());

  if (!operations.length) return null;
  if (!dateRange) {
    // eslint-disable-next-line no-console
    console.error('No date range were given to balance flow');
    return null;
  }

  const dateMap = getBalanceHistory(dateRange, operations, userBalance);

  const labelDates = [...dateMap.keys()].map((d) => formatDisplayDateFromInput(d)).reverse();
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
      },
    },
  };

  const chartData = formChartData(labelDates, chartPoints, [charColor]);
  chartData.datasets[0].tension = 1;

  const widgetContainerStyles: React.CSSProperties = {
    height: '100%',
    display: 'grid',
    alignItems: 'center',
  };

  return (
    <div className="widget">
      <Widget name="Динамика баланса">
        <div className="widget-balance-flow-container" style={widgetContainerStyles}>
          <Chart data={chartData} options={chartOptions} type="line" />
        </div>
      </Widget>
    </div>
  );
}

WidgetBalanceFlow.propTypes = {
  dateRange: PropTypes.number.isRequired,
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};

