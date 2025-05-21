import React from 'react';
import { Box, Typography } from '@mui/material';
import Logo from '../assets/logo.png';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'primary.main',
                py: 3,
                px: 2,
                color: '#fff',
                textAlign: 'center',
                mt: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <img src={Logo} alt="Golden Roadmap Logo" style={{ height: 40, marginBottom: 10 }} />
            <Typography variant="body2">
                © {new Date().getFullYear()} Golden Roadmap. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;