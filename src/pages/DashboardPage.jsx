import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* card 1 */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Your Goals</Typography>
            <Typography variant="body2">Track and update your goals here.</Typography>
          </Paper>
        </Grid>

        {/* card 2 */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Progress Overview</Typography>
            <Typography variant="body2">Check your progress metrics.</Typography>
          </Paper>
        </Grid>

        {/*  card 3 */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Resources</Typography>
            <Typography variant="body2">Access helpful tools and content.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

