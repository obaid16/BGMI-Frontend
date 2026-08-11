export const scoringRules = {
  placementPoints: [
    { rank: 1, points: 15 },
    { rank: 2, points: 12 },
    { rank: 3, points: 10 },
    { rank: 4, points: 8 },
    { rank: 5, points: 6 },
    { rank: 6, points: 4 },
    { rank: 7, points: 2 },
    { rank: 8, points: 1 },
    { rank: '9-16', points: 0 },
  ],
  killPointMultiplier: 1, // 1 point per kill
  bonusRules: '15 Placement Points for WWCD + Kill Points',
  penaltyRules: '-5 Points for non-compliance with recording / disconnect delay'
};

export const mockStandings = [];
