'use client';
import { AreaChart,Area,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,Legend } from 'recharts';

const PIE_COLORS = ['#c6a850','#3b82f6','#22c55e','#e879f9','#f97316','#06b6d4','#84cc16'];

const TTip = ({active,payload,label}) =>
  active && payload?.length ? (
    <div style={{background:'#111520',border:'1px solid rgba(255,255,255,.07)',borderRadius:8,padding:'10px 14px',fontFamily:'DM Mono',fontSize:12,color:'#8a8f9a'}}>
      <div style={{color:'#c6a850',marginBottom:4}}>{label}</div>
      {payload.map((e,i)=>(
        <div key={i} style={{color:e.color}}>₹{Number(e.value).toLocaleString('en-IN')}</div>
      ))}
    </div>
  ) : null;

export function GrowthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <AreaChart data={data} margin={{top:6,right:6,left:-22,bottom:0}}>
        <defs>
          <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#c6a850" stopOpacity={.22}/>
            <stop offset="95%" stopColor="#c6a850" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="bG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={.14}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="yr" tick={{fill:'#44484f',fontSize:11,fontFamily:'DM Mono'}} axisLine={false} tickLine={false}/>
        <YAxis tick={{fill:'#44484f',fontSize:11,fontFamily:'DM Mono'}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/100000).toFixed(0)}L`}/>
        <Tooltip content={<TTip/>}/>
        <Area type="monotone" dataKey="projected"    stroke="#c6a850" strokeWidth={2}   fill="url(#gG)" dot={false}/>
        <Area type="monotone" dataKey="conservative" stroke="#3b82f6" strokeWidth={1.5} fill="url(#bG)" dot={false} strokeDasharray="4 3"/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AllocationPie({ data }) {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
          {data.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
        </Pie>
        <Tooltip contentStyle={{background:'#111520',border:'1px solid rgba(255,255,255,.07)',borderRadius:8,fontFamily:'DM Mono',fontSize:12,color:'#f0ece4'}} formatter={(v,n)=>[`${v}%`,n]}/>
        <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:12,fontFamily:'DM Sans',color:'#8a8f9a',paddingTop:12}}/>
      </PieChart>
    </ResponsiveContainer>
  );
}