import React, { ReactNode } from 'react';

interface ContentBoardProps {
  children?: ReactNode;
  header?: ReactNode | string;
}

export default function ContentBoard({ children = '', header = 'Заголовок' }: ContentBoardProps) {

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
}




