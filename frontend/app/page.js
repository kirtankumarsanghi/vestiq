'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon:'◎', title:'AI Portfolio Engine',    desc:'Monte Carlo simulations and Modern Portfolio Theory build your ideal allocation across 7 asset classes in seconds.' },
  { icon:'⌁', title:'One-Tap Execution',      desc:'Connected to Zerodha, Groww, Angel One & Binance. Approve your portfolio and place orders without switching apps.' },
  { icon:'⟳', title:'Dynamic Rebalancing',    desc:'Vestiq monitors drift, volatility and drawdowns 24/7. It alerts you — or auto-rebalances — when allocations drift.' },
  { icon:'◈', title:'Goal Progress Tracker',  desc:'"Increase SIP by ₹5,000 and reach your ₹1 Cr goal 14 months earlier." Live what-if simulations on your timeline.' },
  { icon:'◉', title:'Smart News Feed',        desc:'Every article scored for impact on your holdings. A rate hike tagged as "High impact on your bond allocation."' },
  { icon:'◇', title:'Tax Optimisation',       desc:'Automatic LTCG tracking, tax-harvesting suggestions, and optimal redemption timing to keep more of your returns.' },
];

const STEPS = [
  { n:'01', title:'Tell us your financial DNA',    desc:'Capital, monthly SIP, risk comfort, timeline, and your life goal.' },
  { n:'02', title:'AI builds your portfolio',       desc:'Diversified across 7 asset classes with plain-English rationale for every decision.' },
  { n:'03', title:'Approve & execute in one tap',   desc:'Orders go straight to your broker. SIPs auto-schedule. No manual entry.' },
  { n:'04', title:'Vestiq watches it grow',         desc:'Rebalancing alerts, tax reminders, and what-if simulations — continuously.' },
];

