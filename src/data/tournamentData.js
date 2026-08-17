/**
 * CENTRALIZED BGMI TOURNAMENT DATA SERVICE
 * Standardizes teams, matches, results, standings, players, MVPs, and top fraggers
 * across all frontend pages and API fallback services.
 */

// 1. OFFICIAL TEAMS & ROSTERS
export const CANONICAL_TEAMS = [
  {
    id: 'team-godlike',
    registrationId: 'GODL-2026',
    teamName: 'GodLike Esports',
    shortName: 'GODL',
    collegeName: 'Nexcore Computer Science Dept',
    captainName: 'Obaid Shaikh',
    captainIgn: 'OBAID (IGL)',
    captainRole: 'IGL / Assaulter',
    contactNumber: '+91 98765 43210',
    email: 'obaid@nexcore.edu',
    logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    status: 'Approved',
    verified: true,
    rank: 1,
    points: 46,
    players: [
      { id: 'p-01', name: 'Obaid Shaikh', ign: 'OBAID (IGL)', role: 'IGL / Assaulter', kills: 10, matchesPlayed: 2, bgmiId: '512938401' },
      { id: 'p-02', name: 'Jonathan Amaral', ign: 'GODL-Jonathan', role: 'Entry Fragger', kills: 8, matchesPlayed: 2, bgmiId: '512938402' },
      { id: 'p-03', name: 'Abhishek Choudhary', ign: 'GODL-Zgod', role: 'Support', kills: 5, matchesPlayed: 2, bgmiId: '512938403' },
      { id: 'p-04', name: 'Harsh Paudwal', ign: 'GODL-Goblin', role: 'Filter Assaulter', kills: 3, matchesPlayed: 2, bgmiId: '512938404' }
    ]
  },
  {
    id: 'team-axions',
    registrationId: 'AXN-2026',
    teamName: 'Axions',
    shortName: 'AXN',
    collegeName: 'Nexcore Electronics Engineering',
    captainName: 'Kratos',
    captainIgn: 'AXN-Kratos',
    captainRole: 'IGL',
    contactNumber: '+91 98765 43211',
    email: 'kratos@nexcore.edu',
    logoUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    status: 'Approved',
    verified: true,
    rank: 2,
    points: 28,
    players: [
      { id: 'p-05', name: 'Kratos', ign: 'AXN-Kratos', role: 'IGL', kills: 7, matchesPlayed: 2, bgmiId: '512938405' },
      { id: 'p-06', name: 'Shadow', ign: 'AXN-Shadow', role: 'Assaulter', kills: 5, matchesPlayed: 2, bgmiId: '512938406' },
      { id: 'p-07', name: 'Viper', ign: 'AXN-Viper', role: 'Support', kills: 2, matchesPlayed: 2, bgmiId: '512938407' },
      { id: 'p-08', name: 'Snax', ign: 'AXN-Snax', role: 'Sniper', kills: 1, matchesPlayed: 2, bgmiId: '512938408' }
    ]
  },
  {
    id: 'team-warriors',
    registrationId: 'ELT-2026',
    teamName: 'Elite Warriors',
    shortName: 'ELT',
    collegeName: 'Nexcore Mechanical Dept',
    captainName: 'Mortal',
    captainIgn: 'ELT-Mortal',
    captainRole: 'Support / IGL',
    contactNumber: '+91 98765 43212',
    email: 'mortal@nexcore.edu',
    logoUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&auto=format&fit=crop&q=80',
    status: 'Approved',
    verified: true,
    rank: 3,
    points: 25,
    players: [
      { id: 'p-09', name: 'Naman Mathur', ign: 'ELT-Mortal', role: 'IGL / Support', kills: 6, matchesPlayed: 2, bgmiId: '512938409' },
      { id: 'p-10', name: 'Tanmay Singh', ign: 'ELT-Scout', role: 'Entry Fragger', kills: 4, matchesPlayed: 2, bgmiId: '512938410' },
      { id: 'p-11', name: 'Siddharth Joshi', ign: 'ELT-Regaltos', role: 'Assaulter', kills: 3, matchesPlayed: 2, bgmiId: '512938411' },
      { id: 'p-12', name: 'Vivek Awasthi', ign: 'ELT-ClutchGod', role: 'Filter', kills: 1, matchesPlayed: 2, bgmiId: '512938412' }
    ]
  },
  {
    id: 'team-unauthorized',
    registrationId: '401-2026',
    teamName: '401 Unauthorized',
    shortName: '401',
    collegeName: 'NIT Information Technology',
    captainName: 'CyberDev',
    captainIgn: '401-Cyber',
    captainRole: 'IGL',
    contactNumber: '+91 98765 43213',
    email: 'cyber@nitesports.edu',
    logoUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&auto=format&fit=crop&q=80',
    status: 'Approved',
    verified: true,
    rank: 4,
    points: 18,
    players: [
      { id: 'p-13', name: 'CyberDev', ign: '401-Cyber', role: 'IGL', kills: 4, matchesPlayed: 2, bgmiId: '512938413' },
      { id: 'p-14', name: 'Kernel', ign: '401-Kernel', role: 'Assaulter', kills: 3, matchesPlayed: 2, bgmiId: '512938414' },
      { id: 'p-15', name: 'Root', ign: '401-Root', role: 'Support', kills: 2, matchesPlayed: 2, bgmiId: '512938415' },
      { id: 'p-16', name: 'Buffer', ign: '401-Buffer', role: 'Sniper', kills: 1, matchesPlayed: 2, bgmiId: '512938416' }
    ]
  },
  {
    id: 'team-farz',
    registrationId: 'FRZ-2026',
    teamName: 'FARZ Esports',
    shortName: 'FRZ',
    collegeName: 'NIT Civil Engineering',
    captainName: 'Farzan',
    captainIgn: 'FRZ-Farzan',
    captainRole: 'IGL',
    contactNumber: '+91 98765 43214',
    email: 'farzan@nitesports.edu',
    logoUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    status: 'Approved',
    verified: true,
    rank: 5,
    points: 7,
    players: [
      { id: 'p-17', name: 'Farzan', ign: 'FRZ-Farzan', role: 'IGL', kills: 2, matchesPlayed: 2, bgmiId: '512938417' },
      { id: 'p-18', name: 'Apex', ign: 'FRZ-Apex', role: 'Assaulter', kills: 1, matchesPlayed: 2, bgmiId: '512938418' },
      { id: 'p-19', name: 'Titan', ign: 'FRZ-Titan', role: 'Support', kills: 1, matchesPlayed: 2, bgmiId: '512938419' },
      { id: 'p-20', name: 'Blaze', ign: 'FRZ-Blaze', role: 'Sniper', kills: 1, matchesPlayed: 2, bgmiId: '512938420' }
    ]
  }
];

