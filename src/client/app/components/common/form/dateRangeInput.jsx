import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { formatDisplayDateFromInput } from '../../../../../utils/formatDate';
import getWeekBorders from '../../../../../utils/date/getWeekBorders';
import getLastMonthsBorders from '../../../../../utils/date/getLastMonthsBorders';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../../utils/console/showElement';
import { arrowLeftIcon, arrowRightIcon } from '../../../../assets/icons';
import getTodayDate from '../../../../../utils/date/getTodayDate';

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export default function DateRangeInput({ pickValue, onPick }) {
  const initialState = {
    startDate: null,
    endDate: null,
    isShortcut: true,
    isBordersClosed: null,
    isOpen: false,
    displayedMonth: {
      month: getTodayDate().getMonth(),
      year: getTodayDate().getFullYear(),
    },

  };
  const [inputState, dispatch] = useReducer(inputStateReducer, initialState);

  useEffect(handleChange, [inputState.endDate]);

  function inputStateReducer(state, { type, payload }) {
    const { value, isShortcut, isBordersClosed } = payload;

    switch (type) {
      case 'SET_START_DATE':
        return { ...state, startDate: value, endDate: null, isShortcut, isBordersClosed };
      case 'SET_END_DATE':
        if (state.startDate > value) {
          return { ...state, startDate: value, endDate: state.startDate, isShortcut, isBordersClosed };
        }
        return { ...state, endDate: value, isShortcut, isBordersClosed };
      case 'RESET_DATE_RANGE':
        return { startDate: '', endDate: '', isShortcut: false, isBordersClosed: null };
      case 'SET_DISPLAYED_MONTH':
        return { ...state, displayedMonth: payload };
      case 'SET_OPEN_STATE':
        return { ...state, isOpen: payload };
      default:
        throw new Error(`Unhandled action type: ${type}`);
    }
  }

  function handleStartDateChange(value, isShortcut) {
    dispatch({
      type: 'SET_START_DATE',
      payload: {
        isShortcut,
        value: value,
        isBordersClosed: isShortcut ? null : false,
      },
    });
  }
  function handleEndDateChange(value, isShortcut) {
    dispatch({
      type: 'SET_END_DATE',
      payload: {
        value: value,
        isShortcut,
        isBordersClosed: isShortcut ? null : true,
      },
    });
  }
  function handleDisplayedMonthChange(newYear, newMonth) {
    dispatch({
      type: 'SET_DISPLAYED_MONTH',
      payload: {
        month: newMonth,
        year: newYear,
      }
    });
  }
  function handleOpenInputPage(state) {
    dispatch({
      type: 'SET_OPEN_STATE',
      payload: state
    });
  }

  function handleChange() {
    if (inputState.endDate) onPick({ start: inputState.startDate, end: inputState.endDate });
  }
  function handlePick({ target }) {
    const selectedDate = new Date(target.dataset.date);
    const firstSelection = inputState.isBordersClosed === null || inputState.isBordersClosed === true;

    if (firstSelection) handleStartDateChange(selectedDate, false);
    if (!firstSelection) handleEndDateChange(selectedDate, false);
  }
  function handleShortcut({ target }) {
    const { name } = target;
    const nameIsNumber = !isNaN(parseInt(name));

    if (nameIsNumber) {
      handleStartDateChange(getLastMonthsBorders(name - 1).firstDay, true);
      handleEndDateChange(getLastMonthsBorders(name - 1).lastDay, true);
    }

    switch (name) {
      case 'today':
        handleStartDateChange(getTodayDate(), true);
        handleEndDateChange(getTodayDate(), true);
        break;
      case 'week':
        handleStartDateChange(getWeekBorders().firstDay, true);
        handleEndDateChange(getWeekBorders().lastDay, true);
        break;
      case 'infinity':
        handleStartDateChange(new Date('1993', '02', '24'), true);
        handleEndDateChange(getTodayDate(), true);
        break;
      default:
        break;
    }
  }

  function handleHighlight({ target }) {
    if (inputState.isBordersClosed !== false) return;

    const [startBorder, endBorder] = getSelectedBorders(target.dataset.date);

    const allCells = [...document.querySelectorAll('.date-cell')];

    highlightItems(allCells, startBorder, endBorder);

    function highlightItems(items, startBorder, endBorder) {
      items.forEach((cell) => {
        const cellDate = new Date(cell.dataset.date);

        if (cellDate > startBorder && cellDate < endBorder) {
          cell.classList.add('highlighted');
        }
        else {
          cell.classList.remove('highlighted');
        }
      });
    }
  }
  function selectNextMonth(number) {
    const nextDate = new Date(inputState.displayedMonth.year, inputState.displayedMonth.month + number);
    handleDisplayedMonthChange(nextDate.getFullYear(), nextDate.getMonth());
  }
  function toggleOpen() { handleOpenInputPage(!inputState.isOpen); };

  function formatDisplayRange() {
    const [startYear, startMonth, startDay] = pickValue.start.split('-');
    const [endYear, endMonth, endDay] = pickValue.end.split('-');

    const startDate = new Date(pickValue.start);
    const endDate = new Date(pickValue.end);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startYear === '1993') return 'все время';
    if (
      startDate.getTime() === getTodayDate().getTime()
      && endDate.getTime() === getTodayDate().getTime()
    ) return 'сегодня';
    if (startYear === endYear) return `${startDay}.${startMonth} - ${endDay}.${endMonth}`;

    return `${formatDisplayDateFromInput(pickValue.start)} - ${formatDisplayDateFromInput(pickValue.end)}`;
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
  function formMonthPage() {
    const getAdjustedDay = (day) => (day === 0 ? 6 : day - 1);
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const numberOfDays = getDaysInMonth(inputState.displayedMonth.year, inputState.displayedMonth.month);
    const firstDayOfMonth = getAdjustedDay(new Date(inputState.displayedMonth.year, inputState.displayedMonth.month, 1).getDay());
    const lastDayOfMonth = getAdjustedDay(new Date(inputState.displayedMonth.year, inputState.displayedMonth.month, numberOfDays).getDay());
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
      if (!day) return <td key={`empty-day-${index}`} />;

      const cellDate = getDateOfDisplayedMonth(day);
      const ISODate = cellDate.toISOString();

      const isSelected = (
        !inputState.isShortcut
        && (cellDate.getTime() === inputState.startDate?.getTime() || cellDate.getTime() === inputState.endDate?.getTime())
      );
      const isHighlighted = (
        !inputState.isShortcut
        && Boolean(inputState.endDate)
        && (cellDate.getTime() > inputState.startDate.getTime() && cellDate.getTime() < inputState.endDate.getTime())
      );
      const transitionStyle = { transition: `background ${0.25 + (index * 0.1)}s` };

      if (day) return (
        <td
          className={`date-cell${isSelected ? ' selected' : ''}${isHighlighted ? ' highlighted' : ''}`}
          data-date={ISODate}
          key={`day-${index}`}
          onClick={handlePick}
          onMouseOver={handleHighlight}
          style={transitionStyle}
        >
          {day}
        </td>
      );
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
  function getSelectedBorders(lastBorder) {
    const startDate = inputState.startDate;
    const endDate = new Date(lastBorder);

    if (startDate > endDate) return [endDate, startDate];
    return [startDate, endDate];
  }
  function getDateOfDisplayedMonth(day) {
    return new Date(inputState.displayedMonth.year, inputState.displayedMonth.month, day);
  }

  return (
    <div className="date-range-input">
      <div
        className="closed-display"
        onClick={toggleOpen}
      >
        {formatDisplayRange()}
      </div>
      <div className={`opened-display ${inputState.isOpen ? 'opened' : 'closed'}`}>
        <div className="selected-month d-flex justify-content-around">
          <button onClick={() => { selectNextMonth(-1); }} type='button' >{arrowLeftIcon}</button>
          <span className='month-name'>{months[inputState.displayedMonth.month]} {inputState.displayedMonth.year.toString()[2] + inputState.displayedMonth.year.toString()[3]}</span>
          <button onClick={() => { selectNextMonth(1); }} type='button'>{arrowRightIcon}</button>
        </div>
        <div className="days-page pe-3 ps-3">{formMonthPage()}</div>
        <div className="buttons-page d-flex justify-content-between mb-2">
          <div className="pickButtons">
            <button className='shortcut-btn' name='today' onClick={handleShortcut} type='button'>Сегодня</button>
            <button className='shortcut-btn' name='week' onClick={handleShortcut} type='button'>1н</button>
            <button className='shortcut-btn' name={1} onClick={handleShortcut} type='button'>1м</button>
            <button className='shortcut-btn' name={3} onClick={handleShortcut} type='button'>3м</button>
            <button className='shortcut-btn' name={6} onClick={handleShortcut} type='button'>6м</button>
            <button className='shortcut-btn' name='infinity' onClick={handleShortcut} type='button'>&#8734;</button>
          </div>
          <div className="end-buttons">
            <button className='close-btn' onClick={toggleOpen} type='button'>Готово</button>
          </div>
        </div>
      </div>
      <input hidden id="start-date" name="start" type="date" />
      <input hidden id="end-date" name="end" type="date" />
    </div >
  );
};

DateRangeInput.propTypes = {
  onPick: PropTypes.func.isRequired,
  pickValue: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }).isRequired,
};