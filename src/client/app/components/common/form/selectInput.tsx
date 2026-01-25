/* eslint-disable no-underscore-dangle */
import React, { memo, ChangeEvent } from 'react';

interface Option {
  name: string;
  value: string;
}

interface SelectInputProps {
  options: Option[] | Record<string, Option> | string;
  name: string;
  value?: string | null;
  onChange: (target: { name: string; value: string }) => void;
  error?: string | null;
  label: string;
  defaultOption?: string;
}

function SelectInput({
  options,
  name,
  value = null,
  onChange,
  error = null,
  label,
  defaultOption = 'Выберите вариант',
}: SelectInputProps): JSX.Element {
  const selectClass = `form-select mt-1 w-100 ${error ? 'is-invalid' : ' '}`;
  const isGuest = defaultOption === 'Бродяга';

  function normolizeOptions(): Option[] | string {
    if (typeof options === 'object') {
      if (Array.isArray(options)) {
        const result = options.map((option: any) => ({
          name: option.name,
          value: option._id,
        }));
        return result;
      }
      const result = Object.keys(options).map((key) => ({
        name: (options as Record<string, any>)[key].name,
        value: (options as Record<string, any>)[key]._id,
      }));
      return result;
    }
    return options;
  }
  const normolizedOptions = normolizeOptions();

  function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
    const defaultOptionNode = document.querySelector<HTMLSelectElement>('#default-option');
    if (defaultOptionNode) defaultOptionNode.disabled = true;
    onChange({ name: event.target.name, value: event.target.value });
  }

  return (
    <div className="mb-2 mt-3 mx-auto w-100" id="selector-continer" style={{ background: 'black' }}>
      <label className="form-label" htmlFor="select">
        {label}
        <div className="input-group has-validation" key={`${label}SelectDiv`}>
          <select
            className={selectClass}
            disabled={isGuest}
            id={`${name}-selector`}
            key={`${name}-selector`}
            name={name}
            onChange={handleChange}
            value={value ?? 'default-option'}
          >
            <option id="default-option" key="defaultOption" value="default-option">
              {defaultOption}
            </option>
            {Array.isArray(normolizedOptions) ? (
              normolizedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))
            ) : (
              <option defaultValue="" disabled>
                Загрузка...
              </option>
            )}
          </select>
          {error ? <div className="invalid-feedback">{error}</div> : null}
        </div>
      </label>
    </div>
  );
}

export default memo(SelectInput);

