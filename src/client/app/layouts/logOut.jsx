import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Loader from '../components/common/loader';
import { logOut } from '../store/user';

export default function LogOut() {
  const dispatch = useDispatch();
  const redirectTo = useNavigate();

  useEffect(() => { loggingOut(); }, []);
  async function loggingOut() {
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
