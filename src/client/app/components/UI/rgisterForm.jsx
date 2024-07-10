import React from 'react';
import { useDispatch } from 'react-redux';
import Checkbox from '../common/form/checkbox';
import Form, { FieldInput } from '../common/form';
import { signUp } from '../../store/user';

export default function RegisterForm() {
  const defaultData = {
    email: '', name: '', password: '', profession: '', sex: 'male', qualities: [], licence: false,
  };
  const validatorConfig = {
    email: {
      isRequired: {
        message: 'Введите e-mail',
      },
      isEmail: {
        message: 'Не корректный e-mail',
      },
    },
    name: {
      isRequired: {
        message: 'Введите ваше имя',
      },
      minLength: {
        message: 'Имя не может быть меньше 2-х символов',
        value: 2,
      },
    },
    password: {
      isRequired: {
        message: 'Введите пароль',
      },
      isCapitalSymbol: {
        message: 'В пароле должна быть хотя бы 1 заглавная буква',
      },
      isContainsDigits: {
        message: 'В пароле должна быть хотя бы 1 цифра',
      },
      minLength: {
        message: 'В пароле должно быть минимум 8 символов',
        value: 8,
      },
    },
    licence: {
      isAccepted: {
        message: 'Необходимо принять соглошение',
      },
    },
  };
  const dispatch = useDispatch();

  async function handleSubmit(data) {
    const newUser = {
      email: data.email,
      name: data.name,
      password: data.password,
    };

    dispatch(signUp(newUser));
  }
  return (
    <div>
      <h2>Регистрация</h2>
      <Form dataScheme={defaultData} onSubmit={handleSubmit} validatorConfig={validatorConfig}>
        <FieldInput
          label="Электронная почта"
          name="email"
          placeholder="adress@mail.com"
          type="text"
        />
        <FieldInput
          label="Ваше имя"
          name="name"
          placeholder="Джеймс Бонд"
          type="text"
        />
        <FieldInput
          label="Пароль"
          name="password"
          placeholder="It1sAGo0dP@ss!"
          type="password"
        />
        <Checkbox name="licence" value={defaultData.licence}>
          Подтвердите
          {' '}
          <a href="">
            {' '}
            лицензионное соглашение
          </a>
        </Checkbox>
        <button
          className="mt-2 mx-auto w-100"
          style={{ "height": "1.8rem" }}
          type="submit"
        >
          Зарегестрироваться
        </button>
      </Form>
      <span className="w-100" id="form-changer">
        Уже есть аккаунт?
        {' '}
        <a href="/login">Авторизируйтесь!</a>
      </span>
    </div>
  );
}
