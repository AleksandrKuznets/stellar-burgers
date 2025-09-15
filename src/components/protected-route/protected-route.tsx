import { useSelector } from '@services/store';
import { isAuthCheckedSelector } from '@slices/user';
import { Preloader } from '@ui';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  unAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  unAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const isLoading = useSelector((state) => state.user.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (!unAuth && !isAuthChecked) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (unAuth && isAuthChecked) {
    const fromPage = location.state?.from || { pathname: '/' };
    return <Navigate replace to={fromPage} />;
  }

  return children;
};
