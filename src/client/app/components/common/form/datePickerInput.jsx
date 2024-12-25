import React from 'react';

export default function DatePickerInput({ name, label, error, onChange, value }) {
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