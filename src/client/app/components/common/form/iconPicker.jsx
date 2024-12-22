import React from 'react';

export default function IconPicker({ options, label }) {
  // 1. Получаем options = { _id, name, src }[]
  // 2. Маппим source -> возвращаем компонент иконки
  // 3. Слушаем клик по иконке
  // 4. По клику возвращаем _id
  return (
    <div className='container'>
      <label htmlFor="icon-picker">{label}</label>
      <input id="icon-picker" type="select" />
    </div>
  );
};
