import React from 'react';
import GoalForm from '../components/GoalForm';

const GoalFormPage = () => {
  const handleGoalSubmit = (goal) => {
    console.log('Goal submitted:', goal);
    // TODO: Connect to backend/API here
  };

  return (
    <div>
      <h2>Define Your Path</h2>
      <h3>Everyone's journey starts with a single step — and that step begins here.</h3>
      
      <p>We believe that justice-impacted individuals deserve tools that support transformation, not just survival.</p>
      <p>By sharing your dream or goal below, you're taking the first step toward building a personalized roadmap designed to guide you forward.</p>
      <p>We'll use what you share to map out a path from where you are now to where you want to be — including check-ins at 3, 6, and 9 months to keep you on track.</p>
      <p>Whether it's a new career, education, or personal growth, this is your space to define what success looks like — and start walking toward it.</p>

      <GoalForm onSubmit={handleGoalSubmit} />
    </div>
  );
};

export default GoalFormPage;
