import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { goalService } from '../services/apiService';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import AssessmentForm from '../components/AssessmentForm';
// import { sendToGeminiAI } from '../services/geminiService'; 

const GoalFormPage = () => {
    const { isAuthenticated, user } = useAuth(); // assumes user object contains `username` or `firstName`
    const navigate = useNavigate();

    const [goal, setGoal] = useState('');
    const [assessment, setAssessment] = useState({});
    const [aiResponse, setAIResponse] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async () => {
        try {
            const fullPayload = {
                goal,
                assessment,
            };
            const aiResult = await sendToGeminiAI(fullPayload);
            setAIResponse(aiResult); 
            await goalService.createGoal({ goal }); // Save just the goal
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong while submitting.');
        }
    };

    const handleAssessmentChange = (e) => {
        setAssessment({
            ...assessment,
            [e.target.name]: e.target.value,
        });
    };

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

                    <Box textAlign="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Submit Goal
                        </Button>
                    </Box>

                    {/* Assessment Section */}
                    <Divider sx={{ my: 4 }} />
                    {/* Assessment Section (Collapsible) */}
                    <Accordion sx={{ mt: 3 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="assessment-content"
                            id="assessment-header"
                        >
                            <Typography variant="h6">Start Assessment</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField
                                fullWidth
                                name="q1"
                                label="What motivates you right now?"
                                value={assessment.q1}
                                onChange={handleAssessmentChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                name="q2"
                                label="What is your biggest barrier?"
                                value={assessment.q2}
                                onChange={handleAssessmentChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                name="q3"
                                label="What would success look like in 3 months?"
                                value={assessment.q3}
                                onChange={handleAssessmentChange}
                                sx={{ mb: 2 }}
                            />
                        </AccordionDetails>
                    </Accordion>


                    <Box textAlign="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Submit Assessment
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
