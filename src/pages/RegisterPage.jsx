// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Paper, Box, TextField, Button, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/goals');
        }
    }, [isAuthenticated, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validate passwords
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            await register(username, email, password);
            // Navigation happens in the effect when isAuthenticated changes
        } catch (err) {
            console.error('Registration error:', err);
            console.error('Response data:', err.response?.data);
            
            if (err.response?.data) {
                // Format error messages from the API
                const errors = err.response.data;
                const errorMessages = [];
                
                for (const field in errors) {
                    if (Array.isArray(errors[field])) {
                        errorMessages.push(`${field}: ${errors[field].join(', ')}`);
                    } else if (typeof errors[field] === 'string') {
                        errorMessages.push(`${field}: ${errors[field]}`);
                    }
                }
                
                setError(errorMessages.join('\n') || 'Registration failed');
            } else {
                setError(err.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Register
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Create an account to get started.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}>
                            {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
                            
                            <TextField
                                label="Username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                fullWidth
                            />
                            
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                            />
                            
                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                            />
                            
                            <TextField
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                fullWidth
                            />
                            
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </Button>
                        </Box>
                    </Box>
                    
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <Typography
                                component="a"
                                variant="body2"
                                href="/login"
                                sx={{
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                Login here
                            </Typography>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default RegisterPage;