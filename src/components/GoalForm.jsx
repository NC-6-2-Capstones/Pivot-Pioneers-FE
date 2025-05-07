// src/components/GoalForm.jsx
import React, { useState } from 'react';
import { TextField, Button, Box, Alert, Snackbar, CircularProgress, MenuItem } from '@mui/material';

const GoalForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        setLoading(true);
        setError(''); setSuccess(false);
        try {
            await onSubmit({ title, description, category });
            setSuccess(true);
            setTitle(''); setDescription(''); setCategory('');
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
                label="Goal Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                inputProps={{ maxLength: 100 }}
            />
            <TextField
                select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            >
                {['Career', 'Education', 'Personal', 'Financial', 'Health'].map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
            </TextField>
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                required
                inputProps={{ maxLength: 500 }}
            />
            <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
            <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} message="Goal submitted successfully!" />
        </Box>
    );
};

export default GoalForm;