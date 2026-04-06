'use client';

export default function Card({
  children,
  title,
  subtitle,
  className = '',
  compact = false,
}) {
  return (
    <section className={`card ${compact ? 'card-compact' : ''} ${className}`.trim()}>
      {(title || subtitle) && (
        <header className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}