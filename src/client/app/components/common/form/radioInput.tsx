import React, { memo, ChangeEvent } from 'react';

interface RadioOption {
  name: string;
  value: string;
}

interface RadioInputProps {
  options: RadioOption[];
  value?: string;
  label: string;
  name: string;
  onChange: (result: { name: string; value: string }) => void;
}

function RadioInput({
  options, value = 'male', label, name, onChange,
}: RadioInputProps): JSX.Element {
  function handleChange({ target }: ChangeEvent<HTMLInputElement>): void {
    const result = {
      name: target.name,
      value: target.value,
    };
    onChange(result);
  }
  return (
    <div className="mb-2 mt-3">
      <label className="form-label me-4" htmlFor="professionSelect">
        {label}
      </label>
      <div>
        {options.map((option) => (
          <div className="form-check form-check-inline" key={`${option.name}_${option.value}`}>
            <input
              checked={option.value === value}
              className="form-check-input"
              id={`${option.name}_${option.value}`}
              name={name}
              onChange={handleChange}
              type="radio"
              value={option.value}
            />
            <label
              className="form-check-label"
              htmlFor={`${option.name}_${option.value}`}
            >
              {option.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(RadioInput);

