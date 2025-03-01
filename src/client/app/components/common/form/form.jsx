import React, {
  cloneElement, useCallback, useEffect, useState, Children,
} from 'react';
import PropTypes from 'prop-types';
import forbidExtraProps from 'prop-types-exact';
import validator from '../../../utils/validation/validator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../utils/console/showElement';

const emptyObject = {};

export default function Form({
  children,
  validatorConfig = undefined,
  onSubmit = noSubmitWarning,
  defaultData = emptyObject,
  dataScheme = '',
}) {
  // Документация:
  // defaultData и dataScheme - оба представляют из себя оьбъект ключ:значение где:
  // Ключ - это название поля инпута, он должен соответствовать параметру name элемента input.
  // Значение - представляет value инпута.
  // Пример { email: "value", password: "value" }
  // defaultData и dataScheme - взаимоисключающие параметры,
  // но один из них должен присутствовать в валидироемой форме.
  // defaultData следует использовать когда нужно передать в поля формы
  // какие-то существующие данные, например в форме для редактирования { name: "existing name", pass: "existing pass"}.
  // dataScheam же это объект с ключами-полями формы, но с пустыми значениями { name: "", pass: "" }.
  // Этот параметр используется для формы где не должно быть изначальных значений.
  // Его следует задать, чтобы не триггерить валидацию на только-что открывшейся форме.
  // В случае передачи пустых полей в defaultData, форма будет отрабатывать корректно,
  // но валидатор сразу выдаст все ошибки при открытии формы.

  const [data, setData] = useState(defaultData);
  const [errors, setErrors] = useState({});
  const [formIsInvalid, setFormIsInvalid] = useState(Object.keys(errors).length !== 0);

  useEffect(() => setFormIsInvalid(Object.keys(errors).length !== 0), [errors]);

  const formIsValidating = !!validatorConfig;
  const dataExists = Object.keys(data).length > 0;

  const validate = useCallback((validatingData) => {
    const errorsObj = validator(validatingData, validatorConfig);
    setErrors(errorsObj);

    return Object.keys(errorsObj).length === 0;
  }, [validatorConfig, setData]);

  function validateData() { if (formIsValidating && dataExists) validate(data); }
  useEffect(validateData, [data]);

  const handleChange = useCallback((target) => {
    if (target.value !== undefined) {
      setData((prevState) => ({ ...prevState, [target.name]: target.value, }));
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


function noSubmitWarning() {
  console.error('You trying to submit a form, but no function handling submit event were added to this form');
}