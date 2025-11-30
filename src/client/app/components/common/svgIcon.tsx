import React, { ReactElement } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../server/utils/console/showElement';
import { Icon } from '../../../types/types';

interface SVGIconProps {
  source: Icon;
  size?: number;
  color?: string;
}

export default function SVGIcon({
  source,
  size = 1,
  color = 'currentColor'
}: SVGIconProps) {
  const iconObject = source?.src;

  if (!iconObject) return <img alt="" src="" />;

  const iconConfig = {
    ...iconObject.props,
    className: 'icon-in-list',
    width: `${size}em`,
    height: `${size}em`,
    color: color || '#fff',
  };

  function createSVGFromObject(object: ReactElement, color = '') {
    function createSVGChildren(childrenObject: any): ReactElement[] | ReactElement | null {
      const childrenIsArray = Array.isArray(childrenObject);
      const childrenIsObject = typeof childrenObject === 'object';

      if (childrenIsArray) {
        return childrenObject.map((child: ReactElement) => {
          return React.createElement(child.type, { ...child.props, color, key: child.props.d });
        });
      }

      const hasChildren = childrenObject?.props?.children;

      if (childrenIsObject) {
        return React.createElement(
          childrenObject.type,
          { ...childrenObject.props, color },
          hasChildren ? createSVGChildren(childrenObject.props.children) : '',
        );
      }
      return null;
    }

    function createSVGIcon(children: any, color: string, iconProps: any) {
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

  return <>{icon}</>;
}






