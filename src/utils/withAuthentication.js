import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const withAuthentication = (WrappedComponent) => {
  return function AuthComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      // Check if the token is present in the HTTP-only cookie
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }, []);

    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    } else {
      // Redirect to the Login Component if the user is not authenticated
      return <Navigate to="/login" />;
    }
  };
};

export default withAuthentication;
