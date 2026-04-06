'use client';
import { useId } from 'react';

export default function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  className = '',
  id,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`field ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}
      <div className={`field-control ${error ? 'is-error' : ''}`}>
        {prefix && <span className="field-addon">{prefix}</span>}
        <input id={inputId} className="field-input" {...props} />
        {suffix && <span className="field-addon">{suffix}</span>}
      </div>
      {error ? (
        <p className="field-error">{error}</p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}