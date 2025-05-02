import React from 'react';
import AppBar from '@mui/material/AppBar';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'blue.600' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Golden Roadmap
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          component={Link}
          to="/login"
          sx={{ borderColor: 'white', color: 'white' }}
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;