import React from 'react';
import { NavLink } from 'react-router-dom';
import NavList from './navlist';

export default function BottomNavbar() {
  return <div className='navbar navlist--bottom'><NavList /></div>;
};
