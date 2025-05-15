import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Roadmap from '../components/Roadmap';
import { goalService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { Container, CircularProgress, Alert, Typography } from '@mui/material';

const RoadmapPage = () => {
  const { goalId } = useParams();
  const { user } = useAuth();

  const [goalData, setGoalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goalId) {
      const fetchGoalRoadmap = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await goalService.getGoal(goalId);
          setGoalData(response.data);
        } catch (err) {
          console.error('Error fetching goal roadmap:', err);
          setError(err.response?.data?.detail || err.message || 'Failed to load roadmap data.');
        } finally {
          setLoading(false);
        }
      };
      fetchGoalRoadmap();
    }
  }, [goalId]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading roadmap...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!goalData) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No roadmap data found for this goal.</Alert>
      </Container>
    );
  }

  const milestones = {
    'Start': goalData.milestone_start || '',
    '3 months': goalData.milestone_3_months || '',
    '6 months': goalData.milestone_6_months || '',
    '9 months': goalData.milestone_9_months || '',
    '12 months': goalData.milestone_12_months || '',
  };

  const fullPlan = goalData.full_plan || '';
  const userName = user?.username || 'User';

  return <Roadmap userName={userName} milestones={milestones} fullPlan={fullPlan} goalTitle={goalData.title} />;
};

export default RoadmapPage; 