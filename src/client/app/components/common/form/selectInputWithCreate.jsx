/* eslint-disable react/forbid-component-props */
import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import showElement from '../../../../../utils/console/showElement';
import flashInvalidInputs from '../../../../../utils/flashInvalidInputs';

export default function SelectInputWithCreate({ data, label, onCreate, name, value, onChange, error }) {
  function createOptions(arrayOfObjects) {
    return arrayOfObjects.map((obj) => {
      if (obj.label && obj.value) return obj;
      if (obj._id) return { label: obj.name, value: obj._id };
      if (obj.name) return { label: obj.name, value: obj.name.toLowerCase() };
      return { label: obj, value: obj.toLowerCase };
    });
  };
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(createOptions(data));
  useEffect(flashIfInvalid, [error]);

  function flashIfInvalid() {
    const thisInput = document.querySelector(`#${name}`);
    if (error) flashInvalidInputs(thisInput);
  }
  function handleChange(inputValue) {
    const result = {
      name: 'category',
      value: inputValue,
    };
    onChange(result);
  }
  async function handleCreate(inputValue) {
    setIsLoading(true);
    const result = await onCreate(inputValue);
    if (result) {
      setIsLoading(false);
      setOptions((prev) => [...prev, result]);
    };
  };

  return (
    <div>
      <label className="label-control" htmlFor={name}>
        {label}
      </label>
      <div id={name}>
        <CreatableSelect
          className="select from-control"
          isClearable
          isDisabled={isLoading}
          isLoading={isLoading}
          name={name}
          onChange={handleChange}
          onCreateOption={handleCreate}
          options={options}
          value={value || null}
        />
        {/* {error ? <div className='ms-2' style={{ color: 'red' }}>{error}</div> : null} */}
      </div>
    </div>
  );
};