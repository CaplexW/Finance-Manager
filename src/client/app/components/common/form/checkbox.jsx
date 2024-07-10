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
        checked={value}
        className={inputClass}
        id={name}
        onChange={handleChange}
        type="checkbox"
      />
      <label className="form-check-label" htmlFor={name}>{children}</label>
    </div>
  );
}
Checkbox.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  error: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.bool,
};
Checkbox.defaultProps = {
  children: undefined,
  error: undefined,
  onChange: undefined,
  value: false,
};
