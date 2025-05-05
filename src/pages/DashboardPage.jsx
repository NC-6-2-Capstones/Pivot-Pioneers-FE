// src/pages/DashboardPage.jsx
import { Box, Typography } from '@mui/material';
import QuoteBox from "../components/QuoteBox";
import RoadmapDisplay from "../components/RoadmapDisplay";

function DashboardPage() {
    return (
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          User info and roadmap will go here.
        </Typography>
        <RoadmapDisplay />
        <QuoteBox />
      </Box>
    );
  }
  
  export default DashboardPage;