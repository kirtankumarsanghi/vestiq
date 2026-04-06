'use client';
import { useState } from 'react';

export default function Input({ label, type='text', placeholder, value, onChange, prefix, suffix, hint, error, min, max, step, name }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:7}}>
      {label && (
        <label style={{
          fontSize:11, fontWeight:500, letterSpacing:'.08em', textTransform:'uppercase',
          color: focused?'var(--gold)':'var(--txt2)', transition:'color .2s',
        }}>{label}</label>
      )}
      <div style={{
        display:'flex', alignItems:'center',
        background:'var(--card)', borderRadius:10,
        border:`1px solid ${error?'rgba(239,68,68,.5)':focused?'var(--borderG)':'var(--border)'}`,
        boxShadow: focused?'0 0 0 3px rgba(198,168,80,.08)':'none',
        transition:'all .2s',
      }}>
        {prefix && <span style={{padding:'11px 0 11px 14px',color:'var(--txt3)',fontFamily:'var(--mono)',fontSize:14}}>{prefix}</span>}
        <input
          type={type} name={name} placeholder={placeholder}
          value={value} onChange={onChange} min={min} max={max} step={step}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{
            flex:1, padding: prefix?'11px 8px':'11px 14px',
            paddingRight: suffix?'8px':'14px',
            background:'transparent', border:'none', outline:'none',
            color:'var(--txt)', fontSize:14, fontFamily:'var(--body)', width:'100%',
          }}
        />
        {suffix && <span style={{padding:'11px 14px 11px 0',color:'var(--txt3)',fontSize:13}}>{suffix}</span>}
      </div>
      {hint  && !error && <span style={{fontSize:11,color:'var(--txt3)'}}>{hint}</span>}
      {error && <span style={{fontSize:11,color:'var(--red)'}}>{error}</span>}
    </div>
  );
}