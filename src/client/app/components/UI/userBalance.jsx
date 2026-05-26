import React from 'react';
import { useSelector } from 'react-redux';
import { getUserBalance } from '../../store/user';
import showElement from '../../../../server/utils/console/showElement';
import { isNumber } from 'lodash';

export default function UserBalance() {
  const balance = useSelector(getUserBalance());
  if (typeof balance !== 'number' && !balance) return;

  const currency = '₽';
  const balanceIsPositive = balance > 0;
  const digitsColor = balanceIsPositive ? 'green' : 'red';

  return <div className='user-balance-plate'>
    <span className='desktop-only'>Ваш баланс:&nbsp;</span>
    <span className={`colored-text--${digitsColor}`}>{balance} {currency}</span>
  </div>;
};
