import React from 'react';
import PropTypes from 'prop-types';

export default function Checkbox({
  children, name, value, onChange, error,
}) {
  const inputClass = `form-check-input + ${error ? 'is-invalid' : ''}`;

  function handleChange() {
    const result = {
      name,
      value: !value,
    };
    onChange(result);
  }
  return (
    <div className="form-check">
      <input
        type="checkbox"
        checked={value}
        className={inputClass}
        id={name}
        onChange={handleChange}
      />
      <label htmlFor={name} className="form-check-label">{children}</label>
    </div>
  );
}
Checkbox.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  error: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.bool,
  onChange: PropTypes.func,
};
Checkbox.defaultProps = {
  onChange: undefined,
  value: false,
  children: undefined,
  error: undefined,
};
