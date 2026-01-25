import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { formatDisplayDateFromInput } from '../../../utils/formatDate';
import getWeekBorders from '../../../utils/date/getWeekBorders';
import getLastMonthsBorders from '../../../utils/date/getLastMonthsBorders';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../utils/console/showElement';
import { arrowLeftIcon, arrowRightIcon } from '../../../../assets/icons';
import getTodayDate from '../../../utils/date/getTodayDate';

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
] as const;

interface DateRangeValue {
  start: string;
  end: string;
}

interface DateRangeInputProps {
  pickValue: DateRangeValue;
  onPick: (range: DateRangeValue) => void;
}

interface DisplayedMonth {
  month: number;
  year: number;
}

interface InputState {
  startDate: Date | null;
  endDate: Date | null;
  isShortcut: boolean;
  isBordersClosed: boolean | null;
  isOpen: boolean;
  displayedMonth: DisplayedMonth;
}

type InputAction =
  | { type: 'SET_START_DATE'; payload: { value: Date; isShortcut: boolean; isBordersClosed: boolean | null } }
  | { type: 'SET_END_DATE'; payload: { value: Date; isShortcut: boolean; isBordersClosed: boolean | null } }
  | { type: 'RESET_DATE_RANGE' }
  | { type: 'SET_DISPLAYED_MONTH'; payload: DisplayedMonth }
  | { type: 'SET_OPEN_STATE'; payload: boolean };

