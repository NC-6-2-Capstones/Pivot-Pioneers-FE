import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

export default function RoadmapDisplay({ steps }) {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Roadmap
      </Typography>
      <List>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemText primary={`Step ${index + 1}`} secondary={step} />
            </ListItem>
            {index < steps.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}