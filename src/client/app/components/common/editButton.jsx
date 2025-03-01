import React from 'react';
import PropTypes from 'prop-types';
import { penpaperIcon } from '../../../assets/icons';

export default function EditButton({ onClick }) {
  return <button aria-roledescription='Редактировать' className='icon-button' onClick={onClick} type='button'>{penpaperIcon}</button>;;
};
EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
