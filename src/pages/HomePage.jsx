import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import AltRouteOutlinedIcon from '@mui/icons-material/AltRouteOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';




const HomePage = () => {
  const { isAuthenticated } = useAuth();
  return (
    // <div>
    <Box sx={{ p: 0, m: 0 }}>

      {/* Hero Section with Background Image */}
      <Box
        sx={{
          py: 12,
          backgroundImage: 'url(/public/images/setting_sun.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // dark overlay for text readability
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="md" >
          <Typography variant="h2" gutterBottom>
            Welcome to the Golden Roadmap
          </Typography>
          <Typography variant="h6" paragraph>
            A path to transformation, empowerment, and new beginnings for justice-impacted individuals ready to reclaim their future.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            component={Link}
            to={isAuthenticated ? "/goals" : "/register"}
          >
            Start Your Journey
          </Button>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>About the Golden Roadmap</Typography>
          <Typography color="text.secondary">
            If you've faced challenges within the justice system or are navigating life after incarceration, this roadmap helps you rebuild, rediscover, and rise above.
            With practical tools, motivational guidance, and a clear framework, the Golden Roadmap helps you take control of your future, step by step.
          </Typography>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ bgcolor: '#D9CAB3', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>Our Services</Typography>
          <Grid container spacing={3} justifyContent={"center"}>
            {[
              { title: 'Goal Setting', desc: 'Define what success means to you and set your vision in motion.', icon: <TrackChangesOutlinedIcon fontSize="large" /> },
              { title: 'Custom Roadmaps', desc: 'Personalized steps at 3, 6, 9 months to help you stay on track.', icon: <AltRouteOutlinedIcon fontSize="large" /> },
              { title: 'Resources Hub', desc: 'Access videos, articles, and tools tailored to your journey.', icon: <MenuBookOutlinedIcon fontSize="large" /> }
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyCOntent: 'center',
                    width: '333px',
                    textAlign: 'center'
                  }}>
                  <Box sx={{ mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography color="text.secondary">{item.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>Features</Typography>
          <Grid container spacing={4} justifyContent="center" textAlign="center">
            {[
              'Justice-informed design',
              'Milestone tracking and check-ins',
              'Inspiration and motivational quotes',
              'Simple, mobile-friendly design',
            ].map((feature, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Typography variant="body1">✅ {feature}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.main', py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom color="white">
            Ready to define your path?
          </Typography>
          <Typography variant="body1" color="white" paragraph>
            Get started today by sharing your goal and letting us build your personalized Golden Roadmap.
          </Typography>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to={isAuthenticated ? "/goals" : "/register"}
            sx={{ borderColor: 'white', color: 'white' }}
          >
            Start Now</Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#212121', py: 4, color: '#fff', textAlign: 'center' }}>
        <Typography variant="body2">© {new Date().getFullYear()} Golden Roadmap. All rights reserved.</Typography>
      </Box>

      {/* </div> */}
      </Box>
  );
};

export default HomePage;
