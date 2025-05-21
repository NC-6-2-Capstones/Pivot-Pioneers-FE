import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Box, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert, Divider
} from '@mui/material';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { goalService } from '../services/apiService';
import { analyzeGoal } from '../services/geminiService';
import { parseGeminiRoadmap } from '../services/parseGeminiRoadmap';

// Styled components for roadmap content
const RoadmapPreviewContainer = styled.div`
  margin: 30px 0;
  font-family: 'Nunito', 'Segoe UI', Roboto, Arial, sans-serif;
`;

const RoadmapTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #d4af37;
  margin-bottom: 15px;
  font-family: 'Montserrat', 'Segoe UI', Roboto, sans-serif;
`;

const MilestoneSection = styled.div`
  margin-bottom: 25px;
`;

const MilestoneTitle = styled.h4`
  font-weight: 600;
  font-size: 1.2rem;
  color: #d4af37;
  margin-bottom: 8px;
  font-family: 'Montserrat', 'Segoe UI', Roboto, sans-serif;
`;

const ContentBlock = styled.div`
  margin-bottom: 20px;
  background-color: #e8f5e9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 4px solid #4caf50;
  line-height: 1.6;
`;

const PlanSection = styled.div`
  margin-top: 30px;
`;

const SectionTitle = styled.div`
  font-weight: 700;
  font-size: 1.2rem;
  color: #d4af37;
  margin-bottom: 15px;
  font-family: 'Montserrat', 'Segoe UI', Roboto, sans-serif;
  display: block;
  padding: 8px 12px;
  background: #e8f5e9;
  border-radius: 6px;
`;

const PhaseBlock = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const PhaseTitle = styled.h5`
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 8px;
  font-size: 1.1rem;
`;

const PhaseContent = styled.div`
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  line-height: 1.7;
  
  ul {
    margin-left: 20px;
    margin-bottom: 10px;
  }
  
  li {
    margin-bottom: 6px;
  }
  
  .section-label {
    font-weight: 700;
    color: #2e7d32;
    margin-top: 20px;
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid #e0e0e0;
    font-size: 1.05rem;
  }
