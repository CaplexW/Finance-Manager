import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import showElement from '../../../../utils/console/showElement';

export default function ProtectedRoute({ isAuthenticated, redirectPath = '/login' }) {
  showElement(location, 'location');
  return isAuthenticated ? <Outlet /> : <Navigate replace state={{ from: location.pathname }} to={redirectPath} />;
};

ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  redirectPath: PropTypes.string,
};
