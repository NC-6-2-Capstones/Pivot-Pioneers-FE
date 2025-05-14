import React, { useEffect, useState } from 'react';
import Roadmap from '../components/Roadmap';
import { parseGeminiRoadmap } from '../services/parseGeminiRoadmap';

// TODO: Replace this with actual Gemini API call
const mockGeminiResponse = `Milestones:
- Start: Define your vision and set clear, actionable objectives.
- 3 months: Build foundational skills and establish consistent routines.
- 6 months: Achieve intermediate milestones and expand your network.
- 9 months: Tackle advanced challenges and refine your strategy.
- 12 months: Reach your primary goal and reflect on your growth.

Full Plan:
To achieve your goal, begin by clarifying your vision and breaking it down into specific, measurable objectives. In the first three months, focus on building the necessary skills and creating habits that support your progress. By six months, you should be hitting key milestones and connecting with others who can support your journey. At nine months, address more complex challenges and adjust your approach as needed. By the end of the year, you will have reached your main goal and can look back on your progress to plan your next steps.`;

const RoadmapPage = () => {
  const [milestones, setMilestones] = useState({});
  const [fullPlan, setFullPlan] = useState('');

  useEffect(() => {
    // Simulate fetching and parsing Gemini response
    const { milestones, fullPlan } = parseGeminiRoadmap(mockGeminiResponse);
    setMilestones(milestones);
    setFullPlan(fullPlan);
  }, []);

  return <Roadmap userName="Tetsu" milestones={milestones} fullPlan={fullPlan} />;
};

export default RoadmapPage; 