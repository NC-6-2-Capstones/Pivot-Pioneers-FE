import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { goalService } from '../services/apiService';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUser } from '../contexts/UserContext';
import { analyzeGoal } from '../services/geminiService';
import { parseGeminiRoadmap } from '../services/parseGeminiRoadmap';
// import AssessmentForm from '../components/AssessmentForm';
// import { sendToGeminiAI } from '../services/geminiService'; 

const GoalFormPage = ({ goldenQuestion = 'What is your next big goal?' }) => {
    const { isAuthenticated } = useAuth(); // assumes user object contains `username` or `firstName`
    const { user } = useUser();
    const navigate = useNavigate();


    const [goal, setGoal] = useState('');
    const [assessment, setAssessment] = useState({});
    const [aiResponse, setAIResponse] = useState('');
    const [category, setCategory] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleNextClick = () => {
        console.log('Next button clicked. Selected category:', category);
        navigate('/goal-form', { state: { category } });
    };

    // const handleSubmit = async () => {
    //     try {
    //         const fullPayload = {
    //             goal,
    //             assessment,
    //         };
    //         const aiResult = await sendToGeminiAI(fullPayload);
    //         setAIResponse(aiResult); 
    //         await goalService.createGoal({ goal }); // Save just the goal
    //     } catch (error) {
    //         console.error('Error:', error);
    //         alert('Something went wrong while submitting.');
    //     }
    // };

    const handleSubmit = async () => {
        // Validate inputs
        if (!goal.trim()) {
            alert('Please describe your goal');
            return;
        }
        if (!category) {
            alert('Please select a category');
            return;
        }
        try {
            setLoadingAI(true);
            // Call Gemini API and parse response
            const aiText = await analyzeGoal(goal, assessment);
            const { milestones, fullPlan } = parseGeminiRoadmap(aiText);
            // Create title from first line or first few words
            const title = goal.split('\n')[0] || goal.substring(0, 50);
            // Save the goal with milestones and full plan
            const response = await goalService.createGoal({
                title: title,
                description: goal,
                category: category,
                milestone_start: milestones['Start'] || '',
                milestone_3_months: milestones['3 months'] || '',
                milestone_6_months: milestones['6 months'] || '',
                milestone_9_months: milestones['9 months'] || '',
                milestone_12_months: milestones['12 months'] || '',
                full_plan: fullPlan || ''
            });
            setLoadingAI(false);
            alert('Goal created successfully!');
            navigate('/userProfile', {
                state: {
                    activeTab: 2, // Goals tab
                    newGoal: true
                }
            });
        } catch (error) {
            setLoadingAI(false);
            console.error('Error submitting goal:', error);
            alert('Something went wrong while submitting your goal. Please try again.');
        }
    };

    const handleAssessmentChange = (e) => {
        setAssessment({
            ...assessment,
            [e.target.name]: e.target.value,
        });
    };

    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    if (!user) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Typography variant="h6">Loading your Goals...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Welcome {user?.firstName || user?.username || 'Friend'}
                    </Typography>

                    <Typography variant="body1" align="center" sx={{ mb: 4 }}>
                        Let's define your path and get personalized support from our AI assistant.
                    </Typography>

                    <Box mt={4}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            Golden Question
                        </Typography>
                        <Typography variant="body1">
                            {goldenQuestion}
                        </Typography>
                    </Box>

                    {/* Goal Section */}
                    <Typography variant="h6" gutterBottom>
                        Your Goal
                    </Typography>
                    <TextField
                        fullWidth
                        label="Describe your goal"
                        multiline
                        minRows={3}
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Box mt={4}>
                        <FormControl fullWidth>
                            <InputLabel id="category-select-label">Select a Category</InputLabel>
                            <Select
                                labelId="category-select-label"
                                value={category}
                                label="Select a Category"
                                onChange={handleChange}
                            >
                                <MenuItem value="career">Career</MenuItem>
                                <MenuItem value="education">Education</MenuItem>
                                <MenuItem value="personal">Personal</MenuItem>
                                <MenuItem value="financial">Financial</MenuItem>
                                <MenuItem value="health">Health</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box textAlign="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loadingAI}
                        >
                            {loadingAI ? 'Generating Roadmap...' : 'Submit Goal'}
                        </Button>
                    </Box>



                    

                    {/* AI Response */}
                    {aiResponse && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6">AI Guidance:</Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                {aiResponse}
                            </Typography>
                        </Box>
                    )}

                    
                </Paper>
            </Box>
        </Container>
    );
};

export default GoalFormPage;