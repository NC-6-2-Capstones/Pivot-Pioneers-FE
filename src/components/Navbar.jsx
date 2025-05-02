import { Box, Flex, Heading, Spacer, Button } from '@chakra-ui/react';

const Navbar = () => {
  return (
    <Box bg="blue.600" px={6} py={4} color="white">
      <Flex align="center">
        <Heading size="md">Pivot Pioneers</Heading>
        <Spacer />
        <Button colorScheme="teal" variant="outline">
          Login
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar;