// src/components/Navbar.jsx - Add a menu item for assessment
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/logo.png'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Menu state for user dropdown
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/">
            <img src={Logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
          </Link>
          <Typography variant="h6" component="div">
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
              The Golden Roadmap
            </Link>
          </Typography>
        </Box>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/goals"
              sx={{ mr: 2, borderColor: 'white', color: 'white', fontWeight: 'bold' }}
            >
              Start with Your Why
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/mygoals"
              sx={{ mr: 2, borderline: 'white', color: 'white', fontWeight: 'bold' }}
            >
              Goals
            </Button>

            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle sx={{ color: '#ffde59' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => {
                handleClose();
                navigate('/userProfile');
              }}>Profile</MenuItem>
              <MenuItem onClick={() => {
                handleClose();
                navigate('/assessment');
              }}>Take Assessment</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/login"
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/register"
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;