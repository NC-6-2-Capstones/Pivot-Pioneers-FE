import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoalFormPage from './pages/GoalFormPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import UserProfilePage from './pages/UserProfilePage';
import { UserProvider } from './contexts/UserContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4caf50' }, // soft green (growth, success)
    secondary: { main: '#2196f3' }, // calm blue (trust, focus)
    background: {
      default: '#f0f4f8', // light gray-blue (clean, fresh)
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
        <UserProvider> 
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <Router>
                        <Navbar />
                        <Routes>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route 
                                path="/goals" 
                                element={
                                    <ProtectedRoute>
                                        <GoalFormPage />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/assessment" 
                                element={
                                    <ProtectedRoute>
                                        <AssessmentPage />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/userProfile" 
                                element={
                                    <ProtectedRoute>
                                        <UserProfilePage />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </Router>
                </AuthProvider>
            </ThemeProvider>
        </UserProvider>
    );
};

export default App;