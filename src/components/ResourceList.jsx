import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, CircularProgress, Link, Alert } from '@mui/material';
import axios from 'axios';

/**
 * ResourceList
 * 
 * Fetches and displays a list of external resources.
 */
export default function ResourceList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/resources/')
      .then((response) => setResources(response.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load resources.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 6, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Resources
      </Typography>
      <List>
        {resources.map((r) => (
          <ListItem key={r.id}>
            <Link href={r.url} target="_blank" rel="noopener" color="primary">
              {r.title}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
