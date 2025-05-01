import { ChakraProvider, Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';

function App() {
  return (
    <ChakraProvider>
      <Box>
        <Navbar />
        <HomePage />
      </Box>
    </ChakraProvider>
  );
}

export default App
