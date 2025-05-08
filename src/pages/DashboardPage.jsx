import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { assessmentService } from '../services/apiService';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';

const DashboardPage = ({ goldenQuestion = 'What is your next big goal?' }) => {
  const { user } = useUser();
  const { isAuthenticated } = useAuth();
  const [category, setCategory] = useState('');
  const [goalText, setGoalText] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();

  // Check if user has completed the assessment
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      assessmentService.getProfile()
        .then(() => {
          setHasProfile(true);
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            setHasProfile(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  const handleSaveGoal = () => {
    if (!goalText.trim()) {
      alert("Please enter your goal");
      return;
    }
    
    if (!category) {
      alert("Please select a category");
      return;
    }
    
    // If user hasn't completed assessment, direct them there
    if (!hasProfile) {
      navigate('/assessment', { 
        state: { 
          goalData: { 
            title: goalText, 
            category 
          },
          returnTo: '/goal-form'
        } 
      });
    } else {
      // If they've already done the assessment, proceed to goal form
      navigate('/goal-form', { 
        state: { 
          goalData: { 
            title: goalText, 
            category 
          } 
        } 
      });
    }
  };

  const handleStartAssessment = () => {
    navigate('/assessment');
  };

  const handleChange = (event) => {
    setCategory(event.target.value);
  };
  
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h6">Loading your dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Welcome {user?.firstName || user?.username || 'Friend'}
        </Typography>

        <Box mt={4}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Golden Question
          </Typography>
          <Typography variant="body1">
            {goldenQuestion}
          </Typography>
        </Box>

        <Box mt={4}>
          <TextField
            fullWidth
            label="Your Goal"
            variant="outlined"
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            multiline
            rows={2}
            placeholder="Describe your goal here..."
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth>
            <InputLabel id="category-select-label">Select a Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={category}
              label="Select a Category"
              onChange={handleChange}
            >
              <MenuItem value="career">Career</MenuItem>
              <MenuItem value="education">Education</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="financial">Financial</MenuItem>
              <MenuItem value="health">Health</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box mt={6} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSaveGoal}
          >
            Save Goal
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        ) : !hasProfile ? (
          <Box mt={2}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Complete your personalized assessment to get a customized roadmap for your goals!
            </Alert>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleStartAssessment}
            >
              Take Assessment
            </Button>
          </Box>
        ) : (
          <Box mt={2}>
            <Alert severity="success" sx={{ mb: 2 }}>
              You've completed your assessment. Your goals will be personalized based on your profile.
            </Alert>
          </Box>
        )}
      </Paper>
    </Container>  
  );
};

export default DashboardPage;