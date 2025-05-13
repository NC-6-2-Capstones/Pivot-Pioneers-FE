import React, { useState, useEffect } from 'react';
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
  Avatar,
  Tab,
  Tabs
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FlagIcon from '@mui/icons-material/Flag';
import { useAuth } from '../contexts/AuthContext';
import { assessmentService, profileService, goalService } from '../services/apiService';

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

// Simplified list for brevity - you can expand this with all profile attributes

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
  }, [isAuthenticated, navigate]);

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTakeAssessment = () => {
    navigate('/assessment');
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
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

        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab icon={<PersonIcon />} label="PROFILE" />
          <Tab icon={<AssessmentIcon />} label="ASSESSMENT RESULTS" />
          <Tab icon={<FlagIcon />} label="GOALS" />
        </Tabs>

        {/* Profile Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Personal Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Account Details
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText primary="Username" secondary={user?.username || 'Not set'} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Email" secondary={user?.email || 'Not set'} />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Journey Status
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Assessment" 
                          secondary={profile ? 'Completed' : 'Not yet taken'} 
                        />
                        {!profile && (
                          <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={handleTakeAssessment}
                          >
                            Take Now
                          </Button>
                        )}
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Active Goals" 
                          secondary={`${goals.filter(g => !g.is_completed).length} goals in progress`} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Completed Goals" 
                          secondary={`${goals.filter(g => g.is_completed).length} goals completed`} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box>
                                <Typography variant="h6">{goal.title}</Typography>
                                <Typography variant="body2" color="textSecondary" paragraph>
                                  {goal.description}
                                </Typography>
                              </Box>
                              <Chip 
                                label={goal.category} 
                                color="primary" 
                                size="small"
                              />
                            </Box>
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => navigate(`/goals/${goal.id}`)}
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
                
                {goals.some(goal => goal.is_completed) && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                      Completed Goals
                    </Typography>
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
      </Paper>
    </Container>
  );
};

export default UserProfilePage;