'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'My Portfolio', href: '/portfolio' },
  { label: 'Goals Tracker', href: '/goals' },
  { label: 'Transactions', href: '/portfolio#transactions' },
  { label: 'AI Insights', href: '/insights' },
  { label: 'Settings', href: '/profile' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="dashboard-sidebar" aria-label="Sidebar navigation">
      <div className="sidebar-head">
        <p className="sidebar-kicker">Workspace</p>
        <h2>Wealth Desk</h2>
      </div>
      <nav className="sidebar-nav">
        {ITEMS.map((item) => {
          const active = pathname === item.href || (item.href.includes('#') && pathname === item.href.split('#')[0]);
          return (
            <Link key={item.label} href={item.href} className={`sidebar-link ${active ? 'is-active' : ''}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
