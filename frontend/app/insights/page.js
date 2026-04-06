'use client';

import DashboardShell from '../../components/DashboardShell';
import InsightList from '../../components/InsightList';
import NotificationPanel from '../../components/NotificationPanel';
import Card from '../../components/Card';
import { useDashboardData } from '../../hooks/useDashboardData';

export default function InsightsPage() {
  const { insights, notifications } = useDashboardData();

  return (
    <DashboardShell
      title="Insights"
      subtitle="AI-generated portfolio intelligence and market-aware recommendations."
    >
      <section className="dashboard-grid dashboard-grid-main">
        <InsightList insights={insights} />
        <NotificationPanel items={notifications} />
      </section>

      <Card title="Insight Engine" subtitle="How recommendations are generated">
        <p className="muted">
          Vestiq evaluates allocation drift, macro regime changes, contribution behavior, and risk profile before generating actions.
          Every insight contains impact score and rationale for transparency.
        </p>
      </Card>
    </DashboardShell>
  );
}
