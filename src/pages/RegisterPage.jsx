import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Paper, Box } from '@mui/material';
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
            navigate('/');
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
            setError(err.message || 'Registration failed. Please try again.');
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
                        Create an account to get started!
                    </Typography>

                    {error && (
                        <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <form onSubmit={handleRegister}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                required
                                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                required
                                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    border: 'none',
                                }}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </Box>
                    </form>

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
