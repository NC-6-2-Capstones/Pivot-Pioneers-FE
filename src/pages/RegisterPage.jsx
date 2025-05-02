import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box
} from '@mui/material';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        console.log('Registering with:', { username, email, password });
        // TODO: connect to backend/api here
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleRegister}>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Register
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default RegisterPage;
