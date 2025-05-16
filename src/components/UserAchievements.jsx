
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  CircularProgress,
  Tooltip
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CategoryIcon from '@mui/icons-material/Category';
import StarsIcon from '@mui/icons-material/Stars';
import gamificationService from '../services/gamificationService';

const iconComponents = {
  'check_circle': CheckCircleIcon,
  'local_fire_department': LocalFireDepartmentIcon,
  'category': CategoryIcon,
  'stars': StarsIcon,
  'emoji_events': EmojiEventsIcon
};

/**
 * Component to display user achievements
 */
const UserAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const achievementsData = await gamificationService.getUserAchievements();
        setAchievements(achievementsData);
      } catch (err) {
        console.error('Error loading achievements:', err);
        setError('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (achievements.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          You haven't earned any achievements yet. Complete goals to unlock achievements!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Achievements
      </Typography>
      
      <Grid container spacing={2}>
        {achievements.map((userAchievement) => {
          const achievement = userAchievement.achievement;
          const IconComponent = iconComponents[achievement.icon] || EmojiEventsIcon;
          const achievedDate = new Date(userAchievement.achieved_at).toLocaleDateString();
          
          return (
            <Grid item xs={12} sm={6} md={4} key={userAchievement.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <IconComponent />
                    </Avatar>
                    <Box>
                      <Tooltip title={`${achievement.points} points`}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {achievement.name}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Achieved on {achievedDate}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default UserAchievements;