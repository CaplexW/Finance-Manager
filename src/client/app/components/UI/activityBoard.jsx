import React, { useState } from 'react';
import showElement from '../../../../utils/console/showElement';
import ContentBoard from '../common/contentBoard';
import DummyWidget from '../common/dummyWidget';
import WidgetIncomeOutcome from './widgets/widgetIncomeOutcome';
import { useSelector } from 'react-redux';
import { getOperationsList } from '../../store/operations';
import WidgetBiggestOperations from './widgets/widgetBiggestOperations';
import WidgetBalanceFlow from './widgets/widgetBalanceFlow';
import WidgetBiggestCategories from './widgets/widgetBiggestCategories';

export default function ActivityBoard() {
  const [activityRange, setActivityRange] = useState(30);

  const operations = useSelector(getOperationsList());

  function handleChange({ target }) {
    showElement(target.value, 'value');
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
  };
  return (
    <ContentBoard header={header}>
      <div className="widgets-container" style={containerStyles}>
        <WidgetIncomeOutcome operations={operations} />
        <WidgetBalanceFlow numberOfDays={activityRange} operations={operations} />
        <WidgetBiggestOperations operations={operations} />
        <WidgetBiggestCategories operations={operations} />
      </div>
    </ContentBoard>
  );
};