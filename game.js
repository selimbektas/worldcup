// =========================
// DOM
// =========================

const rollBtn = document.getElementById("rollBtn");
const simBtn = document.getElementById("simBtn");

const draw = document.getElementById("draw");
const choices = document.getElementById("choices");
const squadEl = document.getElementById("squadEl");
const step = document.getElementById("step");
const result = document.getElementById("result");

// =========================
// STATE
// =========================

let picks = 0;
let squad = [];

const usedTeams = new Set();

// =========================
// ROLL SYSTEM
// =========================

rollBtn.onclick = () => {

  if (picks >= 11) return;

  const availableTeams =
    teams.filter(
      t => !usedTeams.has(t.name)
    );

  if (!availableTeams.length) {
    draw.innerHTML =
      "<p>No teams remaining.</p>";
    return;
  }

  const team =
    availableTeams[
      Math.floor(
        Math.random() *
        availableTeams.length
      )
    ];

  draw.innerHTML = `
    <h3>${team.name}</h3>
    <p>Choose one player</p>
  `;

  choices.innerHTML = "";

  team.players.forEach(player => {

    const d =
      document.createElement("div");

    d.className = "choice";

    d.innerHTML = `
      <strong>${player.name}</strong>
      <br>
      ${player.position}
      ·
      ${player.rating}
    `;

    d.onclick = () => {

      usedTeams.add(team.name);

      squad.push({
        name: player.name,
        rating: player.rating,
        position: player.position,
        team: team.name
      });

      const li =
        document.createElement("li");

      li.innerHTML =
        `${player.position} · ${player.name} (${team.name})`;

      squadEl.appendChild(li);

      picks++;

      step.textContent =
        picks < 11
          ? `Roll ${picks + 1} / 11`
          : "Squad Complete";

      draw.innerHTML = "";
      choices.innerHTML = "";

      if (picks === 11) {

        rollBtn.disabled = true;
        simBtn.disabled = false;

        step.textContent =
          "Squad Complete ✓";
      }
    };

    choices.appendChild(d);

  });

};

// =========================
// DIFFICULTY
// =========================

function getOpponentPool(stage){

  if(stage.includes("GROUP")){
    return teams.filter(
      t => ["B","C","D"].includes(t.tier)
    );
  }

  if(stage === "ROUND OF 16"){
    return teams.filter(
      t => ["A","B"].includes(t.tier)
    );
  }

  if(stage === "QUARTER FINAL"){
    return teams.filter(
      t => ["A","S"].includes(t.tier)
    );
  }

  if(stage === "SEMI FINAL"){
    return teams.filter(
      t => t.tier === "S"
    );
  }

  if(stage === "FINAL"){
    return teams.filter(
      t => t.tier === "S"
    );
  }

  return teams;
}

// =========================
// MATCH ENGINE
// =========================

function playMatch(
  teamStrength,
  oppPower,
  knockout = false
){

  const strengthDiff =
    teamStrength - oppPower;

  let winProb =
    0.45 + (strengthDiff / 120);

  winProb =
    Math.max(
      0.15,
      Math.min(0.85, winProb)
    );

  if(Math.random() < 0.05){
    winProb *= 0.5;
  }

  const roll = Math.random();

  let result;

  if(roll < winProb - 0.15){
    result = "W";
  }else if(
    roll < winProb + 0.15
  ){
    result = "D";
  }else{
    result = "L";
  }

  let gf = 0;
  let ga = 0;

  if(result === "W"){
    gf =
      1 + Math.floor(Math.random()*4);

    ga =
      Math.floor(
        Math.random() *
        Math.min(3,gf)
      );
  }

  if(result === "D"){
    gf =
      Math.floor(Math.random()*3);

    ga = gf;
  }

  if(result === "L"){
    ga =
      1 + Math.floor(Math.random()*4);

    gf =
      Math.floor(
        Math.random() *
        Math.min(3,ga)
      );
  }

  if(knockout && result === "D"){

    const pens =
      Math.random() <
      (
        teamStrength /
        (teamStrength + oppPower)
      );

    if(pens){
      result = "W";
      gf++;
    }else{
      result = "L";
      ga++;
    }
  }

  return {
    result,
    gf,
    ga
  };
}

// =========================
// SIMULATION
// =========================

simBtn.onclick = () => {

  if(squad.length < 11){

    alert(
      "Complete your XI first."
    );

    return;
  }

  const teamStrength =
    squad.reduce(
      (a,b) => a + b.rating,
      0
    ) / squad.length;

  let html = "";
  let points = 0;

  // GROUPS

  for(let i=1;i<=3;i++){

    const pool =
      getOpponentPool(
        "GROUP"
      );

    const opp =
      pool[
        Math.floor(
          Math.random() *
          pool.length
        )
      ];

    const match =
      playMatch(
        teamStrength,
        opp.power,
        false
      );

    if(match.result==="W")
      points += 3;

    if(match.result==="D")
      points += 1;

    html += `
      <div class="match">
        <div>GROUP STAGE · MATCH ${i}</div>
        <div>vs ${opp.name}</div>
        <div>
          ${match.gf}-${match.ga}
          ${match.result}
        </div>
      </div>
    `;
  }

  if(points < 6){

    result.innerHTML =
      html +
      `
      <hr>
      <h2>ELIMINATED</h2>
      <p>Finish: Group Stage</p>
      <p>Points: ${points}</p>
      `;

    return;
  }

  const rounds = [
    {
      name:"ROUND OF 16",
      penalty:2
    },
    {
      name:"QUARTER FINAL",
      penalty:4
    },
    {
      name:"SEMI FINAL",
      penalty:6
    },
    {
      name:"FINAL",
      penalty:8
    }
  ];

  for(const round of rounds){

    const pool =
      getOpponentPool(
        round.name
      );

    const opp =
      pool[
        Math.floor(
          Math.random() *
          pool.length
        )
      ];

    const match =
      playMatch(
        teamStrength -
        round.penalty,
        opp.power,
        true
      );

    html += `
      <div class="match ${match.result==='L' ? 'loss' : ''}">
        <div>${round.name}</div>
        <div>vs ${opp.name}</div>
        <div>
          ${match.gf}-${match.ga}
          ${match.result}
        </div>
      </div>
    `;

    if(match.result==="L"){

      result.innerHTML =
        html +
        `
        <hr>
        <h2>ELIMINATED</h2>
        <p>Finish: ${round.name}</p>
        <p>Team Strength: ${teamStrength.toFixed(1)}</p>
        `;

      return;
    }
  }

  result.innerHTML =
    html +
    `
    <hr>
    <h2>WORLD CUP CHAMPION 🏆</h2>
    <p>Team Strength: ${teamStrength.toFixed(1)}</p>
    `;
};
