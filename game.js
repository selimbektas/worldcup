const order=['GK','RB','CB1','CB2','LB','CM1','CM2','CM3','RW','ST','LW'];
let idx=0,squad={},history=[];
const norm=p=>p.startsWith('CB')?'CB':p.startsWith('CM')?'CM':p;

rollBtn.onclick=()=>{
 if(idx>=11)return;
 const pos=order[idx];
 const team=teams[Math.floor(Math.random()*teams.length)];
 squad[pos]={team,player:null};
 current.innerHTML=`<h3>${pos} - ${team.name}</h3>`;
 choices.innerHTML='';
 (team.players[norm(pos)]||[]).forEach(pl=>{
  const d=document.createElement('div');
  d.className='choice';
  d.textContent=`${pl[0]} (${pl[1]})`;
  d.onclick=()=>{
   squad[pos].player={name:pl[0],rating:pl[1]};
   idx++;
   progress.textContent=`${idx} / 11`;
   choices.innerHTML='';
   current.innerHTML+=`<p>✓ ${pl[0]}</p>`;
   if(idx===11) simulateBtn.disabled=false;
  };
  choices.appendChild(d);
 });
};

simulateBtn.onclick=()=>{
 let total=0;
 Object.values(squad).forEach(x=>total+=x.player.rating);
 const power=(total/11).toFixed(1);
 const goals=Math.max(0,Math.round((power-80)/3 + Math.random()*3));
 const opp=['Spain 2010','Brazil 2002','France 1998'][Math.floor(Math.random()*3)];
 const conceded=Math.floor(Math.random()*3);
 const target=`${Math.min(goals,7)}/7`;
 result.innerHTML=`<h2>${goals}-${conceded}</h2><p>Power ${power}</p><p>Target ${target}</p>`;
 history.unshift(`${opp}: ${goals}-${conceded} (${target})`);
 historyDiv();
};
function historyDiv(){
 document.getElementById('history').innerHTML=history.map(x=>`<div>${x}</div>`).join('');
}