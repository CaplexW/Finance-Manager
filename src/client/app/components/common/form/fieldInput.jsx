import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { eyeOpenIcon, eyeShutIcon } from '../../../../assets/icons';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../../utils/console/showElement';
import flashInvalidInputs from '../../../../../utils/flashInvalidInputs';
import flashOffInvalidInputs from '../../../../../utils/flashOffInvalidInputs';
import { getInputDate } from '../../../../../utils/formatDate';

function FieldInput({
  value = '',
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

  useEffect(setInitialDate, []);
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
  function setInitialDate() {
    if (type === 'date' && !value) {
      const initialDate = { value: getInputDate(), name };
      onChange(initialDate);
    }
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
          step={minimumValue || 1}
          type={passwordVisible ? 'text' : type}
          value={value}
        />
        {type === 'password' && (
          <button className="btn btn-outline-secondary mt-1 mb-1" onClick={togglePasswordVisibility} style={{ "border": "none", background: 'white' }} type="button">
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default memo(FieldInput);
