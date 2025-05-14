// Utility to parse Gemini AI response into milestones and full plan

export function parseGeminiRoadmap(responseText) {
  // Match the milestones section
  const milestoneSection = responseText.match(/Milestones:(.*)Full Plan:/s);
  const fullPlanSection = responseText.match(/Full Plan:(.*)$/s);

  let milestones = {};
  if (milestoneSection) {
    const lines = milestoneSection[1].split('\n').filter(Boolean);
    lines.forEach(line => {
      const match = line.match(/- (Start|3 months|6 months|9 months|12 months): (.*)/);
      if (match) {
        milestones[match[1]] = match[2].trim();
      }
    });
  }

  const fullPlan = fullPlanSection ? fullPlanSection[1].trim() : '';

  return { milestones, fullPlan };
} 