const initialState: InputState = {
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

function inputStateReducer(state: InputState, action: InputAction): InputState {
  if (action.type === 'SET_START_DATE') {
    const { value, isShortcut, isBordersClosed } = action.payload;
    return { ...state, startDate: value, endDate: null, isShortcut, isBordersClosed };
  }
  if (action.type === 'SET_END_DATE') {
    const { value, isShortcut, isBordersClosed } = action.payload;
    if (state.startDate && state.startDate > value) {
      return {
        ...state, startDate: value, endDate: state.startDate, isShortcut, isBordersClosed,
      };
    }
    return { ...state, endDate: value, isShortcut, isBordersClosed };
  }
  if (action.type === 'RESET_DATE_RANGE') {
    return {
      startDate: null, endDate: null, isShortcut: false, isBordersClosed: null, isOpen: state.isOpen, displayedMonth: state.displayedMonth,
    };
  }
  if (action.type === 'SET_DISPLAYED_MONTH') {
    return { ...state, displayedMonth: action.payload };
  }
  if (action.type === 'SET_OPEN_STATE') {
    return { ...state, isOpen: action.payload };
  }
  throw new Error(`Unhandled action type: ${action satisfies never}`);
}

export default function DateRangeInput({ pickValue, onPick }: DateRangeInputProps): JSX.Element {
  const [inputState, dispatch] = useReducer(inputStateReducer, initialState);

  useEffect(handleChange, [inputState.endDate]);

  function handleStartDateChange(value: Date, isShortcut: boolean): void {
    dispatch({
      type: 'SET_START_DATE',
      payload: {
        isShortcut,
        value,
        isBordersClosed: isShortcut ? null : false,
      },
    });
  }
  function handleEndDateChange(value: Date, isShortcut: boolean): void {
    dispatch({
      type: 'SET_END_DATE',
      payload: {
        value,
        isShortcut,
        isBordersClosed: isShortcut ? null : true,
      },
    });
  }
  function handleDisplayedMonthChange(newYear: number, newMonth: number): void {
    dispatch({
      type: 'SET_DISPLAYED_MONTH',
      payload: {
        month: newMonth,
        year: newYear,
      },
    });
  }
  function handleOpenInputPage(state: boolean): void {
    dispatch({
      type: 'SET_OPEN_STATE',
      payload: state,
    });
  }

  function handleChange(): void {
    if (inputState.endDate && inputState.startDate) {
      onPick({
        start: inputState.startDate.toISOString().slice(0, 10),
        end: inputState.endDate.toISOString().slice(0, 10),
      });
    }
  }
  function handlePick({ target }: React.MouseEvent<HTMLTableCellElement>): void {
    const selectedDate = new Date((target as HTMLTableCellElement).dataset.date ?? '');
    const firstSelection = inputState.isBordersClosed === null || inputState.isBordersClosed === true;

    if (firstSelection) handleStartDateChange(selectedDate, false);
    if (!firstSelection) handleEndDateChange(selectedDate, false);
  }
  function handleShortcut({ target }: React.MouseEvent<HTMLButtonElement>): void {
    const { name } = target as HTMLButtonElement;
    const nameIsNumber = !Number.isNaN(parseInt(name, 10));

    if (nameIsNumber) {
      const { firstDay, lastDay } = getLastMonthsBorders(Number(name) - 1);
      handleStartDateChange(firstDay, true);
      handleEndDateChange(lastDay, true);
    }

    switch (name) {
      case 'today':
        handleStartDateChange(getTodayDate(), true);
        handleEndDateChange(getTodayDate(), true);
        break;
      case 'week': {
        const { firstDay, lastDay } = getWeekBorders();
        handleStartDateChange(firstDay, true);
        handleEndDateChange(lastDay, true);
        break;
      }
      case 'infinity':
        handleStartDateChange(new Date('1993-02-24'), true);
        handleEndDateChange(getTodayDate(), true);
        break;
      default:
        break;
    }
  }

  function handleHighlight({ target }: React.MouseEvent<HTMLTableCellElement>): void {
    if (inputState.isBordersClosed !== false) return;

    const [startBorder, endBorder] = getSelectedBorders((target as HTMLTableCellElement).dataset.date ?? '');

    const allCells = [...document.querySelectorAll<HTMLTableCellElement>('.date-cell')];

    highlightItems(allCells, startBorder, endBorder);

    function highlightItems(items: HTMLTableCellElement[], start: Date, end: Date): void {
      items.forEach((cell) => {
        const cellDate = new Date(cell.dataset.date ?? '');

        if (cellDate > start && cellDate < end) {
          cell.classList.add('highlighted');
        } else {
          cell.classList.remove('highlighted');
        }
      });
    }
  }
  function selectNextMonth(number: number): void {
    const nextDate = new Date(inputState.displayedMonth.year, inputState.displayedMonth.month + number);
    handleDisplayedMonthChange(nextDate.getFullYear(), nextDate.getMonth());
  }
  function toggleOpen(): void {
    handleOpenInputPage(!inputState.isOpen);
  }

  function formatDisplayRange(): string {
    const [startYear, startMonth, startDay] = pickValue.start.split('-');
    const [endYear, endMonth, endDay] = pickValue.end.split('-');

    const startDate = new Date(pickValue.start);
    const endDate = new Date(pickValue.end);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startYear === '1993') return 'Все время';
    if (
      startDate.getTime() === getTodayDate().getTime()
      && endDate.getTime() === getTodayDate().getTime()
    ) return 'Сегодня';
    if (startYear === endYear) return `${startDay}.${startMonth} - ${endDay}.${endMonth}`;

    return `${formatDisplayDateFromInput(pickValue.start)} - ${formatDisplayDateFromInput(pickValue.end)}`;
  }

  function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }
  function formMonthPage(): JSX.Element {
    const getAdjustedDay = (day: number) => (day === 0 ? 6 : day - 1);
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const numberOfDays = getDaysInMonth(inputState.displayedMonth.year, inputState.displayedMonth.month);
    const firstDayOfMonth = getAdjustedDay(new Date(inputState.displayedMonth.year, inputState.displayedMonth.month, 1).getDay());
    const lastDayOfMonth = getAdjustedDay(new Date(inputState.displayedMonth.year, inputState.displayedMonth.month, numberOfDays).getDay());
    const totalSlots = firstDayOfMonth + numberOfDays + (6 - lastDayOfMonth);
    const numberOfWeeks = Math.ceil(totalSlots / 7);

    const calendarSlots: (number | null)[] = new Array(totalSlots).fill(null);
    calendarSlots.forEach((_, i) => {
      if (i < numberOfDays) calendarSlots[firstDayOfMonth + i] = i + 1;
    });

    function createRow(rowIndex: number): JSX.Element {
      const rowStart = rowIndex * 7;
      const rowEnd = rowStart + 7;
      const rowDays = calendarSlots.slice(rowStart, rowEnd);

      return (
        <tr key={`week-${rowIndex}`}>
          {rowDays.map((day, colIndex) => createDay(day, colIndex))}
        </tr>
      );
    }
    function createDay(day: number | null, index: number): JSX.Element {
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
        && inputState.startDate
        && (cellDate.getTime() > inputState.startDate.getTime() && cellDate.getTime() < inputState.endDate!.getTime())
      );
      const transitionStyle: React.CSSProperties = { transition: `background ${0.25 + (index * 0.1)}s` };

      return (
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
          <tr key="firs-row">
            {daysOfWeek.map((d) => <th key={d}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {new Array(numberOfWeeks).fill(null).map((_, weekIndex) => createRow(weekIndex))}
        </tbody>
      </table>
    );
  }
  function getSelectedBorders(lastBorder: string): [Date, Date] {
    const startDate = inputState.startDate ?? new Date(lastBorder);
    const endDate = new Date(lastBorder);

    if (startDate > endDate) return [endDate, startDate];
    return [startDate, endDate];
  }
  function getDateOfDisplayedMonth(day: number): Date {
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
          <button onClick={() => { selectNextMonth(-1); }} type="button">{arrowLeftIcon}</button>
          <span className="month-name">
            {months[inputState.displayedMonth.month]}
            {' '}
            {`${inputState.displayedMonth.year.toString()[2]}${inputState.displayedMonth.year.toString()[3]}`}
          </span>
          <button onClick={() => { selectNextMonth(1); }} type="button">{arrowRightIcon}</button>
        </div>
        <div className="days-page pe-3 ps-3">{formMonthPage()}</div>
        <div className="buttons-page d-flex justify-content-between mb-2">
          <div className="pickButtons">
            <button className="shortcut-btn" name="today" onClick={handleShortcut} type="button">Сегодня</button>
            <button className="shortcut-btn" name="week" onClick={handleShortcut} type="button">1н</button>
            <button className="shortcut-btn" name="1" onClick={handleShortcut} type="button">1м</button>
            <button className="shortcut-btn" name="3" onClick={handleShortcut} type="button">3м</button>
            <button className="shortcut-btn" name="6" onClick={handleShortcut} type="button">6м</button>
            <button className="shortcut-btn" name="infinity" onClick={handleShortcut} type="button">&#8734;</button>
          </div>
          <div className="end-buttons">
            <button className="close-btn" onClick={toggleOpen} type="button">Готово</button>
          </div>
        </div>
      </div>
      <input hidden id="start-date" name="start" type="date" />
      <input hidden id="end-date" name="end" type="date" />
    </div>
  );
}

DateRangeInput.propTypes = {
  onPick: PropTypes.func.isRequired,
  pickValue: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }).isRequired,
};

