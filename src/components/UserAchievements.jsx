import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  CircularProgress,
  Tooltip,
  Button
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CategoryIcon from '@mui/icons-material/Category';
import StarsIcon from '@mui/icons-material/Stars';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import gamificationService from '../services/gamificationService';

const iconComponents = {
  'check_circle': CheckCircleIcon,
  'local_fire_department': LocalFireDepartmentIcon,
  'category': CategoryIcon,
  'stars': StarsIcon,
  'emoji_events': EmojiEventsIcon,
  'military_tech': EmojiEventsIcon
};

/**
 * Component to display user achievements
 * 
 * @param {Array} achievements - Optional array of achievement objects to display
 * @param {Function} onRefresh - Optional callback to refresh achievements
 */
const UserAchievements = ({ achievements = null, onRefresh = null }) => {
  const [localAchievements, setLocalAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // If achievements are provided as props, use those
    if (achievements !== null) {
      setLocalAchievements(achievements);
      setLoading(false);
      return;
    }

    // Otherwise fetch them directly (backwards compatibility)
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const achievementsData = await gamificationService.getUserAchievements();
        setLocalAchievements(achievementsData);
      } catch (err) {
        console.error('Error loading achievements:', err);
        setError('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [achievements]);

  // Handle manual refresh
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Legacy refresh if onRefresh not provided
      setLoading(true);
      gamificationService.getUserAchievements()
        .then(data => {
          setLocalAchievements(data);
        })
        .catch(err => {
          console.error('Error refreshing achievements:', err);
          setError('Failed to refresh achievements');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

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
        <Button 
          startIcon={<SettingsBackupRestoreIcon />} 
          onClick={handleRefresh}
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  if (!localAchievements || localAchievements.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          You haven't earned any achievements yet. Complete goals to unlock achievements!
        </Typography>
        <Button 
          startIcon={<SettingsBackupRestoreIcon />} 
          onClick={handleRefresh}
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
        >
          Refresh
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Your Achievements
        </Typography>
        <Button 
          startIcon={<SettingsBackupRestoreIcon />} 
          onClick={handleRefresh}
          size="small"
        >
          Refresh
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {localAchievements.map((userAchievement) => {
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