import React, { memo, useEffect, useRef, useState, ChangeEvent } from 'react';
import { eyeOpenIcon, eyeShutIcon } from '../../../../assets/icons';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../utils/console/showElement';
import flashInvalidInputs from '../../../utils/validation/flashInvalidInputs';
import flashOffInvalidInputs from '../../../utils/validation/flashOffInvalidInputs';
import { getInputDate } from '../../../utils/formatDate';

interface FieldInputProps {
  value?: string | number;
  onChange: (result: { name: string; value: string | number }) => void;
  name?: string;
  type?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  autoFocus?: boolean;
  minimumValue?: number;
}

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
}: FieldInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(setInitialDate, []);
  useEffect(handelInvalid, [error]);

  function handelInvalid() {
    if (input.current && !error) flashOffInvalidInputs(input.current);
    if (input.current && error) flashInvalidInputs(input.current);
  }
  function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
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

export default memo(FieldInput);






