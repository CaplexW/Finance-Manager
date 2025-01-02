/* eslint-disable no-underscore-dangle */
import React, { memo } from 'react';
import PropTypes from 'prop-types';

function SelectInput({
  options,
  name,
  value = null,
  onChange,
  error = null,
  label,
  defaultOption = 'Выберите вариант',
}) {
  const selectClass = `form-select mt-1 w-100 ${error ? 'is-invalid' : ' '}`;
  const isGuest = defaultOption === 'Бродяга';

  function normolizeOptions() {
    if (typeof (options) === 'object') {
      if (Array.isArray(options)) {
        const result = options.map((option) => ({
          name: option.name,
          value: option._id,
        }));
        return result;
      }
      const result = Object.keys(options).map((option) => ({
        name: options[option].name,
        value: options[option]._id,
      }));
      return result;
    }
    return options;
  }
  const normolizedOptions = normolizeOptions();

  function handleChange(event) {
    const defaultOptionNode = document.querySelector('#default-option');
    defaultOptionNode.disabled = true;
    onChange(event.target);
  }
  return (
    <div className="mb-2 mt-3 mx-auto w-100" id="selector-continer">
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
            value={value}
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

SelectInput.propTypes = {
  defaultOption: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.object.isRequired, PropTypes.array.isRequired,
  ]).isRequired,
  value: PropTypes.string,
};


export default memo(SelectInput);
