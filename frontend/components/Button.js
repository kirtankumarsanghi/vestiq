'use client';

const VARIANTS = {
  primary: {
    background:'linear-gradient(135deg,var(--gold),var(--goldL))',
    color:'#07090e', border:'none',
    boxShadow:'0 3px 18px rgba(198,168,80,.3)',
  },
  secondary: {
    background:'transparent', color:'var(--gold)',
    border:'1px solid var(--borderG)',
  },
  ghost: {
    background:'rgba(255,255,255,.04)', color:'var(--txt)',
    border:'1px solid var(--border)',
  },
};

const SIZES = {
  sm: { padding:'7px 16px', fontSize:12 },
  md: { padding:'11px 26px', fontSize:13 },
  lg: { padding:'14px 38px', fontSize:15 },
};

export default function Button({ children, variant='primary', size='md', onClick, disabled, fullWidth, type='button', style:extra={} }) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  return (
    <button
      suppressHydrationWarning
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...v, ...s,
        fontFamily:'var(--body)', fontWeight:500, letterSpacing:'.02em',
        borderRadius:9, cursor: disabled?'not-allowed':'pointer',
        display:'inline-flex', alignItems:'center', justifyContent:'center', gap:7,
        width: fullWidth?'100%':'auto',
        opacity: disabled ? 0.5 : 1,
        transition:'all .22s ease',
        whiteSpace:'nowrap',
        ...extra,
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          if (variant==='primary') e.currentTarget.style.boxShadow = '0 7px 24px rgba(198,168,80,.42)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = v.boxShadow||'';
      }}
    >{children}</button>
  );
}