
const teams = [
// S Tier
{name:'Brazil 1970',tier:'S',power:98,players:[['Pele',100],['Jairzinho',98],['Rivelino',97],['Carlos Alberto',96]]},
{name:'Argentina 1986',tier:'S',power:97,players:[['Maradona',100],['Valdano',92],['Burruchaga',91]]},
{name:'Spain 2010',tier:'S',power:96,players:[['Xavi',99],['Iniesta',100],['Villa',97],['Ramos',96]]},
{name:'Argentina 2022',tier:'S',power:96,players:[['Messi',100],['Di Maria',94],['Alvarez',92]]},

// A Tier
{name:'Brazil 2002',tier:'A',power:92,players:[['Ronaldo',100],['Ronaldinho',99],['Rivaldo',98],['Cafu',96]]},
{name:'Germany 2014',tier:'A',power:92,players:[['Neuer',95],['Kroos',96],['Muller',94],['Lahm',94]]},
{name:'France 1998',tier:'A',power:91,players:[['Zidane',99],['Henry',94],['Desailly',93]]},
{name:'Italy 2006',tier:'A',power:90,players:[['Cannavaro',96],['Pirlo',95],['Buffon',96]]},
{name:'Netherlands 1974',tier:'A',power:90,players:[['Cruyff',99],['Neeskens',93]]},
{name:'France 2018',tier:'A',power:91,players:[['Mbappe',98],['Griezmann',93],['Kante',94]]},

// B Tier
{name:'USA 2002',tier:'B',power:84,players:[['Donovan',85],['McBride',83],['Reyna',84]]},
{name:'South Korea 2002',tier:'B',power:85,players:[['Park Ji-sung',88],['Ahn',84],['Lee Young-pyo',84]]},
{name:'Croatia 1998',tier:'B',power:86,players:[['Suker',90],['Boban',87]]},
{name:'Mexico 1986',tier:'B',power:84,players:[['Hugo Sanchez',89],['Negrete',86]]},
{name:'Belgium 2018',tier:'B',power:87,players:[['Hazard',92],['De Bruyne',96],['Lukaku',91]]},
{name:'England 1990',tier:'B',power:85,players:[['Lineker',90],['Gascoigne',89]]},
{name:'Portugal 2006',tier:'B',power:86,players:[['Figo',92],['Deco',89],['Cristiano Ronaldo',91]]},

// C Tier
{name:'Japan 1998',tier:'C',power:77,players:[['Nakata',83],['Kawaguchi',76]]},
{name:'Saudi Arabia 1994',tier:'C',power:76,players:[['Al-Owairan',86],['Al-Jaber',80]]},
{name:'Nigeria 1994',tier:'C',power:79,players:[['Yekini',84],['Amokachi',82]]},
{name:'Australia 2006',tier:'C',power:78,players:[['Kewell',84],['Viduka',83]]},
{name:'Ireland 2002',tier:'C',power:78,players:[['Keane',88],['Duff',82]]},
{name:'Morocco 1998',tier:'C',power:79,players:[['Hadji',82],['Bassir',80]]},

// D Tier
{name:'China 2002',tier:'D',power:68,players:[['Li Tie',71],['Fan Zhiyi',72]]},
{name:'Zaire 1974',tier:'D',power:62,players:[['Kazadi',66],['Mwepu',65]]},
{name:'Canada 1986',tier:'D',power:67,players:[['Mitchell',70],['Valentine',68]]},
{name:'Bolivia 1994',tier:'D',power:69,players:[['Sanchez',72],['Etcheverry',74]]},
{name:'Togo 2006',tier:'D',power:70,players:[['Adebayor',79],['Agassa',68]]}
];

function weightedRandomTeam(){
  const r = Math.random()*100;
  let pool;
  if(r < 5) pool = teams.filter(t=>t.tier==='S');
  else if(r < 25) pool = teams.filter(t=>t.tier==='A');
  else if(r < 60) pool = teams.filter(t=>t.tier==='B');
  else if(r < 85) pool = teams.filter(t=>t.tier==='C');
  else pool = teams.filter(t=>t.tier==='D');
  return pool[Math.floor(Math.random()*pool.length)];
}
