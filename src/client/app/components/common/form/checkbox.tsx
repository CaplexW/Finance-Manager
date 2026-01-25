import React from 'react';

interface CheckboxProps {
  label?: string;
  name: string;
  value?: boolean;
  onChange?: (result: { name: string; value: boolean }) => void;
}

export default function Checkbox({
  label = undefined,
  name,
  value = false,
  onChange = undefined,
}: CheckboxProps) {
  const inputClass = `form-check-input me-3`;

  function handleChange() {
    if (onChange) {
      const result = {
        name,
        value: !value,
      };
      onChange(result);
    }
  }
  return (
    <div className="mt-3">
      <input
        checked={value}
        className={inputClass}
        id={name}
        onChange={handleChange}
        type="checkbox"
      />
      <label className="form-check-label" htmlFor={name}>{label}</label>
    </div>
  );
}




