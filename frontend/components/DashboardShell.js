import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardShell({ title, subtitle, actions, children }) {
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
            {actions ? <div className="dashboard-actions">{actions}</div> : null}
          </header>
          {children}
        </main>
      </div>
    </>
  );
}
