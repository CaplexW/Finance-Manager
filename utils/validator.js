/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
export default function validator(data, config) {
  const errors = {};
  function validate(validateMethod, name, configLine) {
    let isInvalid;
    switch (validateMethod) {
      case 'isRequired':
        isInvalid = name.trim() === '';
        break;
      case 'isEmail': {
        const eMailRegExp = /^\S+@\S+\.\S+$/g;
        isInvalid = !eMailRegExp.test(name);
        break; }
      case 'isCapitalSymbol': {
        const capitalRegExp = /[A-Z]+/g;
        isInvalid = !capitalRegExp.test(name);
        break; }
      case 'isContainsDigits': {
        const digitsRegExp = /\d+/g;
        isInvalid = !digitsRegExp.test(name);
        break; }
      case 'minLength': {
        isInvalid = name.length < configLine.value;
        break; }
      default:
        break;
    }
    if (isInvalid) return configLine.message;
  }
  for (const fieldName in data) {
    for (const validateMethod in config[fieldName]) {
      const error = validate(validateMethod, data[fieldName], config[fieldName][validateMethod]);
      if (error && !errors[fieldName]) errors[fieldName] = error;
    }
  }
  return errors;
}
