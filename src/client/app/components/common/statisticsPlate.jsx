import React from 'react';
import PropTypes from 'prop-types';
import SVGIcon from './svgIcon';
import { iconPropType } from '../../../types/propTypes';

export default function StatisticPlate({ amount, name, icon }) {
  return (
    <div className='statistics-plate'>
      <span className={`plate__amount ${amount > 0 ? 'income' : 'outcome'}`}>{Math.abs(amount)}</span>
      <span className='plate__name'>{name}</span>
      <span className='plate__icon'><SVGIcon color={icon.color} size={24} source={icon.src} /></span>
    </div >
  );
};

StatisticPlate.propTypes = {
  amount: PropTypes.number.isRequired,
  icon: PropTypes.shape({
    color: PropTypes.string.isRequired,
    src: PropTypes.shape(iconPropType).isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired

};