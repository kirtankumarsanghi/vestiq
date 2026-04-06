'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/goals', label: 'Goals' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/insights', label: 'Insights' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <header className="top-nav">
      <Link href="/" className="brand">
        <span className="brand-mark">V</span>
        <span className="brand-text">Vestiq</span>
      </Link>

      <nav className="top-nav-links" aria-label="Primary navigation">
        {links.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`top-link ${active ? 'is-active' : ''}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="top-nav-actions">
        <ThemeToggle />
        <Link href="/onboarding" className="top-cta">
          New Plan
        </Link>
      </div>
    </header>
  );
}