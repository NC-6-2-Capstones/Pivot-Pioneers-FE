import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Divider } from '@mui/material';

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

const Roadmap = ({ userName, milestones, fullPlan, assessmentTraits = {} }) => {
  const [activePhase, setActivePhase] = useState(0);
  
  // Capitalize first letter of userName
  const capitalizedName = userName && userName.charAt(0).toUpperCase() + userName.slice(1);
  
  // Split the full plan into separate phases
  const phases = fullPlan.split('**Phase').filter(p => p.trim() !== '').map(p => `**Phase${p}`);
  
  // Extract assessment traits
  const {
    problem_solving = '',
    strengths = '',
    daily_motivation = '',
    environment_preference = '',
    goal_motivation = '',
    time_structure = '',
    core_belief = '',
    progress_block = '',
    obstacle_type = '',
    project_style = '',
    success_definition = '',
    future_focus = '',
    support_type = '',
    change_response = '',
    goal_energy = ''
  } = assessmentTraits;
  
  // More detailed phase-specific summaries
  const getPhaseDescriptions = () => {
    return {
      'Start': 'Break down your large goal into manageable chunks with clear milestones.',
      '3 months': 'Celebrate reaching your first significant milestone and recalibrate.',
      '6 months': 'Re-evaluate your milestone breakdown and adjust as needed.',
      '9 months': 'Focus on your next milestone achievement with renewed energy.',
      '12 months': 'Celebrate the meaningful impact you\'ve achieved and set new horizons.'
    };
  };
  
  // Personalized summaries based on assessment traits
  const getSummaries = () => {
    // Base summaries from phase descriptions
    const phaseDescriptions = getPhaseDescriptions();
    const defaultSummaries = {...phaseDescriptions};
    
    // Personalization based on assessment
    if (problem_solving.includes('creative') || environment_preference.includes('creative_flex')) {
      defaultSummaries['Start'] = 'Design a flexible plan that allows for creative exploration.';
      defaultSummaries['3 months'] = 'Experiment with different approaches to find what works best for you.';
    }
    
    if (strengths.includes('disciplined')) {
      defaultSummaries['Start'] = 'Create a structured routine with clear expectations.';
      defaultSummaries['3 months'] = 'Maintain consistency through disciplined adherence to your plan.';
    }
    
    if (daily_motivation.includes('impact') || success_definition.includes('impact')) {
      defaultSummaries['6 months'] = 'Evaluate the impact of your progress and refine for maximum effect.';
      defaultSummaries['12 months'] = 'Celebrate the meaningful impact you\'ve achieved and set new horizons.';
    }
    
    if (time_structure.includes('flexibility')) {
      defaultSummaries['Start'] = 'Build a flexible framework that adapts to your changing schedule.';
      defaultSummaries['9 months'] = 'Fine-tune your adaptable routine for long-term sustainability.';
    }
    
    if (progress_block.includes('structure_needed')) {
      defaultSummaries['Start'] = 'Implement strong structural elements with clear checkpoints.';
      defaultSummaries['3 months'] = 'Review and reinforce your structured approach for consistency.';
    }
    
    if (obstacle_type.includes('distractions')) {
      defaultSummaries['Start'] = 'Create a distraction-free environment and accountability systems.';
      defaultSummaries['3 months'] = 'Evaluate and minimize distractions that have affected your progress.';
    }
    
    if (project_style.includes('break_down')) {
      defaultSummaries['Start'] = 'Break down your large goal into manageable chunks with clear milestones.';
      defaultSummaries['6 months'] = 'Re-evaluate your milestone breakdown and adjust as needed.';
    }
    
    if (future_focus.includes('milestones')) {
      defaultSummaries['3 months'] = 'Celebrate reaching your first significant milestone and recalibrate.';
      defaultSummaries['9 months'] = 'Focus on your next milestone achievement with renewed energy.';
    }
    
    return defaultSummaries;
  };
  
  const summaries = getSummaries();
  
  // Personalized guidance based on assessment traits
  const getPersonalizedGuidance = () => {
    const traits = [];
    let guidance = '';
    
    // Check for creative traits
    if (problem_solving.includes('creative') || environment_preference.includes('creative_flex')) {
      traits.push('creative');
      guidance += 'As a creative type, you\'ll benefit from flexible routines and varied activities to maintain engagement. ';
    }
    
    // Check for analytical traits
    if (problem_solving.includes('analytical') || core_belief.includes('curiosity')) {
      traits.push('analytical');
      guidance += 'With your analytical mindset and curiosity, tracking metrics and exploring the "why" behind your actions will help you stay motivated. ';
    }
    
    // Check for disciplined traits
    if (strengths.includes('disciplined')) {
      traits.push('disciplined');
      guidance += 'Your disciplined approach will help you establish and maintain consistent habits throughout this journey. ';
    }
    
    // Check for impact-driven motivation
    if (daily_motivation.includes('impact') || success_definition.includes('impact') || goal_motivation.includes('values')) {
      traits.push('impact-driven');
      guidance += 'Since you\'re driven by making an impact and living your values, focus on how each step contributes to your larger purpose. ';
    }
    
    // Check for structure needs
    if (progress_block.includes('structure_needed')) {
      traits.push('structure-needing');
      guidance += 'You thrive with clear structure, so maintaining organized routines and checkpoints will be essential for your success. ';
    }
    
    // Check for distraction challenges
    if (obstacle_type.includes('distractions')) {
      traits.push('distraction-prone');
      guidance += 'Being aware of potential distractions will help you create environments that support your focus and progress. ';
    }
    
    return guidance || 'This roadmap is personalized based on your assessment results to help you achieve your goals effectively.';
  };

  const getPhaseNumber = () => {
    return activePhase + 1;
  };

  const getPhaseTitle = () => {
    return `Phase ${getPhaseNumber()}: ${checkpointLabels[activePhase]}`;
  };

  const getPhaseSummary = () => {
    // Get a concise one-sentence summary of the current phase
    const phaseSummaries = {
      0: "Set your foundation by establishing clear goals and creating your initial action plan.",
      1: "Build momentum by implementing consistent routines and celebrating early wins.",
      2: "Refine your approach based on what's working and adjust strategies as needed.",
      3: "Accelerate your progress by leveraging your strengths and addressing any obstacles.",
      4: "Solidify your achievements and establish sustainable practices for long-term success."
    };
    
    return phaseSummaries[activePhase] || "";
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {capitalizedName ? `${capitalizedName}'s Roadmap` : 'Roadmap'}
        </Typography>
        
        {Object.keys(assessmentTraits).length > 0 && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            {getPersonalizedGuidance()}
          </Typography>
        )}
        
        <Box sx={{ position: 'relative', width: 600, height: 420, mx: 'auto', my: 4 }}>
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
                fill={activePhase === idx ? "#fff8e1" : "#fff"}
                stroke={activePhase === idx ? "#ffc107" : "#43a047"}
                strokeWidth="4"
                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={() => setActivePhase(idx)}
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
                top: checkpointPositions[idx].cy + 35,
                width: 120,
                textAlign: 'center',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                {idx + 1}. {label}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mt: 2, 
                  lineHeight: 1.4,
                  padding: '0 8px'
                }}
              >
                {summaries[label] || milestones[label]}
              </Typography>
            </Box>
          ))}
        </Box>
        
        {fullPlan && (
          <Box sx={{ mt: 10, textAlign: 'left', maxWidth: 700, mx: 'auto', minHeight: '220px', p: 2, pt: 4, backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              {getPhaseTitle()}
            </Typography>
            
            <Typography variant="subtitle1" color="primary.main" sx={{ mb: 3, fontStyle: 'italic' }}>
              {getPhaseSummary()}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
              {phases[activePhase] || phases[0] || fullPlan}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Roadmap; 