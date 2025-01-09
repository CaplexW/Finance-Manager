import React from 'react';
import { clrTransWhite500 } from '../../../../constants/colors';

export default function DummyWidget() {
  const styles = {
    width: "235.2px",
    height: '121.6px',
    padding: '4.5rem',
    borderRadius: '0 0 9px 9px',
    background: clrTransWhite500,
    // margin: '1rem',
  };
  const stylesHeader = {
    borderRadius: '9px 9px 0 0',
    padding: '1em',
    textAlign: 'center',
    justifyContent: 'center',
  };

  return (
    <div className='widget'>
      <header className='content-board_header' style={stylesHeader}><h6>Widget name</h6></header>
      <div className="content" style={styles} />
    </div>
  );
};