// 2. OFFICIAL MATCHES & RESULTS DATASET
export const CANONICAL_MATCHES = [
  {
    id: 'match-01',
    matchNumber: 1,
    title: 'Match #1 / Erangel',
    round: 'Match 1',
    map: 'Erangel',
    date: '2026-09-02',
    time: '10:00 AM',
    status: 'Completed',
    teamsCount: 24,
    winner: {
      teamName: 'GodLike Esports',
      shortName: 'GODL',
      kills: 14,
      points: 24
    },
    mvp: {
      name: 'Obaid Shaikh',
      ign: 'OBAID (IGL)',
      kills: 6,
      teamName: 'GodLike Esports'
    },
    totalKills: 37,
    leaderboard: [
      { rank: 1, team: 'GodLike Esports', kills: 14, placementPoints: 10, killPoints: 14, totalPoints: 24 },
      { rank: 2, team: 'Elite Warriors', kills: 9, placementPoints: 8, killPoints: 9, totalPoints: 17 },
      { rank: 3, team: 'Axions', kills: 7, placementPoints: 5, killPoints: 7, totalPoints: 12 },
      { rank: 4, team: '401 Unauthorized', kills: 4, placementPoints: 3, killPoints: 4, totalPoints: 7 },
      { rank: 5, team: 'FARZ Esports', kills: 3, placementPoints: 1, killPoints: 3, totalPoints: 4 }
    ],
    proofs: {
      screenshots: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80'
      ]
    }
  },
  {
    id: 'match-02',
    matchNumber: 2,
    title: 'Match #2 / Livik',
    round: 'Match 2',
    map: 'Livik',
    date: '2026-09-02',
    time: '12:30 PM',
    status: 'Completed',
    teamsCount: 24,
    winner: {
      teamName: 'Axions',
      shortName: 'AXN',
      kills: 12,
      points: 22
    },
    mvp: {
      name: 'Kratos',
      ign: 'AXN-Kratos',
      kills: 7,
      teamName: 'Axions'
    },
    totalKills: 33,
    leaderboard: [
      { rank: 1, team: 'Axions', kills: 12, placementPoints: 10, killPoints: 12, totalPoints: 22 },
      { rank: 2, team: 'GodLike Esports', kills: 8, placementPoints: 8, killPoints: 8, totalPoints: 16 },
      { rank: 3, team: '401 Unauthorized', kills: 6, placementPoints: 5, killPoints: 6, totalPoints: 11 },
      { rank: 4, team: 'Elite Warriors', kills: 5, placementPoints: 3, killPoints: 5, totalPoints: 8 },
      { rank: 5, team: 'FARZ Esports', kills: 2, placementPoints: 1, killPoints: 2, totalPoints: 3 }
    ],
    proofs: {
      screenshots: [
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80'
      ]
    }
  },
  {
    id: 'match-03',
    matchNumber: 3,
    title: 'Match #3 / Livik',
    round: 'Match 3',
    map: 'Livik',
    date: '2026-09-02',
    time: '03:30 PM',
    status: 'Live',
    teamsCount: 24,
    teamA: 'GodLike Esports',
    teamB: 'Axions',
    killsA: 8,
    killsB: 5
  },
  {
    id: 'match-04',
    matchNumber: 4,
    title: 'Match #4 / Erangel',
    round: 'Match 4',
    map: 'Erangel',
    date: '2026-09-02',
    time: '06:00 PM',
    status: 'Upcoming',
    teamsCount: 24
  }
];

