/* eslint-disable react/forbid-component-props */
import React from 'react';
import { useSelector } from 'react-redux';
import { getLoginStatus } from '../../store/user';
import { NavLink } from 'react-router-dom';

export default function NavList() {
  const isLogged = useSelector(getLoginStatus());

  return (
    <nav>
      <ul className='nav-list'>
        {isLogged ?
          <>
            <li className='nav-item'>
              <NavLink
                aria-current="page"
                className={({ isActive }) => (isActive ? 'nav-link navbar-brand' : 'nav-link')}
                to="/analytics"
              >
                Аналитика
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                aria-current="page"
                className={({ isActive }) => (isActive ? 'nav-link navbar-brand' : 'nav-link')} //TODO убрать выделение, посмотреть другие варианты.
                to="/operations"
              >
                Операции
              </NavLink>
            </li>
          </> :
          <>
            <li className='nav-item'>
              <NavLink
                aria-current="page"
                className={({ isActive }) => (isActive ? 'nav-link navbar-brand' : 'nav-link')}
                to="/"
              >
                Главная
              </NavLink>
            </li>
            <li className='nav-item login'>
              <NavLink className='nav-link' to="/login" >Войти</NavLink>
            </li>
          </>}
      </ul>
    </nav>
  );
}






