import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Divider,
    CircularProgress,
    Alert,
    Button,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Tab,
    Tabs,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import Confetti from 'react-confetti';
import { useAuth } from '../contexts/AuthContext';
import { assessmentService, profileService, goalService } from '../services/apiService';
import gamificationService from '../services/gamificationService';
import UserAchievements from '../components/UserAchievements';
import UserLevelBadge from '../components/UserLevelBadge';
import AchievementNotification from '../components/AchievementNotification';
import AssignmentIcon from '@mui/icons-material/Assignment';


// Map profile values to readable text and descriptions
const profileLabels = {
    // Problem solving
    'creative': {
        label: 'Creative Problem Solver',
        description: 'You excel at finding innovative solutions and thinking outside the box.'
    },
    'analytical': {
        label: 'Analytical Thinker',
        description: 'You approach problems methodically, breaking them down into components.'
    },
    'collaborative': {
        label: 'Collaborative Problem Solver',
        description: 'You value input from others and solve problems through teamwork.'
    },
    'action-oriented': {
        label: 'Action-Oriented Problem Solver',
        description: 'You prefer to tackle problems directly through immediate action.'
    },

    // Goal energy
    'social': {
        label: 'Socially Motivated',
        description: 'Working with others energizes you and helps you stay committed.'
    },
    'progress-focused': {
        label: 'Progress-Driven',
        description: 'Seeing tangible progress and results keeps you motivated.'
    },
    'growth-focused': {
        label: 'Growth-Oriented',
        description: 'Learning new skills and developing yourself drives your motivation.'
    },
    'vision-focused': {
        label: 'Vision-Inspired',
        description: 'Having a clear long-term vision guides your daily actions.'
    },

    // Other categories follow the same pattern...
    'empathy': {
        label: 'Strong Empathy',
        description: 'You excel at understanding others and connecting with their perspective.'
    },
    'discipline': {
        label: 'Disciplined Approach',
        description: 'You maintain structure and consistency in pursuing your goals.'
    },
    'strategy': {
        label: 'Strategic Thinking',
        description: 'You plan ahead and consider multiple steps toward your objectives.'
    },
    'adaptability': {
        label: 'Adaptable Mindset',
        description: 'You thrive in changing environments and can pivot when needed.'
    }
};

const UserProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get state passed from other components
  const newGoal = location.state?.newGoal;
  const initialTab = location.state?.activeTab || 0;
  
  // Update activeTab state to use initialTab from location state
  const [activeTab, setActiveTab] = useState(initialTab);
  const [profile, setProfile] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Gamification state
  const [showConfetti, setShowConfetti] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [achievement, setAchievement] = useState(null);
  const [showAchievementNotification, setShowAchievementNotification] = useState(false);
  
  // New state to track achievements
  const [userAchievements, setUserAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [refreshAchievementsTrigger, setRefreshAchievementsTrigger] = useState(0);

  // Create a reusable function to fetch achievements
  const fetchUserAchievements = useCallback(async () => {
    setAchievementsLoading(true);
    try {
      console.log('Fetching user achievements...');
      const achievementsData = await gamificationService.getUserAchievements();
      console.log('Achievements data:', achievementsData);
      setUserAchievements(achievementsData || []);
    } catch (err) {
      console.error('Error fetching achievements:', err);
    } finally {
      setAchievementsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch personality profile
        const profileResponse = await assessmentService.getProfile();
        setProfile(profileResponse.data);

        // Fetch user goals
        const goalsResponse = await goalService.getGoals();
        setGoals(goalsResponse.data);

        // Fetch user gamification data
        const pointsData = await gamificationService.getUserPoints();
        setUserPoints(pointsData.total_points);
        setUserLevel(pointsData.level);
        
        // Fetch user achievements
        await fetchUserAchievements();
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (err.response?.status === 404 && err.response?.data?.detail?.includes('personality profile')) {
          // No profile exists yet, but that's okay
          setProfile(null);
        } else {
          setError('Failed to load your profile data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate, fetchUserAchievements]);

  // Re-fetch goals when navigating from goal creation
  useEffect(() => {
    if (newGoal) {
      const fetchGoals = async () => {
        try {
          const goalsResponse = await goalService.getGoals();
          setGoals(goalsResponse.data);
        } catch (err) {
          console.error('Error fetching goals:', err);
        }
      };
      
      fetchGoals();
    }
  }, [newGoal]);
  
  // Refresh achievements whenever the tab changes to achievements tab
  useEffect(() => {
    if (activeTab === 3) {
      fetchUserAchievements();
    }
  }, [activeTab, fetchUserAchievements]);
  
  // Refresh achievements when the refreshAchievementsTrigger changes
  useEffect(() => {
    if (refreshAchievementsTrigger > 0) {
      fetchUserAchievements();
    }
  }, [refreshAchievementsTrigger, fetchUserAchievements]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTakeAssessment = () => {
    navigate('/assessment');
  };

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
          
          // Check for new achievements
          const newAchievements = await gamificationService.checkNewAchievements();
          console.log('New achievements:', newAchievements);
          
          if (newAchievements && newAchievements.length > 0) {
            setAchievement(newAchievements[0]);
            // Show achievement notification after celebration dialog closes
            setTimeout(() => {
              setShowAchievementNotification(true);
            }, 1000);
            
            // Trigger a refresh of the achievements
            setRefreshAchievementsTrigger(prev => prev + 1);
          }
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

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      try {
        await goalService.deleteGoal(goalId);
        
        // Remove the deleted goal from the state
        setGoals(goals.filter(goal => goal.id !== goalId));
        
        // Show success message (you could use a snackbar or other notification)
        alert('Goal deleted successfully');
      } catch (error) {
        console.error('Error deleting goal:', error);
        alert('Failed to delete goal. Please try again.');
      }
    }
  };
  
  // Handle closing the achievement notification
  const handleCloseAchievementNotification = () => {
    setShowAchievementNotification(false);
    // Refresh achievements list after closing the notification
    setRefreshAchievementsTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {newGoal && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Goal created successfully! You can view and track it in your goals list.
          </Alert>
        )}
        
        {/* Header with avatar, name and level badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                mr: 3
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h4">
                {user?.firstName || user?.username || 'User Profile'}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Member since {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          
          {/* Level badge on the right */}
          <UserLevelBadge level={userLevel} points={userPoints} size="large" />
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab icon={<PersonIcon />} label="PROFILE" />
          <Tab icon={<AssessmentIcon />} label="ASSESSMENT RESULTS" />
          <Tab icon={<FlagIcon />} label="GOALS" />
          <Tab icon={<EmojiEventsIcon />} label="ACHIEVEMENTS" />
        </Tabs>

        {/* Profile Tab - UPDATED with horizontal layout */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Personal Information
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  {/* Left section - Account Details */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>
                      Account Details
                    </Typography>
                    
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Username" 
                          secondary={user?.username || 'Not set'} 
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Email" 
                          secondary={user?.email || 'Not set'} 
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  
                  {/* Divider between sections */}
                  <Grid item xs={12} md="auto">
                    <Divider orientation="vertical" flexItem sx={{ height: '100%', display: { xs: 'none', md: 'block' } }} />
                    <Divider sx={{ width: '100%', my: 2, display: { xs: 'block', md: 'none' } }} />
                  </Grid>
                  
                  {/* Right section - Journey Status */}
                  <Grid item xs={12} md={7} >
                    <Typography variant="h6" gutterBottom>
                      Journey Status
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={4}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Box sx={{ mb: 1 }}>
                            <AssessmentIcon color="primary" />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Assessment
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            <Chip 
                              label={profile ? 'Completed' : 'Not taken'} 
                              color={profile ? 'success' : 'warning'} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                          {!profile && (
                            <Button
                              size="small"
                              variant="text"
                              color="primary"
                              onClick={handleTakeAssessment}
                              sx={{ mt: 1, fontSize: '0.75rem' }}
                            >
                              Take Now
                            </Button>
                          )}
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} sm={4}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Box sx={{ mb: 1 }}>
                            <FlagIcon color="primary" />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Active Goals
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                            {goals.filter(g => !g.is_completed).length}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} sm={4}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Box sx={{ mb: 1 }}>
                            <CheckCircleIcon color="primary" />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Completed
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                            {goals.filter(g => g.is_completed).length}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} sm={4}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Box sx={{ mb: 1 }}>
                            <StarIcon color="primary" />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Experience
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                            {userPoints} pts
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Level {userLevel}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} sm={4}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Box sx={{ mb: 1 }}>
                            <EmojiEventsIcon color="primary" />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Achievements
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                            {userAchievements.length}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Assessment Results Tab */}
        {activeTab === 1 && (
          <Box>
            {!profile ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" gutterBottom>
                  You haven't completed your assessment yet
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Complete the assessment to discover your personality profile and receive tailored goal recommendations.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleTakeAssessment}
                >
                  Take Assessment
                </Button>
              </Box>
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  Your Personality Profile
                </Typography>

                <Typography variant="body1" paragraph>
                  Based on your assessment, we've identified your unique strengths and preferences to help you on your goal journey.
                </Typography>

                <Grid container spacing={3}>
                  {Object.entries(profile)
                    .filter(([key, value]) =>
                      value &&
                      key !== 'id' &&
                      key !== 'user' &&
                      key !== 'created_at' &&
                      key !== 'updated_at'
                    )
                    .map(([key, value]) => {
                      const profileInfo = profileLabels[value] || {
                        label: value,
                        description: 'A key aspect of your personality profile.'
                      };

                      return (
                        <Grid item xs={12} md={6} key={key}>
                          <Card>
                            <CardContent>
                              <Typography color="textSecondary" gutterBottom>
                                {key.replace(/_/g, ' ')
                                  .split(' ')
                                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(' ')}
                              </Typography>
                              <Typography variant="h6" gutterBottom>
                                {profileInfo.label}
                              </Typography>
                              <Divider sx={{ my: 1 }} />
                              <Typography variant="body2">
                                {profileInfo.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                </Grid>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={handleTakeAssessment}
                  >
                    Retake Assessment
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}

        {/* Goals Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Your Goals
            </Typography>

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
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Active Goals
                </Typography>
                <Grid container spacing={2}>
                  {goals
                    .filter(goal => !goal.is_completed)
                    .map(goal => (
                      <Grid item xs={12} key={goal.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                              <Box>
                                <Typography variant="h6">{goal.title}</Typography>
                              </Box>
                              <Chip
                                label={goal.category}
                                color="primary"
                                size="small"
                                sx={{ml:2}}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mt:2 }}>
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
                                sx={{ml:2}}
                                onClick={() => handleDeleteGoal(goal.id)}
                              >
                                Delete
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>

                {goals.some(goal => goal.is_completed) && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                      Completed Goals
                    </Typography >
                    <Grid container spacing={2}> 
                      {goals
                        .filter(goal => goal.is_completed)
                        .map(goal => (
                          <Grid item xs={12} key={goal.id}>
                            <Card variant="outlined">
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Box>
                                    <Typography variant="h6">{goal.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                      {goal.description}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label="Completed"
                                    color="success"
                                    size="small"
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
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
                        ))}
                    </Grid>
                  </>
                )}

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/goals')}
                  >
                    Create New Goal
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}
        
        {/* Achievements Tab */}
        {activeTab === 3 && (
          <Box>
            {achievementsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <UserAchievements 
                achievements={userAchievements} 
                onRefresh={fetchUserAchievements} 
              />
            )}
          </Box>
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
      
      {/* Achievement notification */}
      <AchievementNotification 
        open={showAchievementNotification} 
        onClose={handleCloseAchievementNotification} 
        achievement={achievement}
      />
    </Container>
  );
};

export default UserProfilePage;