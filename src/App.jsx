import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import RoadmapPage from './pages/RoadmapPage';
import GeminiAIPage from './pages/GeminiAIPage';
import CssBaseline from '@mui/material/CssBaseline';
import MyGoals from './pages/MyGoals';
import Footer from './components/Footer';
import { Box } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#4caf50' },
        secondary: { main: '#2196f3' },
        background: {
            default: '#f0f4f8',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#5f6368',
        },
    },
});

const App = () => {
    return (
        <UserProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <Router>
                        <Box display="flex" flexDirection="column" minHeight="100vh">
                            <Navbar />
                            <Box sx={{ flex: 1 }}>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                    <Route path="/dashboard" element={<DashboardPage />} />
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
                                    <Route
                                        path="/goals/:goalId"
                                        element={
                                            <ProtectedRoute>
                                                <RoadmapPage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/mygoals"
                                        element={
                                            <ProtectedRoute>
                                                <MyGoals />
                                            </ProtectedRoute>
                                        }
                                    />
                                </Routes>
                            </Box>
                            <Footer />
                        </Box>
                    </Router>
                </AuthProvider>
            </ThemeProvider>
        </UserProvider>
    );
};

export default App;
