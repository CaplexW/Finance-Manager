import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { eyeOpenIcon, eyeShutIcon } from '../../../../assets/icons';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../../utils/console/showElement';
import flashInvalidInputs from '../../../../../utils/flashInvalidInputs';
import flashOffInvalidInputs from '../../../../../utils/flashOffInvalidInputs';

function FieldInput({
  value = undefined,
  onChange,
  name = `textInput-${Date.now()}`,
  type = 'text',
  label = undefined,
  error = undefined,
  placeholder = undefined,
  autoFocus = false,
  minimumValue = undefined,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const input = useRef();

  useEffect(handelInvalid, [error]);

  function handelInvalid() {
    if (input.current && !error) flashOffInvalidInputs(input.current);
    if (input.current && error) flashInvalidInputs(input.current);
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
  const inputClass = `form-control mt-1 mb-1 ${type === 'color' ? 'w-25' : ''}`;
  const parentClass = `${type === 'color' ? '' : 'input-group'} ${error ? 'has-validation' : ''}`;

  return (
    <div>
      <label className="label-control" htmlFor={name}>
        {label}
      </label>
      <div className={parentClass}>
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

export default memo(FieldInput);
