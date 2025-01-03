import React from 'react';
import { useSelector } from 'react-redux';
import { getUserBalance } from '../../store/user';

export default function UserBalance() {
  const balance = useSelector(getUserBalance());
  if(!balance) return;

  const balanceIsPositive = balance > 0;
  const balanceStyles = {
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '8px',
    padding: '.4em 1em',
  };
  const digitsStyles = { color: balanceIsPositive ? 'green' : 'red' };

  return <div style={balanceStyles}>Ваш баланс: <span style={digitsStyles}>{balance}</span></div>;
};
