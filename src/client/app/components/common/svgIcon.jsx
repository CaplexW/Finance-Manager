import React from 'react';
import showElement from '../../../../utils/console/showElement';

export default function SVGIcon({ source, classes, size = 24, color }) {
  const iconConfig = {
    ...source.props,
    width: size,
    height: size,
    color: color ? color : '#fff',
  };

  function createSVGFromObject(object, color = '') {
    showElement(object, 'object');
    function createSVGChildren(childrenObject) {
      const childrenIsArray = Array.isArray(childrenObject);
      const childrenIsObject = typeof childrenObject === 'object';

      if (childrenIsArray) {
        return childrenObject.map((child) => {
          return React.createElement(child.type, { ...child.props, ...color });
        });
      }

      const hasChildren = childrenObject.props.children;

      if (childrenIsObject) {
        return React.createElement(
          childrenObject.type,
          { ...childrenObject.props, ...color },
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

  const icon = createSVGFromObject(source, color);

  return <span className={classes}>{icon}</span>;
};
