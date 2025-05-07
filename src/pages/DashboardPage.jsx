import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';


const DashboardPage = ({ goldenQuestion = 'What is your next big goal?' }) => {
  const { user } = useUser();
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleNextClick = () => {
    console.log('Next button clicked. Selected category:', category);
    navigate('/goal-form', { state: { category } });
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
            onClick={handleNextClick}
          >
            Next
          </Button>
        </Box>
      </Paper>
    </Container>  
  );
};

export default DashboardPage;
