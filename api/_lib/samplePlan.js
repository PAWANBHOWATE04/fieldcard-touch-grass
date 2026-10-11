/**
 * Fieldcard - Sample Plan Fallback
 * Clearly labelled sample field card for visitors to test and explore the interface
 * without needing an active API key or consuming API quota.
 * This is NEVER misrepresented as live AI output.
 */

export const SAMPLE_FIELD_CARD = {
  id: 'sample-pinecrest-60',
  isSample: true,
  model: 'gemma-4-26b-a4b-it (Sample Demonstration)',
  place: 'Pinecrest Meadow & Community Trail',
  timeMinutes: 60,
  activity: 'nature observation',
  pace: 'relaxed',
  budget: 'free',
  preferences: 'Shaded path, bench resting spot, birdwatching focus',
  title: 'Sensory Canopy Stroll & Canopy Pause',
  reason: 'Trade the glow of your screen for the natural rustle of autumn leaves and the crisp scent of fresh pines.',
  itinerary: [
    {
      step: 1,
      timeWindow: '00:00 - 00:10',
      durationMinutes: 10,
      activity: 'Threshold Crossing & Phone Stow',
      detail: 'Arrive at the trailhead, power off notification chimes, zip your phone away in your pack, and take three deep breaths to tune into the outdoor soundscape.'
    },
    {
      step: 2,
      timeWindow: '00:10 - 00:30',
      durationMinutes: 20,
      activity: 'Canopy Observation Walk',
      detail: 'Walk at an easy, unhurried pace along the tree-lined path. Look up into the branches to spot birds, leaf patterns, and bark textures.'
    },
    {
      step: 3,
      timeWindow: '00:30 - 00:45',
      durationMinutes: 15,
      activity: 'Bench Sit & Sensory Cataloging',
      detail: 'Find a shaded bench or sturdy log. Sit in stillness for 15 minutes. Identify five distinct sounds—wind in leaves, distant birds, insects, crunching gravel.'
    },
    {
      step: 4,
      timeWindow: '00:45 - 01:00',
      durationMinutes: 15,
      activity: 'Gentle Return & Grounding',
      detail: 'Stroll back along the return loop. Notice how your breathing and mental chatter have slowed compared to when you first stepped outside.'
    }
  ],
  checklist: [
    'Reusable water bottle',
    'Comfortable walking shoes',
    'Weather-appropriate light layer',
    'Pocket notebook & pencil (optional for field sketching)'
  ],
  screenFreeChallenge: 'Keep your phone tucked inside your pocket or backpack for the entire 60 minutes. If you feel the itch to check notifications, touch the rough bark of the nearest tree instead.',
  reflectionQuestion: 'What was the quietest thing you noticed during your 60 minutes outside that you would have missed while scrolling?',
  safetyReminder: 'Stay on marked public trails, be mindful of exposed roots or uneven ground, and check local park opening hours.',
  createdAt: '2026-10-11T12:00:00.000Z'
};

/**
 * Creates a dynamic sample plan matching user form inputs when live API is unavailable.
 * Always explicitly labelled with isSample: true.
 */
