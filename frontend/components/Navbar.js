'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  const isHome = pathname === '/';

  const links = useMemo(() => {
    if (isHome) {
      return [
        { href: '/', label: 'Home' },
        { href: '/#features', label: 'Features', hash: '#features' },
        { href: '/#how-it-works', label: 'How It Works', hash: '#how-it-works' },
        { href: '/#pricing', label: 'Pricing', hash: '#pricing' },
      ];
    }

    return [
      { href: '/', label: 'Home' },
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/goals', label: 'Goals' },
      { href: '/portfolio', label: 'Portfolio' },
      { href: '/insights', label: 'Insights' },
      { href: '/profile', label: 'Profile' },
    ];
  }, [isHome]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    function syncHash() {
      setActiveHash(window.location.hash || '');
    }

    syncHash();
    window.addEventListener('hashchange', syncHash);

    return () => {
      window.removeEventListener('hashchange', syncHash);
    };
  }, [pathname]);

  function isActive(item) {
    if (item.hash && isHome) {
      return activeHash === item.hash;
    }

    return pathname === item.href;
  }

  return (
    <header className="top-nav">
      <Link href="/" className="brand">
        <span className="brand-mark">V</span>
        <span className="brand-text">Vestiq</span>
      </Link>

      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <nav className={`top-nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
        {links.map((item) => {
          const active = isActive(item);
          return (
            <Link key={item.href} href={item.href} className={`top-link ${active ? 'is-active' : ''}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="top-nav-actions">
        <ThemeToggle />
        {isHome ? (
          <Link href="/onboarding" className="top-cta">
            Start Plan
          </Link>
        ) : (
          <Link href="/onboarding" className="top-cta">
            New Plan
          </Link>
        )}
      </div>
    </header>
  );
}