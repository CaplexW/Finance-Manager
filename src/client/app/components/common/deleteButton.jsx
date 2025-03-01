import React from 'react';
import PropTypes from 'prop-types';
import { trashIcon } from '../../../assets/icons';
import showElement from '../../../../server/utils/console/showElement';

export default function DeleteButton({ onDelete }) {
  return <button className='icon-button' onClick={onDelete} type='button'>{trashIcon}</button>;
};
DeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
};
