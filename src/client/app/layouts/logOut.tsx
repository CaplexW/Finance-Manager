import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/loader';
import { logOut } from '../store/user';
import useAppDispatch from '../hooks/useAppDispatch';

export default function LogOut(): JSX.Element {
  const dispatch = useAppDispatch();
  const redirectTo = useNavigate();

  useEffect(() => {
    void loggingOut();
  }, []);

  async function loggingOut(): Promise<void> {
    const isGuest = false;
    if (isGuest) {
      redirectTo('/deleteAccount');
    } else {
      redirectTo('/');
      dispatch(logOut());
    }
  }

  const loaderReason = 'logging out';
  return <Loader reason={loaderReason} />;
}

