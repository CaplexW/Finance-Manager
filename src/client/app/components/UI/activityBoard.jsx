import React, { useState } from 'react';
import showElement from '../../../../utils/console/showElement';
import ContentBoard from '../common/contentBoard';
import DummyWidget from '../common/dummyWidget';
import WidgetIncomeOutcome from './widgets/widgetIncomeOutcome';
import { useSelector } from 'react-redux';
import { getOperationsList } from '../../store/operations';
import WidgetBiggestOperations from './widgets/widgetBiggestOperations';

export default function ActivityBoard() {
  const [activityRange, setActivityRange] = useState(30);

  const operations = useSelector(getOperationsList());

  function handleChange({ target }) {
    showElement(target.value, 'value');
    setActivityRange(target.value);
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
  return (
    <div className="container d-flex justify-content-center">
      <ContentBoard header={header}>
        <WidgetIncomeOutcome operations={operations} />
        <WidgetBiggestOperations operations={operations} />
        <DummyWidget />
        <DummyWidget />
        <DummyWidget />
        <DummyWidget />
        <DummyWidget />
        <DummyWidget />
      </ContentBoard>
    </div>
  );
};