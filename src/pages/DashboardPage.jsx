// src/pages/DashboardPage.jsx
import { Box, Heading, Text } from '@chakra-ui/react';
import RoadmapDisplay from '../components/RoadmapDisplay';

function DashboardPage() {
  return (
    <Box p={4}>
      <Heading>Dashboard</Heading>
      <Text mt={2}>User info and roadmap will go here.</Text>
      <RoadmapDisplay goalId={1} />
    </Box>
  );
}

export default DashboardPage;