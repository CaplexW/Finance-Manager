import React from 'react';
import { Category, Icon } from '../../../types/types';
import SVGIcon from '../common/svgIcon';

interface CategoryButtonProps {
  data: {
    category: Category;
    icon: Icon;
  };
  onClick: () => void;
}

export default function CategoryButton({ data, onClick }: CategoryButtonProps) {
  return <span
    className='category-button'
    key={`${data.category.name}+${data.icon._id}`}
    onClick={onClick}
  >
    <SVGIcon
      color={data.category.color}
      size={1.5}
      source={data.icon}
    />
  </span>;
}






