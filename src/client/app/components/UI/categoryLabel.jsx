import React from 'react';
import { useSelector } from 'react-redux';
import { getCategoryById } from '../../store/categories';
import PropTypes from 'prop-types';
import SVGIcon from '../common/svgIcon';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../utils/console/showElement';
import { getIconById } from '../../store/icons';

export default function CategoryLabel({ categoryId }) {
  const category = useSelector(getCategoryById(categoryId));
  const icon = useSelector(getIconById(category.icon));

  const { name, color } = category;

  return (
    <div className="category-label disply-flex align-items-center">
      <SVGIcon classes="category-icon me-2" color={color} size={16} source={icon} />
      <span>{name}</span>
    </div>
  );
};

CategoryLabel.propTypes = {
  categoryId: PropTypes.string.isRequired,
};

