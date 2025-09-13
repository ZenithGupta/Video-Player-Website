import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
    if (!user) {
        // Redirect them to the / page, but save the current location they were
        // trying to go to. This is optional and can be used for redirecting
        // back after login. For now, we'll just redirect to home.
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;