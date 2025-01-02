import React from 'react';
import PropTypes from 'prop-types';

export default function DatePickerInput({ name, label, onChange, value = undefined, }) {
  function handleChange({ target }) {
    const result = {
      name: target.name,
      value: target.value,
    };
    onChange(result);
  }
  return (
    <div>
      <label className="label-control" htmlFor={name}>
        {label}
      </label>
      <input
        checked={value}
        className="form-control"
        id={name}
        onChange={handleChange}
        type="date"
      />
    </div>
  );
};

DatePickerInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};