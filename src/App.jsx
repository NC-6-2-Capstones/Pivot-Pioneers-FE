// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoalFormPage from './pages/GoalFormPage';
import HomePage from './pages/HomePage';
// import ResourcePage from './pages/ResourcePage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4caf50' }, // soft green (growth, success)
    secondary: { main: '#2196f3' }, // calm blue (trust, focus)
    background: {
      default: '#f0f4f8',// light gray-blue (clean, fresh)
      paper: '#ffffff', // white (contrast for cards/forms)
    },
    text: {
      primary: '#1a1a1a', // near-black (legible)
      secondary: '#5f6368', // soft gray
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/goals" element={<GoalFormPage />} />
          {/* <Route path="/resources" element={<ResourcePage />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;

