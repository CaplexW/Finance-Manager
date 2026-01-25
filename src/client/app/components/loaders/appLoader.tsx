import React, { ReactNode, useEffect } from 'react';
import forbidExtraProps from 'prop-types-exact';
import PropTypes from 'prop-types';
import { useAppDispatch } from '../../hooks/useAppDispatch';
// import { useAppSelector } from '../hooks/useAppSelector';
// import { getLoginStatus, getUsersDataStatus, loadUsers } from '../store/users';
// import { loadQualities } from '../store/qualities';
// import { loadProfessions } from '../store/professions';
// import Loader from '../components/common/loader';
import { nodesPropType } from '../../../types/propTypes';

interface AppLoaderProps {
  children: ReactNode;
}

export default function AppLoader({ children }: AppLoaderProps): JSX.Element {
  // const isLogged = useAppSelector(getLoginStatus());
  const isLogged = true;
  // const isUsersLoaded = useAppSelector(getUsersDataStatus());
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged]);

  function loadData(): void {
    // if (isLogged) dispatch(loadUsers());
  }

  // const loaderReason = 'appLoader loading';
  // if (!isUsersLoaded && isLogged) return <Loader reason={loaderReason} />;
  return <>{children}</>;
}

AppLoader.propTypes = forbidExtraProps({
  children: nodesPropType.isRequired as unknown as PropTypes.Validator<ReactNode>,
});

