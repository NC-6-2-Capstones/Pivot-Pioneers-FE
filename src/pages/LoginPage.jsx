
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Paper, Box } from '@mui/material';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (credentials) => {
        // Call the login function from AuthContext
        await login(credentials.username, credentials.password);
        // Redirection is handled in the useEffect
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Log In
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Welcome back! Enter your credentials to continue.
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <LoginForm onLogin={handleLogin} />
                    </Box>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2">
                            Don't have an account?{' '}
                            <Typography
                                component="a"
                                variant="body2"
                                href="/register"
                                sx={{
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                Register here
                            </Typography>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;