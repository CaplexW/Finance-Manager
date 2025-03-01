import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import SVGIcon from './svgIcon';
import { iconPropType } from '../../../types/propTypes';

export default function ButtonWithIcon({ icon, onClick, size = 16 }) {
  const styles = { margin: '.5rem' };
  return <div onClick={useCallback(() => (onClick(icon)))} style={styles} type='button' ><SVGIcon size={size} source={icon} /></div>;
};

ButtonWithIcon.propTypes = {
  icon: PropTypes.shape(iconPropType).isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.number,
};