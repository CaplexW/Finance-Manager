import React from 'react';
import PropTypes from 'prop-types';
import { clrTransWhite500 } from '../../../../constants/colors';
import { nodesPropType } from '../../../../types/propTypes';

export default function Widget({ children, name = 'Widget name' }) {
  const widgetStyles = {
    margin: '1rem',
  };
  const headerStyles = {
    borderRadius: '9px 9px 0 0',
    padding: '.20em',
    justifyContent: 'center',
    fontWeight: '600',

  };
  const contentStyles = {
    width: "16rem",
    height: '12rem',
    minWidth: '18%',
    padding: '1em',
    borderRadius: '0 0 9px 9px',
    background: clrTransWhite500,
  };

  return (
    <div className="widget" style={widgetStyles}>
      <header className='content-board_header' style={headerStyles}>{name}</header>
      <div className="content" style={contentStyles} >
        {children}
      </div>
    </div>
  );
};

Widget.propTypes = {
  children: nodesPropType.isRequired,
  name: PropTypes.string,
};
