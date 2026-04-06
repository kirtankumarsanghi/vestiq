'use client';
import {
  Area,
  AreaChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PIE_COLORS = ['#c6a850', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#14b8a6', '#e879f9'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="chart-tooltip-value">
          {entry.name}: ₹{Number(entry.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

export function GrowthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="primaryFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#c6a850" stopOpacity={0.34} />
            <stop offset="95%" stopColor="#c6a850" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="secondaryFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="yr"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted)', fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted)', fontSize: 11 }}
          tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="projected"
          name="Projected"
          stroke="#c6a850"
          strokeWidth={2}
          fill="url(#primaryFill)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="conservative"
          name="Conservative"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#secondaryFill)"
          dot={false}
          strokeDasharray="5 5"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AllocationPie({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={66}
          outerRadius={102}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`${entry.name}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value}%`, 'Allocation']}
          contentStyle={{
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
          }}
        />
        <Legend iconType="circle" iconSize={10} wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}