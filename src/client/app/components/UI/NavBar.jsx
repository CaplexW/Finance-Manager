/* eslint-disable react/forbid-component-props */
import React from 'react';
import { NavLink } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
// import { useSelector } from 'react-redux';
// import NavProfile from './navProfile';
// import { getCurrentUser } from '../../store/users';
import { mainColor } from '../../../../constants/colors';
import { useSelector } from 'react-redux';
import { getLoginStatus } from '../../store/user';
import NavProfile from './navProfile';
import showElement from '../../../../utils/console/showElement';

export default function NavBar() {
  const isLogged = useSelector(getLoginStatus());

  const lastColClass = `col-md-2 d-flex ${isLogged ? '' : 'justify-content-end'}`;
  // style={{ backgroundColor: mainColor }}
  return (
    <nav className="navbar row gutter-md py-1 px-4 d-flex justify-content-between">
      <div className="col-md-1 align-items-center d-flex justify-content-center" id="main">
        <NavLink
          aria-current="page"
          className={({ isActive }) => (isActive ? 'nav-link navbar-brand' : 'nav-link')}
          to="/"
        >
          Главная
        </NavLink>
      </div>
      <div className="col-md-1  align-items-center d-flex justify-content-center" id="users">
        {isLogged ? (
          <NavLink
            aria-current="page"
            className={({ isActive }) => (isActive ? 'nav-link navbar-brand' : 'nav-link')} //TODO убрать выделение, посмотреть другие варианты.
            to="/operations"
          >
            Операции
          </NavLink>
        ) : ''}
      </div>
      <div className="col-md-6" id="space" />
      <div className={lastColClass} id="right-side">
        {isLogged ?
          <NavProfile />
          : (
            <NavLink
              aria-current="page"
              className={({ isActive }) => (isActive ? 'nav-link navbar-brand' : 'nav-link')}
              to="/login"
            >
              Войти
            </NavLink>
          )}
      </div>
    </nav>
  );
}