`;

const GoalAndGeminiPage = ({ 
  goldenQuestion = (
    <>
      It all starts with your <strong>Golden Question</strong> — your <em>why</em>.
      <br />
      What goal do you want to pursue?
    </>
  ),
}) => {
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const [goal, setGoal] = useState('');
  const [assessment, setAssessment] = useState({});
  const [category, setCategory] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [readyToSave, setReadyToSave] = useState(false);
  const [parsedPlan, setParsedPlan] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const handleAssessmentChange = (e) => {
    const { name, value } = e.target;
    setAssessment((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleAnalyzeGoal = async () => {
    if (!goal.trim()) return alert('Please describe your goal.');
    if (!category) return alert('Please select a category.');

    try {
      setLoading(true);
      const aiText = await analyzeGoal(goal, assessment);
      const parsed = parseGeminiRoadmap(aiText);

      setAIResponse(aiText);
      setParsedPlan(parsed);
      setReadyToSave(true);
    } catch (err) {
      console.error('AI analysis failed:', err);
      alert('Something went wrong with AI analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async () => {
    try {
      const title = goal.split('\n')[0] || goal.substring(0, 50);
      await goalService.createGoal({
        title,
        description: goal,
        category,
        milestone_start: parsedPlan.milestones?.['Start'] || '',
        milestone_3_months: parsedPlan.milestones?.['3 months'] || '',
        milestone_6_months: parsedPlan.milestones?.['6 months'] || '',
        milestone_9_months: parsedPlan.milestones?.['9 months'] || '',
        milestone_12_months: parsedPlan.milestones?.['12 months'] || '',
        full_plan: parsedPlan.fullPlan || aiResponse,
      });

      setSnackbarOpen(true); 
      navigate('/userProfile', { state: { activeTab: 2, newGoal: true } });
    } catch (err) {
      console.error('Save goal failed:', err);
      alert('Failed to save your goal.');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const capitalize = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  
  // Format Milestone section for better display
  const renderMilestones = () => {
    if (!parsedPlan.milestones || Object.keys(parsedPlan.milestones).length === 0) return null;
    
    return (
      <MilestoneSection>
        <SectionTitle>Milestones</SectionTitle>
        <ContentBlock>
          {Object.entries(parsedPlan.milestones).map(([period, description]) => (
            <div key={period} style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#d4af37' }}>{period}:</strong> {description}
            </div>
          ))}
        </ContentBlock>
      </MilestoneSection>
    );
  };
  
  // Format the full plan with better styling
  const renderFormattedPlan = () => {
    if (!parsedPlan.fullPlan) return null;
    
    // Extract phases
    const phaseRegex = /\*\*Phase \d+:([^*]+)\*\*/g;
    const phases = [...parsedPlan.fullPlan.matchAll(phaseRegex)].map(match => match[1].trim());
    
    // Split content by phases
    const phaseContents = parsedPlan.fullPlan.split(phaseRegex).filter(Boolean);
    
    // Remove the first item if it's just intro text
    if (phaseContents.length > phases.length) {
      phaseContents.shift();
    }
    
    return (
      <PlanSection>
        <SectionTitle>Full Plan</SectionTitle>
        
        {phases.map((phase, index) => (
          <PhaseBlock key={index}>
            <PhaseTitle>Phase {index + 1}: {phase}</PhaseTitle>
            <PhaseContent>
              {formatPhaseContent(phaseContents[index] || '')}
            </PhaseContent>
          </PhaseBlock>
        ))}
      </PlanSection>
    );
  };
  
  // Helper to format phase content with better structure
  const formatPhaseContent = (content) => {
    if (!content) return null;
    
    // Add spacing between labeled sections (e.g., "Legality and Safety:", "Setup:")
    let formatted = content
      // First handle section headers - add margin and styling
      .replace(/([A-Z][a-zA-Z\s]+):/g, '<div class="section-label">$1:</div>')
      
      // Format bolding and italics
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      
      // Format bullet points as proper HTML lists
      .replace(/(\n\s*)(•|\*|\-) ([^\n]+)/g, '$1<li>$3</li>')
      .replace(/(<li>[^<]+<\/li>\n?)+/g, '<ul>$&</ul>')
      
      // Format numbered lists
      .replace(/(\n\s*)(\d+\.) ([^\n]+)/g, '$1<li>$3</li>')
      .replace(/(<li>[^<]+<\/li>\n?)+/g, '<ul>$&</ul>')
      
      // Add paragraph breaks for better readability
      .replace(/\n\n+/g, '<br/><br/>')
      
      // Add specific styling for common sections
      .replace(/<div class="section-label">(Legality and Safety|Setup|Resources|Timeline|Tools|First Steps|Challenges|Milestones|Recommended Resources|Implementation|Key Skills|Learning Path|Success Metrics):<\/div>/g, 
        '<div class="section-label" style="background-color: #e8f5e9; color: #2e7d32; padding: 12px 15px; margin-top: 25px; margin-bottom: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">$1:</div>');
    
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: formatted }}
        style={{
          // Add custom styles to the parent div
          lineHeight: '1.7',
          color: '#333',
          '& ul, & ol': {
            marginTop: '12px',
            marginBottom: '20px',
            paddingLeft: '25px',
          },
          '& li': {
            marginBottom: '10px',
          }
        }}
      />
    );
  };
  
  return (
    <Container maxWidth="md">
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Welcome {user? capitalize(user.firstName || user.username) : 'Friend'}
          </Typography>

          <Typography align="center" sx={{ mb: 4 }}>
            {goldenQuestion}
          </Typography>

          <TextField
            label="Describe your goal and why it matters"
            multiline
            minRows={3}
            fullWidth
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="category-label">Select a Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Select a Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="career">Career</MenuItem>
              <MenuItem value="education">Education</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="financial">Financial</MenuItem>
              <MenuItem value="health">Health</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          {!readyToSave ? (
            <Box textAlign="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAnalyzeGoal}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Roadmap'}
              </Button>
            </Box>
          ) : (
            <RoadmapPreviewContainer>
              <RoadmapTitle>Your Personalized Roadmap</RoadmapTitle>
              
              <Divider sx={{ my: 2 }} />
              
              {renderMilestones()}
              {renderFormattedPlan()}
              
              <Box textAlign="center" mt={3}>
                <Button 
                  variant="contained" 
                  style={{ 
                    backgroundColor: '#4caf50', 
                    color: 'white', 
                    padding: '10px 25px',
                    fontSize: '1rem'
                  }} 
                  onClick={handleSaveGoal}
                >
                  Save Goal
                </Button>
              </Box>
            </RoadmapPreviewContainer>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Goal saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GoalAndGeminiPage;
