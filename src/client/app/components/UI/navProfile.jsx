/* eslint-disable react/forbid-component-props */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserAvatar from './userAvatar';
import showElement from '../../../../utils/console/showElement';
import { useDispatch, useSelector } from 'react-redux';
import { getDataStatus, getUser, loadUserData } from '../../store/user';

export default function NavProfile() {
  const isLoaded = useSelector(getDataStatus());
  const user = useSelector(getUser());
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const userPagePath = '/user/myProfile';
  const redirectTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(!isLoaded) dispatch(loadUserData());
  }, [isLoaded]);

  function toggleMenu() { setMenuIsOpen((prevState) => !prevState); }
  function handleLogout() {
    const confirmed = confirm('Вы хотите выйти?');
    if (confirmed) redirectTo('/logout');
  }
  async function handleDeleteAccount() {
    const confirmed = confirm('Вы хотите удалить свой аккаунт? Это действие не обратимо!');
    if (confirmed) {
      const password = prompt('Тогда введите свой пароль');
      const result = await deleteUserAccount(user._id, password);
      if (result) redirectTo('/deleteAccount');
      if (!result) alert('Неверный пароль!');
    }
  }

  if(isLoaded) return (
    <div className="dropdown w-100" onClick={toggleMenu} role="button" tabIndex={0}>
      <div className="btn dropdown-toggle d-flex align-items-center">
        <div className="me-2">{user.name}</div>
        <UserAvatar size={26} source={user.image} />
      </div>
      <div className={`w-100 dropdown-menu ps-3 ${menuIsOpen ? 'show' : ''}`}>
        <Link className="dropdown-item" tabIndex={0} to={userPagePath}>Профиль</Link>
        <button className="dropdown-item" onClick={handleLogout} style={{ color: 'orange' }} tabIndex={0} type="button">Выйти</button>
        <button className="dropdown-item" onClick={handleDeleteAccount} style={{ color: 'red' }} tabIndex={0} type="button">Удалить</button>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function deleteUserAccount(id, password) {
  // Обращаемся к api user/remove, отправляем туда id и password.
  // Возвращаем результат deleteCount;
}