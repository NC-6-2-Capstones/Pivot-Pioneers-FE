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
// import { parseGeminiRoadmap } from '../services/parseGeminiRoadmap';
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

            // Step 1: Create the basic goal first
            const title = goal.split('\n')[0] || goal.substring(0, 50);
            const newGoalPayload = {
                title: title,
                description: goal, // Full goal text
                category: category,
            };
            const createdGoalResponse = await goalService.createGoal(newGoalPayload);
            const newGoalId = createdGoalResponse.data.id;

            if (!newGoalId) {
                setLoadingAI(false);
                alert('Failed to create goal. Please try again.');
                return;
            }

            // Step 2: Call backend to generate roadmap for the newly created goal
            // The backend will now parse and save the roadmap details to this goal
            const roadmapGenerationResponse = await goalService.generateRoadmap({
                goal_id: newGoalId, // Pass the ID of the newly created goal
                goal: goal,         // Full goal text for the prompt
                category: category, // Category for the prompt
                description: goal   // Full goal text as description for the prompt
            });
            
            setLoadingAI(false);

            // The roadmapGenerationResponse.data should contain the updated goal with roadmap fields
            if (roadmapGenerationResponse.data && roadmapGenerationResponse.data.id) {
                alert('Goal and roadmap generated successfully!');
                navigate('/userProfile', {
                    state: {
                        activeTab: 2, // Goals tab
                        newGoal: true, // To potentially trigger a refresh or show a message
                        goalId: newGoalId // Pass the new goal ID if needed by UserProfilePage
                    }
                });
            } else {
                // This case might occur if generateRoadmap doesn't return the full goal or an error occurred
                console.error('Roadmap generation might have had an issue, or response format is unexpected:', roadmapGenerationResponse);
                alert('Goal created, but there was an issue generating the full roadmap. You can try generating it again from your profile.');
                navigate('/userProfile', { state: { activeTab: 2 } }); // Navigate anyway
            }

        } catch (error) {
            setLoadingAI(false);
            console.error('Error submitting goal or generating roadmap:', error);
            if (error.response && error.response.data && error.response.data.detail) {
                alert(`Error: ${error.response.data.detail}`);
            } else {
                alert('Something went wrong. Please try again.');
            }
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
                                <MenuItem value="other">Other</MenuItem>
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