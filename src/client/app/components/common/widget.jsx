import React from 'react';
import PropTypes from 'prop-types';
import { clrTransWhite500 } from '../../../../constants/colors';
import { nodesPropType } from '../../../../types/propTypes';

export default function Widget({ children, name }) {
  const headerStyles = {
    borderRadius: '9px 9px 0 0',
    padding: '.20em',
    justifyContent: 'center',
    fontWeight: '600',

  };
  const styles = {
    width: "14rem",
    height: '9rem',
    minWidth: '18%',
    borderRadius: '0 0 9px 9px',
    background: clrTransWhite500,
    // margin: '',
    // padding: '.7em',
    // display: 'flex',
    // justifyContent: 'center',
  };

  return (
    <div className="widget">
      <header className='content-board_header' style={headerStyles}>{name}</header>
      <div className="content" style={styles} >
        {children}
      </div>
    </div>
  );
};

Widget.propTypes = {
  children: nodesPropType.isRequired
};
