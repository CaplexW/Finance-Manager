import React from 'react';
import { useSelector } from 'react-redux';
import { getCategoryById } from '../../store/categories';
import PropTypes from 'prop-types';
import showElement from '../../../../utils/console/showElement';

export default function CategoryLabel({ source }) {
  const category = useSelector(getCategoryById(source));
  showElement(category, 'category');
  return (
    <div className="category-label disply-flex align-items-center">
      {/* <div className="category-icon"></div> */}
      <span>{category.name}</span>
    </div>
  );
};
CategoryLabel.propTypes = {
  source: PropTypes.string.isRequired,
};
