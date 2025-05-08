
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Container, 
  Paper, 
  Box, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel, 
  Button, 
  Stepper, 
  Step, 
  StepLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { assessmentService } from '../services/apiService';
import { useLocation } from 'react-router-dom';


const sections = [
  "Core Strengths & Cognitive Style",
  "Motivation & Purpose Drivers",
  "Work Style & Environment Needs",
  "Vision, Obstacles, and Follow-Through"
];

const AssessmentPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const goalData = location.state?.goalData;
  const returnTo = location.state?.returnTo;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await assessmentService.getQuestions();
        setQuestions(response.data);
        
        // Initialize answers object
        const initialAnswers = {};
        response.data.forEach(q => {
          initialAnswers[q.question_id] = '';
        });
        setAnswers(initialAnswers);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching assessment questions:', err);
        setError('Failed to load assessment questions. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Group questions by section
  const getQuestionsForSection = (sectionIndex) => {
    // Section 1: questions 1-4
    // Section 2: questions 5-7
    // Section 3: questions 8-10
    // Section 4: questions 11-15
    const sectionRanges = [
      { start: 1, end: 4 },
      { start: 5, end: 7 },
      { start: 8, end: 10 },
      { start: 11, end: 15 }
    ];

    const range = sectionRanges[sectionIndex];
    return questions.filter(q => q.question_id >= range.start && q.question_id <= range.end);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    // Check if all questions in current section are answered
    const currentQuestions = getQuestionsForSection(activeSection);
    const unanswered = currentQuestions.some(q => !answers[q.question_id]);
    
    if (unanswered) {
      setError('Please answer all questions before proceeding.');
      return;
    }
    
    setError('');
    
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    
    try {
      // Transform answers to the format expected by the backend
      const formattedAnswers = Object.keys(answers).map(questionId => ({
        question_id: parseInt(questionId),
        answer: answers[questionId]
      }));
      
      await assessmentService.submitAssessment(formattedAnswers);
      setSuccess(true);
      
 // Redirect after a delay, either to the goal form with data or to home
      setTimeout(() => {
        if (goalData && returnTo) {
          navigate(returnTo, { state: { goalData } });
        } else {
          navigate('/');
        }
      }, 2000);
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Assessment Completed!
          </Typography>
          <Typography variant="body1" align="center">
            Thank you for completing the assessment. Your personalized roadmap is being created.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        </Paper>
      </Container>
    );
  }

  const currentSectionQuestions = getQuestionsForSection(activeSection);

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Personality Assessment
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }} align="center">
          Complete this assessment to help us create your personalized goal roadmap.
        </Typography>
        
        <Stepper activeStep={activeSection} sx={{ mb: 4 }}>
          {sections.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
          Section {activeSection + 1}: {sections[activeSection]}
        </Typography>
        
        {currentSectionQuestions.map(question => (
          <Box key={question.question_id} sx={{ mb: 4 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
                {question.text}
              </FormLabel>
              <RadioGroup
                name={`question-${question.question_id}`}
                value={answers[question.question_id]}
                onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
              >
                <FormControlLabel value="a" control={<Radio />} label={question.option_a} />
                <FormControlLabel value="b" control={<Radio />} label={question.option_b} />
                <FormControlLabel value="c" control={<Radio />} label={question.option_c} />
                <FormControlLabel value="d" control={<Radio />} label={question.option_d} />
              </RadioGroup>
            </FormControl>
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            onClick={handleBack} 
            disabled={activeSection === 0 || submitting}
            variant="outlined"
          >
            Back
          </Button>
          
          <Button 
            onClick={handleNext} 
            variant="contained" 
            color="primary"
            disabled={submitting}
          >
            {activeSection === sections.length - 1 ? (
              submitting ? 'Submitting...' : 'Complete Assessment'
            ) : (
              'Next Section'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AssessmentPage;