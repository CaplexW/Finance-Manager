import React, { ReactNode } from 'react';
import { clrTransWhite500 } from '../../constants/colors';

interface WidgetProps {
  children: ReactNode;
  name?: string;
}

export default function Widget({ children, name = 'Widget name' }: WidgetProps) {
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
}




