
import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';

// Color mapping for different levels
const levelColors = {
  1: '#6c757d', // Gray
  2: '#28a745', // Green
  3: '#17a2b8', // Teal
  4: '#dc3545', // Red
  5: '#ffc107', // Gold
  6: '#7209b7', // Purple
  7: '#3a0ca3', // Royal Blue
  8: '#f72585', // Pink
  9: '#4361ee', // Blue
  10: '#4cc9f0', // Cyan
};

// Names for different levels
const levelNames = {
  1: 'Beginner',
  2: 'Explorer',
  3: 'Achiever',
  4: 'Master',
  5: 'Champion',
  6: 'Conqueror',
  7: 'Visionary',
  8: 'Legend',
  9: 'Guru',
  10: 'Enlightened',
};

/**
 * A circular badge showing the user's level
 * 
 * @param {number} level - User's current level
 * @param {number} points - User's total points
 * @param {string} size - Badge size: 'small', 'medium', or 'large'
 */
const UserLevelBadge = ({ level, points, size = 'medium' }) => {
  // Size configurations
  const sizes = {
    small: { outer: 30, inner: 24, fontSize: '0.7rem', iconSize: '0.9rem' },
    medium: { outer: 50, inner: 40, fontSize: '1rem', iconSize: '1.3rem' },
    large: { outer: 70, inner: 56, fontSize: '1.4rem', iconSize: '1.8rem' },
  };
  
  const { outer, inner, fontSize, iconSize } = sizes[size] || sizes.medium;
  
  // Clamp level between 1-10
  const actualLevel = Math.min(Math.max(1, level || 1), 10);
  const badgeColor = levelColors[actualLevel] || levelColors[1];
  const levelName = levelNames[actualLevel] || 'Beginner';
  
  return (
    <Tooltip 
      title={
        <Box>
          <Typography variant="subtitle2">{levelName}</Typography>
          <Typography variant="body2">{points || 0} total points</Typography>
        </Box>
      } 
      arrow
    >
      <Box 
        sx={{
          position: 'relative',
          width: outer,
          height: outer,
          borderRadius: '50%',
          backgroundColor: badgeColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        }}
      >
        <Box 
          sx={{
            width: inner,
            height: inner,
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: badgeColor,
            fontWeight: 'bold',
            fontSize: fontSize,
          }}
        >
          {actualLevel}
        </Box>
      </Box>
    </Tooltip>
  );
};

export default UserLevelBadge;