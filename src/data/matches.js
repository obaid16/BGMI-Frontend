export const mockMatches = [
  {
    id: 'match-07',
    matchNumber: 7,
    title: 'Match #07 - Semifinal Group A vs B',
    round: 'Semifinal',
    map: 'Erangel',
    date: '2026-08-08',
    time: '10:30 AM',
    timestamp: new Date().getTime() + 1000 * 60 * 45, // 45 mins from now
    status: 'Upcoming', // 'Upcoming', 'Live', 'Completed'
    streamUrl: 'https://youtube.com/live/example',
    teamsCount: 16,
    participatingTeams: [
      { id: 'team-1', name: 'IIT Bombay Titans', shortName: 'TITANS' },
      { id: 'team-2', name: 'BITS Apex Esports', shortName: 'APEX' },
      { id: 'team-3', name: 'DTU Phoenix Esports', shortName: 'PHOENIX' },
      { id: 'team-4', name: 'RVCE Revenants', shortName: 'RVCE' },
      { id: 'team-5', name: 'VIT Venom Clan', shortName: 'VENOM' },
      { id: 'team-6', name: 'IIIT Hyderabad Spectres', shortName: 'SPECTRE' },
      { id: 'team-7', name: 'SRM Shadow Roster', shortName: 'SRM' },
      { id: 'team-8', name: 'MIT Cyber Knights', shortName: 'MIT' },
    ]
  },
  {
    id: 'match-08',
    matchNumber: 8,
    title: 'Match #08 - Grand Final Showdown',
    round: 'Grand Final',
    map: 'Miramar',
    date: '2026-08-08',
    time: '06:00 PM',
    timestamp: new Date().getTime() + 1000 * 60 * 60 * 8, // 8 hours from now
    status: 'Upcoming',
    streamUrl: 'https://youtube.com/live/example2',
    teamsCount: 16,
    participatingTeams: [
      { id: 'team-1', name: 'IIT Bombay Titans', shortName: 'TITANS' },
      { id: 'team-2', name: 'BITS Apex Esports', shortName: 'APEX' },
      { id: 'team-3', name: 'DTU Phoenix Esports', shortName: 'PHOENIX' },
      { id: 'team-4', name: 'RVCE Revenants', shortName: 'RVCE' },
      { id: 'team-5', name: 'VIT Venom Clan', shortName: 'VENOM' },
      { id: 'team-6', name: 'IIIT Hyderabad Spectres', shortName: 'SPECTRE' }
    ]
  },
  {
    id: 'match-06',
    matchNumber: 6,
    title: 'Match #06 - Semifinal Miramar Battle',
    round: 'Semifinal',
    map: 'Miramar',
    date: '2026-08-07',
    time: '04:00 PM',
    status: 'Completed',
    winner: {
      id: 'team-1',
      name: 'IIT Bombay Titans',
      shortName: 'TITANS',
      kills: 12,
      points: 27
    },
    topFragger: {
      name: 'Aditya Verma (TITAN_BLAZE)',
      team: 'IIT Bombay Titans',
      kills: 6
    },
    participatingTeamsCount: 16
  },
  {
    id: 'match-05',
    matchNumber: 5,
    title: 'Match #05 - Quarterfinal Sanhok Survival',
    round: 'Quarterfinal',
    map: 'Sanhok',
    date: '2026-08-07',
    time: '01:30 PM',
    status: 'Completed',
    winner: {
      id: 'team-2',
      name: 'BITS Apex Esports',
      shortName: 'APEX',
      kills: 14,
      points: 29
    },
    topFragger: {
      name: 'Kabir Roy (APEX_FRAGGER)',
      team: 'BITS Apex Esports',
      kills: 7
    },
    participatingTeamsCount: 16
  },
  {
    id: 'match-04',
    matchNumber: 4,
    title: 'Match #04 - Quarterfinal Erangel Assault',
    round: 'Quarterfinal',
    map: 'Erangel',
    date: '2026-08-06',
    time: '05:00 PM',
    status: 'Completed',
    winner: {
      id: 'team-3',
      name: 'DTU Phoenix Esports',
      shortName: 'PHOENIX',
      kills: 10,
      points: 25
    },
    topFragger: {
      name: 'Yash Vardhan (PHX_FIREFLAME)',
      team: 'DTU Phoenix Esports',
      kills: 5
    },
    participatingTeamsCount: 16
  },
  {
    id: 'match-03',
    matchNumber: 3,
    title: 'Match #03 - Group Stage Vikendi Freeze',
    round: 'Group Stage',
    map: 'Vikendi',
    date: '2026-08-06',
    time: '02:00 PM',
    status: 'Completed',
    winner: {
      id: 'team-1',
      name: 'IIT Bombay Titans',
      shortName: 'TITANS',
      kills: 15,
      points: 30
    },
    topFragger: {
      name: 'Rohan Sharma (TITAN_VIPER)',
      team: 'IIT Bombay Titans',
      kills: 6
    },
    participatingTeamsCount: 16
  }
];
