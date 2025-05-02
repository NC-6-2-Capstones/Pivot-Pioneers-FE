import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    const handleLogin = (credentials) => {
        console.log('Logging in with:', credentials);
        // TODO: connect to backend/api here
    };

    return (
        <div>
            <h2>Login</h2>
            <LoginForm onLogin={handleLogin} />
        </div>
    );
};

export default LoginPage;
