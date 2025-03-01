import React from 'react';
import PropTypes from 'prop-types';
import { clrTransWhite500 } from '../../constants/colors';
import { nodesPropType } from '../../../types/propTypes';

export default function Widget({ children, name = 'Widget name' }) {
  const widgetStyles = {
  };
  const headerStyles = {
  };
  const contentStyles = {
    aspectRatio: '4/3',
    padding: '1em',
    borderRadius: '0 0 9px 9px',
    background: clrTransWhite500,
  };

  return (
    <div className="widget">
      <header className='widget-header'>{name}</header>
      <div className="widget-content">
        {children}
      </div>
    </div>
  );
};

Widget.propTypes = {
  children: nodesPropType.isRequired,
  name: PropTypes.string,
};
