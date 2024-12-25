import React from 'react';
import PropTypes from 'prop-types';

export default function Checkbox({
  label, name, value, onChange, error,
}) {
  const inputClass = `form-check-input me-3`;

  function handleChange() {
    const result = {
      name,
      value: !value,
    };
    onChange(result);
  }
  return (
    <div className="mt-3">
      <input
        checked={value}
        className={inputClass}
        id={name}
        onChange={handleChange}
        type="checkbox"
      />
      <label className="form-check-label" htmlFor={name}>{label}</label>
    </div>
  );
}
Checkbox.propTypes = {
  error: PropTypes.string,
  // children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.bool,
};
Checkbox.defaultProps = {
  error: undefined,
  label: undefined,
  onChange: undefined,
  value: false,
};
