import React from 'react';
import { Container, Paper, Avatar, Typography, Box, Divider, List, ListItem, ListItemText } from '@mui/material';

// Mock user and assessment data
const user = {
  name: 'Tetsu',
  email: 'tetsu@email.com',
  bio: 'Aspiring developer and lifelong learner.',
  profilePic: 'https://i.pravatar.cc/100?u=tetsu',
};

const assessments = [
  { id: 1, title: 'Assessment 1', result: 'Passed' },
  { id: 2, title: 'Assessment 2', result: 'Needs Improvement' },
  { id: 3, title: 'Assessment 3', result: 'Passed' },
];

const UserProfile = () => (
  <Container maxWidth="sm" sx={{ mt: 8 }}>
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <Avatar src={user.profilePic} alt={user.name} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />
      <Typography variant="h5" gutterBottom>{user.name}</Typography>
      <Typography variant="body1" color="text.secondary">{user.email}</Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>{user.bio}</Typography>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>Assessment Results</Typography>
      <List>
        {assessments.map(a => (
          <ListItem key={a.id} divider>
            <ListItemText primary={a.title} secondary={a.result} />
          </ListItem>
        ))}
      </List>
    </Paper>
  </Container>
);

export default UserProfile; 