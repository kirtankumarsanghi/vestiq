import Card from './Card';

export default function InsightList({ insights = [] }) {
  return (
    <Card title="AI Insights" subtitle="Actionable intelligence tailored to your holdings">
      <div className="stack-list">
        {insights.length === 0 ? (
          <p className="muted">No insights available right now.</p>
        ) : (
          insights.map((insight) => (
            <article className="insight-item" key={insight.id}>
              <div>
                <h4>{insight.title}</h4>
                <p>{insight.detail}</p>
              </div>
              <span className="insight-impact">{insight.impact}</span>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
