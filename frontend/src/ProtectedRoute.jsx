import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, token, children }) => {
    // If we have a token but no user details yet, it means we are still loading.
    // Render a simple loading message instead of redirecting.
    if (token && !user) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}><h2>Loading...</h2></div>;
    }

    if (!user) {
        // Redirect them to the home page if not logged in
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;