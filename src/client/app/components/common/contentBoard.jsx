import React from 'react';
import showElement from '../../../../utils/console/showElement';

export default function ContentBoard({ children, header }) {

  showElement(children, 'children');
  const contentStyles = {
    justifyContent: 'space-around',
  };
  return (
    <main className='content-board_layout'>
      <div className="content-board_container">
        <section className='content-board_header'>
          {header}
        </section>
        <section className='content-board_body' style={contentStyles}>
          {children}
        </section>
      </div>
    </main>
  );
};