import React, { useEffect, useState } from 'react';
import { Box, Heading, List, ListItem, Spinner, Link, Alert, AlertIcon } from '@chakra-ui/react';
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
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load resources.
      </Alert>
    );
  }

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
      <Heading as="h2" size="lg" mb={4}>
        Resources
      </Heading>
      <List spacing={3}>
        {resources.map((r) => (
          <ListItem key={r.id}>
            <Link href={r.url} isExternal color="teal.500">
              {r.title}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
