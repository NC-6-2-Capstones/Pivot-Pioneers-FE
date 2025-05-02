// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoalFormPage from './pages/GoalFormPage';
import ResourcePage from './pages/ResourcePage';

const App = () => {
  return (
    <Router>
      <div>
        <h1>My App</h1>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/goals" element={<GoalFormPage />} />
          <Route path="/resources" element={<ResourcePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

