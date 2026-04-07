"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardShell({ title, subtitle, actions, children }) {
  const pathname = usePathname();

  const navSteps = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/goals', label: 'Goals' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/insights', label: 'Insights' },
    { href: '/profile', label: 'Profile' },
  ];

  const currentIndex = navSteps.findIndex((item) => item.href === pathname);
  const previous = currentIndex > 0 ? navSteps[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < navSteps.length - 1 ? navSteps[currentIndex + 1] : null;

  return (
    <>
      <Navbar />
      <div className="dashboard-shell">
        <Sidebar />
        <main className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <p className="dashboard-kicker">Vestiq Wealth OS</p>
              <h1>{title}</h1>
              {subtitle ? <p className="dashboard-subtitle">{subtitle}</p> : null}
            </div>
            <div className="dashboard-actions">
              {previous ? (
                <Link href={previous.href} className="btn btn-ghost btn-sm">
                  Previous: {previous.label}
                </Link>
              ) : null}
              {next ? (
                <Link href={next.href} className="btn btn-secondary btn-sm">
                  Next: {next.label}
                </Link>
              ) : null}
              {actions}
            </div>
          </header>
          {children}
        </main>
      </div>
    </>
  );
}
