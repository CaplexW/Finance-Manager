/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-component-props */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
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
  const options = createOptions(data);
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
    // setIsLoading(true);
    const result = await onCreate(inputValue);
    // if (result) {
    //   setIsLoading(false);
    //   setOptions((prev) => [...prev, result]);
    // };
  };

  return (
    <div>
      <label className="label-control" htmlFor={name}>
        {label}
      </label>
      <div id={name}>
        <CreatableSelect
          aria-invalid={Boolean(error)}
          className="select from-control"
          isClearable
          isDisabled={isLoading}
          isLoading={isLoading}
          name={name}
          onChange={handleChange}
          onCreateOption={handleCreate}
          options={options}
          required
          value={value || null}
        />
      </div>
    </div>
  );
};
SelectInputWithCreate.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  error: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onCreate: PropTypes.func,
  value: PropTypes.string.isRequired,
};