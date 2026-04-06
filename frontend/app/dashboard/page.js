'use client';

import { useMemo, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ActivityTable from '../../components/ActivityTable';
import InsightList from '../../components/InsightList';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import NotificationPanel from '../../components/NotificationPanel';
import { GrowthChart, AllocationPie } from '../../components/PortfolioChart';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatINR } from '../../utils/calculations';

function MetricCard({ label, value, note, tone }) {
  return (
    <Card compact>
      <p className="metric-label">{label}</p>
      <h3 className="metric-value">{value}</h3>
      {note ? <p className={`metric-note tone-${tone || 'neutral'}`}>{note}</p> : null}
    </Card>
  );
}

export default function DashboardPage() {
  const { portfolio, insights, transactions, notifications, rebalance, metrics, loading, error, simulate } =
    useDashboardData();
  const [extraSip, setExtraSip] = useState('5000');
  const [simulation, setSimulation] = useState(null);

  const profile = portfolio?.profile || {};
  const chartData = portfolio?.chart || [];
  const allocationData = portfolio?.allocation || [];

  const targetYear = useMemo(
    () => new Date().getFullYear() + Number(profile.horizonYears || 10),
    [profile.horizonYears]
  );

  async function onRunSimulation() {
    const increment = Number(extraSip || 0);
    const payload = {
      lumpSum: Number(profile.lumpSum || 0),
      monthlySIP: Number(profile.monthlySIP || 0) + increment,
      riskScore: Number(profile.riskScore || 5),
      horizonYears: Number(profile.horizonYears || 10),
      targetCorpus: Number(profile.targetCorpus || 10000000),
    };

    const result = await simulate(payload);
    setSimulation(result);
  }

  return (
    <DashboardShell
      title="Portfolio Command Center"
      subtitle="Track trajectory, simulate decisions, and execute the next best action from one workspace."
      actions={
        <Button variant="secondary" size="sm">
          Export Report
        </Button>
      }
    >
      {loading ? (
        <Card>
          <LoadingSkeleton lines={6} />
        </Card>
      ) : (
        <>
          {error ? <p className="error-banner">{error}</p> : null}

          <section className="metrics-grid">
            <MetricCard
              label="Projected Corpus"
              value={formatINR(metrics.projected)}
              note={`Target ${formatINR(metrics.target)}`}
              tone="neutral"
            />
            <MetricCard
              label="Capital Invested"
              value={formatINR(metrics.invested)}
              note={`SIP ${formatINR(profile.monthlySIP || 0)}/mo`}
              tone="neutral"
            />
            <MetricCard
              label="Estimated Gains"
              value={formatINR(metrics.gains)}
              note={`${metrics.progress.toFixed(1)}% target completion`}
              tone="positive"
            />
            <MetricCard
              label="Risk Profile"
              value={`${metrics.riskScore}/10`}
              note={`Target year ${targetYear}`}
              tone="accent"
            />
          </section>

          <section className="dashboard-grid dashboard-grid-main">
            <Card title="Growth Projection" subtitle="Projected vs conservative trajectory">
              <GrowthChart data={chartData} />
            </Card>
            <Card title="Asset Allocation" subtitle="Current target weights">
              <AllocationPie data={allocationData} />
            </Card>
          </section>

          <section className="dashboard-grid dashboard-grid-main">
            <Card
              title="What-If Simulation"
              subtitle="Change SIP contribution and estimate target timeline"
            >
              <div className="simulate-row">
                <label htmlFor="sipIncrement">Increase SIP by</label>
                <div className="simulate-controls">
                  <input
                    id="sipIncrement"
                    type="number"
                    value={extraSip}
                    onChange={(event) => setExtraSip(event.target.value)}
                  />
                  <Button variant="primary" size="sm" onClick={onRunSimulation}>
                    Run Simulation
                  </Button>
                </div>
                {simulation ? (
                  <p className="simulation-result">
                    New projected corpus {formatINR(simulation.projectedCorpus || 0)} with goal timeline of{' '}
                    {simulation.yearsToGoal || '--'} years.
                  </p>
                ) : null}
              </div>
            </Card>

            <Card title="Rebalancing Suggestion" subtitle="Recommended adjustments to stay on target">
              <p className="muted">{rebalance?.summary || 'No rebalance actions required right now.'}</p>
              <div className="stack-list">
                {(rebalance?.changes || []).map((change, index) => (
                  <article key={`${change.asset || 'asset'}-${index}`} className="list-item">
                    <div>
                      <h4>{change.asset}</h4>
                      <p>
                        Current {change.current}% → Target {change.target}%
                      </p>
                    </div>
                    <span className="badge badge-info">{change.action}</span>
                  </article>
                ))}
              </div>
            </Card>
          </section>

          <section className="dashboard-grid dashboard-grid-main">
            <InsightList insights={insights} />
            <NotificationPanel items={notifications} />
          </section>

          <ActivityTable rows={transactions} />
        </>
      )}
    </DashboardShell>
  );
}
