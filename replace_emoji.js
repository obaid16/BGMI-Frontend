const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/teams/[id]/page.jsx',
  'src/components/tournament/ResultCard.jsx',
  'src/components/tournament/Top3Leaderboard.jsx',
  'src/components/tournament/RankingCard.jsx',
  'src/components/tournament/TeamCard.jsx',
  'src/components/tournament/tabs/MVPTab.jsx'
];

const svgIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>`;

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file); // We will run this from BGMI-Frontend/scripts, wait I'll put it in BGMI-Frontend
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/🍗/g, svgIcon);
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
