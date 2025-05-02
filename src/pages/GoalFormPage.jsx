// src/pages/GoalFormPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GoalForm from '../components/GoalForm';
import { goalService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

const GoalFormPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);
    
    const handleGoalSubmit = async (goalData) => {
        try {
            await goalService.createGoal(goalData);
            alert('Goal created successfully!');
            navigate('/'); // Navigate to home or dashboard
        } catch (error) {
            console.error('Error creating goal:', error);
            alert('Failed to create goal. Please try again.');
        }
    };

    return (
        <div>
            <h2>Define Your Path</h2>
            <h3>Everyone's journey starts with a single step — and that step begins here.</h3>
            <p>We believe that justice-impacted individuals deserve tools that support transformation, not just survival.</p>
            <p>By sharing your dream or goal below, you're taking the first step toward building a personalized roadmap designed to guide you forward.</p>
            <p>We'll use what you share to map out a path from where you are now to where you want to be — including check-ins at 3, 6, and 9 months to keep you on track.</p>
            <p>Whether it's a new career, education, or personal growth, this is your space to define what success looks like — and start walking toward it.</p>
            <GoalForm onSubmit={handleGoalSubmit} />
        </div>
    );
};

export default GoalFormPage;