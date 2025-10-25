import React from 'react';
import { Category, Icon } from '../../../types/types.ts';
import SVGIcon from '../common/svgIcon.jsx'

export default function CategoryButton({ data, onClick }) {
  return <span
    className='category-button'
    key={`${i.category.name}+${i.icon._id}`}
    onClick={onClick}
  >
    <SVGIcon
      color={data.category.color}
      size={1.5}
      source={data.icon}
    />
  </span>;
};