export function getSamplePlanForInputs(inputs = {}) {
  const timeMinutes = Number(inputs.timeMinutes) || 60;
  const place = inputs.place?.trim() || 'Your Local Park';
  const activity = inputs.activity || 'nature walk';
  const pace = inputs.pace || 'relaxed';
  const budget = inputs.budget || 'free';
  const preferences = inputs.preferences || 'Screen-free outdoor reset';

  // Proportional breakdown depending on duration
  const steps = [];
  if (timeMinutes === 30) {
    steps.push(
      {
        step: 1,
        timeWindow: '00:00 - 00:05',
        durationMinutes: 5,
        activity: 'Arrival & Screen Stow',
        detail: `Arrive at ${place}. Put your device on silent and stow it safely in your bag.`
      },
      {
        step: 2,
        timeWindow: '00:05 - 00:20',
        durationMinutes: 15,
        activity: `Active ${activity}`,
        detail: `Immerse in your ${activity} at a ${pace} pace. Focus your attention on the colors, sights, and seasonal changes around you.`
      },
      {
        step: 3,
        timeWindow: '00:20 - 00:30',
        durationMinutes: 10,
        activity: 'Reflective Cool-Down & Pause',
        detail: 'Find a peaceful spot to stand or sit. Take a few restorative breaths before heading back.'
      }
    );
  } else if (timeMinutes === 90) {
    steps.push(
      {
        step: 1,
        timeWindow: '00:00 - 00:15',
        durationMinutes: 15,
        activity: 'Transition & Threshold Entry',
        detail: `Step out at ${place}. Leave notifications behind, stretch gently, and tune your senses to the fresh air.`
      },
      {
        step: 2,
        timeWindow: '00:15 - 00:45',
        durationMinutes: 30,
        activity: `Deep Exploration (${activity})`,
        detail: `Engage in ${activity} at a steady ${pace} pace along open paths. Observe local flora, birds, or cloud movements.`
      },
      {
        step: 3,
        timeWindow: '00:45 - 01:15',
        durationMinutes: 30,
        activity: 'Stationary Nature Pause',
        detail: 'Pause at a scenic overlook, bench, or clearing. Spend unhurried time observing patterns in nature without checking the time.'
      },
      {
        step: 4,
        timeWindow: '01:15 - 01:30',
        durationMinutes: 15,
        activity: 'Unwinding Return Walk',
        detail: 'Return along the path at an easy pace, savoring the mental clarity and relaxed physical state.'
      }
    );
  } else if (timeMinutes === 120) {
    steps.push(
      {
        step: 1,
        timeWindow: '00:00 - 00:15',
        durationMinutes: 15,
        activity: 'Preparation & Mindful Disconnect',
        detail: `Arrive at ${place}. Pack your phone away, hydrate, and set an intention for your two hours in nature.`
      },
      {
        step: 2,
        timeWindow: '00:15 - 00:55',
        durationMinutes: 40,
        activity: `Main Trail Expedition (${activity})`,
        detail: `Follow public pathways at a ${pace} tempo, exploring different corners of ${place}.`
      },
      {
        step: 3,
        timeWindow: '00:55 - 01:35',
        durationMinutes: 40,
        activity: 'Quiet Nature Immersion',
        detail: 'Find a serene resting area. Practice five-senses grounding: note 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you appreciate.'
      },
      {
        step: 4,
        timeWindow: '01:35 - 02:00',
        durationMinutes: 25,
        activity: 'Leisurely Return Loop',
        detail: 'Wind down your outing along a gentle path back to the starting point.'
      }
    );
  } else {
    // Default 60 minutes
    steps.push(
      {
        step: 1,
        timeWindow: '00:00 - 00:10',
        durationMinutes: 10,
        activity: 'Arrival & Screen Stow',
        detail: `Arrive at ${place}, silence all digital alerts, and take a moment to transition into outdoor mode.`
      },
      {
        step: 2,
        timeWindow: '00:10 - 00:35',
        durationMinutes: 25,
        activity: `Guided ${activity}`,
        detail: `Move along paths at a ${pace} pace, focusing on the sights and sounds of the natural landscape.`
      },
      {
        step: 3,
        timeWindow: '00:35 - 00:50',
        durationMinutes: 15,
        activity: 'Sensory Observation Pause',
        detail: 'Stop at a comfortable vantage point. Listen intently to wind, rustling leaves, or wildlife.'
      },
      {
        step: 4,
        timeWindow: '00:50 - 01:00',
        durationMinutes: 10,
        activity: 'Return & Centering',
        detail: 'Walk back at an unhurried tempo, carrying the calm of the outdoors with you.'
      }
    );
  }

  return {
    id: `sample-${Date.now()}`,
    isSample: true,
    model: 'gemma-4-26b-a4b-it (Sample Demonstration)',
    place,
    timeMinutes,
    activity,
    pace,
    budget,
    preferences,
    title: `Outing at ${place}: ${activity.charAt(0).toUpperCase() + activity.slice(1)} Session`,
    reason: `Step away from digital noise for ${timeMinutes} minutes and ground yourself in the physical world at ${place}.`,
    itinerary: steps,
    checklist: [
      'Full water bottle',
      'Comfortable walking shoes',
      'Weather-appropriate layers or hat',
      budget === 'low-cost' ? 'Small cash/card for any parking or park entry' : 'Keys and essentials only'
    ],
    screenFreeChallenge: `Leave your mobile phone inside your backpack or pocket for the full ${timeMinutes} minutes. If you reach for it out of habit, stop and notice three details in the immediate foliage instead.`,
    reflectionQuestion: 'How does your head and attention span feel right now compared to when you were staring at a screen?',
    safetyReminder: 'Keep to established trails, hydrate regularly, and verify park rules or weather forecast before setting off.',
    createdAt: new Date().toISOString()
  };
}
