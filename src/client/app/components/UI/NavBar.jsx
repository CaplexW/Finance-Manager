/* eslint-disable react/forbid-component-props */
import React from 'react';
import { NavLink } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
// import { useSelector } from 'react-redux';
// import NavProfile from './navProfile';
// import { getCurrentUser } from '../../store/users';
import { useSelector } from 'react-redux';
import { getLoginStatus } from '../../store/user';
import NavProfile from './navProfile';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../utils/console/showElement';
import UserBalance from './userBalance';

export default function NavBar() {
  const isLogged = useSelector(getLoginStatus());

  return (
    <div className="navbar">
      <nav>
        <ul className='nav-list'>
          {isLogged ?
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
            <li className='nav-item'>
              <NavLink className='nav-link' to="/login" >Войти</NavLink>
            </li>}
        </ul>
      </nav>
      <div className="user-panel">
        <UserBalance />
        <NavProfile />
      </div>
    </div>
  );
}
