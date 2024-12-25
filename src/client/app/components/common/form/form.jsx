import React, {
  cloneElement, useCallback, useEffect, useState, Children,
} from 'react';
import PropTypes from 'prop-types';
import forbidExtraProps from 'prop-types-exact';
import validator from '../../../../../utils/validator';

export default function Form({
  children, validatorConfig, onSubmit, defaultData, dataScheme,
}) {
  const [data, setData] = useState(defaultData);
  const [errors, setErrors] = useState({});

  const formIsValidating = !!validatorConfig;
  const dataExists = Object.keys(data).length > 0;
  const formIsInvalid = Object.keys(errors).length !== 0;

  const validate = useCallback((validatingData) => {
    const errorsObj = validator(validatingData, validatorConfig);
    setErrors(errorsObj);
    return Object.keys(errorsObj).length === 0;
  }, [validatorConfig, setData]);

  if (formIsValidating) {
    useEffect(() => { if (dataExists) validate(data); }, [data]);
  }

  const handleChange = useCallback((target) => {
    if (target.value !== undefined) {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    }
  }, []);
  function handleSubmit(event) {
    event.preventDefault();
    if (formIsValidating) {
      const finalData = { ...dataScheme, ...data };
      const formIsValid = validate(finalData);
      if (formIsValid) {
        onSubmit(finalData);
        setData(defaultData);
      }
    }
  }
  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      const { form } = event.target; // В форме есть input'ы с type="hidden" от мультиселекта.
      // Они ломают итерацию по форме, поэтому ниже убираю их и работаю с массивом нодов.
      const visibleForm = Object.values(form).filter((element) => element.type !== 'hidden');
      const indexInput = visibleForm.indexOf(event.target);
      const nextInput = visibleForm[indexInput + 1];
      const currentElement = visibleForm[indexInput];
      if (currentElement.tagName !== 'BUTTON') {
        event.preventDefault();
        nextInput.focus();
      }
    }
  }

  const clonedChildren = Children.map(children, (child) => {
    const childType = typeof child.type;
    let props = {};

    if (childType === 'string') {
      if (child.type === 'button') {
        if (child.props.type === 'submit' || child.props.type === undefined) {
          props = { ...child.props, disabled: formIsInvalid };
        }
      }
    }
    if (childType === 'object' || childType === 'function') {
      if (!child.props.name) {
        throw new Error(`name property is required for component ${child.props.label}`);
      }
      props = {
        ...child.props,
        onChange: handleChange,
        value: data[child.props.name],
        error: errors[child.props.name],
      };
    }
    return cloneElement(child, props);
  });

  return <form className="form" onKeyDown={handleKeyDown} onSubmit={handleSubmit}>{clonedChildren}</form>;
}

Form.propTypes = forbidExtraProps({
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  dataScheme: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  defaultData: PropTypes.object,
  onSubmit: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  validatorConfig: PropTypes.object,
});
Form.defaultProps = {
  dataScheme: {},
  defaultData: {},
  onSubmit: () => console.error('You trying to submit a form, but no function handling submit event were added to this form'),
  validatorConfig: undefined,
};
