import React, { memo, ChangeEvent } from 'react';

interface TextAreaInputProps {
  value?: string | null;
  onChange: (result: { name: string; value: string }) => void;
  name?: string;
  label?: string | null;
  error?: string | null;
  placeholder?: string | null;
  rows?: number;
  autoFocus?: boolean;
}

function TextAreaInput({
  value = '',
  onChange,
  name = `textInput-${Date.now()}`,
  label = null,
  error = null,
  placeholder = null,
  rows = 2,
  autoFocus = false,
}: TextAreaInputProps): JSX.Element {
  function handleChange({ target }: ChangeEvent<HTMLTextAreaElement>): void {
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
          placeholder={placeholder ?? undefined}
          rows={rows}
          value={value ?? ''}
        />
        {error ? <div className="invalid-feedback">{error}</div> : null}
      </div>
    </div>
  );
}

export default memo(TextAreaInput);

