'use client';

import DashboardShell from '../../components/DashboardShell';
import Card from '../../components/Card';
import ActivityTable from '../../components/ActivityTable';
import { AllocationPie } from '../../components/PortfolioChart';
import { useDashboardData } from '../../hooks/useDashboardData';

export default function PortfolioPage() {
  const { portfolio, transactions, rebalance } = useDashboardData();

  return (
    <DashboardShell
      title="Portfolio"
      subtitle="Holdings, allocation quality, and recommended adjustments."
    >
      <section className="dashboard-grid dashboard-grid-main">
        <Card title="Current Allocation" subtitle="Target-weight map">
          <AllocationPie data={portfolio?.allocation || []} />
        </Card>

        <Card title="Rebalance Plan" subtitle={rebalance?.action || 'Monitor'}>
          <p className="muted">{rebalance?.summary || 'Portfolio is aligned with target allocation.'}</p>
          <div className="stack-list">
            {(rebalance?.changes || []).map((row, index) => (
              <article className="list-item" key={`${row.asset || 'asset'}-${index}`}>
                <div>
                  <h4>{row.asset}</h4>
                  <p>
                    Current {row.current}% · Target {row.target}%
                  </p>
                </div>
                <span className="badge badge-info">{row.action}</span>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <ActivityTable rows={transactions} />
    </DashboardShell>
  );
}
