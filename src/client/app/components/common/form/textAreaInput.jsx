/* eslint-disable jsx-a11y/no-autofocus */
import React, { memo } from 'react';
import PropTypes from 'prop-types';

function TextAreaInput({
  value,
  onChange,
  name,
  label,
  error,
  placeholder,
  rows,
  autoFocus,
}) {
  function handleChange({ target }) {
    const result = {
      name: target.name,
      value: target.value,
    };
    onChange(result);
  }

  const inputClass = `form-control mt-1 mb-1 ${error ? 'is-invalid' : ''}`;

  return (
    <div>
      <label htmlFor={name} className="label-control">
        {label}
      </label>
      <div className="input-group has-validation">
        <textarea
          key={name}
          name={name}
          value={value}
          onChange={handleChange}
          className={inputClass}
          placeholder={placeholder}
          rows={rows}
          autoFocus={autoFocus}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
}

TextAreaInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  rows: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
};

TextAreaInput.defaultProps = {
  label: undefined,
  name: `textInput-${Date.now()}`,
  value: '',
  error: undefined,
  rows: 2,
  placeholder: undefined,
  autoFocus: false,
};

export default memo(TextAreaInput);
