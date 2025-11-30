import React from 'react';
import { useSelector } from 'react-redux';
import { getCategoryById } from '../../store/categories';
import SVGIcon from '../common/svgIcon';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../server/utils/console/showElement';
import { getIconById } from '../../store/icons';

interface CategoryLabelProps {
  categoryId: string;
}

export default function CategoryLabel({ categoryId }: CategoryLabelProps) {
  const category = useSelector(getCategoryById(categoryId));
  const icon = useSelector(getIconById(category?.icon));

  const { name, color } = category;

  return (
    <div className="category-label">
      <SVGIcon color={color} source={icon} />
      {' '}
      <span>{name}</span>
    </div>
  );
}




