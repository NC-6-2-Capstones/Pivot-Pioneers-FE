import React, { useState } from 'react';

const GoalFormPage = () => {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Goal submitted:', goal);
    // TODO: connect to backend/api here
  };

  return (
    <div>
      <h2>Set a Goal</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Enter your goal"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default GoalFormPage;