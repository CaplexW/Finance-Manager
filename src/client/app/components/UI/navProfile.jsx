/* eslint-disable react/forbid-component-props */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserAvatar from './userAvatar';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../server/utils/console/showElement';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataStatus, getUser, loadUserData } from '../../store/user';
import userService from '../../services/user.service';
import { removeAuthData } from '../../services/storage.service';
import CreateImportPresetForm from './createImportPresetForm';
import ModalWindow from '../common/modalWindow';
import { loadImportPresets } from '../../store/importPresets';
import { getCategoriesList } from '../../store/categories';

export default function NavProfile() {
  const isLoaded = useSelector(getUserDataStatus());
  const user = useSelector(getUser());
  const categories = useSelector(getCategoriesList());
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const userPagePath = '/user/myProfile';
  const redirectTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => { 
    if (!isLoaded) dispatch(loadUserData()); 
  }, [isLoaded]);

  function toggleMenu() { setMenuIsOpen((prevState) => !prevState); }
  
  function openPresetModal() {
    setMenuIsOpen(false);
    setIsPresetModalOpen(true);
    dispatch(loadImportPresets());
  }
  
  function closePresetModal() {
    setIsPresetModalOpen(false);
  }
  
  function handleLogout() {
    const confirmed = confirm('Вы хотите выйти?');
    if (confirmed) redirectTo('/logout');
  }
  async function handleDeleteAccount() {
    const confirmed = confirm('Вы хотите удалить свой аккаунт? Это действие не обратимо!');
    if (confirmed) {
      const password = prompt('Тогда введите свой пароль');
      const result = await deleteUserAccount(user._id, password);
      if (result) { removeAuthData(); alert('Ваш аккаунт удален! Спасибо, что были с нами!'); };
      if (!result) alert('Неверный пароль!');
    }
  }

  if (isLoaded) return (
    <>
      <div className="dropdown" onClick={toggleMenu} role="button" tabIndex={0}>
        <div className="btn dropdown-toggle d-flex align-items-center">
          <div className="me-2">{user.name}</div>
          <UserAvatar size={26} source={user.image} />
        </div>
        <div className={`w-100 dropdown-menu ps-3 ${menuIsOpen ? 'show' : ''}`}>
          <Link className="dropdown-item" tabIndex={0} to={userPagePath}>Профиль</Link>
          <button className="dropdown-item" onClick={openPresetModal} tabIndex={0} type="button">Типовые операции</button>
          <button className="dropdown-item" onClick={handleLogout} style={{ color: 'orange' }} tabIndex={0} type="button">Выйти</button>
          <button className="dropdown-item" onClick={handleDeleteAccount} style={{ color: 'red' }} tabIndex={0} type="button">Удалить</button>
        </div>
      </div>
      
      <ModalWindow headTitle="Создание типовой операции" isOpen={isPresetModalOpen} onClose={closePresetModal}>
        <CreateImportPresetForm onClose={closePresetModal} />
      </ModalWindow>
    </>
  );
};

async function deleteUserAccount(id, password) {
  const result = await userService.deleteUser(id, password);
  return result;
}
