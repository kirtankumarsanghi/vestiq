'use client';

import DashboardShell from '../../components/DashboardShell';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatINR } from '../../utils/calculations';

export default function GoalsPage() {
  const { portfolio, metrics, simulate } = useDashboardData();

  async function adjustPlan(increment) {
    await simulate({
      lumpSum: portfolio?.profile?.lumpSum || 0,
      monthlySIP: (portfolio?.profile?.monthlySIP || 0) + increment,
      riskScore: portfolio?.profile?.riskScore || 5,
      horizonYears: portfolio?.profile?.horizonYears || 10,
      targetCorpus: portfolio?.profile?.targetCorpus || 10000000,
    });
  }

  return (
    <DashboardShell
      title="Goals"
      subtitle="Keep every wealth target measurable with probability and correction paths."
    >
      <section className="dashboard-grid dashboard-grid-main">
        <Card title="Primary Target" subtitle="Current long-term objective">
          <div className="goal-highlight">
            <h3>{formatINR(metrics.target)}</h3>
            <p>
              Progress: <strong>{metrics.progress.toFixed(1)}%</strong>
            </p>
            <p className="muted">
              Remaining gap: {formatINR(Math.max(0, metrics.target - metrics.projected))}
            </p>
          </div>
        </Card>

        <Card title="Fast Actions" subtitle="Scenario shortcuts">
          <div className="button-row">
            <Button variant="secondary" size="sm" onClick={() => adjustPlan(2000)}>
              +₹2,000 SIP
            </Button>
            <Button variant="secondary" size="sm" onClick={() => adjustPlan(5000)}>
              +₹5,000 SIP
            </Button>
            <Button variant="secondary" size="sm" onClick={() => adjustPlan(10000)}>
              +₹10,000 SIP
            </Button>
          </div>
        </Card>
      </section>

      <Card title="Goal Milestones" subtitle="Suggested checkpoints">
        <div className="stack-list">
          <article className="list-item">
            <div>
              <h4>6-Month Checkpoint</h4>
              <p>Review SIP adherence and emergency fund health.</p>
            </div>
            <span className="badge badge-info">Upcoming</span>
          </article>
          <article className="list-item">
            <div>
              <h4>Annual Rebalance</h4>
              <p>Rebalance asset allocation to align with drawdown tolerance.</p>
            </div>
            <span className="badge badge-warning">Planned</span>
          </article>
          <article className="list-item">
            <div>
              <h4>Tax Optimization Window</h4>
              <p>Harvest gains and optimize redemptions before fiscal year close.</p>
            </div>
            <span className="badge badge-success">Recommended</span>
          </article>
        </div>
      </Card>
    </DashboardShell>
  );
}
