// src/pages/HomePage.jsx
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';

const HomePage = () => {
  return (
    <Box p={10} textAlign="center">
      <VStack spacing={6}>
        <Heading>Welcome to Pivot Pioneers</Heading>
        <Text fontSize="lg">Empowering justice-impacted individuals to thrive.</Text>
        <Button colorScheme="teal" size="lg">
          Get Started
        </Button>
      </VStack>
    </Box>
  );
};

export default HomePage;