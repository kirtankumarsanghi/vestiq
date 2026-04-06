'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { GrowthChart, AllocationPie } from '../../components/PortfolioChart';
import { usePortfolio } from '../../hooks/usePortfolio';
import { formatINR, yearsToGoal, growthData as makeChart, allocation, products, rationale } from '../../utils/calculations';

// ─── Static demo data (used when no real portfolio exists yet) ───────────────

function demoPortfolio() {
  const lump=500000, sip=15000, risk=6, horizon=15, target=10000000;
  const rate=0.12;
  return {
    profile:          { goal:'wealth', lumpSum:lump, monthlySIP:sip, riskScore:risk, horizonYears:horizon, targetCorpus:target },
    projectedCorpus:  makeChart(lump,sip,rate,horizon).at(-1)?.projected || 9000000,
    annualRate:       rate,
    yearsRequired:    12.3,
    chart:            makeChart(lump,sip,rate,horizon),
    allocation:       allocation(risk,horizon),
    recommendations:  allocation(risk,horizon).map(a=>({ ...a, products:products(a.name), rationale:rationale(a.name) })),
  };
}

const NEWS = [
  { title:'RBI holds repo rate at 6.5% — third consecutive pause',         tag:'HIGH', tc:'#ef4444', impact:'Bond allocation benefits from rate stability',    time:'2h ago' },
  { title:'Sensex crosses 80,000 — IT sector leads the rally',             tag:'MED',  tc:'#c6a850', impact:'Positive for your equity holdings',                time:'4h ago' },
  { title:'Gold hits ₹72,000 / 10g amid geopolitical tensions',           tag:'HIGH', tc:'#ef4444', impact:'Your 12% gold allocation is outperforming',        time:'6h ago' },
  { title:'Bitcoin ETF inflows surge — BTC holds $68K support',           tag:'MED',  tc:'#c6a850', impact:'Relevant to your crypto allocation',                time:'8h ago' },
  { title:'Parag Parikh Flexi Cap reports 28.4% one-year return',         tag:'LOW',  tc:'#22c55e', impact:'One of your recommended SIP funds performing well', time:'1d ago' },
];

const ALERTS = [
  { title:'Rebalancing Required',   desc:'Equities have drifted to 23% (+3%). Consider selling ₹18,000 to rebalance.',                              color:'#f97316' },
  { title:'LTCG Alert',             desc:'Long-term gains of ₹82,000 in equity funds. Book gains before you exceed the ₹1L exempt limit.',          color:'#3b82f6' },
  { title:'SIP Due on 10th',        desc:'Mirae Asset Large Cap Fund — ₹5,000. Ensure funds are available in your linked account.',                  color:'#8a8f9a' },
];

// ─── Small helper components ─────────────────────────────────────────────────

