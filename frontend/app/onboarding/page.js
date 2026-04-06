'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { usePortfolio } from '../../hooks/usePortfolio';
import { formatINR } from '../../utils/calculations';

// ─── Data ────────────────────────────────────────────────────────────────────

const GOALS = [
  { id:'wealth',     icon:'◈', label:'Wealth Creation',    desc:'Long-term compounding' },
  { id:'retirement', icon:'◎', label:'Retirement',         desc:'Financial freedom at 60' },
  { id:'house',      icon:'⌂', label:'Buy a House',        desc:'Down payment goal' },
  { id:'education',  icon:'◉', label:"Child's Education",  desc:'15-year horizon' },
  { id:'car',        icon:'⊙', label:'Buy a Car',          desc:'2–5 year goal' },
  { id:'business',   icon:'◇', label:'Start a Business',   desc:'Capital building' },
];

const RISK_LABEL  = ['','Very Safe','Safe','Cautious','Moderate–','Moderate','Moderate+','Growth','Aggressive','High Risk','Max Risk'];
const RISK_COLOR  = (r) => r<=3 ? '#22c55e' : r<=6 ? '#c6a850' : '#ef4444';
const RISK_NOTE   = (r) => r<=3
  ? 'Conservative: more bonds, gold & stable debt. Best if capital preservation is your priority.'
  : r<=6
  ? 'Balanced: mix of equity SIPs, gold and some bonds. Good for medium-term goals.'
  : 'Aggressive: higher equity, crypto & international stocks. Best for long-horizon investors.';

