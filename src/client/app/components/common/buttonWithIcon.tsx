import React, { useCallback } from 'react';
import SVGIcon from './svgIcon';
import { Icon } from '../../../types/types';

interface ButtonWithIconProps {
  icon: Icon;
  onClick: (icon: Icon) => void;
  size?: number;
}

export default function ButtonWithIcon({ icon, onClick, size = 1 }: ButtonWithIconProps) {
  const styles = { margin: '.5rem' };
  return <div onClick={useCallback(() => (onClick(icon)))} style={styles} type='button' ><SVGIcon size={size} source={icon} /></div>;
}




