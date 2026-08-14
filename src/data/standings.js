export const scoringRules = {
  placementPoints: [
    { rank: 1, points: 10 },
    { rank: 2, points: 8 },
    { rank: 3, points: 5 },
    { rank: '4+', points: 0 },
  ],
  killPointMultiplier: 1, // 1 point per kill
  bonusRules: '10 Placement Points for WWCD + Kill Points (1 pt/kill)',
  penaltyRules: '-5 Points for non-compliance with recording / disconnect delay'
};

export const mockStandings = [];
