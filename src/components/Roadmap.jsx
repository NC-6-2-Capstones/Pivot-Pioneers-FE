import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';

const checkpointPositions = [
  { cx: 60, cy: 220 },
  { cx: 160, cy: 120 },
  { cx: 300, cy: 180 },
  { cx: 440, cy: 80 },
  { cx: 540, cy: 40 },
];

const checkpointLabels = [
  'Start',
  '3 months',
  '6 months',
  '9 months',
  '12 months',
];

const Roadmap = ({ userName, milestones, fullPlan }) => (
  <Container maxWidth="md" sx={{ mt: 8 }}>
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        {userName ? `${userName}'s Roadmap` : 'Roadmap'}
      </Typography>
      <Box sx={{ position: 'relative', width: 600, height: 260, mx: 'auto', my: 4 }}>
        {/* SVG Roadmap Path */}
        <svg width="600" height="260" style={{ position: 'absolute', top: 0, left: 0 }}>
          <path
            d="M60 220 Q120 80 160 120 Q220 200 300 180 Q380 160 440 80 Q500 20 540 40"
            stroke="#1976d2"
            strokeWidth="6"
            fill="none"
          />
          {checkpointPositions.map((pos, idx) => (
            <circle
              key={idx}
              cx={pos.cx}
              cy={pos.cy}
              r={18}
              fill="#fff"
              stroke="#43a047"
              strokeWidth="4"
            />
          ))}
        </svg>
        {/* Checkpoint Labels */}
        {checkpointLabels.map((label, idx) => (
          <Box
            key={idx}
            sx={{
              position: 'absolute',
              left: checkpointPositions[idx].cx - 60,
              top: checkpointPositions[idx].cy + 25,
              width: 120,
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {idx + 1}. {label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {milestones && milestones[label]}
            </Typography>
          </Box>
        ))}
      </Box>
      {fullPlan && (
        <Box sx={{ mt: 6, textAlign: 'left', maxWidth: 700, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>Comprehensive Plan</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {fullPlan}
          </Typography>
        </Box>
      )}
    </Paper>
  </Container>
);

export default Roadmap; 