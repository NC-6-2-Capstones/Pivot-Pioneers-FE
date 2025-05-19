import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Box, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { goalService } from '../services/apiService';
import { analyzeGoal } from '../services/geminiService';
import { parseGeminiRoadmap } from '../services/parseGeminiRoadmap';

const GoalAndGeminiPage = ({ goldenQuestion = 'What is your next big goal?' }) => {
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const [goal, setGoal] = useState('');
  const [assessment, setAssessment] = useState({});
  const [category, setCategory] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [readyToSave, setReadyToSave] = useState(false);
  const [parsedPlan, setParsedPlan] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const handleAssessmentChange = (e) => {
    const { name, value } = e.target;
    setAssessment((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleAnalyzeGoal = async () => {
    if (!goal.trim()) return alert('Please describe your goal.');
    if (!category) return alert('Please select a category.');

    try {
      setLoading(true);
      const aiText = await analyzeGoal(goal, assessment);
      const parsed = parseGeminiRoadmap(aiText);

      setAIResponse(aiText);
      setParsedPlan(parsed);
      setReadyToSave(true);
    } catch (err) {
      console.error('AI analysis failed:', err);
      alert('Something went wrong with AI analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async () => {
    try {
      const title = goal.split('\n')[0] || goal.substring(0, 50);
      await goalService.createGoal({
        title,
        description: goal,
        category,
        milestone_start: parsedPlan.milestones?.['Start'] || '',
        milestone_3_months: parsedPlan.milestones?.['3 months'] || '',
        milestone_6_months: parsedPlan.milestones?.['6 months'] || '',
        milestone_9_months: parsedPlan.milestones?.['9 months'] || '',
        milestone_12_months: parsedPlan.milestones?.['12 months'] || '',
        full_plan: parsedPlan.fullPlan || aiResponse,
      });

      setSnackbarOpen(true); 
      navigate('/userProfile', { state: { activeTab: 2, newGoal: true } });
    } catch (err) {
      console.error('Save goal failed:', err);
      alert('Failed to save your goal.');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h6">Loading your profile...</Typography>
      </Container>
    );
  }
  const capitalize = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Welcome {user? capitalize(user.firstName || user.username) : 'Friend'}
          </Typography>

          <Typography align="center" sx={{ mb: 4 }}>
            {goldenQuestion}
          </Typography>

          <TextField
            label="Describe your goal"
            multiline
            minRows={3}
            fullWidth
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="category-label">Select a Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Select a Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="career">Career</MenuItem>
              <MenuItem value="education">Education</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="financial">Financial</MenuItem>
              <MenuItem value="health">Health</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          {!readyToSave ? (
            <Box textAlign="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAnalyzeGoal}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Roadmap'}
              </Button>
            </Box>
          ) : (
            <Box mt={4}>
              <Typography variant="h6">AI-Generated Roadmap:</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
                {aiResponse}
              </Typography>

              <Box textAlign="center" mt={3}>
                <Button variant="contained" color="success" onClick={handleSaveGoal}>
                  Save Goal
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Goal saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GoalAndGeminiPage;
