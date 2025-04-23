import React from 'react';
import NavProfile from './navProfile';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../server/utils/console/showElement';
import UserBalance from './userBalance';
import NavList from './navlist';

export default function NavBar() {
  return (
    <div className="navbar">
      <div className="navlist--top">
        <NavList />
      </div>
      <div className="user-panel">
        <UserBalance />
        <NavProfile />
      </div>
    </div>
  );
}
