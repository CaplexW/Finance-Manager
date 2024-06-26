import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nodesType } from '../../../mockData/propTypesScheme';
import { getUsersDataStatus, loadUsers } from '../../../store/users';
import { loadQualities } from '../../../store/qualities';
import { loadProfessions } from '../../../store/professions';
import Loader from '../../common/loader';

export default function UsersLoader({ children }) {
  const usersIsLoaded = useSelector(getUsersDataStatus());
  const dispatch = useDispatch();

  useEffect(() => { loadData(); }, []);
  function loadData() {
    if (!usersIsLoaded) {
      dispatch(loadUsers());
      dispatch(loadQualities());
      dispatch(loadProfessions());
    }
  }

  const loaderReason = 'usersLoader loading';
  if (!usersIsLoaded) return <Loader reason={loaderReason} />;
  return children;
}

UsersLoader.propTypes = {
  children: nodesType.isRequired,
};
