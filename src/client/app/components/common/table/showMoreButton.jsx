import React from 'react';
import PropTypes from 'prop-types';
import { arrowDownIcon } from '../../../../assets/icons';

export default function ShowMoreButton({ condition, onClick }) {

  if(!condition) return;

  function handleKeyDown(event) {
    if (event.key === "Enter") onClick();
  }

  return <div className='more-btn' onClick={onClick} onKeyDown={handleKeyDown} tabIndex="0">{arrowDownIcon}</div>;
};

ShowMoreButton.propTypes = {
  condition: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
