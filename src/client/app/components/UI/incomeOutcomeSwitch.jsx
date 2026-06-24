import React from 'react';
import PropTypes from 'prop-types';

export default function IncomeOutcomeSwitch({ value, onChange }) {
  const switchOptions = [
    { id: 'both', label: 'Оба' },
    { id: 'income', label: 'Доход' },
    { id: 'outcome', label: 'Расход' },
  ];

  const handleClick = (optionId) => {
    onChange(optionId);
  };

  return (
    <div className="income-outcome-switch">
      {switchOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`income-outcome-switch__tab ${value === option.id ? 'active' : ''}`}
          onClick={() => handleClick(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

IncomeOutcomeSwitch.propTypes = {
  value: PropTypes.oneOf(['both', 'income', 'outcome']).isRequired,
  onChange: PropTypes.func.isRequired,
};
