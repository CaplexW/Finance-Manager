import React, { jsx } from 'react';
import { useSelector } from 'react-redux';
import { getCategoryById } from '../../store/categories';
import PropTypes from 'prop-types';
import showElement from '../../../../utils/console/showElement';
import { blueColor } from '../../../../constants/colors';

export default function CategoryLabel({ source }) {
  const category = useSelector(getCategoryById(source));
  showElement(category.icon, 'category.icon');
  function createIconChildren(children) {
    if (Array.isArray(children)) {
      return category.icon.props.children.map((child) => React.createElement(child.type, child.props));
    }
    if (typeof children === 'object') return React.createElement(children.type, children.props);
  }

  const iconChildren = createIconChildren(category.icon.props.children);
  const icon = React.createElement(category.icon.type, { ...category.icon.props, width: "16", height: "16" }, iconChildren);

  return (
    <div className="category-label disply-flex align-items-center">
      <span className="category-icon me-2">{icon}</span>
      <span>{category.name}</span>
    </div>
  );
};
CategoryLabel.propTypes = {
  source: PropTypes.string.isRequired,
};
