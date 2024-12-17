import React from 'react';
import { useSelector } from 'react-redux';
import { getCategoryById } from '../../store/categories';
import PropTypes from 'prop-types';
import showElement from '../../../../utils/console/showElement';

export default function CategoryLabel({ categoryId }) {
  const category = useSelector(getCategoryById(categoryId));
  const icon = { ...category.icon };
  const iconConfig = {
    ...icon.props,
    width: "16",
    height: "16",
    color: category.color
  };

  function createSVGFromObject(object, color = '') {
    function createSVGPath(children) {
      const childrenIsArray = Array.isArray(children);
      const childrenIsObject = typeof children === 'object';
  
      if (childrenIsArray) {
        return category.icon.props.children.map((child) => {
          // if (child.props.fill) color = { fill: category.color };
  
          return React.createElement(child.type, { ...child.props, ...color });
        });
      }
  
      if (childrenIsObject) {
        // if (children.props.fill) color = { fill: category.color };
        return React.createElement(children.type, { ...children.props, ...color });
      }
    }
    function createSVGIconForCategory(path, categoryColor, iconProps) {
      let colorIsApplied = false;
      const coloredProps = { ...iconProps, fill: categoryColor };
  
      if (Array.isArray(path)) {
        if (path[0]?.props?.fill) colorIsApplied = true;
      }
  
      if (path?.props?.fill) colorIsApplied = true;
  
      return React.createElement('svg', colorIsApplied ? iconProps : coloredProps, path);
    }
    const svgPath = createSVGPath(object.props.children);
    const icon = createSVGIconForCategory(svgPath, color, iconConfig);

    return icon;
  }

  const categoryIcon = createSVGFromObject(icon, category.color);

  return (
    <div className="category-label disply-flex align-items-center">
      <span className="category-icon me-2">{categoryIcon}</span>
      <span>{category.name}</span>
    </div>
  );
};

CategoryLabel.propTypes = {
  categoryId: PropTypes.string.isRequired,
};

