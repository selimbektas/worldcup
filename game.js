
const stages = [
  {name:'GROUP STAGE · MATCH 1', knockout:false},
  {name:'GROUP STAGE · MATCH 2', knockout:false},
  {name:'GROUP STAGE · MATCH 3', knockout:false},
  {name:'ROUND OF 16', knockout:true},
  {name:'QUARTER FINAL', knockout:true},
  {name:'SEMI FINAL', knockout:true},
  {name:'FINAL', knockout:true}
];

function playMatch(teamStrength, oppPower, knockout=false){

  const strengthDiff = teamStrength - oppPower;

  let winProb = 0.50 + (strengthDiff / 100);
  winProb = Math.max(0.15, Math.min(0.85, winProb));

  const roll = Math.random();

  let result;

  if(roll < winProb - 0.15){
    result = "W";
  }else if(roll < winProb + 0.15){
    result = "D";
  }else{
    result = "L";
  }

  let gf = 0;
  let ga = 0;

  if(result === "W"){
    gf = 1 + Math.floor(Math.random()*4);
    ga = Math.floor(Math.random()*Math.min(3,gf));
  }

  if(result === "D"){
    gf = Math.floor(Math.random()*3);
    ga = gf;
  }

  if(result === "L"){
    ga = 1 + Math.floor(Math.random()*4);
    gf = Math.floor(Math.random()*Math.min(3,ga));
  }

  if(knockout && result === "D"){
    const pens =
      Math.random() < (teamStrength / (teamStrength + oppPower));

    if(pens){
      result = "W";
      gf++;
    }else{
      result = "L";
      ga++;
    }
  }

  return {result,gf,ga};
}

simBtn.onclick = () => {

  const overall =
    squad.reduce((a,b)=>a+b.rating,0) / squad.length;

  let chemistry = 0;

  const teamsUsed = {};

  squad.forEach(p=>{
    teamsUsed[p.team] = (teamsUsed[p.team]||0)+1;
  });

  Object.values(teamsUsed).forEach(v=>{
    if(v >= 2) chemistry += (v-1);
  });

  const teamStrength = overall + chemistry;

  let html = "";
  let points = 0;
  let eliminated = false;
  let finish = "Champion";

  for(let i=0;i<3;i++){

    const opp = teams[Math.floor(Math.random()*teams.length)];

    const m =
      playMatch(teamStrength, opp.power, false);

    if(m.result==="W") points += 3;
    if(m.result==="D") points += 1;

    html += `
    <div class="match">
      <div>${stages[i].name}</div>
      <div>vs ${opp.name}</div>
      <div>${m.gf}-${m.ga} ${m.result}</div>
    </div>`;
  }

  if(points < 5){

    result.innerHTML =
      html +
      `<hr>
      <h2>ELIMINATED</h2>
      <p>Finish: Group Stage</p>
      <p>Points: ${points}</p>`;

    return;
  }

  for(let i=3;i<stages.length;i++){

    const opp =
      teams[Math.floor(Math.random()*teams.length)];

    const m =
      playMatch(teamStrength, opp.power, true);

    html += `
    <div class="match ${m.result==='L'?'loss':''}">
      <div>${stages[i].name}</div>
      <div>vs ${opp.name}</div>
      <div>${m.gf}-${m.ga} ${m.result}</div>
    </div>`;

    if(m.result==="L"){

      eliminated = true;
      finish = stages[i].name;

      break;
    }
  }

  result.innerHTML =
    html +
    `<hr>
    <h2>${eliminated ? 'ELIMINATED' : 'WORLD CUP CHAMPION 🏆'}</h2>
    <p>Team Strength: ${teamStrength.toFixed(1)}</p>
    <p>Best Finish: ${eliminated ? finish : 'Champion'}</p>`;
};
