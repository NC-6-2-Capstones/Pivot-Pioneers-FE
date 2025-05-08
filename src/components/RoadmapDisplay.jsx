import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { goalService } from '../services/apiService';

const RoadmapDisplay = ({ goalId }) => {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await goalService.getRoadmap(goalId);
        setRoadmap(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Failed to load roadmap');
      } finally {
        setLoading(false);
      }
    };
    if (goalId) fetchRoadmap();
  }, [goalId]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
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

  if (!roadmap.length) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>No roadmap data available.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Roadmap
      </Typography>
      <List>
        {roadmap.map((step, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={step.title || `Step ${index + 1}`}
              secondary={step.description || JSON.stringify(step)}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default RoadmapDisplay; 