// 3. SYNCHRONIZED SELECTORS & CALCULATION HELPERS

/**
 * Calculates live standings dynamically from completed match results
 */
export function getStandingsData() {
  const standingsMap = {};

  // Initialize from canonical teams
  CANONICAL_TEAMS.forEach((t) => {
    standingsMap[t.teamName] = {
      teamId: t.id,
      registrationId: t.registrationId,
      teamName: t.teamName,
      shortName: t.shortName,
      collegeName: t.collegeName,
      played: 0,
      matchesPlayed: 0,
      wwcd: 0,
      placementPoints: 0,
      killPoints: 0,
      kills: 0,
      totalPoints: 0,
      points: 0
    };
  });

  // Aggregate results from completed matches
  CANONICAL_MATCHES.filter((m) => m.status === 'Completed' && m.leaderboard).forEach((m) => {
    if (m.winner?.teamName && standingsMap[m.winner.teamName]) {
      standingsMap[m.winner.teamName].wwcd += 1;
    }

    m.leaderboard.forEach((row) => {
      if (standingsMap[row.team]) {
        standingsMap[row.team].played += 1;
        standingsMap[row.team].matchesPlayed += 1;
        standingsMap[row.team].placementPoints += (row.placementPoints || 0);
        standingsMap[row.team].killPoints += (row.kills || 0);
        standingsMap[row.team].kills += (row.kills || 0);
        standingsMap[row.team].totalPoints += (row.totalPoints || 0);
        standingsMap[row.team].points += (row.totalPoints || 0);
      }
    });
  });

  // Convert to array and sort by Total Points -> WWCD -> Kills
  const standingsList = Object.values(standingsMap).sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.wwcd !== a.wwcd) return b.wwcd - a.wwcd;
    return b.kills - a.kills;
  });

  // Assign ranks
  return standingsList.map((item, idx) => ({
    ...item,
    rank: idx + 1
  }));
}

/**
 * Returns all players sorted by overall verified tournament kills
 */
