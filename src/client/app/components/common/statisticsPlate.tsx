import React from 'react';
import SVGIcon from './svgIcon';
import { Icon } from '../../../types/types';

interface StatisticPlateProps {
  amount: number;
  name: string;
  icon: {
    color: string;
    src: Icon;
  };
}

export default function StatisticPlate({ amount, name, icon }: StatisticPlateProps) {
  return (
    <div className='statistics-plate'>
      <span className={`plate__amount ${amount > 0 ? 'income' : 'outcome'}`}>{Math.abs(amount)}</span>
      <span className='plate__name'>{name}</span>
      <span className='plate__icon'><SVGIcon color={icon.color} size={1.5} source={icon.src} /></span>
    </div >
  );
}




