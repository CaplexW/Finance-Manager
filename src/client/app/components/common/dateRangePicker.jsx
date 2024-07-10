import React from 'react';
import PropTypes from 'prop-types';
import { arrowRightIcon } from '../../../assets/icons';
import { mainColor } from '../../../../constants/colors';
import { tomorrowInput } from '../../../../utils/formatDate.ts';

export default function DateRangeInput({ pick, onPick }) {
  function handlePick() {
    const start = document.querySelector('#dateRangeStart');
    const end = document.querySelector('#dateRangeEnd');
    if (start.value > end.value) {
      end.value = start.value;
    }
    onPick({ startDate: start.value, endDate: end.value });
  }
  function handleAllTime() {
    const start = document.querySelector('#dateRangeStart');
    const end = document.querySelector('#dateRangeEnd');
    start.value = '1993-03-24';
    end.value = tomorrowInput();
    onPick({ start: start.value, end: end.value });
  }
  return (
    <>
      <input
        className="content-justify-end form-control m-1"
        defaultValue={pick.start}
        id="dateRangeStart"
        onChange={handlePick}
        type="date"
      />
      {arrowRightIcon}
      <input
        className="content-justify-end form-control m-1"
        defaultValue={pick.end}
        id="dateRangeEnd"
        onChange={handlePick}
        type="date"
      />
      <button
        className="badge m-3"
        id="allTimeButton"
        onClick={handleAllTime}
        style={{ backgroundColor: mainColor, borderColor: mainColor }}
        type="button"
      >
        Всё время
      </button>
    </>
  );
}
DateRangeInput.propTypes = {
  dateRange: PropTypes.shape({
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
  }).isRequired,
  onPick: PropTypes.func.isRequired,
};
