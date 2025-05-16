import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { goalService } from '../services/apiService';

const MyGoals = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(0); // 0 for active goals, 1 for completed
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch goals
    const fetchGoals = async () => {
      setLoading(true);
      setError('');

      try {
        const goalsResponse = await goalService.getGoals();
        setGoals(goalsResponse.data);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('Failed to load your goals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [isAuthenticated, navigate]);

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      try {
        await goalService.deleteGoal(goalId);
        
        // Remove the deleted goal from the state
        setGoals(goals.filter(goal => goal.id !== goalId));
        
        // Show success message
        alert('Goal deleted successfully');
      } catch (error) {
        console.error('Error deleting goal:', error);
        alert('Failed to delete goal. Please try again.');
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const activeGoals = goals.filter(goal => !goal.is_completed);
  const completedGoals = goals.filter(goal => goal.is_completed);

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            My Goals
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/goals')}
          >
            Create New Goal
          </Button>
        </Box>

        {/* Tab navigation */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label={`Active Goals (${activeGoals.length})`} />
          <Tab label={`Completed Goals (${completedGoals.length})`} />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {goals.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              You haven't set any goals yet
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Create your first goal to start your journey.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/goals')}
            >
              Create Goal
            </Button>
          </Box>
        ) : (
          <>
            {/* Active Goals Tab */}
            {activeTab === 0 && (
              <Grid container spacing={2}>
                {activeGoals.length > 0 ? (
                  activeGoals.map(goal => (
                    <Grid item xs={12} key={goal.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box maxWidth="70%">
                              <Typography variant="h6" noWrap>{goal.title}</Typography>
                            </Box>
                            <Chip
                              label={goal.category}
                              color="primary"
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                          
                          {/* <Typography variant="body2" color="textSecondary" paragraph>
                            {goal.description}
                          </Typography> */}
                          
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/goals/${goal.id}`)}
                            >
                              Goal Roadmap
                            </Button>
                            <Button 
                              size="small" 
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteGoal(goal.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        You don't have any active goals.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}

            {/* Completed Goals Tab */}
            {activeTab === 1 && (
              <Grid container spacing={2}>
                {completedGoals.length > 0 ? (
                  completedGoals.map(goal => (
                    <Grid item xs={12} key={goal.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box maxWidth="70%">
                              <Typography variant="h6" noWrap>{goal.title}</Typography>
                            </Box>
                            <Chip
                              label="Completed"
                              color="success"
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                          
                          {/* <Typography variant="body2" color="textSecondary" paragraph>
                            {goal.description}
                          </Typography> */}
                          
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/goals/${goal.id}`)}
                            >
                              Goal Roadmap
                            </Button>
                            <Button 
                              size="small" 
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteGoal(goal.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        You don't have any completed goals yet.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default MyGoals;