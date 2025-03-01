import React from 'react';
import PropTypes from 'prop-types';
import { nodesPropType } from '../../../types/propTypes';

export default function ContentBoard({ children = '', header = 'Заголовок' }) {

  return (
    <main className='content-board_layout'>
      <div className="content-board_container">
        <section className='content-board_header'>
          {header}
        </section>
        <section className='content-board_body'>
          {children}
        </section>
      </div>
    </main>
  );
};

ContentBoard.propTypes = {
  children: nodesPropType,
  header: PropTypes.oneOfType([PropTypes.string, nodesPropType]),
};
