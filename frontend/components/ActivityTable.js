import Card from './Card';

export default function ActivityTable({ rows = [] }) {
  return (
    <Card title="Recent Activity" subtitle="Latest orders, SIP debits and portfolio events">
      <div className="table-wrap" id="transactions">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Asset</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-empty">
                  No transactions available.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.date}</td>
                  <td>{row.type}</td>
                  <td>{row.asset}</td>
                  <td>₹{Number(row.amount).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`badge badge-${row.status === 'Completed' ? 'success' : 'warning'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
