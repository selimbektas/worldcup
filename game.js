let roll=0;
let squad=[];
let used=new Set();
let history=[];

const step=document.getElementById('step');
const draw=document.getElementById('draw');
const choices=document.getElementById('choices');
const squadEl=document.getElementById('squad');

rollBtn.onclick=()=>{
 if(roll>=11)return;
 const t=teams[Math.floor(Math.random()*teams.length)];
 draw.innerHTML='<h3>'+t.name+'</h3>';
 choices.innerHTML='';
 t.players.filter(p=>!used.has(p[0])).forEach(p=>{
   const d=document.createElement('div');
   d.className='choice';
   d.textContent=p[0]+' ('+p[1]+')';
   d.onclick=()=>pick(t,p);
   choices.appendChild(d);
 });
};

function pick(team,p){
 used.add(p[0]);
 squad.push({team:team.name,name:p[0],rating:p[1]});
 const li=document.createElement('li');
 li.textContent=p[0]+' — '+team.name;
 squadEl.appendChild(li);

 roll++;
 step.textContent='Roll '+Math.min(roll+1,11)+' / 11';
 draw.innerHTML='';
 choices.innerHTML='';

 if(roll===11){
   rollBtn.disabled=true;
   simBtn.disabled=false;
   step.textContent='Squad Complete';
 }
}

simBtn.onclick=()=>{
 const avg=squad.reduce((a,b)=>a+b.rating,0)/11;
 const opp=teams[Math.floor(Math.random()*teams.length)];
 const goals=Math.max(0,Math.round((avg-opp.power)/2 + 4 + Math.random()*3));
 const against=Math.floor(Math.random()*2);
 const success=goals>=7;

 result.innerHTML=`<h2>${goals}-${against}</h2>
 <p>Opponent: ${opp.name}</p>
 <p>${goals}/7 goals</p>
 <p class="${success?'success':'fail'}">${success?'YES, 7-0 CHALLENGE CLEARED':'NO'}</p>`;

 history.unshift(`${goals}-${against} vs ${opp.name} (${Math.min(goals,7)}/7)`);
 document.getElementById('history').innerHTML=history.map(x=>'<div>'+x+'</div>').join('');
};