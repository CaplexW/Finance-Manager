import React, { KeyboardEvent } from 'react';
import { arrowDownIcon } from '../../../../assets/icons';

interface ShowMoreButtonProps {
  condition: boolean;
  onClick: () => void;
}

export default function ShowMoreButton({ condition, onClick }: ShowMoreButtonProps) {

  if(!condition) return null;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") onClick();
  }

  return <div className='more-btn' onClick={onClick} onKeyDown={handleKeyDown} tabIndex={0}>{arrowDownIcon}</div>;
}




