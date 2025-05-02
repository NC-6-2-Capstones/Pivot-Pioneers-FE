// src/components/GoalForm.jsx
import React, { useState } from 'react';

const GoalForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        
        setLoading(true);
        
        try {
            await onSubmit({
                title,
                description,
                category
            });
            
            // Clear form on success
            setTitle('');
            setDescription('');
            setCategory('');
        } catch (error) {
            console.error('Error submitting goal:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Goal Title"
                    required
                />
            </div>
            
            <div className="form-group">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Career">Career</option>
                    <option value="Education">Education</option>
                    <option value="Personal">Personal</option>
                    <option value="Financial">Financial</option>
                    <option value="Health">Health</option>
                </select>
            </div>
            
            <div className="form-group">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your goal"
                    rows={4}
                    required
                />
            </div>
            
            <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
};

export default GoalForm;