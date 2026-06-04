
// Draft fix for object-based dataset

rollBtn.onclick = () => {

  const team = weightedRandomTeam();

  draw.innerHTML = `<h3>${team.name}</h3>`;
  choices.innerHTML = "";

  if(!team.players || !team.players.length){
    draw.innerHTML = "No players available";
    return;
  }

  const availablePlayers =
    team.players.filter(
      p => !used.has(p.name)
    );

  if(!availablePlayers.length){
    draw.innerHTML = `<h3>${team.name}</h3><p>All players already used. Roll again.</p>`;
    return;
  }

  availablePlayers.forEach(player => {

    const d = document.createElement("div");

    d.className = "choice";

    d.innerHTML = `
      <strong>${player.name}</strong>
      <br>
      ${player.position} · ${player.rating}
    `;

    d.onclick = () => {

      used.add(player.name);

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

      if(picks === 11){
        rollBtn.disabled = true;
        simBtn.disabled = false;
      }
    };

    choices.appendChild(d);
  });

};
