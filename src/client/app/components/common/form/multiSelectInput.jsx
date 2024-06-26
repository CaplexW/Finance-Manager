/* eslint-disable react/forbid-component-props */
import React, { memo, useEffect, useState } from 'react';
import PropTypes, { object } from 'prop-types';
import Select from 'react-select';

function MultiSelectInput({
  options, name, onChange, label, value,
}) {
  const [normolizedOption, setNormolizedOptions] = useState();

  function normolizeOptions() {
    if (typeof options === 'string') {
      setNormolizedOptions([{ value: 'loading', label: 'Загрузка...' }]);
    }
    if (typeof (options) === 'object') {
      const array = Object.values(options).map((quality) => {
        const result = { label: quality.name, value: quality._id };
        return result;
      });
      setNormolizedOptions(array);
    }
  }
  useEffect(() => { normolizeOptions(); }, [options]);

  function handleChange(inputValue) {
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
        value={value}
      />
    </div>
  );
}
MultiSelectInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.objectOf(object).isRequired,
    PropTypes.array.isRequired,
  ]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.array,
};
MultiSelectInput.defaultProps = {
  label: undefined,
  name: `MultiSelectInput-${Date.now()}`,
  value: undefined,
};

export default memo(MultiSelectInput);
