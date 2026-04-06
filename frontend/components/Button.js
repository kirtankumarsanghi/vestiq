'use client';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={cx('btn', `btn-${variant}`, `btn-${size}`, fullWidth && 'btn-full', className)}
      {...props}
    >
      {children}
    </button>
  );
}