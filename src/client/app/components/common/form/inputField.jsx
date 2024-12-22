import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { eyeOpenIcon, eyeShutIcon } from '../../../../assets/icons';

function InputField({
  value,
  onChange,
  name,
  type,
  label,
  error,
  placeholder,
  autoFocus,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  function handleChange({ target }) {
    const result = {
      name: target.name,
      value: target.value,
    };
    onChange(result);
  }
  function togglePasswordVisibility() {
    setPasswordVisible((prevState) => !prevState);
  }

  const eyeIcon = passwordVisible ? eyeOpenIcon : eyeShutIcon;
  const inputClass = `form-control mt-1 mb-1 ${error ? 'is-invalid' : ''}`;

  return (
    <div>
      <label className="label-control" htmlFor={name}>
        {label}
      </label>
      <div className="input-group has-validation">
        <input
          autoFocus={autoFocus}
          className={inputClass}
          key={name}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          type={passwordVisible ? 'text' : type}
          value={value}
        />
        {type === 'password' && (
        <button className="btn btn-outline-secondary mt-1 mb-1" onClick={togglePasswordVisibility} type="button">
          {eyeIcon}
        </button>
        )}
        {error ? <div className="invalid-feedback">{error}</div> : null}
      </div>
    </div>
  );
}

InputField.propTypes = {
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
};

InputField.defaultProps = {
  autoFocus: false,
  error: undefined,
  label: undefined,
  name: `textInput-${Date.now()}`,
  placeholder: undefined,
  type: 'text',
  value: '',
};

export default memo(InputField);
