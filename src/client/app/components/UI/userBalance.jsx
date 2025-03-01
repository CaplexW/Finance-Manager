import React from 'react';
import { useSelector } from 'react-redux';
import { getUserBalance } from '../../store/user';
import showElement from '../../../../server/utils/console/showElement';
import { isNumber } from 'lodash';

export default function UserBalance() {
  const balance = useSelector(getUserBalance());
  if(typeof balance !== 'number' && !balance) return;

  const balanceIsPositive = balance > 0;
  const balanceStyles = {
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '8px',
    padding: '.4em 1em',

    display: 'flex',
    alignItems: 'center',
  };
  const digitsStyles = { marginInlineStart: '.5rem', color: balanceIsPositive ? 'green' : 'red' };

  return <div style={balanceStyles}>Ваш баланс:<span style={digitsStyles}>{balance}</span></div>;
};
