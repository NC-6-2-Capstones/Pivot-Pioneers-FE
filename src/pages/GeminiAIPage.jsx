import React, { useState } from 'react';
import { goalService } from '../services/apiService';

const GeminiAIPage = () => {
  const [goal, setGoal] = useState('');
  const [assessment, setAssessment] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const aiResponse = await goalService.generateRoadmap({
        goal,
        category: '', // or add a category input if needed
        description: goal
      });
      setResult(aiResponse.data.roadmap);
    } catch (error) {
      console.error('AI analysis error:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail);
      } else {
        alert('Something went wrong while generating your roadmap. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentChange = (e) => {
    const { name, value } = e.target;
    setAssessment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>AI Goal Analyzer</h2>
      <textarea
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Describe your goal..."
        rows={4}
        style={{ width: '10%', marginBottom: '1rem' }}
      />

      <input
        type="text"
        name="q1"
        placeholder="Assessment question 1"
        onChange={handleAssessmentChange}
        style={{ width: '10%', marginBottom: '1rem' }}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {result && (
        <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          {result}
        </pre>
      )}
    </div>
  );
};

export default GeminiAIPage;
