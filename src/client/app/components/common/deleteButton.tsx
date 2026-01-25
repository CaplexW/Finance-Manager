import React from 'react';
import { trashIcon } from '../../../assets/icons';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../server/utils/console/showElement';

interface DeleteButtonProps {
  onDelete: () => void;
}

export default function DeleteButton({ onDelete }: DeleteButtonProps) {
  return <button className='icon-button' onClick={onDelete} type='button'>{trashIcon}</button>;
}




