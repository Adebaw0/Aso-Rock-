let year = 1;

// NATIONAL STATS
let stats = {
  trust: 65,
  economy: 50,
  security: 45,
  infrastructure: 40,
  food: 35,
  sovereignty: 40,
  global: 30
};

// MILITARY
let military = { army: 40, navy: 30, airforce: 30 };

// RESOURCES
let resources = { oil: 50, minerals: 45, agriculture: 40 };

// REGIONS
let regions = {
  north: { name: "Northern Region", stability: 50, threat: 40 },
  south: { name: "Southern Region", stability: 55, threat: 35 },
  sea: { name: "Territorial Waters", stability: 45, threat: 50 },
  air: { name: "National Airspace", stability: 50, threat: 30 }
};

// WAR STATE
let warState = { atWar: false, enemyPower: 0, type: null };

// LEADERBOARD
let leaderboard = [];

// PREMIUM
let premium = false;

// EVENTS
const events = [
  { title: "Food Independence Policy", text: "Achieve food security.", choices: [
    { text: "Build mega-farms", effect: { food: 12, economy: 6, sovereignty: 4 } },
    { text: "Delay reforms", effect: { trust: -8, food: -6 } }
  ]},
  { title: "Infrastructure Plan", text: "Upgrade roads, ports, airports.", choices: [
    { text: "Build infrastructure", effect: { infrastructure: 12, economy: 5, global: 4 } },
    { text: "Postpone upgrades", effect: { trust: -6 } }
  ]},
  { title: "Military Modernization", text: "Armed forces require upgrades.", choices: [
    { text: "Upgrade Army, Navy & Air Force", effect: { security: 10, sovereignty: 6, global: 6 } },
    { text: "Minimal upgrades", effect: { security: -6 } }
  ]},
  { title: "Nuclear Program", text: "Propose nuclear energy facility.", choices: [
    { text: "Proceed transparently", effect: { infrastructure: 8, economy: 8, global: 10 } },
    { text: "Cancel under pressure", effect: { sovereignty: -8 } }
  ]}
];

// REGIONAL EVENTS
const regionalEvents = [
  { region: "north", title: "Insurgency in the North", text: "Terrorist cells increasing attacks.", choices: [
    { text: "Deploy Army", effect: () => { regions.north.threat -= 12; regions.north.stability += 8; stats.security += 6; }},
    { text: "Neglect situation", effect: () => { regions.north.threat += 10; regions.north.stability -= 12; stats.trust -= 8; }}
  ]},
  { region: "south", title: "Oil Sabotage", text: "Pipelines under attack.", choices: [
    { text: "Secure oil fields", effect: () => { regions.south.threat -= 10; regions.south.stability += 6; stats.economy += 6; }},
    { text: "Ignore", effect: () => { regions.south.stability -= 10; stats.economy -= 8; }}
  ]},
  { region: "sea", title: "Naval Incursion", text: "Foreign ships violate waters.", choices: [
    { text: "Deploy Navy", effect: () => { regions.sea.threat -= 12; regions.sea.stability += 8; military.navy += 6; stats.sovereignty += 6; }},
    { text: "Avoid confrontation", effect: () => { regions.sea.threat += 10; stats.sovereignty -= 8; }}
  ]},
  { region: "air", title: "Airspace Provocation", text: "Foreign aircraft test defenses.", choices: [
    { text: "Scramble jets", effect: () => { regions.air.threat -= 10; regions.air.stability += 8; military.airforce += 6; }},
    { text: "Diplomatic warning", effect: () => { regions.air.threat += 6; stats.global += 4; }}
  ]}
];

// UPDATE UI
function updateUI() {
  trustBar.value = stats.trust;
  ecoBar.value = stats.economy;
  secBar.value = stats.security;
  infra.innerText = stats.infrastructure;
  food.innerText = stats.food;
  sovBar.value = stats.sovereignty;
  globBar.value = stats.global;
  document.getElementById("year").innerText = `Year: ${year}`;
}

// RANDOM EVENT
function randomEvent() {
  const pool = Math.random() < 0.6 ? events : regionalEvents;
  return pool[Math.floor(Math.random() * pool.length)];
}

