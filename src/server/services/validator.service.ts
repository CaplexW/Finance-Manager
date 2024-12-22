import { Request } from "express";
import { Result, ValidationChain, ValidationError, check, validationResult } from "express-validator";

const validatorService = {
  getResult: (request: Request): Result<ValidationError> => {
    return validationResult(request);
  },
  validateEmail: ():ValidationChain => {
    return check('email', 'Некорректный email').isEmail();
  },
  validatePassword: ():ValidationChain => {
    return check('password', 'Минимальная длина пароля 8 символов').isLength({ min: 8 });
  },
  getValidation: (name:string, message:string):ValidationChain => {
    return check(name, message);
  },
};

export default validatorService;