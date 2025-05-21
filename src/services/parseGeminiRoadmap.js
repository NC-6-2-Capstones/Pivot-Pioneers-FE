// Utility to parse Gemini AI response into milestones and full plan

export function parseGeminiRoadmap(responseText) {
  // Clean up and standardize the text format
  let cleanedText = responseText
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')  // Remove excessive blank lines
    .trim();
  
  // Match the milestones section
  const milestoneSection = cleanedText.match(/Milestones:(.*)(?:Full Plan:|$)/s);
  const fullPlanSection = cleanedText.match(/(?:Full Plan:|Phase 1:)(.*)$/s);
  
  // Handle case where text doesn't contain explicit "Milestones:" or "Full Plan:" headers
  if (!milestoneSection && !fullPlanSection) {
    // Try to detect a simple list format at the beginning
    const lines = cleanedText.split('\n');
    const timeframes = ['Start', '3 months', '6 months', '9 months', '12 months'];
    const potentialMilestones = {};
    let foundMilestones = false;
    
    for (let i = 0; i < Math.min(15, lines.length); i++) {
      const line = lines[i].trim();
      // Look for lines like "- X months: description" or "• Start: description"
      const match = line.match(/^[-•*]\s*(Start|3 months|6 months|9 months|12 months):\s*(.*)/i);
      if (match) {
        potentialMilestones[match[1]] = match[2].trim();
        foundMilestones = true;
      }
    }
    
    if (foundMilestones) {
      return {
        milestones: potentialMilestones,
        fullPlan: cleanedText
      };
    }
    
    // If no milestones found, make a best guess at structuring the content
    return formatUnstructuredResponse(cleanedText);
  }
  
  // Extract and parse milestones
  let milestones = {};
  if (milestoneSection) {
    const lines = milestoneSection[1].split('\n').filter(Boolean);
    lines.forEach(line => {
      // Match different milestone formats
      const match = line.match(/[-•*]?\s*(Start|3 months|6 months|9 months|12 months):\s*(.*)/i);
      if (match) {
        milestones[match[1]] = match[2].trim();
      }
    });
  }
  
  // Extract the full plan
  let fullPlan = '';
  if (fullPlanSection) {
    fullPlan = fullPlanSection[1].trim();
  } else {
    // If no explicit full plan section, use the whole text
    fullPlan = cleanedText;
  }
  
  // Ensure proper phase formatting
  fullPlan = formatPhases(fullPlan);

  return { milestones, fullPlan };
}

// Format unstructured response into a more useful structure
function formatUnstructuredResponse(text) {
  // Try to identify time-based phases in the text
  const timeframes = ['Start', '3 months', '6 months', '9 months', '12 months'];
  const milestones = {};
  let fullPlan = text;
  
  // Look for potential milestones in the text
  timeframes.forEach(timeframe => {
    const regex = new RegExp(`(^|\\n).*${timeframe}[^\\n]*(\\n|$)`, 'i');
    const match = text.match(regex);
    if (match) {
      const line = match[0].trim();
      // Extract just the description after the timeframe
      const descMatch = line.match(new RegExp(`${timeframe}[:\\s]+(.*?)($|\\n)`, 'i'));
      if (descMatch) {
        milestones[timeframe] = descMatch[1].trim();
      } else {
        milestones[timeframe] = line;
      }
    }
  });
  
  // Format the full plan into phases if not already structured
  fullPlan = formatPhases(text);
  
  return { milestones, fullPlan };
}

// Format text into proper phase structure if needed
function formatPhases(text) {
  // Clean up spacing for labeled sections
  let cleanedText = text
    // Add spacing before labeled sections
    .replace(/([A-Z][a-zA-Z\s]+):([^\n])/g, '$1: $2')
    // Ensure proper line breaks after section labels to get better spacing
    .replace(/([A-Z][a-zA-Z\s]+):/g, '\n\n$1:')
    // Improve spacing in common section headers (Legality and Safety, Setup, etc.)
    .replace(/(Legality and Safety|Setup|Resources|Timeline|Tools|First Steps|Challenges|Milestones|Recommended Resources|Implementation|Key Skills|Learning Path|Success Metrics):/g, '\n\n**$1:**\n')
    // Improve spacing after bullet points
    .replace(/(\*|\-|\•) ([^\n]+)/g, '$1 $2\n')
    // Add spacing between paragraphs
    .replace(/([^\n])\n([^\n*•\-])/g, '$1\n\n$2');
  
  // Continue with existing formatting logic
  // Check if the text already has phase headers like "**Phase 1: X**"
  if (cleanedText.match(/\*\*Phase \d+:/)) {
    return cleanedText;
  }
  
  // Look for potential phase indicators (numbered sections, time periods)
  const phaseIndicators = cleanedText.match(/(?:^|\n)(Phase \d+:|Week \d+[-\d]*:|Months \d+[-\d]*:|First \d+ months:|Stage \d+:|Year \d+:|Quarter \d+:)/g);
  
  if (phaseIndicators && phaseIndicators.length > 0) {
    // Text has some phase structure, but needs formatting
    let formattedText = cleanedText;
    phaseIndicators.forEach((indicator, index) => {
      const cleanIndicator = indicator.trim().replace(/\n/g, '');
      const pattern = new RegExp(cleanIndicator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      formattedText = formattedText.replace(pattern, `\n\n**Phase ${index + 1}: ${cleanIndicator.replace(/:/g, '')}**\n\n`);
    });
    return formattedText;
  }
  
  // If no phase structure detected, create a basic structure based on paragraphs
  const paragraphs = cleanedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  if (paragraphs.length >= 3) {
    // Create artificial phases based on paragraphs
    return [
      `**Phase 1: Self-Reflection and Preparation**\n\n${paragraphs[0]}`,
      `\n\n**Phase 2: Foundation Building**\n\n${paragraphs.length > 1 ? paragraphs[1] : ''}`,
      `\n\n**Phase 3: Progress and Growth**\n\n${paragraphs.slice(2).join('\n\n')}`
    ].join('\n\n');
  }
  
  // Fall back to wrapping the whole text as one phase
  return `**Phase 1: Roadmap Overview**\n\n${cleanedText}`;
} 