function StatBox({ label, value, note, noteColor }) {
  return (
    <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'22px 22px', transition:'all .25s ease' }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,.12)'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform=''; }}
    >
      <div style={{ fontSize:10, color:'var(--txt3)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10 }}>{label}</div>
      <div style={{ fontFamily:'var(--display)', fontSize:30, fontWeight:300, lineHeight:1 }}>{value}</div>
      {note && <div style={{ fontSize:12, color:noteColor||'var(--green)', marginTop:8, fontFamily:'var(--mono)' }}>{note}</div>}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const { portfolio } = usePortfolio();
  const [mounted, setMounted] = useState(false);
  const [whatIf, setWhatIf]     = useState('');
  const [wiResult, setWiResult] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Navbar/>
        <div style={{ maxWidth:1260, margin:'0 auto', padding:'88px 22px 60px' }}>
          <p style={{ color:'var(--txt2)', fontSize:14 }}>Loading dashboard...</p>
        </div>
      </>
    );
  }

  // Use real portfolio if available, otherwise demo
  const p     = portfolio || demoPortfolio();
  const prof  = p.profile || {};
  const target       = prof.targetCorpus || 10000000;
  const totalInvested = (prof.lumpSum||0) + (prof.monthlySIP||15000)*12;
  const gains         = p.projectedCorpus - totalInvested;
  const progressPct   = Math.min(100, ((prof.lumpSum||500000)/target)*100);

  function runWhatIf() {
    if (!whatIf) return;
    const newSIP  = (prof.monthlySIP||15000) + Number(whatIf);
    const newYrs  = yearsToGoal(prof.lumpSum||500000, newSIP, p.annualRate||.12, target);
    setWiResult(newYrs);
  }

  return (
    <>
      <Navbar/>
      <div style={{ maxWidth:1260, margin:'0 auto', padding:'88px 22px 60px' }}>

        {/* ── HEADER ── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:36, flexWrap:'wrap', gap:18 }}>
          <div>
            <p style={{ fontSize:11, color:'var(--gold)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Portfolio Overview</p>
            <h1 style={{ fontSize:'clamp(30px,5vw,50px)' }}>
              Good morning, <em style={{ color:'var(--gold)', fontStyle:'italic' }}>Arjun.</em>
            </h1>
            <p style={{ color:'var(--txt2)', marginTop:6, fontSize:14 }}>Your portfolio is on track. Markets are up today.</p>
          </div>
          <div style={{ display:'flex', gap:9 }}>
            <Button variant="ghost" size="sm" onClick={()=>router.push('/onboarding')}>Edit Profile</Button>
            <Button variant="primary" size="sm">+ Add Goal</Button>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:28 }}>
          <StatBox label="Projected Corpus"  value={formatINR(p.projectedCorpus)}   note={`+${((p.annualRate||.12)*100).toFixed(0)}% p.a. expected`} noteColor="var(--green)"/>
          <StatBox label="Total Invested"    value={formatINR(totalInvested)}        note={formatINR(prof.monthlySIP||15000)+'/mo SIP active'}        noteColor="var(--txt2)"/>
          <StatBox label="Estimated Gains"   value={formatINR(gains)}                note={`${((gains/totalInvested)*100).toFixed(1)}% total return`}  noteColor="var(--green)"/>
          <StatBox label="Years to Goal"     value={`${p.yearsRequired||'—'} yrs`}   note={`Target: ${formatINR(target)}`}                            noteColor="var(--gold)"/>
        </div>

        {/* ── GOAL PROGRESS BAR ── */}
        <div style={{ background:'var(--card)', border:'1px solid var(--borderG)', borderRadius:18, padding:'26px 30px', marginBottom:28, position:'relative', overflow:'hidden', boxShadow:'0 0 40px rgba(198,168,80,.08)' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,var(--gold),transparent)', opacity:.4 }}/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:10 }}>
            <div>
              <div style={{ fontSize:10, color:'var(--txt3)', textTransform:'uppercase', letterSpacing:'.08em' }}>Goal Progress</div>
              <div style={{ fontFamily:'var(--display)', fontSize:20, marginTop:3 }}>
                {GOALS_MAP[prof.goal]||'Wealth Creation'} — {formatINR(target)}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'var(--mono)', fontSize:26, color:'var(--gold)' }}>{progressPct.toFixed(1)}%</div>
              <div style={{ fontSize:11, color:'var(--txt3)' }}>of target reached</div>
            </div>
          </div>
          <div style={{ height:6, background:'var(--border)', borderRadius:3, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${progressPct}%`, background:'linear-gradient(90deg,var(--gold),var(--goldL))', borderRadius:3, transition:'width 1s ease' }}/>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
            <span style={{ fontSize:11, color:'var(--txt3)' }}>{formatINR(prof.lumpSum||0)} invested</span>
            <span style={{ fontSize:11, color:'var(--txt3)' }}>Target by {new Date().getFullYear()+(prof.horizonYears||15)}</span>
          </div>
        </div>

        {/* ── CHART + PIE ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:22, marginBottom:28 }}>

          {/* Growth chart */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:18, padding:'26px 26px 18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
              <div>
                <div style={{ fontSize:10, color:'var(--txt3)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:3 }}>Corpus Projection</div>
                <div style={{ fontFamily:'var(--display)', fontSize:20 }}>Portfolio Growth</div>
              </div>
              <div style={{ display:'flex', gap:16, fontSize:12 }}>
                {[['var(--gold)','Projected'],['var(--blue)','Conservative']].map(([c,l])=>(
                  <span key={l} style={{ display:'flex', alignItems:'center', gap:6, color:'var(--txt2)' }}>
                    <span style={{ width:12, height:2, background:c, display:'inline-block', borderRadius:1 }}/>
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <GrowthChart data={p.chart||[]}/>
          </div>

          {/* Allocation pie */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:18, padding:'26px 24px' }}>
            <div style={{ fontSize:10, color:'var(--txt3)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:3 }}>Allocation</div>
            <div style={{ fontFamily:'var(--display)', fontSize:20, marginBottom:8 }}>Asset Breakdown</div>
            <AllocationPie data={p.allocation||[]}/>
          </div>
        </div>

        {/* ── WHAT-IF SIMULATOR ── */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:18, padding:'26px 28px', marginBottom:28 }}>
          <div style={{ fontSize:10, color:'var(--txt3)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:3 }}>Scenario Simulator</div>
          <div style={{ fontFamily:'var(--display)', fontSize:20, marginBottom:20 }}>What If?</div>
          <div style={{ display:'flex', gap:12, alignItems:'flex-end', flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ fontSize:11, color:'var(--txt2)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:8 }}>Increase monthly SIP by</div>
              <div style={{ display:'flex', alignItems:'center', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:9, overflow:'hidden' }}>
                <span style={{ padding:'11px 0 11px 13px', color:'var(--txt3)', fontFamily:'var(--mono)', fontSize:14 }}>₹</span>
                <input type="number" placeholder="5000" value={whatIf}
                  onChange={e=>{ setWhatIf(e.target.value); setWiResult(null); }}
                  style={{ flex:1, padding:'11px 8px', background:'transparent', border:'none', outline:'none', color:'var(--txt)', fontSize:14, fontFamily:'var(--body)' }}
                />
              </div>
            </div>
            <Button variant="secondary" onClick={runWhatIf}>Simulate →</Button>
          </div>
          {wiResult && (
            <div style={{ marginTop:18, padding:'14px 18px', background:'var(--goldDim)', border:'1px solid rgba(198,168,80,.22)', borderRadius:11 }}>
              <span style={{ fontSize:14, color:'var(--txt)' }}>
                With ₹{Number(whatIf).toLocaleString('en-IN')} extra/month, you'll reach {formatINR(target)} in{' '}
                <strong style={{ color:'var(--gold)', fontFamily:'var(--display)', fontSize:20 }}>{wiResult} years</strong>
                {p.yearsRequired && ` — ${Math.abs(p.yearsRequired-wiResult).toFixed(1)} years ${wiResult<p.yearsRequired?'earlier':'later'}.`}
              </span>
            </div>
          )}
        </div>

        {/* ── BOTTOM 3-COLUMN GRID ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:22 }}>

          {/* AI Recommendations */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:18, padding:'26px 24px' }}>
            <div style={{ fontSize:10, color:'var(--txt3)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:3 }}>AI Picks</div>
            <div style={{ fontFamily:'var(--display)', fontSize:20, marginBottom:20 }}>Recommendations</div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {(p.recommendations||[]).map((r,i)=>(
                <div key={i} style={{ padding:'14px', background:'var(--bg2)', borderRadius:11, border:'1px solid rgba(255,255,255,.04)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                    <span style={{ fontSize:13, fontWeight:500 }}>{r.name}</span>
                    <span style={{ fontSize:12, fontFamily:'var(--mono)', color:'var(--gold)', background:'var(--goldDim)', padding:'2px 8px', borderRadius:4 }}>{r.value}%</span>
                  </div>
                  <p style={{ fontSize:12, color:'var(--txt3)', lineHeight:1.5, marginBottom:10 }}>{r.rationale}</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                    {(r.products||[]).slice(0,2).map((prod,j)=>(
                      <span key={j} style={{ fontSize:10, padding:'2px 8px', background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, color:'var(--txt2)' }}>{prod}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:18, padding:'26px 24px' }}>
            <div style={{ fontSize:10, color:'var(--txt3)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:3 }}>Market Intelligence</div>
            <div style={{ fontFamily:'var(--display)', fontSize:20, marginBottom:20 }}>Portfolio News</div>
            <div style={{ display:'flex', flexDirection:'column' }}>
              {NEWS.map((n,i)=>(
                <div key={i} style={{ padding:'13px 0', borderBottom: i<NEWS.length-1?'1px solid rgba(255,255,255,.04)':'none' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', gap:8, marginBottom:5 }}>
                    <span style={{ fontSize:13, color:'var(--txt)', lineHeight:1.4 }}>{n.title}</span>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3, flexShrink:0 }}>
                      <span style={{ fontSize:9, fontWeight:600, fontFamily:'var(--mono)', color:n.tc, background:`${n.tc}18`, padding:'2px 6px', borderRadius:3 }}>{n.tag}</span>
                      <span style={{ fontSize:10, color:'var(--txt3)' }}>{n.time}</span>
                    </div>
                  </div>
                  <p style={{ fontSize:11, color:'var(--txt3)', lineHeight:1.4 }}>↳ {n.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:18, padding:'26px 24px' }}>
            <div style={{ fontSize:10, color:'var(--txt3)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:3 }}>Action Centre</div>
            <div style={{ fontFamily:'var(--display)', fontSize:20, marginBottom:20 }}>Alerts</div>
            <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
              {ALERTS.map((a,i)=>(
                <div key={i} style={{ padding:'15px', background:`${a.color}0a`, border:`1px solid ${a.color}22`, borderRadius:11 }}>
                  <div style={{ fontSize:13, fontWeight:500, marginBottom:6 }}>{a.title}</div>
                  <p style={{ fontSize:12, color:'var(--txt2)', lineHeight:1.5, marginBottom:10 }}>{a.desc}</p>
                  <button style={{ fontSize:12, color:a.color, background:`${a.color}15`, border:`1px solid ${a.color}28`, borderRadius:6, padding:'4px 12px', cursor:'pointer', fontFamily:'var(--body)', fontWeight:500 }}>
                    Take Action →
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width:860px) {
          div[style*="gridTemplateColumns: 1.6fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

// goal id → display label
const GOALS_MAP = { wealth:'Wealth Creation', retirement:'Retirement', house:'Buy a House', education:"Child's Education", car:'Buy a Car', business:'Start a Business' };