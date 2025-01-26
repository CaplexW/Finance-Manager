import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../utils/console/showElement';
import ContentBoard from '../common/contentBoard';
import WidgetIncomeOutcome from './widgets/widgetIncomeOutcome';
import { useSelector } from 'react-redux';
import { getOperationsList } from '../../store/operations';
import WidgetBiggestOperations from './widgets/widgetBiggestOperations';
import WidgetBalanceFlow from './widgets/widgetBalanceFlow';
import WidgetBiggestCategories from './widgets/widgetBiggestCategories';
import getSomeDaysAgoDate from '../../../../utils/date/getSomeDaysAgoDate';

export default function ActivityBoard() {
  const [activityRange, setActivityRange] = useState(30);

  const operations = useSelector(getOperationsList());
  const relevantOperations = operations.filter((op) => {
    const operationDate = new Date(op.date);
    const startDate = getSomeDaysAgoDate(activityRange);
    return operationDate.getTime() >= startDate.getTime();
  });
  const prevOperations = operations.filter((op) => {
    const startDate = getSomeDaysAgoDate(activityRange * 2);
    const endDate = getSomeDaysAgoDate(activityRange);
    const operationDate = new Date(op.date);

    return operationDate.getTime() >= startDate.getTime() && operationDate.getTime() < endDate.getTime();
  });

  function handleChange({ target }) {
    setActivityRange(parseInt(target.value));
  }

  const selectStyles = {
    background: 'rgba(255, 255, 255, 0)',
    border: 'none',
    borderRadius: '8px',
    appearance: 'none',
    padding: '.5rem',
    fontWeight: '600',
  };
  const header = (
    <h4 className="">
      Ваши финансы за последние
      {' '}
      <select onChange={handleChange} style={selectStyles} value={activityRange} >
        <option>30</option>
        <option>60</option>
        <option>90</option>
        <option>180</option>
        <option>365</option>
      </select>
      {' '}
      дней
    </h4>
  );

  const containerStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  };

  return (
    <ContentBoard header={header}>
      <div className="widgets-container" style={containerStyles}>
        <WidgetIncomeOutcome operations={relevantOperations} prevOperations={prevOperations} />
        <WidgetBalanceFlow dateRange={activityRange} operations={relevantOperations} />
        <WidgetBiggestOperations operations={relevantOperations} />
        <WidgetBiggestCategories operations={relevantOperations} />
      </div>
    </ContentBoard>
  );
};