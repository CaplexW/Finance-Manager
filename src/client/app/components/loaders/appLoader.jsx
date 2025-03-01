import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import forbidExtraProps from 'prop-types-exact';
import { useDispatch, useSelector } from 'react-redux';
import { getLoginStatus, getUsersDataStatus, loadUsers } from '../../../store/users';
import { loadQualities } from '../../../store/qualities';
import { loadProfessions } from '../../../store/professions';
import Loader from '../../common/loader';
import { nodesPropType } from '../../../types/propTypes';

export default function AppLoader({ children }) {
  // const isLogged = useSelector(getLoginStatus());
  const isLogged = true;
  // const isUsersLoaded = useSelector(getUsersDataStatus());
  const dispatch = useDispatch();

  useEffect(loadData, [isLogged]);
  function loadData() {
    // if (isLogged) dispatch(loadUsers());
  }

  // const loaderReason = 'appLoader loading';
  // if (!isUsersLoaded && isLogged) return <Loader reason={loaderReason} />;
  return children;
}

AppLoader.propTypes = forbidExtraProps({
  children: nodesPropType.isRequired,
});