export function getPlayerData() {
  const allPlayers = [];
  CANONICAL_TEAMS.forEach((team) => {
    team.players.forEach((p) => {
      allPlayers.push({
        ...p,
        teamName: team.teamName,
        teamShort: team.shortName,
        collegeName: team.collegeName,
        wwcd: team.wwcd || 0
      });
    });
  });

  // 4-Tier Official BGMI Tie-Breaker Order: Kills -> Chicken Dinners (WWCD) -> Fewer Matches -> KD Ratio
  return allPlayers.sort((a, b) => {
    if ((b.kills || 0) !== (a.kills || 0)) return (b.kills || 0) - (a.kills || 0);
    if ((b.wwcd || 0) !== (a.wwcd || 0)) return (b.wwcd || 0) - (a.wwcd || 0);
    if ((a.matchesPlayed || 1) !== (b.matchesPlayed || 1)) return (a.matchesPlayed || 1) - (b.matchesPlayed || 1);
    return (b.kdRatio || 0) - (a.kdRatio || 0);
  });
}

/**
 * Returns the single top fragger across the tournament
 */
export function getTopFraggerData() {
  const players = getPlayerData();
  return players[0] || null;
}

/**
 * Returns the overall tournament MVP
 */
export function getTournamentMVPData() {
  return getTopFraggerData();
}

/**
 * Returns completed match results
 */
export function getResultsData() {
  return CANONICAL_MATCHES.filter((m) => m.status === 'Completed');
}

/**
 * Updates or adds a completed match result in canonical in-memory state
 */
export function updateCanonicalMatchResult(payload) {
  if (!payload) return null;

  const matchNum = Number(payload.matchNumber);
  const targetMatch = CANONICAL_MATCHES.find(
    (m) =>
      String(m.id) === String(payload.matchId) ||
      String(m._id) === String(payload.matchId) ||
      Number(m.matchNumber) === matchNum
  );

  const updatedObj = {
    id: payload.matchId || targetMatch?.id || `match-${matchNum || 1}`,
    _id: payload._id || payload.id || targetMatch?._id || targetMatch?.id,
    matchId: payload.matchId || targetMatch?.matchId || targetMatch?.id,
    matchNumber: matchNum || targetMatch?.matchNumber || 1,
    title: `Match #${matchNum || 1} / ${payload.map || 'Erangel'}`,
    round: payload.round || targetMatch?.round || 'Semifinal',
    map: payload.map || targetMatch?.map || 'Erangel',
    date: payload.date || targetMatch?.date || '2026-09-02',
    time: payload.time || targetMatch?.time || '10:00 AM',
    status: 'Completed',
    teamsCount: 24,
    winner: {
      teamName: payload.winner?.teamName || 'Winner Squad',
      shortName: (payload.winner?.teamName || 'WIN').substring(0, 4).toUpperCase(),
      kills: payload.winner?.kills || 0,
      points: payload.winner?.totalPoints || 0
    },
    mvp: {
      name: payload.mvp?.name || payload.mvp?.ign || 'MVP Player',
      ign: payload.mvp?.ign || payload.mvp?.name || 'MVP',
      kills: payload.mvp?.kills || 0,
      teamName: payload.mvp?.team || payload.winner?.teamName || 'Winner Squad'
    },
    totalKills: payload.winner?.kills || 0,
    leaderboard: payload.leaderboard || []
  };

  if (targetMatch) {
    Object.assign(targetMatch, updatedObj);
  } else {
    CANONICAL_MATCHES.unshift(updatedObj);
  }

  // Recalculate standings and sync CANONICAL_TEAMS array
  const updatedStandings = getStandingsData();
  updatedStandings.forEach((st) => {
    const t = CANONICAL_TEAMS.find(
      (team) => team.id === st.teamId || team.teamName === st.teamName || team.shortName === st.shortName
    );
    if (t) {
      t.rank = st.rank;
      t.points = st.totalPoints || st.points;
      t.kills = st.kills;
      t.wwcd = st.wwcd;
      t.matchesPlayed = st.matchesPlayed;
    }
  });

  return updatedObj;
}


