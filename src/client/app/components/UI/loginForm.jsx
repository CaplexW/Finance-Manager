/* eslint-disable react/jsx-max-depth */
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Form, { Checkbox, FieldInput } from '../common/form';
import { signIn } from '../../store/user';
import { mainColor } from '../../../../constants/colors';

export default function LoginForm() {
  const emptyData = { email: '', password: '', stayIn: false };
  const prevLocation = useLocation().state?.from;
  const redirectTo = useNavigate();
  const dispatch = useDispatch();

  const validatorConfig = {
    email: {
      isRequired: {
        message: 'Введите e-mail',
      },
      isEmail: {
        message: 'Не корректный e-mail',
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
  };

  function redirectUser() {
    if (prevLocation) {
      redirectTo(prevLocation);
    } else {
      redirectTo('/operations');
    }
  }
  function handleSubmit(data) {
    const logingInUser = {
      email: data.email,
      password: data.password,
      stayIn: data.stayIn,
    };
    dispatch(signIn(logingInUser))
      .then((result) => { if (result === 'success') redirectUser(); });
  }

  return (
    <div className="container mt-5">
      <h2>Авторизация</h2>
      <Form dataScheme={emptyData} onSubmit={handleSubmit} validatorConfig={validatorConfig}>
        <FieldInput label="E-mail" name="email" placeholder="adress@mail.com" type="text" />
        <FieldInput label="Пароль" name="password" placeholder="It1sAGo0dP@ss!" type="password" />
        <Checkbox name="stayIn"><span>Оставаться в системе</span></Checkbox>
        <button className="mt-2 mx-auto w-100" style={{ "height": "1.8rem" }} type="submit">Войти</button>
      </Form>
      <span className="w-100">
        Нет аккаунта?
        {' '}
        <a href="/login/register">Зарегестрируйтесь!</a>
      </span>
    </div>
  );
}
