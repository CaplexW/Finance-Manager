/* eslint-disable react/forbid-component-props */
import React, { memo, useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectInputProps {
  options: Record<string, { name: string; _id: string }> | string | MultiSelectOption[];
  name: string;
  onChange: (result: { name: string; value: MultiValue<MultiSelectOption> }) => void;
  label?: string | null;
  value?: MultiValue<MultiSelectOption> | null;
}

function MultiSelectInput({
  options, name, onChange, label = null, value = null,
}: MultiSelectInputProps): JSX.Element {
  const [normolizedOption, setNormolizedOption] = useState<MultiSelectOption[]>();

  function normolizeOptions(): void {
    if (typeof options === 'string') {
      setNormolizedOption([{ value: 'loading', label: 'Загрузка...' }]);
    }
    if (typeof options === 'object') {
      const array = Object.values(options as Record<string, { name: string; _id: string }>).map((quality) => {
        const result = { label: quality.name, value: quality._id };
        return result;
      });
      setNormolizedOption(array);
    }
  }
  useEffect(() => { normolizeOptions(); }, [options]);

  function handleChange(inputValue: MultiValue<MultiSelectOption>): void {
    const result = {
      name: 'qualities',
      value: inputValue,
    };
    onChange(result);
  }

  return (
    <div id="qualities-selector">
      <label className="label-control" htmlFor={name}>
        {label}
      </label>
      <Select
        className="basic-multi-select"
        classNamePrefix="select"
        closeMenuOnSelect={false}
        isMulti
        name={name}
        onChange={handleChange}
        options={normolizedOption}
        value={value ?? []}
      />
    </div>
  );
}

export default memo(MultiSelectInput);

