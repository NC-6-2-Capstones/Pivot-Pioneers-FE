import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Roadmap from '../components/Roadmap';
import { goalService, assessmentService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { Container, CircularProgress, Alert, Typography } from '@mui/material';

const RoadmapPage = () => {
  const { goalId } = useParams();
  const { user } = useAuth();

  const [goalData, setGoalData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goalId) {
      const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
          // Fetch goal data
          const goalResponse = await goalService.getGoal(goalId);
          setGoalData(goalResponse.data);
          
          // Fetch personality profile
          try {
            const profileResponse = await assessmentService.getProfile();
            setProfileData(profileResponse.data);
          } catch (profileErr) {
            console.log('No profile found or error fetching profile:', profileErr);
            // This is okay, we'll handle missing profile in the UI
          }
        } catch (err) {
          console.error('Error fetching goal roadmap:', err);
          setError(err.response?.data?.detail || err.message || 'Failed to load roadmap data.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
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
  
  // Build assessment traits object from profile data
  const assessmentTraits = {};
  
  if (profileData) {
    // Extract all assessment traits from profile data
    Object.entries(profileData).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim() !== '') {
        assessmentTraits[key] = value;
      }
    });
  }
  
  // Fallback to goal assessment_type if profile data isn't available
  if (Object.keys(assessmentTraits).length === 0 && goalData.assessment_type) {
    assessmentTraits.assessment_type = goalData.assessment_type;
  }

  return <Roadmap 
    userName={userName} 
    milestones={milestones} 
    fullPlan={fullPlan} 
    goalTitle={goalData.title}
    assessmentTraits={assessmentTraits} 
  />;
};

export default RoadmapPage; 