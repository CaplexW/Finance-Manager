import React, { memo } from 'react';
import PropTypes from 'prop-types';

function RadioInput({
  options, value = 'male', label, name, onChange,
}) {
  function handleChange({ target }) {
    const result = {
      name: target.name,
      value: target.value,
    };
    onChange(result);
  }
  return (
    <div className="mb-2 mt-3">
      <label className="form-label me-4" htmlFor="professionSelect">
        {label}
      </label>
      <div>
        {options.map((option) => (
          <div className="form-check form-check-inline" key={`${option.name}_${option.value}`}>
            <input
              checked={option.value === value}
              className="form-check-input"
              id={`${option.name}_${option.value}`}
              name={name}
              onChange={handleChange}
              type="radio"
              value={option.value}
            />
            <label
              className="form-check-label"
              htmlFor={`${option.name}_${option.value}`}
            >
              {option.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
RadioInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  value: PropTypes.string,
};

export default memo(RadioInput);