const STATS = [
  { v:'₹2.4Cr', l:'Avg corpus at retirement',   s:'for users who follow their plan' },
  { v:'94%',    l:'Portfolio accuracy',          s:'vs benchmark allocation' },
  { v:'3.2×',   l:'Better than FD',              s:'over a 10-year horizon' },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'120px 24px 80px', position:'relative' }}>

        {/* decorative rings */}
        {[600,900].map(s=>(
          <div key={s} style={{ position:'absolute', width:s, height:s, border:'1px solid rgba(198,168,80,.06)', borderRadius:'50%', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }}/>
        ))}

        {/* badge */}
        <div className="fu d1" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'var(--goldDim)', border:'1px solid rgba(198,168,80,.2)', borderRadius:100, padding:'6px 16px', marginBottom:32 }}>
          <span className="pulse" style={{ width:6, height:6, borderRadius:'50%', background:'var(--gold)', display:'inline-block' }}/>
          <span style={{ fontSize:11, color:'var(--gold)', letterSpacing:'.1em', fontWeight:500 }}>AI-POWERED WEALTH CO-PILOT</span>
        </div>

        {/* headline */}
        <h1 className="fu d2" style={{ fontSize:'clamp(46px,8vw,94px)', fontFamily:'var(--display)', fontWeight:300, letterSpacing:'-.02em', maxWidth:880, marginBottom:22 }}>
          Your personal CFO,<br/>
          <em style={{ color:'var(--gold)', fontStyle:'italic' }}>in your pocket.</em>
        </h1>

        {/* sub */}
        <p className="fu d3" style={{ fontSize:17, color:'var(--txt2)', maxWidth:500, lineHeight:1.75, fontWeight:300, marginBottom:44 }}>
          Five questions. One portfolio. Diversified across equities, mutual funds, gold, crypto, bonds and REITs — executed in a single tap.
        </p>

        {/* CTAs */}
        <div className="fu d4" style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
          <Link href="/onboarding" style={{
            padding:'13px 38px', background:'linear-gradient(135deg,var(--gold),var(--goldL))', color:'#07090e',
            borderRadius:12, fontSize:14, fontWeight:600, boxShadow:'0 5px 22px rgba(198,168,80,.35)',
            transition:'all .25s ease',
          }}>Build My Portfolio →</Link>
          <Link href="#how-it-works" style={{
            padding:'13px 28px', background:'rgba(255,255,255,.04)', border:'1px solid var(--border)',
            color:'var(--txt)', borderRadius:12, fontSize:14,
          }}>See how it works</Link>
        </div>

        {/* stats row */}
        <div className="fu d5" style={{ display:'flex', gap:52, marginTop:76, flexWrap:'wrap', justifyContent:'center' }}>
          {STATS.map((s,i)=>(
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'var(--display)', fontSize:42, fontWeight:300, color:'var(--gold)', lineHeight:1 }}>{s.v}</div>
              <div style={{ fontSize:13, color:'var(--txt)', marginTop:6, fontWeight:500 }}>{s.l}</div>
              <div style={{ fontSize:11, color:'var(--txt3)', marginTop:3 }}>{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:'100px 24px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:60 }}>
          <p style={{ fontSize:11, color:'var(--gold)', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:14 }}>What Vestiq Does</p>
          <h2 style={{ fontSize:'clamp(34px,5vw,58px)' }}>
            Intelligent. Automated.{' '}
            <em style={{ color:'var(--gold)', fontStyle:'italic' }}>Personal.</em>
          </h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:18 }}>
          {FEATURES.map((f,i)=>(
            <div key={i} style={{
              background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:30,
              transition:'all .25s ease', cursor:'default',
            }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(198,168,80,.28)'; e.currentTarget.style.transform='translateY(-4px)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform=''; }}
            >
              <div style={{ fontSize:26, color:'var(--gold)', marginBottom:18, fontFamily:'var(--mono)' }}>{f.icon}</div>
              <h3 style={{ fontSize:22, fontWeight:400, marginBottom:10 }}>{f.title}</h3>
              <p style={{ fontSize:14, color:'var(--txt2)', lineHeight:1.7, fontWeight:300 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding:'100px 24px', background:'linear-gradient(180deg,var(--bg) 0%,var(--bg2) 100%)' }}>
        <div style={{ maxWidth:700, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <p style={{ fontSize:11, color:'var(--gold)', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:14 }}>Process</p>
            <h2 style={{ fontSize:'clamp(34px,5vw,54px)' }}>
              From zero to invested<br/>
              <em style={{ color:'var(--gold)', fontStyle:'italic' }}>in four steps.</em>
            </h2>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {STEPS.map((s,i)=>(
              <div key={i} style={{ display:'grid', gridTemplateColumns:'72px 1fr', gap:22, position:'relative', paddingBottom: i<STEPS.length-1?38:0 }}>
                {i<STEPS.length-1 && (
                  <div style={{ position:'absolute', left:35, top:50, bottom:0, width:1, background:'linear-gradient(180deg,var(--gold),transparent)', opacity:.18 }}/>
                )}
                <div style={{
                  width:48, height:48, border:'1px solid var(--borderG)', borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'var(--mono)', fontSize:12, color:'var(--gold)', background:'var(--goldDim)',
                }}>{s.n}</div>
                <div style={{ paddingTop:10 }}>
                  <h3 style={{ fontSize:22, fontWeight:400, marginBottom:7 }}>{s.title}</h3>
                  <p style={{ fontSize:14, color:'var(--txt2)', lineHeight:1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding:'110px 24px', textAlign:'center' }}>
        <div style={{
          maxWidth:1020, margin:'0 auto',
          background:'var(--card)', border:'1px solid var(--borderG)', borderRadius:30,
          padding:'68px 36px', boxShadow:'0 0 60px rgba(198,168,80,.09)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:0, left:'18%', right:'18%', height:1, background:'linear-gradient(90deg,transparent,var(--gold),transparent)', opacity:.45 }}/>
          <h2 style={{ fontSize:'clamp(38px,6vw,70px)', marginBottom:18 }}>
            Your ₹1 Crore goal<br/>
            <em style={{ color:'var(--gold)', fontStyle:'italic' }}>starts with five questions.</em>
          </h2>
          <p style={{ fontSize:15, color:'var(--txt2)', marginBottom:38, maxWidth:420, margin:'0 auto 38px' }}>
            No sign-up required. Build your full AI portfolio in 3 minutes, free.
          </p>
          <Link href="/onboarding" style={{
            padding:'15px 50px', background:'linear-gradient(135deg,var(--gold),var(--goldL))',
            color:'#07090e', borderRadius:13, fontSize:15, fontWeight:600,
            boxShadow:'0 7px 28px rgba(198,168,80,.38)', display:'inline-block',
          }}>Build My Portfolio — Free →</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:'1px solid var(--border)', padding:'28px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:26,height:26,borderRadius:6,background:'linear-gradient(135deg,var(--gold),var(--goldL))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#07090e',fontFamily:'var(--mono)' }}>V</div>
          <span style={{ fontFamily:'var(--display)', fontSize:17 }}>Vestiq</span>
        </div>
        <span style={{ fontSize:11, color:'var(--txt3)' }}>© 2025 Vestiq. Not SEBI registered. For informational purposes only.</span>
      </footer>
    </>
  );
}