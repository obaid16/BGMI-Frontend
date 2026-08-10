export const mockTeams = [
  {
    id: 'team-1',
    name: 'IIT Bombay Titans',
    shortName: 'TITANS',
    college: 'IIT Bombay',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    rank: 1,
    points: 142,
    wwcd: 3,
    kills: 58,
    matchesPlayed: 8,
    verified: true,
    captain: {
      name: 'Rohan Sharma',
      email: 'rohan.sharma@iitb.ac.in',
      phone: '+91 98765 43210'
    },
    registrationId: 'BGMI-2026-001',
    registrationDate: '2026-08-01',
    status: 'Approved',
    players: [
      {
        id: 'p-101',
        name: 'Rohan Sharma',
        ign: 'TITAN_VIPER',
        bgmiId: '5123987410',
        role: 'IGL',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        kills: 18,
        kdRatio: 2.25
      },
      {
        id: 'p-102',
        name: 'Aditya Verma',
        ign: 'TITAN_BLAZE',
        bgmiId: '5123987411',
        role: 'Assaulter',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        kills: 22,
        kdRatio: 2.75
      },
      {
        id: 'p-103',
        name: 'Vikram Patel',
        ign: 'TITAN_SNIPE',
        bgmiId: '5123987412',
        role: 'Sniper',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        kills: 12,
        kdRatio: 1.50
      },
      {
        id: 'p-104',
        name: 'Siddharth Rao',
        ign: 'TITAN_SHIELD',
        bgmiId: '5123987413',
        role: 'Support',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
        kills: 6,
        kdRatio: 0.75
      },
      {
        id: 'p-105',
        name: 'Karan Joshi',
        ign: 'TITAN_GHOST',
        bgmiId: '5123987414',
        role: 'Substitute',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        kills: 0,
        kdRatio: 0.00
      }
    ]
  },
  {
    id: 'team-2',
    name: 'BITS Apex Esports',
    shortName: 'APEX',
    college: 'BITS Pilani',
    logo: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    rank: 2,
    points: 128,
    wwcd: 2,
    kills: 52,
    matchesPlayed: 8,
    verified: true,
    captain: {
      name: 'Aarav Mehta',
      email: 'aarav@pilani.bits-pilani.ac.in',
      phone: '+91 98765 43211'
    },
    registrationId: 'BGMI-2026-002',
    registrationDate: '2026-08-02',
    status: 'Approved',
    players: [
      {
        id: 'p-201',
        name: 'Aarav Mehta',
        ign: 'APEX_COMMANDER',
        bgmiId: '5223987410',
        role: 'IGL',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        kills: 14,
        kdRatio: 1.75
      },
      {
        id: 'p-202',
        name: 'Kabir Roy',
        ign: 'APEX_FRAGGER',
        bgmiId: '5223987411',
        role: 'Entry Fragger',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        kills: 24,
        kdRatio: 3.00
      },
      {
        id: 'p-203',
        name: 'Dhruv Kapoor',
        ign: 'APEX_HAWK',
        bgmiId: '5223987412',
        role: 'Sniper',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        kills: 10,
        kdRatio: 1.25
      },
      {
        id: 'p-204',
        name: 'Manish Gupta',
        ign: 'APEX_DOC',
        bgmiId: '5223987413',
        role: 'Support',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        kills: 4,
        kdRatio: 0.50
      }
    ]
  },
  {
    id: 'team-3',
    name: 'DTU Phoenix Esports',
    shortName: 'PHOENIX',
    college: 'Delhi Technological University',
    logo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    rank: 3,
    points: 116,
    wwcd: 2,
    kills: 46,
    matchesPlayed: 8,
    verified: true,
    captain: {
      name: 'Yash Vardhan',
      email: 'yash@dtu.ac.in',
      phone: '+91 98765 43212'
    },
    registrationId: 'BGMI-2026-003',
    registrationDate: '2026-08-02',
    status: 'Approved',
    players: [
      {
        id: 'p-301',
        name: 'Yash Vardhan',
        ign: 'PHX_FIREFLAME',
        bgmiId: '5323987410',
        role: 'IGL',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        kills: 15,
        kdRatio: 1.87
      },
      {
        id: 'p-302',
        name: 'Tushar Anand',
        ign: 'PHX_STORM',
        bgmiId: '5323987411',
        role: 'Assaulter',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        kills: 19,
        kdRatio: 2.37
      },
      {
        id: 'p-303',
        name: 'Suraj Nair',
        ign: 'PHX_EAGLE',
        bgmiId: '5323987412',
        role: 'Sniper',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        kills: 8,
        kdRatio: 1.00
      },
      {
        id: 'p-304',
        name: 'Rahul Sen',
        ign: 'PHX_RESCUE',
        bgmiId: '5323987413',
        role: 'Support',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        kills: 4,
        kdRatio: 0.50
      }
    ]
  },
  {
    id: 'team-4',
    name: 'RVCE Revenants',
    shortName: 'RVCE',
    college: 'RV College of Engineering',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    rank: 4,
    points: 98,
    wwcd: 1,
    kills: 42,
    matchesPlayed: 8,
    verified: true,
    captain: {
      name: 'Nikhil Gowda',
      email: 'nikhil@rvce.edu.in',
      phone: '+91 98765 43213'
    },
    registrationId: 'BGMI-2026-004',
    registrationDate: '2026-08-03',
    status: 'Approved',
    players: [
      {
        id: 'p-401',
        name: 'Nikhil Gowda',
        ign: 'RV_DEADSHOT',
        bgmiId: '5423987410',
        role: 'Assaulter',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        kills: 17,
        kdRatio: 2.12
      },
      {
        id: 'p-402',
        name: 'Karthik S',
        ign: 'RV_TACTICIAN',
        bgmiId: '5423987411',
        role: 'IGL',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        kills: 11,
        kdRatio: 1.37
      },
      {
        id: 'p-403',
        name: 'Praveen Kumar',
        ign: 'RV_SNIPER_X',
        bgmiId: '5423987412',
        role: 'Sniper',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        kills: 9,
        kdRatio: 1.12
      },
      {
        id: 'p-404',
        name: 'Varun Hegde',
        ign: 'RV_MEDIC',
        bgmiId: '5423987413',
        role: 'Support',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
        kills: 5,
        kdRatio: 0.62
      }
    ]
  },
  {
    id: 'team-5',
    name: 'VIT Venom Clan',
    shortName: 'VENOM',
    college: 'VIT Vellore',
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    rank: 5,
    points: 89,
    wwcd: 0,
    kills: 45,
    matchesPlayed: 8,
    verified: true,
    captain: {
      name: 'Anirudh Menon',
      email: 'anirudh@vit.ac.in',
      phone: '+91 98765 43214'
    },
    registrationId: 'BGMI-2026-005',
    registrationDate: '2026-08-04',
    status: 'Approved',
    players: [
      {
        id: 'p-501',
        name: 'Anirudh Menon',
        ign: 'VNM_STRIKER',
        bgmiId: '5523987410',
        role: 'Entry Fragger',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&auto=format&fit=crop&q=80',
        kills: 16,
        kdRatio: 2.00
      },
      {
        id: 'p-502',
        name: 'Deepak Raj',
        ign: 'VNM_MIND',
        bgmiId: '5523987411',
        role: 'IGL',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        kills: 10,
        kdRatio: 1.25
      },
      {
        id: 'p-503',
        name: 'Gautam Pillai',
        ign: 'VNM_SHADOW',
        bgmiId: '5523987412',
        role: 'Assaulter',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        kills: 12,
        kdRatio: 1.50
      },
      {
        id: 'p-504',
        name: 'Hari Krishnan',
        ign: 'VNM_WALL',
        bgmiId: '5523987413',
        role: 'Support',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        kills: 7,
        kdRatio: 0.87
      }
    ]
  },
  {
    id: 'team-6',
    name: 'IIIT Hyderabad Spectres',
    shortName: 'SPECTRE',
    college: 'IIIT Hyderabad',
    logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    rank: 6,
    points: 74,
    wwcd: 0,
    kills: 34,
    matchesPlayed: 8,
    verified: true,
    captain: {
      name: 'Srikar Reddy',
      email: 'srikar@iiit.ac.in',
      phone: '+91 98765 43215'
    },
    registrationId: 'BGMI-2026-006',
    registrationDate: '2026-08-04',
    status: 'Approved',
    players: [
      {
        id: 'p-601',
        name: 'Srikar Reddy',
        ign: 'SPEC_PHANTOM',
        bgmiId: '5623987410',
        role: 'IGL',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        kills: 9,
        kdRatio: 1.12
      },
      {
        id: 'p-602',
        name: 'Praneeth Ch',
        ign: 'SPEC_NINJA',
        bgmiId: '5623987411',
        role: 'Assaulter',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        kills: 14,
        kdRatio: 1.75
      },
      {
        id: 'p-603',
        name: 'Mahesh Babu',
        ign: 'SPEC_SCOPE',
        bgmiId: '5623987412',
        role: 'Sniper',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
        kills: 7,
        kdRatio: 0.87
      },
      {
        id: 'p-604',
        name: 'Chaitanya V',
        ign: 'SPEC_BACKUP',
        bgmiId: '5623987413',
        role: 'Support',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        kills: 4,
        kdRatio: 0.50
      }
    ]
  },
  {
    id: 'team-7',
    name: 'SRM Shadow Roster',
    shortName: 'SRM',
    college: 'SRM Institute of Science and Tech',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    rank: 7,
    points: 68,
    wwcd: 0,
    kills: 30,
    matchesPlayed: 8,
    verified: false,
    captain: {
      name: 'Ashwin Kumar',
      email: 'ashwin@srmist.edu.in',
      phone: '+91 98765 43216'
    },
    registrationId: 'BGMI-2026-007',
    registrationDate: '2026-08-05',
    status: 'Pending',
    players: [
      {
        id: 'p-701',
        name: 'Ashwin Kumar',
        ign: 'SRM_SHADOW',
        bgmiId: '5723987410',
        role: 'IGL',
        verified: false,
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        kills: 8,
        kdRatio: 1.00
      },
      {
        id: 'p-702',
        name: 'Vikas Swamy',
        ign: 'SRM_REAPER',
        bgmiId: '5723987411',
        role: 'Entry Fragger',
        verified: false,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        kills: 11,
        kdRatio: 1.37
      },
      {
        id: 'p-703',
        name: 'Siddharth M',
        ign: 'SRM_CYBORG',
        bgmiId: '5723987412',
        role: 'Assaulter',
        verified: false,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        kills: 7,
        kdRatio: 0.87
      },
      {
        id: 'p-704',
        name: 'Dinesh K',
        ign: 'SRM_ANCHOR',
        bgmiId: '5723987413',
        role: 'Support',
        verified: false,
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
        kills: 4,
        kdRatio: 0.50
      }
    ]
  },
  {
    id: 'team-8',
    name: 'MIT Cyber Knights',
    shortName: 'MIT',
    college: 'Manipal Institute of Technology',
    logo: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    rank: 8,
    points: 59,
    wwcd: 0,
    kills: 28,
    matchesPlayed: 8,
    verified: true,
    captain: {
      name: 'Rishi Sunak',
      email: 'rishi@manipal.edu',
      phone: '+91 98765 43217'
    },
    registrationId: 'BGMI-2026-008',
    registrationDate: '2026-08-05',
    status: 'Approved',
    players: [
      {
        id: 'p-801',
        name: 'Rishi Sunak',
        ign: 'MIT_KNIGHT',
        bgmiId: '5823987410',
        role: 'IGL',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        kills: 8,
        kdRatio: 1.00
      },
      {
        id: 'p-802',
        name: 'Varun B',
        ign: 'MIT_GLADIATOR',
        bgmiId: '5823987411',
        role: 'Assaulter',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        kills: 10,
        kdRatio: 1.25
      },
      {
        id: 'p-803',
        name: 'Nitin K',
        ign: 'MIT_SNIPEX',
        bgmiId: '5823987412',
        role: 'Sniper',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        kills: 6,
        kdRatio: 0.75
      },
      {
        id: 'p-804',
        name: 'Abhinav P',
        ign: 'MIT_SUPPORT',
        bgmiId: '5823987413',
        role: 'Support',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        kills: 4,
        kdRatio: 0.50
      }
    ]
  }
];
