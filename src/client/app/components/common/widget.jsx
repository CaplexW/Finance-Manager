import React from 'react';
import PropTypes from 'prop-types';
import { clrTransWhite500 } from '../../../../constants/colors';
import { nodesPropType } from '../../../../types/propTypes';

export default function Widget({ children }) {
  const styles = {
    width: "14rem",
    height: '9rem',
    minWidth: '18%',
    borderRadius: '0 0 9px 9px',
    background: clrTransWhite500,
    margin: '',
    padding: '.7em',
    display: 'flex',
    justifyContent: 'center',
  };

  return (
    <div className="wiget" style={styles} >
      {children}
    </div>
  );
};

Widget.propTypes = {
  children: PropTypes.shape(nodesPropType).isRequired
};