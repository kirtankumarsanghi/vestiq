import Card from './Card';

export default function NotificationPanel({ items = [] }) {
  return (
    <Card title="Notifications" subtitle="Latest alerts from your portfolio" compact>
      <div className="stack-list">
        {items.length === 0 ? (
          <p className="muted">No notifications yet.</p>
        ) : (
          items.map((item) => (
            <article key={item.id} className="list-item">
              <div>
                <h4>{item.title}</h4>
                <p>{item.message}</p>
              </div>
              <span className={`badge badge-${item.severity || 'info'}`}>{item.severity || 'info'}</span>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
