import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography, Box, Container, Card, Divider } from '@mui/material';

// Basic styled components
const RoadmapWrapper = styled.div`
  margin: 50px auto;
  max-width: 1100px;
  padding: 0 20px;
  font-family: 'Nunito', 'Segoe UI', Roboto, Arial, sans-serif;
  
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const RoadmapTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #d4af37;
  text-align: center;
  margin-bottom: 1.5rem;
  font-family: 'Montserrat', 'Segoe UI', Roboto, sans-serif;
`;

const PersonalizedIntro = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
  text-align: center;
  margin: 0 auto 40px;
  max-width: 800px;
  font-family: 'Nunito', 'Segoe UI', Roboto, sans-serif;
`;

const TimelineContainer = styled.div`
  position: relative;
  padding: 40px 0 20px;
  margin-bottom: 70px;
`;

const PathSegment = styled.div`
  position: absolute;
  top: 100px;
  height: 4px;
  background: ${props => props.$isActive 
    ? 'linear-gradient(90deg, #4caf50, #2e7d32)' 
    : 'linear-gradient(90deg, #bdbdbd, #e0e0e0)'};
  border-radius: 4px;
  z-index: 0;
  width: ${props => props.$width || '20%'};
  left: ${props => props.$left || '0'};
  transition: background 0.4s ease;
  opacity: 0.8;
`;

const MilestonesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 20px;
  margin-bottom: 60px;
`;

const Milestone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 160px;
  transform: translateY(${props => props.$offset || 0}px);
  cursor: pointer;
  z-index: 1;
`;

const MilestoneDot = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.$isActive ? '#d4af37' : '#ffffff'};
  border: 4px solid ${props => props.$isActive ? '#b8860b' : '#4caf50'};
  margin-bottom: 15px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
`;

const MilestoneLabel = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 12px;
  text-align: center;
  color: #d4af37;
  font-family: 'Nunito', 'Segoe UI', Roboto, sans-serif;
`;

const MilestoneDesc = styled.div`
  font-size: 0.9rem;
  line-height: 1.4;
  text-align: center;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 80px;
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-family: 'Nunito', 'Segoe UI', Roboto, sans-serif;
  position: relative;
  margin-top: 5px;
`;

const PhaseDetailCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-top: 60px;
  border-top: 6px solid #4caf50;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const PhaseTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #d4af37;
  margin-bottom: 15px;
  font-family: 'Montserrat', 'Segoe UI', Roboto, sans-serif;
`;

const PhaseSummary = styled.p`
  font-size: 1.1rem;
  color: #4caf50;
  font-style: italic;
  margin-bottom: 25px;
  font-family: 'Nunito', 'Segoe UI', Roboto, sans-serif;
  padding: 10px 15px;
  background-color: #f0f8f0;
  border-radius: 8px;
`;

const PhaseContent = styled.div`
  font-size: 1.05rem;
  line-height: 1.8;
  color: #444;
  font-family: 'Nunito', 'Segoe UI', Roboto, sans-serif;
  
  .section {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .section-title {
    font-weight: 700;
    font-size: 1.2rem;
    color: #d4af37;
    margin-bottom: 15px;
    font-family: 'Montserrat', 'Segoe UI', Roboto, sans-serif;
    display: block;
    padding: 8px 12px;
    background: #e8f5e9;
    border-radius: 6px;
  }
  
  .category-label {
    font-weight: 700;
    color: #d4af37;
    display: inline-block;
    margin-right: 8px;
  }
  
  .content-block {
    margin-bottom: 20px;
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    
    @media (max-width: 768px) {
      padding: 15px;
    }
  }
  
  .item-block {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px dashed #e0e0e0;
  }
  
  .item-block:last-child {
    border-bottom: none;
  }
  
  .description {
    display: block;
    margin-top: 6px;
    font-style: italic;
    color: #666;
  }
  
  p {
    margin-bottom: 16px;
    letter-spacing: 0.01em;
  }
  
  b, strong {
    font-weight: 700;
    color: #333;
  }
  
  i, em {
    color: #555;
  }
  
  /* Color coding for different types of content */
  .goal-section {
    background-color: #e8f5e9;
    border-left: 4px solid #4caf50;
    padding-left: 15px;
    border-radius: 0 6px 6px 0;
    margin-bottom: 15px;
  }
  
  .action-section {
    background-color: #e8f5e9;
    border-left: 4px solid #2e7d32;
    padding-left: 15px;
    border-radius: 0 6px 6px 0;
    margin-bottom: 15px;
  }
  
  .tools-section {
    background-color: #e8f5e9;
    border-left: 4px solid #388e3c;
    padding-left: 15px;
    border-radius: 0 6px 6px 0;
    margin-bottom: 15px;
  }
  
  .habit-section {
    background-color: #f1f8e9;
    border-left: 4px solid #7cb342;
    padding-left: 15px;
    border-radius: 0 6px 6px 0;
    margin-bottom: 15px;
  }
  
  .value-section {
    background-color: #e8f5e9;
    border-left: 4px solid #4caf50;
    padding-left: 15px;
    border-radius: 0 6px 6px 0;
    margin-bottom: 15px;
  }
`;

