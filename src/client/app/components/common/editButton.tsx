import React from 'react';
import { penpaperIcon } from '../../../assets/icons';

interface EditButtonProps {
  onClick: () => void;
}

export default function EditButton({ onClick }: EditButtonProps) {
  return <button aria-roledescription='Редактировать' className='icon-button' onClick={onClick} type='button'>{penpaperIcon}</button>;
}






