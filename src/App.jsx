import { ChakraProvider, Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <ChakraProvider>
      <Box>
        <Navbar />
        <DashboardPage />
      </Box>
    </ChakraProvider>
  );
}

export default App