// LOAD EVENT
let currentEvent;
function loadEvent() {
  currentEvent = randomEvent();
  eventTitle.innerText = currentEvent.title;
  eventText.innerText = currentEvent.text;

  choices.innerHTML = "";
  currentEvent.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice.text;
    btn.onclick = () => applyChoice(choice.effect);
    choices.appendChild(btn);
  });
}

// APPLY CHOICE
function applyChoice(effect) {
  if (typeof effect === "function") effect();
  else { for (let key in effect) { stats[key] += effect[key]; stats[key] = Math.max(0, Math.min(100, stats[key])); } }
  updateUI();
  loadEvent();
}

// WAR CHECK
function checkForWar() {
  const totalThreat = regions.north.threat + regions.south.threat + regions.sea.threat + regions.air.threat;
  if (totalThreat > 220 && !warState.atWar) {
    warState.atWar = true;
    warState.enemyPower = Math.floor(Math.random()*40)+60;
    warState.type = ["terror","invasion","naval","air"][Math.floor(Math.random()*4)];
    alert(`⚠️ WAR ERUPTS: ${warState.type.toUpperCase()} CONFLICT`);
  }
}

function resolveWar() {
  if (!warState.atWar) return;
  const yourPower = military.army + military.navy + military.airforce + stats.security + stats.sovereignty;
  if (yourPower > warState.enemyPower) {
    stats.trust += 6; stats.sovereignty += 8; stats.global += 6;
    alert("🇳🇬 Victory secured. Nigeria stands stronger.");
  } else { stats.trust -= 12; stats.security -= 15; alert("❌ Defeat. National stability shaken."); }
  warState.atWar = false; warState.enemyPower = 0;
}

// AI ESCALATION
function aiEscalation() {
  if (stats.economy>70) stats.global+=2;
  if (stats.sovereignty>70) stats.global+=3;
  if (stats.food>65) stats.global+=1;
  if (stats.global>80){ regions.sea.threat+=4; regions.air.threat+=4; }
}

// SAVE/LOAD
function saveGame(){ localStorage.setItem("presidencySave", JSON.stringify({year,stats,military,resources,regions})); alert("Game Saved 🇳🇬"); }
function loadGame(){ 
  const data = localStorage.getItem("presidencySave"); 
  if(!data){ alert("No saved game found."); return; } 
  const g=JSON.parse(data); year=g.year; stats=g.stats; military=g.military; resources=g.resources; regions=g.regions; updateUI(); loadEvent(); alert("Game Loaded ✔");
}

// LEADERBOARD
function submitScore(playerName){
  const score = year*5 + stats.trust + stats.economy + stats.security + stats.sovereignty + stats.infrastructure + stats.food - stats.global;
  leaderboard.push({name:playerName,score}); leaderboard.sort((a,b)=>b.score-a.score); if(leaderboard.length>10) leaderboard.pop();
  alert("Top Leaders: "+leaderboard.map(l=>`${l.name}: ${l.score}`).join(", "));
}

// PREMIUM
function unlockPremium(){ premium=true; alert("⭐ Premium Mode Activated"); }

// NEXT YEAR
function nextYear(){
  year++;
  stats.global+=Math.floor(year/4);
  stats.trust-=Math.floor(year/8);
  checkForWar();
  resolveWar();
  aiEscalation();

  for(let key in regions){ if(regions[key].stability<=0){ document.body.innerHTML=`<h1>⚠️ Regional Collapse</h1><p>${regions[key].name} has fallen into chaos.</p><p>Your presidency failed to maintain national unity.</p>`; return; } }

  if(stats.trust<=0||stats.security<=0||stats.economy<=0||stats.sovereignty<=0){ document.body.innerHTML=`<h1>🇳🇬 Nation Collapsed – Year ${year}</h1><p>Your leadership could not withstand pressure.</p>`; return; }

  if(!premium && year%5===0) alert("🔓 Unlock Premium to access Hardcore Mode & History Archive");
  loadEvent();
  updateUI();
}

// START GAME
loadEvent();
updateUI();
