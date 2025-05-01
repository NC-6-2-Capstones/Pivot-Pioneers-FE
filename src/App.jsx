import { ChakraProvider, Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';

function App() {
  return (
    <ChakraProvider>
      <Box>
        <Navbar />
        {/* Add routing or content here */}
      </Box>
    </ChakraProvider>
  );
}

export default App
