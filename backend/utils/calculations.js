function expectedRate(risk) {
  if (risk <= 3) return 0.07;
  if (risk <= 6) return 0.1;
  if (risk <= 8) return 0.12;
  return 0.15;
}

function futureValue(lump, sip, rate, years) {
  const r = rate / 12;
  const n = years * 12;
  const fvLump = lump * Math.pow(1 + r, n);
  const fvSip = sip * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  return Math.round(fvLump + fvSip);
}

function yearsToGoal(lump, sip, rate, target) {
  let corpus = lump;
  const r = rate / 12;
  let months = 0;

  while (corpus < target && months < 600) {
    corpus = corpus * (1 + r) + sip;
    months += 1;
  }

  return Number((months / 12).toFixed(1));
}

function growthData(lump, sip, rate, years) {
  const rows = [];
  const maxYears = Math.min(years, 20);
  let projected = lump;
  let conservative = lump;
  const r = rate / 12;
  const conservativeRate = (rate * 0.6) / 12;

  for (let y = 0; y <= maxYears; y += 1) {
    rows.push({
      yr: y === 0 ? 'Now' : `Yr ${y}`,
      projected: Math.round(projected),
      conservative: Math.round(conservative),
    });

    for (let m = 0; m < 12; m += 1) {
      projected = projected * (1 + r) + sip;
      conservative = conservative * (1 + conservativeRate) + sip;
    }
  }

  return rows;
}

function allocation(risk, horizon) {
  if (risk <= 3) {
    return [
      { name: 'Mutual Funds', value: 32 },
      { name: 'Bonds', value: 28 },
      { name: 'Gold', value: 20 },
      { name: 'Equities', value: 10 },
      { name: 'REITs', value: 6 },
      { name: 'International', value: 4 },
    ];
  }

  if (risk >= 7 && horizon >= 10) {
    return [
      { name: 'Equities', value: 28 },
      { name: 'Mutual Funds', value: 24 },
      { name: 'International', value: 12 },
      { name: 'REITs', value: 10 },
      { name: 'Gold', value: 9 },
      { name: 'Crypto', value: 10 },
      { name: 'Bonds', value: 7 },
    ];
  }

  return [
    { name: 'Mutual Funds', value: 30 },
    { name: 'Equities', value: 20 },
    { name: 'Bonds', value: 15 },
    { name: 'Gold', value: 12 },
    { name: 'REITs', value: 8 },
    { name: 'International', value: 10 },
    { name: 'Crypto', value: 5 },
  ];
}

function products(name) {
  const map = {
    'Mutual Funds': [
      'Mirae Asset Large Cap',
      'Parag Parikh Flexi Cap',
      'Axis Midcap Fund',
    ],
    Equities: ['Reliance Industries', 'Infosys', 'HDFC Bank'],
    Bonds: ['Bharat Bond ETF', 'HDFC Short Term Debt', 'SBI Ultra Short'],
    Gold: ['Sovereign Gold Bond', 'Nippon Gold ETF'],
    Crypto: ['Bitcoin (BTC)', 'Ethereum (ETH)'],
    REITs: ['Embassy Office Parks', 'Mindspace Business Parks'],
    International: [
      'Motilal Oswal Nasdaq 100',
      'Franklin Feeder US Opp.',
    ],
  };

  return map[name] || [];
}

function rationale(name) {
  const map = {
    'Mutual Funds':
      'SIP in diversified equity funds gives rupee-cost averaging and professional management over your horizon.',
    Equities:
      'Direct large-cap and mid-cap exposure adds alpha potential above benchmark returns.',
    Bonds:
      'Fixed income provides stability and predictable returns, balancing equity volatility.',
    Gold:
      'Precious metals hedge inflation and can cushion drawdowns when equities fall.',
    Crypto:
      'A small, controlled allocation captures asymmetric upside while limiting downside.',
    REITs:
      'REITs provide real-asset exposure and rental-yield potential with good liquidity.',
    International:
      'Global diversification reduces concentration risk in a single geography.',
  };

  return map[name] || 'Diversified exposure to this asset class.';
}

module.exports = {
  expectedRate,
  futureValue,
  yearsToGoal,
  growthData,
  allocation,
  products,
  rationale,
};
