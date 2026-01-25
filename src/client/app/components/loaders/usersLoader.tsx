import React, { ReactElement, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'react-redux';
import { nodesType } from '../../../mockData/propTypesScheme';
import { getUsersDataStatus, loadUsers } from '../../../store/users';
import Loader from '../../common/loader';

export default function UsersLoader({ children } : { children: ReactElement}) {
  const usersIsLoaded = useAppSelector(getUsersDataStatus());
  const dispatch = useAppDispatch();

  useEffect(() => { loadData(); }, []);
  function loadData() {
    if (!usersIsLoaded) {
      dispatch(loadUsers());
    }
  }

  const loaderReason = 'usersLoader loading';
  if (!usersIsLoaded) return <Loader reason={loaderReason} />;
  return children;
}

UsersLoader.propTypes = {
  children: nodesType.isRequired,
};
