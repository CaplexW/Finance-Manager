import React from 'react';
import { useSelector } from 'react-redux';
import { getCategoryById } from '../../store/categories';
import PropTypes from 'prop-types';
import SVGIcon from '../common/svgIcon';
import showElement from '../../../../utils/console/showElement';

export default function CategoryLabel({ categoryId }) {
  const category = useSelector(getCategoryById(categoryId));
  const { icon, name, color } = category;

  return (
    <div className="category-label disply-flex align-items-center">
      <SVGIcon classes="category-icon me-2" color={color} size='16' source={icon} />
      <span>{name}</span>
    </div>
  );
};

CategoryLabel.propTypes = {
  categoryId: PropTypes.string.isRequired,
};

