import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { formatDisplayDateFromInput, tomorrowInput } from '../../../../../utils/formatDate';
import { clrTransWhite600, clrTransWhite900 } from '../../../../../constants/colors';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../../utils/console/showElement';
import { arrowLeftIcon, arrowRightIcon } from '../../../../assets/icons';

export default function DateRangeInput({ pickValue, onPick }) {
  const startInput = useRef();
  const endInput = useRef();
  const closedInput = useRef();
  const openedInput = useRef();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [firstSelectedDay, setFirstSelectedDay] = useState(null);
  const [secondSelectedDay, setSecondSelectedDay] = useState(null);

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  function handlePick() {
    if (startInput.current.value > endInput.current.value) {
      endInput.current.value = startInput.current.value;
    }
    onPick({ startDate: startInput.current.value, endDate: endInput.current.value });
  }
  function pickAllTime() {
    startInput.current.value = '1993-03-24';
    endInput.current.value = tomorrowInput();
    onPick({ start: startInput.current.value, end: endInput.current.value });
  }
  function handleOpen() {
    showElement(openedInput.current, 'openedInput.current');
    const isClosed = openedInput.current.hasAttribute('hidden');
    showElement(isClosed, 'isClosed');
    if (isClosed) {
      openedInput.current.removeAttribute('hidden');
    } else {
      openedInput.current.setAttribute('hidden', true);
    }
  }

  function selectNexMonth() {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  }
  function selectPrevMonth() {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  }

  function formatDisplayRange() {
    const [startYear, startMonth, startDay] = pickValue.start.split('-');
    const [endYear, endMonth, endDay] = pickValue.end.split('-');

    if (startYear === '1993') return 'За все время';
    if (startYear === endYear) return `${startDay}.${startMonth} - ${endDay}.${endMonth}`;

    return `${formatDisplayDateFromInput(pickValue.start)} - ${formatDisplayDateFromInput(pickValue.end)}`;
  }
  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }


  function formMonthPage() {
    const getAdjustedDay = (day) => (day === 0 ? 6 : day - 1);
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const numberOfDays = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
    const firstDayOfMonth = getAdjustedDay(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay());
    const lastDayOfMonth = getAdjustedDay(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), numberOfDays).getDay());
    const totalSlots = firstDayOfMonth + numberOfDays + (6 - lastDayOfMonth);
    const numberOfWeeks = Math.ceil(totalSlots / 7);

    const calendarSlots = new Array(totalSlots).fill(null);
    calendarSlots.forEach((_, i) => {
      if (i < numberOfDays) calendarSlots[firstDayOfMonth + i] = i + 1;
    });

    function createRow(rowIndex) {
      const rowStart = rowIndex * 7;
      const rowEnd = rowStart + 7;
      const rowDays = calendarSlots.slice(rowStart, rowEnd);
  
      return (
        <tr key={`week-${rowIndex}`}>
          {rowDays.map((day, colIndex) => createDay(day, colIndex))}
        </tr>
      );
    }
    function createDay(day, index) {
      return <td key={`day-${index}`}><button style={inputButtonStyles} type='button'>{day !== null ? day : ''}</button></td>;
    }

    return (
      <table>
        <thead>
          <tr key='firs-row'>
            {daysOfWeek.map((d) => <th key={d}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
        {new Array(numberOfWeeks).fill(null).map((_, weekIndex) => createRow(weekIndex))}
        </tbody>
      </table>
    );
  }

  const closedDisplayStyles = {
    background: clrTransWhite600,
    borderRadius: '14px',
    cursor: 'pointer',
    marginLeft: '5.2rem',
    padding: '.3em 1em',
  };
  const openedDisplayStyles = {
    marginTop: '.5rem',
    // marginRight: '100px',
    background: clrTransWhite900,
    borderRadius: '8px',
    position: 'absolute',
    zIndex: '100',
  };
  const inputButtonStyles = {
    margin: '0',
  };
  const selectedMonthNameStyles = {
    margin: '.5rem 1.5rem',
  };
  const buttonsBlockStyles = {
    padding: '.5em 1em',
  };

  return (
    <div className="input">
      <div
        className="closed-display"
        onClick={handleOpen}
        ref={closedInput}
        style={closedDisplayStyles}
      >
        {formatDisplayRange()}
      </div>
      <div className="opend-display" hidden ref={openedInput} style={openedDisplayStyles}>
        <div className="selected-month d-flex justify-content-around">
          <button onClick={selectPrevMonth} style={inputButtonStyles} type='button' >{arrowLeftIcon}</button>
          <span style={selectedMonthNameStyles}>{months[selectedDate.getMonth()]} {selectedDate.getFullYear().toString()[2] + selectedDate.getFullYear().toString()[3]}</span>
          <button onClick={selectNexMonth} style={inputButtonStyles} type='button'>{arrowRightIcon}</button>
        </div>
        <div className="days pe-3 ps-3">{formMonthPage()}</div>
        <div className="buttons" style={buttonsBlockStyles}>
          <button style={inputButtonStyles} type='button' >Сегодня</button>
          <button style={inputButtonStyles} type='button' >1н</button>
          <button style={inputButtonStyles} type='button' >1м</button>
          <button style={inputButtonStyles} type='button' >3м</button>
          <button style={inputButtonStyles} type='button' >6м</button>
          <button style={inputButtonStyles} type='button' >&#8734;</button>
        </div>
      </div>
      <input hidden id="start-date" name="start" ref={startInput} type="date" />
      <input hidden id="end-date" name="end" ref={endInput} type="date" />
    </div>
  );
};

DateRangeInput.propTypes = {
  onPick: PropTypes.func.isRequired,
  pickValue: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }).isRequired,
};