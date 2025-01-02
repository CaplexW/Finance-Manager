import React, { memo } from 'react';
import PropTypes from 'prop-types';

function TextAreaInput({
  value = null,
  onChange,
  name = `textInput-${Date.now()}`,
  label = null,
  error = null,
  placeholder = null,
  rows = 2,
  autoFocus = false,
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
      <label className="label-control" htmlFor={name}>
        {label}
      </label>
      <div className="input-group has-validation">
        <textarea
          autoFocus={autoFocus}
          className={inputClass}
          key={name}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          value={value}
        />
        {error ? <div className="invalid-feedback">{error}</div> : null}
      </div>
    </div>
  );
}

TextAreaInput.propTypes = {
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  value: PropTypes.string,
};

export default memo(TextAreaInput);
