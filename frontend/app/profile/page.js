'use client';

import DashboardShell from '../../components/DashboardShell';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useDashboardData } from '../../hooks/useDashboardData';

export default function ProfilePage() {
  const { portfolio } = useDashboardData();
  const profile = portfolio?.profile || {};

  return (
    <DashboardShell
      title="Profile"
      subtitle="Investor settings, preferences, and account controls."
    >
      <section className="dashboard-grid dashboard-grid-main">
        <Card title="Investor Profile" subtitle="Editable personal investing parameters">
          <div className="form-stack">
            <Input label="Goal" value={profile.goal || 'wealth'} readOnly />
            <Input label="Risk Score" value={String(profile.riskScore || 5)} readOnly />
            <Input label="Investment Horizon" value={`${profile.horizonYears || 10} years`} readOnly />
            <Input label="Monthly SIP" value={String(profile.monthlySIP || 0)} prefix="₹" readOnly />
          </div>
        </Card>

        <Card title="Preferences" subtitle="Notifications and automation controls">
          <div className="stack-list">
            <article className="list-item">
              <div>
                <h4>Email Alerts</h4>
                <p>Receive high-impact market and rebalancing notifications.</p>
              </div>
              <span className="badge badge-success">Enabled</span>
            </article>
            <article className="list-item">
              <div>
                <h4>Auto-Rebalance</h4>
                <p>Execute suggested shifts automatically once threshold triggers.</p>
              </div>
              <span className="badge badge-warning">Manual</span>
            </article>
          </div>
          <div className="button-row">
            <Button variant="secondary">Update Preferences</Button>
            <Button variant="ghost">Sign Out</Button>
          </div>
        </Card>
      </section>
    </DashboardShell>
  );
}
