import React from 'react';
import SVGIcon from './svgIcon';
import showElement from '../../../../utils/console/showElement';

export default function ButtonWithIcon({ icon, onClick, size }) {
  const styles = { margin: '.5rem' };
  return <div onClick={onClick} style={styles} type='button' ><SVGIcon size={size} source={icon} /></div>;
};
