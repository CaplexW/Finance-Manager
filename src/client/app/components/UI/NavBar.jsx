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
  return (
    <nav className="navbar row gutter-md p-3 d-flex justify-content-between" style={{ backgroundColor: mainColor }}>
      <div className="col-md-1 align-items-center d-flex justify-content-center ms-4 my-1" id="main">
        <NavLink
          aria-current="page"
          className={({ isActive }) => (isActive ? 'nav-link navbar-brand' : 'nav-link')}
          to="/"
        >
          Главная
        </NavLink>
      </div>
      <div className="col-md-1  align-items-center d-flex justify-content-center my-1" id="users">
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
      <div className="col-md-2 d-flex align-items-end justify-content-end mx-5" id="right-side">
        {isLogged ? <NavProfile /> : (
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
