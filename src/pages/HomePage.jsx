import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import AltRouteOutlinedIcon from '@mui/icons-material/AltRouteOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';




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
            Welcome to <br></br><strong>The Golden Roadmap</strong>
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
          <Typography variant="h4" align="center" gutterBottom><strong>About the Golden Roadmap</strong></Typography>
          <Typography paragraph align="center">
            <strong><em>The Golden Roadmap</em></strong> is a transformational tool built for individuals rebuilding their lives after incarceration.<br></br>
            Whether you’re just starting over or taking your next big step, this app helps you move forward with clarity, confidence, and purpose.
          </Typography>

          <Typography paragraph align="center">
            Created by people who understand the complexities of reentry, <strong>The Golden Roadmap</strong> blends human-centered guidance with the power of AI
            to deliver a <strong>personalized plan</strong> designed to support your growth and accountability.
          </Typography>

          <Typography paragraph align="center">
            It starts with your <strong><em>Golden Question</em></strong> — your “why.” From there, the app creates a custom roadmap tailored to your unique goals,
            with clear milestones at <strong>3, 6, 9, and 12 months</strong>. You'll gain access to practical tools, step-by-step planning, and motivational check-ins
            to help you stay on track.
          </Typography>

          <Typography paragraph align="center">
            What makes <strong>The Golden Roadmap</strong> unique? It’s built specifically for people like you — resilient, determined, and ready for something more.
            This isn’t just an app. It’s your partner in change, one powerful step at a time.
          </Typography>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ bgcolor: '#D9CAB3', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>Our Services</Typography>
          <Grid container spacing={3} justifyContent={"center"}>
            {[
              { title: 'Goal Setting', desc: 'Define what success means to you and set your vision in motion with clarity, confidence, and purpose-driven steps that align with your personal goals.', icon: <TrackChangesOutlinedIcon fontSize="large" /> },
              { title: 'Custom Roadmaps', desc: 'Personalized steps at 3, 6, and 9 months tailored to your journey — so you can stay on track and celebrate progress at every stage.', icon: <AltRouteOutlinedIcon fontSize="large" /> },
              { title: 'Accountability', desc: 'Stay motivated with built-in check-ins, reminders, and uplifting prompts designed to keep you moving forward — even when life gets hard.', icon: <HandshakeOutlinedIcon fontSize="large" /> }
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
    <Typography variant="h4" align="center" gutterBottom>
      Features
    </Typography>
    <Grid container spacing={4} justifyContent="center" textAlign="center">
      {[
        'Justice-Informed Design',
        'Progress You Can See',
        'Motivation That Moves You',
        'Clean, focused interface',
      ].map((feature, i) => (
        <Grid item xs={12} md={6} key={i}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: 1,
              textAlign: 'left',
            }}>
            <CheckCircleOutlineIcon color="primary" />
            <Typography variant="subtitle1">{feature}</Typography>
          </Box>
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