const checkpointPositions = [
  { offset: 40 },
  { offset: -30 },
  { offset: 10 },
  { offset: -50 },
  { offset: -20 },
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
  const firstName = capitalizedName || 'You';
  
  // Split the full plan into separate phases
  const processPhases = () => {
    if (!fullPlan) return [];
    
    // Handle both markdown and regular text formats
    if (fullPlan.includes('**Phase')) {
      return fullPlan.split(/\*\*Phase \d+:/)
        .filter(p => p.trim() !== '')
        .map(p => p.trim());
    } else {
      // Attempt to split by "Phase X:" pattern
      return fullPlan.split(/Phase \d+:/)
        .filter(p => p.trim() !== '')
        .map(p => p.trim());
    }
  };
  
  const phases = processPhases();
  
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
  } = assessmentTraits || {};

  // More detailed phase-specific summaries
  const getPhaseDescriptions = () => {
    return {
      'Start': `${firstName} should break down the large goal into manageable chunks with clear milestones.`,
      '3 months': `${firstName} can celebrate reaching the first significant milestone and recalibrate.`,
      '6 months': `${firstName} should re-evaluate the milestone breakdown and adjust as needed.`,
      '9 months': `${firstName} can focus on the next milestone achievement with renewed energy.`,
      '12 months': `${firstName} should celebrate the meaningful impact achieved and set new horizons.`
    };
  };
  
  // Personalized summaries based on assessment traits
  const getSummaries = () => {
    // Base summaries from phase descriptions
    const phaseDescriptions = getPhaseDescriptions();
    const defaultSummaries = {...phaseDescriptions};
    
    // Personalization based on assessment
    if (problem_solving && problem_solving.includes('creative') || 
        environment_preference && environment_preference.includes('creative_flex')) {
      defaultSummaries['Start'] = `${firstName} should design a flexible plan that allows for creative exploration.`;
      defaultSummaries['3 months'] = `${firstName} can experiment with different approaches to find what works best.`;
    }
    
    if (strengths && strengths.includes('disciplined')) {
      defaultSummaries['Start'] = `${firstName} should create a structured routine with clear expectations.`;
      defaultSummaries['3 months'] = `${firstName} can maintain consistency through disciplined adherence to the plan.`;
    }
    
    return defaultSummaries;
  };
  
  const summaries = getSummaries();
  
  // Personalized guidance based on assessment traits
  const getPersonalizedGuidance = () => {
    let guidance = '';
    
    // Check for creative traits
    if (problem_solving && problem_solving.includes('creative') || 
        environment_preference && environment_preference.includes('creative_flex')) {
      guidance += `As a creative type, ${firstName} will benefit from flexible routines and varied activities to maintain engagement. `;
    }
    
    // Check for analytical traits
    if (problem_solving && problem_solving.includes('analytical') || 
        core_belief && core_belief.includes('curiosity')) {
      guidance += `With ${firstName}'s analytical mindset and curiosity, tracking metrics and exploring the "why" behind actions will help stay motivated. `;
    }
    
    return guidance || `This roadmap is personalized based on ${firstName}'s assessment results to achieve goals effectively.`;
  };

  const getPhaseNumber = () => {
    return activePhase + 1;
  };

  const getPhaseTitle = () => {
    return `Phase ${getPhaseNumber()}: ${checkpointLabels[activePhase]}`;
  };

  const getPhaseSummary = () => {
    // Default phase summaries
    const phaseSummaries = {
      0: `${firstName} should set a foundation by establishing clear goals and creating an initial action plan.`,
      1: `${firstName} can build momentum by implementing consistent routines and celebrating early wins.`,
      2: `${firstName} should refine the approach based on what's working and adjust strategies as needed.`,
      3: `${firstName} can accelerate progress by leveraging strengths and addressing any obstacles.`,
      4: `${firstName} should solidify achievements and establish sustainable practices for long-term success.`
    };
    
    return phaseSummaries[activePhase] || "";
  };

  const getPhaseContent = () => {
    const content = phases[activePhase] || phases[0] || fullPlan || "";
    
    // Replace generic second-person pronouns with the user's name
    let personalizedContent = content
      .replace(/\byour\b/gi, `${firstName}'s`)
      .replace(/\byou\b/gi, firstName)
      .replace(/\byou're\b/gi, `${firstName} is`)
      .replace(/\byou've\b/gi, `${firstName} has`)
      .replace(/\byourself\b/gi, `${firstName}self`)
      .replace(/\byou'll\b/gi, `${firstName} will`);
    
    // Format the content with better structure
    personalizedContent = addStructureToContent(personalizedContent);
    
    // Format basic markdown
    return personalizedContent
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\*([^*]+)\*/g, '<i>$1</i>');
  };

  // Function to add structure and formatting to content
  const addStructureToContent = (content) => {
    if (!content) return '';
    
    let structured = content;
    
    // Find all sections like "Something:" or "Something (Details):"
    const sectionPattern = /([A-Z][a-zA-Z\s]+(?:\([^)]+\))?):\s*/g;
    
    // Split content by major sections
    structured = structured.replace(sectionPattern, '<div class="section-title">$1</div>');
    
    // Format sections with category labels
    const categoryLabels = [
      'Goal', 'Action Items', 'Research', 'Use Tools', 'Focus on Values', 'Learning',
      'Creative Problem Solving', 'Scheduling', 'Environment', 'Distraction Management',
      'Workout Execution', 'Values Driven', 'Impact and Milestones', 'Progress Tracking',
      'Nutrition', 'Basic Understanding', 'Creative Flex', 'Time Structure', 'Flexibility',
      'Structure Needed', 'Leverage Curiosity', 'Form', 'Problem Solving', 'Time Management',
      'Habit Formation', 'Preference'
    ];
    
    categoryLabels.forEach(label => {
      const labelPattern = new RegExp(`\\b(${label})\\b:\\s*`, 'g');
      structured = structured.replace(labelPattern, '<span class="category-label">$1:</span> ');
    });
    
    // Add paragraph breaks for better readability
    structured = structured.replace(/\.\s+([A-Z])/g, '.</p><p>$1');
    
    // Format numbered sections like "(Weeks 1-2)" with stronger styling
    structured = structured.replace(/\(([^)]+)\)/g, '<b>($1)</b>');
    
    // Add more spacing between numbers and text
    structured = structured.replace(/(\d+)\.(\s*)/g, '$1. &nbsp; ');
    
    // Add subtle styling to lists
    structured = structured.replace(/(\d+)\.\s+([^.]+\.)/g, '<div class="item-block">$1. $2</div>');
    
    // Break long sentences into shorter ones with commas
    structured = structured.replace(/,\s+([^,]+),/g, ', </br>$1,');
    
    // Color code different types of content
    structured = structured.replace(/<span class="category-label">Goal:<\/span>/g, 
      '<div class="goal-section"><span class="category-label">Goal:</span>');
    structured = structured.replace(/<span class="category-label">Action Items:<\/span>/g, 
      '<div class="action-section"><span class="category-label">Action Items:</span>');
    structured = structured.replace(/<span class="category-label">Use Tools:<\/span>/g, 
      '<div class="tools-section"><span class="category-label">Use Tools:</span>');
    structured = structured.replace(/<span class="category-label">Focus on Values:<\/span>/g, 
      '<div class="value-section"><span class="category-label">Focus on Values:</span>');
    structured = structured.replace(/<span class="category-label">Habit Formation:<\/span>/g, 
      '<div class="habit-section"><span class="category-label">Habit Formation:</span>');
    
    // Add closing divs for color-coded sections
    ['goal-section', 'action-section', 'tools-section', 'value-section', 'habit-section'].forEach(className => {
      if (structured.includes(`class="${className}"`)) {
        // Add closing div before the next section-title or at the end
        if (structured.includes('<div class="section-title">')) {
          structured = structured.replace(/<div class="section-title">/, '</div><div class="section-title">');
        } else {
          structured = structured + '</div>';
        }
      }
    });
    
    // Wrap in paragraph tags if not already
    if (!structured.includes('<p>')) {
      structured = `<p>${structured}</p>`;
    }
    
    // Wrap everything in a content block
    structured = `<div class="content-block">${structured}</div>`;
    
    return structured;
  };

  console.log("Rendering Roadmap component with:", { userName, phases: phases.length });

  return (
    <RoadmapWrapper>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <RoadmapTitle>
        {capitalizedName ? `${capitalizedName}'s Roadmap` : 'Roadmap'}
      </RoadmapTitle>
      
      {Object.keys(assessmentTraits).length > 0 && (
        <PersonalizedIntro>
          {getPersonalizedGuidance()}
        </PersonalizedIntro>
      )}
      
      <TimelineContainer>
        {[0, 1, 2, 3].map((index) => (
          <PathSegment 
            key={index} 
            $isActive={activePhase > index}
            $width="22%"
            $left={`${index === 0 ? 8 : 9 + index * 22}%`}
          />
        ))}
        <MilestonesContainer>
          {checkpointLabels.map((label, idx) => (
            <Milestone 
              key={idx}
              $offset={checkpointPositions[idx].offset}
              onClick={() => setActivePhase(idx)}
            >
              <MilestoneDot 
                className="milestone-dot"
                $isActive={activePhase === idx}
              />
              <MilestoneLabel>
                {label}
              </MilestoneLabel>
              <MilestoneDesc className="milestone-desc">
                {summaries[label] || milestones[label] || ''}
              </MilestoneDesc>
            </Milestone>
          ))}
        </MilestonesContainer>
      </TimelineContainer>
      
      {fullPlan && phases.length > 0 && (
        <PhaseDetailCard>
          <PhaseTitle>
            {getPhaseTitle()}
          </PhaseTitle>
          
          <PhaseSummary>
            {getPhaseSummary()}
          </PhaseSummary>
          
          <Divider sx={{ my: 3 }} />
          
          <PhaseContent dangerouslySetInnerHTML={{ 
            __html: getPhaseContent()
          }} />
        </PhaseDetailCard>
      )}
    </RoadmapWrapper>
  );
};

export default Roadmap; 