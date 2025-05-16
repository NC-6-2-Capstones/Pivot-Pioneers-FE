
import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Box, 
  Avatar, 
  Button 
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CategoryIcon from '@mui/icons-material/Category';
import StarsIcon from '@mui/icons-material/Stars';

const iconComponents = {
  'check_circle': CheckCircleIcon,
  'local_fire_department': LocalFireDepartmentIcon,
  'category': CategoryIcon,
  'stars': StarsIcon,
  'emoji_events': EmojiEventsIcon
};

/**
 * Component to display achievement unlocked notification
 */
const AchievementNotification = ({ 
  open, 
  onClose, 
  achievement 
}) => {
  if (!achievement) return null;

  const IconComponent = iconComponents[achievement.icon] || EmojiEventsIcon;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        pb: 0,
        bgcolor: 'primary.dark',
        color: 'white'
      }}>
        <Typography variant="h5">
          Achievement Unlocked! 🎉
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ 
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar sx={{ 
          width: 80, 
          height: 80,
          bgcolor: 'primary.main',
          mb: 2
        }}>
          <IconComponent fontSize="large" />
        </Avatar>
        
        <Typography variant="h6" fontWeight="bold" align="center">
          {achievement.name}
        </Typography>
        
        <Typography variant="body1" align="center">
          {achievement.description}
        </Typography>
        
        <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
          +{achievement.points} Points!
        </Typography>
        
        <Button 
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          Awesome!
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementNotification;