import React, { useState } from 'react';
import SelectInput from '../common/form/selectInput';
import showElement from '../../../../utils/console/showElement';
import ContentBoard from '../common/contentBoard';
import Widget from '../common/widget';

export default function ActivityBoard() {
  const [activityRange, setActivityRange] = useState(30);

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
        <Widget />
        <Widget />
        <Widget />
        <Widget />
        <Widget />
        <Widget />
        <Widget />
        <Widget />
      </ContentBoard>
    </div>
  );
};