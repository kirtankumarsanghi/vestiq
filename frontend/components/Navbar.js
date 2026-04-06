'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const onDash = path?.startsWith('/dashboard');

  const S = {
    nav: {
      position:'fixed', top:0, left:0, right:0, zIndex:200,
      height:64, padding:'0 32px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      background: scrolled ? 'rgba(7,9,14,.88)' : 'transparent',
      backdropFilter: scrolled ? 'blur(18px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition:'all .3s ease',
    },
    logo: {
      display:'flex', alignItems:'center', gap:10,
      fontFamily:'var(--display)', fontSize:22, fontWeight:400, letterSpacing:'.05em',
    },
    logoBox: {
      width:30, height:30, borderRadius:7,
      background:'linear-gradient(135deg,var(--gold),var(--goldL))',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:13, fontWeight:700, color:'#07090e', fontFamily:'var(--mono)',
    },
    link: { fontSize:13, color:'var(--txt2)', transition:'color .2s', cursor:'pointer' },
    btn: {
      fontSize:13, padding:'8px 20px',
      background:'linear-gradient(135deg,var(--gold),var(--goldL))',
      color:'#07090e', borderRadius:9, fontWeight:600,
      boxShadow:'0 2px 14px rgba(198,168,80,.28)',
    },
    ghost: {
      fontSize:13, padding:'8px 16px',
      background:'transparent', border:'1px solid var(--border)',
      color:'var(--txt)', borderRadius:9,
    },
  };

  return (
    <nav style={S.nav}>
      <Link href="/" style={S.logo}>
        <div style={S.logoBox}>V</div>
        Vestiq
      </Link>

      {!onDash && (
        <div style={{display:'flex', gap:28}}>
          {['Features','How it Works','Pricing'].map(l => (
            <a key={l} style={S.link}
              onMouseEnter={e=>e.target.style.color='var(--txt)'}
              onMouseLeave={e=>e.target.style.color='var(--txt2)'}
            >{l}</a>
          ))}
        </div>
      )}

      {onDash && (
        <div style={{display:'flex', gap:6}}>
          {['Portfolio','Goals','Markets','Tax'].map((l,i) => (
            <a key={l} style={{
              fontSize:13, padding:'6px 14px', borderRadius:7,
              color: i===0?'var(--gold)':'var(--txt2)',
              background: i===0?'var(--goldDim)':'transparent',
            }}>{l}</a>
          ))}
        </div>
      )}

      <div style={{display:'flex', gap:10, alignItems:'center'}}>
        {onDash ? (
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{
              width:32,height:32,borderRadius:'50%',
              background:'linear-gradient(135deg,var(--gold),var(--goldL))',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:13,fontWeight:700,color:'#07090e',
            }}>A</div>
            <span style={{fontSize:13,color:'var(--txt2)'}}>Arjun</span>
          </div>
        ) : (
          <>
            <Link href="/dashboard" style={S.ghost}>Log in</Link>
            <Link href="/onboarding" style={S.btn}>Get Started →</Link>
          </>
        )}
      </div>
    </nav>
  );
}