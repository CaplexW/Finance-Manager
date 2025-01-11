import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../common/widget';
import Chart from '../common/charts/chart';
import { greenColor, redColor } from '../../../../constants/colors';
import { operationPropType } from '../../../../types/propTypes';
import showElement from '../../../../utils/console/showElement';
import ContentBoard from '../common/contentBoard';

export default function WidgetIncomeOutcome({ operations }) {
  const data = {
    labels: ["Расход", "Доход"],
    datasets: [
      {
        label: '',
        data: [operations.filter((op) => op.amount < 0).reduce((acc, op) => acc + Math.abs(op.amount), 0), operations.filter((op) => op.amount > 0).reduce((acc, op) => acc + op.amount, 0)],
        backgroundColor: [redColor, greenColor],
        borderColor: [redColor, greenColor],
      }
    ],
  };

  const styles = {
    borderRadius: '9px 9px 0 0',
    padding: '1em',
    textAlign: 'center',
    justifyContent: 'center',
  };

  const incomeChange = -15;
  const outcomeChange = -30;

  return (
    <div className="widget">
      
      <Widget name='Доход/Расход'>
        <div className="income d-grid justify-content-between">
          <span style={{ color: greenColor }}>{data.datasets[0].data[1]}</span>
          <span style={{ color: incomeChange > 0 ? greenColor : redColor, alignSelf: 'end' }}>{incomeChange}%</span>
        </div>
        <Chart data={data} />
        <div className="outcome d-grid justify-content-between">
          <span style={{ color: redColor }}>{data.datasets[0].data[0]}</span>
          <span style={{ color: outcomeChange < 0 ? greenColor : redColor, alignSelf: 'end' }}>{outcomeChange}%</span>
        </div>
      </Widget>
      {/* <ContentBoard>
      <Chart data={data} />
    </ContentBoard> */}
    </div>
  );
};

WidgetIncomeOutcome.propTypes = {
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired
};