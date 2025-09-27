import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;