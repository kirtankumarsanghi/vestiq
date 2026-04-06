'use client';

export default function Card({ children, title, gold=false, hover=true, pad='24px', style:ex={} }) {
  return (
    <div
      style={{
        background:'var(--card)', borderRadius:18, padding:pad,
        border:`1px solid ${gold?'var(--borderG)':'var(--border)'}`,
        boxShadow: gold?'0 0 36px rgba(198,168,80,.1)':'0 4px 20px rgba(0,0,0,.35)',
        position:'relative', overflow:'hidden',
        transition:'all .25s ease', ...ex,
      }}
      onMouseEnter={hover?e=>{
        e.currentTarget.style.background='var(--card2)';
        e.currentTarget.style.transform='translateY(-2px)';
      }:undefined}
      onMouseLeave={hover?e=>{
        e.currentTarget.style.background='var(--card)';
        e.currentTarget.style.transform='';
      }:undefined}
    >
      {gold && <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,var(--gold),transparent)',opacity:.5}}/>}
      {title && <div style={{fontSize:11,color:'var(--txt2)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:16}}>{title}</div>}
      {children}
    </div>
  );
}