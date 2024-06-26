import React from 'react';
import { useParams } from 'react-router';
import LoginForm from '../components/UI/loginForm';
import RegisterForm from '../components/UI/rgisterForm';

export default function Login() {
  const { register } = useParams();
  return (
    <div className="container d-flex justify-content-center mt-3" id="loginPageContainer" style={{ maxWidth: '300px' }}>
      {!register ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}
