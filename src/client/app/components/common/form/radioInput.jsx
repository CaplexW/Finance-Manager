import React, { memo } from 'react';
import PropTypes from 'prop-types';

function RadioInput({
  options, value, label, name, onChange,
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
      <label htmlFor="professionSelect" className="form-label me-4">
        {label}
      </label>
      <div>
        {options.map((option) => (
          <div className="form-check form-check-inline" key={`${option.name}_${option.value}`}>
            <input
              className="form-check-input"
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              id={`${option.name}_${option.value}`}
              onChange={handleChange}
            />
            <label
              htmlFor={`${option.name}_${option.value}`}
              className="form-check-label"
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
  options: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
RadioInput.defaultProps = {
  value: 'male',
};

export default memo(RadioInput);
