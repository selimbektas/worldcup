
const stages=[
{name:'GROUP STAGE 1',knockout:false},
{name:'GROUP STAGE 2',knockout:false},
{name:'GROUP STAGE 3',knockout:false},
{name:'ROUND OF 16',knockout:true},
{name:'QUARTER FINAL',knockout:true},
{name:'SEMI FINAL',knockout:true},
{name:'FINAL',knockout:true}
];
let picks=0,squad=[],used=new Set();
rollBtn.onclick=()=>{
const team=teams[Math.floor(Math.random()*teams.length)];
draw.innerHTML='<h3>'+team.name+'</h3>';choices.innerHTML='';
team.players.filter(p=>!used.has(p[0])).forEach(p=>{
let d=document.createElement('div');d.className='choice';d.textContent=p[0]+' ('+p[1]+')';
d.onclick=()=>{used.add(p[0]);squad.push({rating:p[1]});let li=document.createElement('li');li.textContent=p[0]+' - '+team.name;squadEl.appendChild(li);picks++;step.textContent=picks<11?'Roll '+(picks+1)+' / 11':'Squad Complete';draw.innerHTML='';choices.innerHTML='';if(picks===11){rollBtn.disabled=true;simBtn.disabled=false;}};
choices.appendChild(d);});
};
simBtn.onclick=()=>{
let overall=squad.reduce((a,b)=>a+b.rating,0)/squad.length;let html='';let eliminated=false;let finish='Champion';
for(const s of stages){
const opp=teams[Math.floor(Math.random()*teams.length)];
let g=Math.max(0,Math.round(1+(overall-opp.power)/8+Math.random()*3));
let a=Math.max(0,Math.round(Math.random()*2));
if(s.knockout && g===a) g++;
let win=g>a;
html+=`<div class="match ${win?'':'loss'}"><div>${s.name}</div><div>vs ${opp.name}</div><div>${g}-${a} ${win?'✓':'✗'}</div></div>`;
if(s.knockout && !win){eliminated=true;finish=s.name;break;}
}
result.innerHTML=html+`<hr><h2>${eliminated?'ELIMINATED':'WORLD CUP CHAMPION 🏆'}</h2><p>Best Finish: ${eliminated?finish:'Champion'}</p>`;
};
