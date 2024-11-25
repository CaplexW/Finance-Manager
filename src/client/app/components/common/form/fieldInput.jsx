import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { eyeOpenIcon, eyeShutIcon } from '../../../../assets/icons';
import flashInvalidInputs from '../../../../../utils/flashInvalidInputs';
import showElement from '../../../../../utils/console/showElement';

function FieldInput({
  value,
  onChange,
  name,
  type,
  label,
  error,
  placeholder,
  autoFocus,
  minimumValue
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const input = useRef();
  useEffect(flashIfInvalid, [error]);
  showElement(error, 'error');

  function flashIfInvalid() {
    // const thisInput = document.querySelector(`#${name}`);
    if (error) flashInvalidInputs(input.current);
  }
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
  const inputClass = `form-control mt-1 mb-1`;

  return (
    <div>
      <label className="label-control" htmlFor={name}>
        {label}
      </label>
      <div className="input-group has-validation">
        <input
          autoFocus={autoFocus}
          className={inputClass}
          id={name}
          key={name}
          min={minimumValue}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          ref={input}
          type={passwordVisible ? 'text' : type}
          value={value}
        />
        {type === 'password' && (
          <button className="btn btn-outline-secondary mt-1 mb-1" onClick={togglePasswordVisibility} style={{ "border": "none" }} type="button">
            {eyeIcon}
          </button>
        )}
        {error ? <div className="invalid-feedback">{error}</div> : null}
      </div>
    </div>
  );
}

FieldInput.propTypes = {
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.string,
  minimumValue: PropTypes.number,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
};

FieldInput.defaultProps = {
  autoFocus: false,
  error: undefined,
  label: undefined,
  minimumValue: undefined,
  name: `textInput-${Date.now()}`,
  placeholder: undefined,
  type: 'text',
  value: '',
};

export default memo(FieldInput);
