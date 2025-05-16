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
  Tab,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import Confetti from 'react-confetti';
import { useAuth } from '../contexts/AuthContext';
import { goalService } from '../services/apiService';
import gamificationService from '../services/gamificationService';
import UserLevelBadge from '../components/UserLevelBadge';

const MyGoals = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Tab and goals state
  const [activeTab, setActiveTab] = useState(0); // 0 for active goals, 1 for completed
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Gamification state
  const [showConfetti, setShowConfetti] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Fetch goals when component loads
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

  // Fetch user points on load
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (isAuthenticated) {
        try {
          const pointsData = await gamificationService.getUserPoints();
          setUserPoints(pointsData.total_points);
          setUserLevel(pointsData.level);
        } catch (error) {
          console.error('Error fetching user points:', error);
          // Default values are already set in state
        }
      }
    };
    
    fetchUserPoints();
  }, [isAuthenticated]);

  // Handle deleting a goal
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

  // Handle toggling goal completion status
  const handleToggleComplete = async (goal) => {
    try {
      // Toggle the completion status
      const updatedGoal = {
        ...goal,
        is_completed: !goal.is_completed
      };
      
      // Call the API to update the goal
      await goalService.updateGoal(goal.id, updatedGoal);
      
      // Update the local state to reflect the change
      setGoals(goals.map(g => 
        g.id === goal.id ? updatedGoal : g
      ));
      
      // If marking as complete (not uncompleting)
      if (updatedGoal.is_completed) {
        try {
          // Add points via gamification service
          const pointsResponse = await gamificationService.addPointsForGoal(updatedGoal);
          
          // Update state with new points
          setUserPoints(pointsResponse.total_points || 50);
          setUserLevel(pointsResponse.level || 1);
          setEarnedPoints(pointsResponse.points_earned || 50);
        } catch (err) {
          console.error('Error with gamification:', err);
          // Fallback to calculating points locally if API fails
          const earnedPoints = gamificationService.calculatePoints(goal.category);
          setEarnedPoints(earnedPoints);
          setUserPoints(userPoints + earnedPoints);
        }
        
        // Trigger celebration
        setShowConfetti(true);
        setCelebrationOpen(true);
        
        // Stop confetti after 5 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      alert('Failed to update goal status. Please try again.');
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
       
  // Filter goals based on completion status
  const activeGoals = goals.filter(goal => !goal.is_completed);
  const completedGoals = goals.filter(goal => goal.is_completed);

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header with title, level badge and create button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            My Goals
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <UserLevelBadge level={userLevel} points={userPoints} />
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/goals')}
            >
              Create New Goal
            </Button>
          </Box>
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

        {/* Error alerts */}
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {/* Empty state when no goals exist */}
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
                            <Box>
                              <Typography variant="h6" noWrap>{goal.title}</Typography>
                            </Box>
                            <Chip
                              label={goal.category}
                              color="primary"
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/goals/${goal.id}`)}
                            >
                              Roadmap
                            </Button>
                            <Button 
                              size="small" 
                              variant="outlined"
                              color="success"
                              onClick={() => handleToggleComplete(goal)}
                            >
                              Complete
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
                          
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/goals/${goal.id}`)}
                            >
                              Roadmap
                            </Button>
                            <Button 
                              size="small" 
                              variant="outlined"
                              color="primary"
                              onClick={() => handleToggleComplete(goal)}
                            >
                              Mark Active
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

      {/* Confetti overlay when completing a goal */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Goal completion celebration dialog */}
      <Dialog 
        open={celebrationOpen} 
        onClose={() => setCelebrationOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
          <Typography variant="h4" color="primary">
            Goal Completed! 🎉
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ 
          textAlign: 'center', 
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="h5">
            You earned {earnedPoints} points!
          </Typography>
          
          <Typography variant="body1">
            Total Points: {userPoints}
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            {gamificationService.getMotivationalMessage(goals.filter(g => g.is_completed).length)}
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setCelebrationOpen(false)}
            sx={{ mt: 2 }}
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MyGoals;