import showElement from "../../../../utils/console/showElement";

export default function validator(data, config) {
  const errors = {};
  function validate(validateMethod, name, configLine) {
    let isInvalid;
    switch (validateMethod) {
      case 'isRequired':
        if (!name) {
          isInvalid = true;
        } else if (name?.value) {
          isInvalid = name?.value.trim() === '';
        } else {
          isInvalid = name?.toString().trim() === '';
        }
        break;
      case 'isEmail': {
        const eMailRegExp = /^\S+@\S+\.\S+$/g;
        isInvalid = !eMailRegExp.test(name);
        break;
      }
      case 'isCapitalSymbol': {
        const capitalRegExp = /[A-Z]+/g;
        isInvalid = !capitalRegExp.test(name);
        break;
      }
      case 'isContainsDigits': {
        const digitsRegExp = /\d+/g;
        isInvalid = !digitsRegExp.test(name);
        break;
      }
      case 'minLength': {
        isInvalid = name.length < configLine.value;
        break;
      }
      case 'isPositive': {
        isInvalid = name <= 0;
        break;
      }
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
