import React from 'react';
import { useParams } from 'react-router-dom';
import LoginForm from '../components/UI/loginForm';
import RegisterForm from '../components/UI/rgisterForm';

export default function LoginPage() {
  const { register } = useParams<{ register?: string }>();
  return (
    <div className="login-page container d-flex justify-content-center mt-3" id="loginPageContainer" style={{ maxWidth: '300px' }}>
      {!register ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}






