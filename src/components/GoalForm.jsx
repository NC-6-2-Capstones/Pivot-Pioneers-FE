import React, { useState } from 'react';

const GoalForm = ({ onSubmit }) => {
    const [goal, setGoal] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!goal.trim()) return;
        onSubmit(goal);
        setGoal('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What do you want to achieve?"
                required
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default GoalForm;
