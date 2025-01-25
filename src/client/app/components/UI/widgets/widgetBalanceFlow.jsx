import React from 'react';
import PropTypes from 'prop-types';
import Widget from '../../common/widget';
import { operationPropType } from '../../../../../types/propTypes';
import showElement from '../../../../../utils/console/showElement';
import getTodayDate from '../../../../../utils/date/getTodayDate';
import { getInputDate } from '../../../../../utils/formatDate';
import { useSelector } from 'react-redux';
import { getUserBalance } from '../../../store/user';

export default function WidgetBalanceFlow({ operations, numberOfDays }) {
  const userBalance = useSelector(getUserBalance());
  if (!operations) return;
  if (!numberOfDays) return console.error('No number of days were given to balance flow');

  const dateMap = new Map();
  const today = getTodayDate();
  const daysArray = new Array(numberOfDays).fill(0);

  let balance = userBalance;
  // TODO переписать с reduce
  daysArray.forEach((_, day) => {
    const date = getInputDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - day));
    const prevDate = getInputDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - day + 1));
    const dateOperations = operations.filter((op) => op.date === prevDate);
    const dateBalanceChange = dateOperations.reduce((acc, op) => (acc += op.amount), 0);
    balance -= dateBalanceChange;

    dateMap.set(date, balance);
  });

  showElement(dateMap, 'map');

  return (
    <div className="widget">
      <Widget name='Динамика баланса' />
    </div>
  );
};

WidgetBalanceFlow.propTypes = {
  numberOfDays: PropTypes.number.isRequired,
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
};