import React from 'react';
import { clrTransWhite500 } from '../../../../constants/colors';

export default function Widget() {
  const styles = {
    width: "9rem",
    height: '9rem',
    minWidth: '18%',
    borderRadius: '9px',
    background: clrTransWhite500,
    margin: '1rem',
  };

  return <div className="wiget" style={styles} />;
};