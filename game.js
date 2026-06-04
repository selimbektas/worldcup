
function getOpponentPool(stage){

  if(stage.includes("GROUP")){
    return teams.filter(t => ["B","C","D"].includes(t.tier));
  }

  if(stage === "ROUND OF 16"){
    return teams.filter(t => ["A","B"].includes(t.tier));
  }

  if(stage === "QUARTER FINAL"){
    return teams.filter(t => ["A","S"].includes(t.tier));
  }

  if(stage === "SEMI FINAL"){
    return teams.filter(t => t.tier === "S");
  }

  if(stage === "FINAL"){
    return teams.filter(t => t.tier === "S");
  }

  return teams;
}

function playMatch(teamStrength, oppPower, knockout=false){

  const strengthDiff = teamStrength - oppPower;

  let winProb = 0.45 + (strengthDiff / 120);
  winProb = Math.max(0.15, Math.min(0.85, winProb));

  // upset factor
  if(Math.random() < 0.05){
    winProb *= 0.5;
  }

  const roll = Math.random();

  let result;

  if(roll < winProb - 0.15){
    result = "W";
  }else if(roll < winProb + 0.15){
    result = "D";
  }else{
    result = "L";
  }

  let gf=0, ga=0;

  if(result==="W"){
    gf = 1 + Math.floor(Math.random()*4);
    ga = Math.floor(Math.random()*Math.min(3,gf));
  }

  if(result==="D"){
    gf = Math.floor(Math.random()*3);
    ga = gf;
  }

  if(result==="L"){
    ga = 1 + Math.floor(Math.random()*4);
    gf = Math.floor(Math.random()*Math.min(3,ga));
  }

  if(knockout && result==="D"){
    const pens =
      Math.random() <
      (teamStrength/(teamStrength+oppPower));

    result = pens ? "W" : "L";

    if(pens){ gf++; }
    else { ga++; }
  }

  return {result,gf,ga};
}

simBtn.onclick = () => {

  const overall =
    squad.reduce((a,b)=>a+b.rating,0) / squad.length;

  let chemistry = 0;

  const nations = {};

  squad.forEach(p=>{
    nations[p.team] = (nations[p.team]||0)+1;
  });

  Object.values(nations).forEach(v=>{
    if(v>1) chemistry += (v-1);
  });

  const teamStrength = overall + chemistry;

  let html = "";
  let points = 0;

  // GROUP STAGE
  for(let i=1;i<=3;i++){

    const pool = getOpponentPool("GROUP");
    const opp = pool[Math.floor(Math.random()*pool.length)];

    const match =
      playMatch(teamStrength, opp.power, false);

    if(match.result==="W") points += 3;
    if(match.result==="D") points += 1;

    html += `<div class="match">
      <div>GROUP STAGE · MATCH ${i}</div>
      <div>vs ${opp.name}</div>
      <div>${match.gf}-${match.ga} ${match.result}</div>
    </div>`;
  }

  // harder qualification
  if(points < 6){

    result.innerHTML =
      html +
      `<hr>
      <h2>ELIMINATED</h2>
      <p>Finish: Group Stage</p>
      <p>Points: ${points}</p>`;

    return;
  }

  const rounds = [
    {name:"ROUND OF 16", penalty:2},
    {name:"QUARTER FINAL", penalty:4},
    {name:"SEMI FINAL", penalty:6},
    {name:"FINAL", penalty:8}
  ];

  for(const round of rounds){

    const pool = getOpponentPool(round.name);
    const opp = pool[Math.floor(Math.random()*pool.length)];

    const effectiveStrength =
      teamStrength - round.penalty;

    const match =
      playMatch(
        effectiveStrength,
        opp.power,
        true
      );

    html += `<div class="match ${match.result==='L'?'loss':''}">
      <div>${round.name}</div>
      <div>vs ${opp.name}</div>
      <div>${match.gf}-${match.ga} ${match.result}</div>
    </div>`;

    if(match.result==="L"){

      result.innerHTML =
        html +
        `<hr>
        <h2>ELIMINATED</h2>
        <p>Finish: ${round.name}</p>
        <p>Team Strength: ${teamStrength.toFixed(1)}</p>`;

      return;
    }
  }

  result.innerHTML =
    html +
    `<hr>
    <h2>WORLD CUP CHAMPION 🏆</h2>
    <p>Team Strength: ${teamStrength.toFixed(1)}</p>
    <p>Difficulty Scaling Enabled</p>`;
};