const STEPS = ['Goal','Capital','Risk','Horizon','Review'];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Onboarding() {
  const router = useRouter();
  const { build, loading } = usePortfolio();

  const [step, setStep]   = useState(0);
  const [form, setForm]   = useState({ goal:'', lumpSum:'', monthlySIP:'', riskScore:5, horizonYears:10, targetCorpus:'' });
  const [errs, setErrs]   = useState({});

  const progress = (step / (STEPS.length-1)) * 100;

  function set(k,v) { setForm(p=>({...p,[k]:v})); setErrs(e=>({...e,[k]:''})); }

  function validate() {
    const e = {};
    if (step===1) {
      if (isNaN(Number(form.lumpSum))   || form.lumpSum==='')     e.lumpSum='Enter a valid amount';
      if (!form.monthlySIP || Number(form.monthlySIP)<500)        e.monthlySIP='Minimum SIP is ₹500';
    }
    if (step===3 && (!form.targetCorpus || Number(form.targetCorpus)<10000)) e.targetCorpus='Enter your target amount';
    setErrs(e);
    return Object.keys(e).length===0;
  }

  function next() { if (validate()) setStep(s=>s+1); }
  function back() { setStep(s=>s-1); }

  async function submit() {
    await build({
      goal:          form.goal,
      lumpSum:       Number(form.lumpSum)       || 0,
      monthlySIP:    Number(form.monthlySIP)    || 0,
      riskScore:     form.riskScore,
      horizonYears:  form.horizonYears,
      targetCorpus:  Number(form.targetCorpus)  || 0,
    });
    router.push('/dashboard');
  }

  // ── Shared heading style ──
  const H = (stepNum, headline) => (
    <div style={{ marginBottom:34 }}>
      <p style={{ fontSize:11, color:'var(--gold)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:11 }}>Step {stepNum} of 5</p>
      <h1 style={{ fontSize:'clamp(34px,6vw,44px)', marginBottom:11 }} dangerouslySetInnerHTML={{__html:headline}}/>
    </div>
  );

  const SliderBox = ({ label, value, min, max, onChange, unit='' }) => {
    const pct = ((value-min)/(max-min))*100;
    return (
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:18, padding:'26px 28px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:20 }}>
          <span style={{ fontSize:13, color:'var(--txt2)' }}>{label}</span>
          <span style={{ fontFamily:'var(--mono)', fontSize:34, color:'var(--gold)' }}>
            {value}<span style={{ fontSize:15, color:'var(--txt3)' }}> {unit}</span>
          </span>
        </div>
        <input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))}
          style={{ width:'100%', height:4, borderRadius:2, background:`linear-gradient(90deg,var(--gold) 0%,var(--gold) ${pct}%,var(--border) ${pct}%)` }}
        />
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:7 }}>
          <span style={{ fontSize:11, color:'var(--txt3)' }}>{min}{unit}</span>
          <span style={{ fontSize:11, color:'var(--txt3)' }}>{max}{unit}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar/>
      <div style={{ maxWidth:600, margin:'0 auto', padding:'90px 22px 60px', minHeight:'100vh', display:'flex', flexDirection:'column' }}>

        {/* Progress bar */}
        <div style={{ marginBottom:46 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
            {STEPS.map((s,i)=>(
              <span key={i} style={{ fontSize:10, letterSpacing:'.06em', textTransform:'uppercase',
                color: i===step?'var(--gold)': i<step?'var(--txt3)':'var(--txt3)', fontWeight: i===step?600:400 }}>{s}</span>
            ))}
          </div>
          <div style={{ height:2, background:'var(--border)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,var(--gold),var(--goldL))', borderRadius:2, transition:'width .4s cubic-bezier(.4,0,.2,1)' }}/>
          </div>
        </div>

        {/* ── STEP CONTENT ── */}
        <div style={{ flex:1 }}>

          {/* STEP 0 — Goal */}
          {step===0 && (
            <div className="fu">
              {H('1','What are you<br/><em style="color:var(--gold);font-style:italic">investing for?</em>')}
              <p style={{ color:'var(--txt2)', fontSize:14, marginBottom:26 }}>This shapes your entire portfolio — risk, allocation, and time horizon.</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {GOALS.map(g=>(
                  <button key={g.id} onClick={()=>{ set('goal',g.id); setTimeout(next,180); }}
                    style={{
                      background: form.goal===g.id?'var(--goldDim)':'var(--card)',
                      border:`1px solid ${form.goal===g.id?'var(--borderG)':'var(--border)'}`,
                      borderRadius:15, padding:'18px 18px', textAlign:'left', cursor:'pointer',
                      color:'var(--txt)', fontFamily:'var(--body)', transition:'all .2s',
                    }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(198,168,80,.35)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=form.goal===g.id?'var(--borderG)':'var(--border)'; e.currentTarget.style.transform=''; }}
                  >
                    <div style={{ fontSize:20, color:'var(--gold)', marginBottom:9 }}>{g.icon}</div>
                    <div style={{ fontSize:14, fontWeight:500, marginBottom:3 }}>{g.label}</div>
                    <div style={{ fontSize:12, color:'var(--txt3)' }}>{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — Capital */}
          {step===1 && (
            <div className="fu">
              {H('2','How much are you<br/><em style="color:var(--gold);font-style:italic">starting with?</em>')}
              <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
                <Input label="Lump Sum Capital" type="number" prefix="₹" placeholder="500000"
                  value={form.lumpSum} onChange={e=>set('lumpSum',e.target.value)}
                  hint="One-time amount you invest now — enter 0 if starting fresh" error={errs.lumpSum}
                />
                {form.lumpSum && !errs.lumpSum && (
                  <div style={{ padding:'10px 14px', background:'var(--goldDim)', border:'1px solid rgba(198,168,80,.2)', borderRadius:9, fontSize:13, color:'var(--gold)' }}>
                    {formatINR(Number(form.lumpSum))} initial capital
                  </div>
                )}
                <Input label="Monthly SIP" type="number" prefix="₹" placeholder="10000"
                  value={form.monthlySIP} onChange={e=>set('monthlySIP',e.target.value)}
                  hint="Fixed amount you can invest every month" error={errs.monthlySIP}
                />
              </div>
            </div>
          )}

          {/* STEP 2 — Risk */}
          {step===2 && (
            <div className="fu">
              {H('3','What\'s your<br/><em style="color:var(--gold);font-style:italic">risk appetite?</em>')}
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:18, padding:'26px 28px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:22 }}>
                  <div>
                    <div style={{ fontSize:13, color:'var(--txt2)', marginBottom:5 }}>Risk Level</div>
                    <div style={{ fontFamily:'var(--display)', fontSize:30, color:RISK_COLOR(form.riskScore), fontWeight:300 }}>{RISK_LABEL[form.riskScore]}</div>
                  </div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:40, color:RISK_COLOR(form.riskScore) }}>
                    {form.riskScore}<span style={{ fontSize:16, color:'var(--txt3)' }}>/10</span>
                  </div>
                </div>
                <input type="range" min={1} max={10} value={form.riskScore} onChange={e=>set('riskScore',Number(e.target.value))}
                  style={{ width:'100%', height:4, borderRadius:2, background:`linear-gradient(90deg,${RISK_COLOR(form.riskScore)} 0%,${RISK_COLOR(form.riskScore)} ${(form.riskScore-1)/9*100}%,var(--border) ${(form.riskScore-1)/9*100}%)` }}
                />
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                  <span style={{ fontSize:11, color:'var(--txt3)' }}>Conservative</span>
                  <span style={{ fontSize:11, color:'var(--txt3)' }}>Aggressive</span>
                </div>
                <div style={{ marginTop:20, padding:'11px 14px', background:'var(--bg2)', borderRadius:9, fontSize:13, color:'var(--txt2)', lineHeight:1.6 }}>
                  ⚡ {RISK_NOTE(form.riskScore)}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Horizon */}
          {step===3 && (
            <div className="fu">
              {H('4','When do you need<br/><em style="color:var(--gold);font-style:italic">the money?</em>')}
              <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
                <SliderBox label="Investment Horizon" value={form.horizonYears} min={1} max={30} unit="yrs" onChange={v=>set('horizonYears',v)}/>
                <Input label="Target Corpus" type="number" prefix="₹" placeholder="10000000"
                  value={form.targetCorpus} onChange={e=>set('targetCorpus',e.target.value)}
                  hint="Total amount you want to accumulate" error={errs.targetCorpus}
                />
                {form.targetCorpus && !errs.targetCorpus && (
                  <div style={{ padding:'10px 14px', background:'var(--goldDim)', border:'1px solid rgba(198,168,80,.2)', borderRadius:9, fontSize:13, color:'var(--gold)' }}>
                    Target: {formatINR(Number(form.targetCorpus))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 — Review */}
          {step===4 && (
            <div className="fu">
              {H('5','Your profile<br/><em style="color:var(--gold);font-style:italic">is ready.</em>')}
              <p style={{ color:'var(--txt2)', fontSize:14, marginBottom:24 }}>Review your inputs, then let Vestiq AI build your personalised portfolio.</p>

              <div style={{ background:'var(--card)', border:'1px solid var(--borderG)', borderRadius:18, overflow:'hidden', boxShadow:'0 0 36px rgba(198,168,80,.09)' }}>
                {/* card header */}
                <div style={{ padding:'20px 26px', borderBottom:'1px solid var(--border)', background:'var(--goldDim)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontFamily:'var(--display)', fontSize:20, fontWeight:400 }}>Investment Profile</span>
                  <span style={{ fontSize:11, color:'var(--gold)', fontFamily:'var(--mono)' }}>VESTIQ AI</span>
                </div>
                {/* rows */}
                {[
                  ['Goal',          GOALS.find(g=>g.id===form.goal)?.label || '—'],
                  ['Lump Sum',       formatINR(Number(form.lumpSum)||0)],
                  ['Monthly SIP',    formatINR(Number(form.monthlySIP)||0)+'/mo'],
                  ['Risk Score',     `${form.riskScore}/10 — ${RISK_LABEL[form.riskScore]}`],
                  ['Horizon',        `${form.horizonYears} years`],
                  ['Target Corpus',  formatINR(Number(form.targetCorpus)||0)],
                ].map(([l,v])=>(
                  <div key={l} style={{ padding:'15px 26px', borderBottom:'1px solid rgba(255,255,255,.04)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:12, color:'var(--txt3)', textTransform:'uppercase', letterSpacing:'.07em' }}>{l}</span>
                    <span style={{ fontSize:14, color:'var(--txt)', fontWeight:500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Navigation Buttons ── */}
        {step>0 && (
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:38, gap:12 }}>
            <Button variant="ghost" onClick={back}>← Back</Button>
            {step < STEPS.length-1
              ? <Button variant="primary" onClick={next}>Continue →</Button>
              : <Button variant="primary" size="lg" onClick={submit} disabled={loading}>
                  {loading
                    ? <span style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <span className="spin" style={{ width:13,height:13,border:'2px solid rgba(7,9,14,.3)',borderTopColor:'#07090e',borderRadius:'50%',display:'inline-block' }}/>
                        Building your portfolio…
                      </span>
                    : 'Build My Portfolio →'}
                </Button>
            }
          </div>
        )}
      </div>
    </>
  );
}