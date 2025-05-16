
import api from './apiService';

/**
 * Service for handling gamification features like points, levels, and achievements
 */
const gamificationService = {
  /**
   * Get user points and level from the backend
   * @returns {Promise<Object>} User points data
   */
  getUserPoints: async () => {
    try {
      const response = await api.get('/api/gamification/points/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user points:', error);
      
      // Fallback to localStorage if API fails
      return { 
        total_points: localStorage.getItem('userPoints') ? parseInt(localStorage.getItem('userPoints')) : 0, 
        level: localStorage.getItem('userLevel') ? parseInt(localStorage.getItem('userLevel')) : 1, 
        goals_completed: localStorage.getItem('goalsCompleted') ? parseInt(localStorage.getItem('goalsCompleted')) : 0 
      };
    }
  },
  
  /**
   * Get user achievements from the backend
   * @returns {Promise<Array>} User achievements
   */
  getUserAchievements: async () => {
    try {
      const response = await api.get('/api/gamification/achievements/');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  },
  
  /**
   * Add points for a completed goal using the backend API
   * @param {Object} goalData - The goal data
   * @returns {Promise<Object>} Updated points data
   */
  addPointsForGoal: async (goalData) => {
    try {
      const response = await api.post('/api/gamification/add-points/', {
        goal_id: goalData.id,
        category: goalData.category
      });
      
      // Store in localStorage as backup
      localStorage.setItem('userPoints', response.data.total_points);
      localStorage.setItem('userLevel', response.data.level);
      localStorage.setItem('goalsCompleted', response.data.goals_completed);
      
      return response.data;
    } catch (error) {
      console.error('Error adding points:', error);
      
      // Fallback to local calculation if API fails
      const pointsEarned = gamificationService.calculatePoints(goalData.category);
      const currentPoints = localStorage.getItem('userPoints') ? parseInt(localStorage.getItem('userPoints')) : 0;
      const newPoints = currentPoints + pointsEarned;
      const newLevel = gamificationService.calculateLevel(newPoints);
      const goalsCompleted = localStorage.getItem('goalsCompleted') ? parseInt(localStorage.getItem('goalsCompleted')) : 0;
      
      localStorage.setItem('userPoints', newPoints);
      localStorage.setItem('userLevel', newLevel);
      localStorage.setItem('goalsCompleted', goalsCompleted + 1);
      
      return {
        total_points: newPoints,
        level: newLevel,
        points_earned: pointsEarned,
        goals_completed: goalsCompleted + 1,
        level_up: false 
      };
    }
  },
  
  /**
   * Check for new achievements using the backend API
   * @returns {Promise<Array>} Any new achievements
   */
  checkNewAchievements: async () => {
    try {
      const response = await api.get('/api/gamification/check-achievements/');
      return response.data.new_achievements || [];
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  },
  
  /**
   * Calculate level based on points (fallback if API fails)
   * @param {number} points - Total points
   * @returns {number} User level
   */
  calculateLevel: (points) => {
    if (points < 100) return 1;
    if (points < 300) return 2;
    if (points < 600) return 3;
    if (points < 1000) return 4;
    if (points < 1500) return 5;
    if (points < 2500) return 6;
    if (points < 4000) return 7;
    if (points < 6000) return 8;
    if (points < 9000) return 9;
    return 10;
  },
  
  /**
   * Calculate points based on goal category (fallback if API fails)
   * @param {string} category - Goal category
   * @returns {number} Points value
   */
  calculatePoints: (category) => {
    const categoryPoints = {
      career: 100,
      education: 100,
      personal: 75,
      financial: 125,
      health: 100,
      other: 50
    };
    
    return categoryPoints[category?.toLowerCase()] || 50;
  },
  
  /**
   * Get motivational message based on completed goals count
   * @param {number} completedCount - Number of completed goals
   * @returns {string} Motivational message
   */
  getMotivationalMessage: (completedCount) => {
    const messages = [
      "Great job! You're making progress!",
      "Keep up the momentum! You're doing great!",
      "You're crushing it! One goal at a time!",
      "Success comes from consistent effort. Well done!",
      "You're building powerful habits. Keep going!",
      "Each completed goal gets you closer to your dreams!",
      "You're unstoppable! What goal is next?",
      "The journey of a thousand miles begins with a single step. That was a great step!"
    ];
    
    // Use completed count as an index or pick randomly if out of bounds
    const index = completedCount % messages.length;
    return messages[index];
  },
  
  /**
   * Get achievement icon name based on achievement type
   * For use with Material-UI icons
   * @param {string} type - Achievement type
   * @returns {string} Icon name
   */
  getAchievementIcon: (type) => {
    const iconMap = {
      'completion': 'check_circle',
      'streak': 'local_fire_department',
      'category': 'category',
      'special': 'stars'
    };
    
    return iconMap[type] || 'emoji_events';
  }
};

export default gamificationService;