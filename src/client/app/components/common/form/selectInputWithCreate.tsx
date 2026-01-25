/* eslint-disable react/forbid-component-props */
import React, { useEffect, useRef } from 'react';
import CreatableSelect, { SingleValue } from 'react-select/creatable';
import flashInvalidInputs from '../../../utils/validation/flashInvalidInputs';
import flashOffInvalidInputs from '../../../utils/validation/flashOffInvalidInputs';

interface SelectValue {
  label: string;
  value: string;
}

interface SelectInputWithCreateProps {
  data: Array<SelectValue | { _id?: string; name?: string } | string>;
  label?: string | null;
  onCreate?: (value: string) => Promise<void> | void;
  name: string;
  value?: SelectValue | null;
  onChange?: (result: { name: string; value: SelectValue | null }) => void;
  error?: string | null;
}

export default function SelectInputWithCreate({
  data,
  label = null,
  onCreate = noCreateWarning,
  name,
  value = null,
  onChange = () => {},
  error = null,
}: SelectInputWithCreateProps): JSX.Element {
  // Документация:
  // В value следует передавать объект формата
  // { label: [отображаемое название], value: [передоваемое значение] }

  function createOptions(arrayOfObjects: SelectInputWithCreateProps['data']): SelectValue[] {
    return arrayOfObjects.map((obj) => {
      if (typeof obj === 'string') {
        return { label: obj, value: obj.toLowerCase() };
      }
      if ('label' in obj && 'value' in obj && obj.label && obj.value) return obj as SelectValue;
      if ('_id' in obj && obj._id) return { label: obj.name ?? String(obj._id), value: obj._id };
      if ('name' in obj && obj.name) return { label: obj.name, value: obj.name.toLowerCase() };
      return { label: String(obj), value: String(obj).toLowerCase() };
    });
  }
  const thisInput = useRef<HTMLDivElement | null>(null);

  const options = createOptions(data);

  useEffect(handleInvalid, [error]);

  function handleInvalid(): void {
    if (thisInput.current && !error) flashOffInvalidInputs(thisInput.current);
    if (thisInput.current && error) flashInvalidInputs(thisInput.current);
  }

  function handleChange(inputValue: SingleValue<SelectValue>): void {
    const result = {
      name,
      value: inputValue ?? null,
    };
    onChange(result);
  }
  async function handleCreate(inputValue: string): Promise<void> {
    await onCreate(inputValue);
  }

  return (
    <div>
      <label className="label-control" htmlFor={name}>
        {label}
      </label>
      <div id={name} ref={thisInput}>
        <CreatableSelect
          aria-invalid={Boolean(error)}
          className="select from-control"
          isClearable
          name={name}
          onChange={handleChange}
          onCreateOption={handleCreate}
          options={options}
          placeholder="Выберите категорию"
          value={value ?? null}
        />
      </div>
    </div>
  );
}

function noCreateWarning(): void {
  // eslint-disable-next-line no-console
  console.error('no onCreate function was given to this input');
}

