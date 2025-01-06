import React from 'react';
import PropTypes from 'prop-types';
import showElement from '../../../../utils/console/showElement';
import { useSelector } from 'react-redux';
import { getIconById } from '../../store/icons';
import { iconPropType } from '../../../../types/propTypes';

export default function SVGIcon({
  source,
  classes = '',
  size = 24,
  color = 'currentColor'
}) {
  const iconObject = source?.src;

  if (!iconObject) return <img alt="" src="" />;

  const iconConfig = {
    ...iconObject.props,
    width: size,
    height: size,
    color: color || '#fff',
  };

  function createSVGFromObject(object, color = '') {
    function createSVGChildren(childrenObject) {
      const childrenIsArray = Array.isArray(childrenObject);
      const childrenIsObject = typeof childrenObject === 'object';

      if (childrenIsArray) {
        return childrenObject.map((child) => {
          return React.createElement(child.type, { ...child.props, color, key: child.props.d });
        });
      }

      const hasChildren = childrenObject.props.children;

      if (childrenIsObject) {
        return React.createElement(
          childrenObject.type,
          { ...childrenObject.props, color },
          hasChildren ? createSVGChildren(childrenObject.props.children) : '',
        );
      }
    }

    function createSVGIcon(children, color, iconProps) {
      let colorIsApplied = false;
      const coloredProps = { ...iconProps, fill: color };

      if (Array.isArray(children)) {
        if (children[0]?.props?.fill) colorIsApplied = true;
      }

      if (children?.props?.fill) colorIsApplied = true;

      return React.createElement('svg', colorIsApplied ? iconProps : coloredProps, children);
    }

    const children = createSVGChildren(object.props.children);
    const icon = createSVGIcon(children, color, iconConfig);

    return icon;
  }

  const icon = createSVGFromObject(iconObject, color);

  return <span className={classes}>{icon}</span>;
};

SVGIcon.propTypes = {
  classes: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
  source: PropTypes.shape(iconPropType).isRequired,
};
