// ── All financial math lives here ─────────────────────────────────

export function formatINR(n) {
  n = Number(n);
  if (n >= 10000000) return `₹${(n/10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n/100000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

export function expectedRate(risk) {
  if (risk <= 3) return 0.07;
  if (risk <= 6) return 0.10;
  if (risk <= 8) return 0.12;
  return 0.15;
}

export function futureValue(lump, sip, rate, years) {
  const r = rate / 12, n = years * 12;
  const fvL = lump * Math.pow(1+r, n);
  const fvS = sip * ((Math.pow(1+r,n)-1)/r) * (1+r);
  return Math.round(fvL + fvS);
}

export function yearsToGoal(lump, sip, rate, target) {
  let corpus = lump;
  const r = rate / 12;
  let months = 0;
  while (corpus < target && months < 600) {
    corpus = corpus * (1+r) + sip;
    months++;
  }
  return +(months/12).toFixed(1);
}

export function growthData(lump, sip, rate, years) {
  const rows = [];
  let p = lump, c = lump;
  const r = rate/12, rc = (rate*0.6)/12;
  for (let y=0; y<=Math.min(years,20); y++) {
    rows.push({ yr: y===0?'Now':`Yr ${y}`, projected: Math.round(p), conservative: Math.round(c) });
    for (let m=0;m<12;m++) { p=p*(1+r)+sip; c=c*(1+rc)+sip; }
  }
  return rows;
}

export function allocation(risk, horizon) {
  if (risk <= 3)
    return [
      {name:'Mutual Funds',value:32},{name:'Bonds',value:28},{name:'Gold',value:20},
      {name:'Equities',value:10},{name:'REITs',value:6},{name:'International',value:4},
    ];
  if (risk >= 7 && horizon >= 10)
    return [
      {name:'Equities',value:28},{name:'Mutual Funds',value:24},{name:'International',value:12},
      {name:'REITs',value:10},{name:'Gold',value:9},{name:'Crypto',value:10},{name:'Bonds',value:7},
    ];
  return [
    {name:'Mutual Funds',value:30},{name:'Equities',value:20},{name:'Bonds',value:15},
    {name:'Gold',value:12},{name:'REITs',value:8},{name:'International',value:10},{name:'Crypto',value:5},
  ];
}

export function products(name) {
  const map = {
    'Mutual Funds':   ['Mirae Asset Large Cap','Parag Parikh Flexi Cap','Axis Midcap Fund'],
    'Equities':       ['Reliance Industries','Infosys','HDFC Bank'],
    'Bonds':          ['Bharat Bond ETF','HDFC Short Term Debt','SBI Ultra Short'],
    'Gold':           ['Sovereign Gold Bond','Nippon Gold ETF'],
    'Crypto':         ['Bitcoin (BTC)','Ethereum (ETH)'],
    'REITs':          ['Embassy Office Parks','Mindspace Business Parks'],
    'International':  ['Motilal Oswal Nasdaq 100','Franklin Feeder US Opp.'],
  };
  return map[name] || [];
}

export function rationale(name) {
  const map = {
    'Mutual Funds':   'SIP in diversified equity funds gives rupee-cost averaging and professional management over your horizon.',
    'Equities':       'Direct large-cap and mid-cap exposure adds alpha potential above benchmark returns.',
    'Bonds':          'Fixed income provides stability and predictable returns — a ballast against equity volatility.',
    'Gold':           'Precious metals hedge inflation and tend to rise when equity markets fall.',
    'Crypto':         'Small high-conviction allocation to BTC/ETH captures asymmetric upside with limited downside exposure.',
    'REITs':          'Rental income and real-asset exposure without the illiquidity of physical property.',
    'International':  'Global diversification reduces India-specific concentration risk.',
  };
  return map[name] || 'Diversified exposure to this asset class.';
}