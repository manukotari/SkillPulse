import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line
} from 'recharts';
import { LearningEntry } from '../../types';
import { TrendingUp, Sparkles } from 'lucide-react';

interface LearningCurveChartProps {
  entries: LearningEntry[];
}

export const LearningCurveChart: React.FC<LearningCurveChartProps> = ({ entries }) => {
  // Sort chronologically
  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate or map entries
  const chartData = sorted.map((entry) => {
    const d = new Date(entry.date + 'T00:00:00');
    const formattedDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return {
      date: formattedDate,
      fullDate: entry.date,
      mastery: entry.masteryScore,
      hours: entry.hoursSpent,
      topic: entry.topic,
      category: entry.category,
      ahaMoment: entry.ahaMoment
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1.5 max-w-xs">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
            <span className="font-semibold text-slate-400">{data.date}</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">
              {data.category}
            </span>
          </div>
          <div className="font-bold text-white text-sm">{data.topic}</div>
          <div className="flex items-center gap-4 text-slate-300 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Mastery: <strong className="text-white">{data.mastery}/10</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Hours: <strong className="text-white">{data.hours}h</strong>
            </span>
          </div>
          {data.ahaMoment && (
            <p className="text-[11px] text-amber-300/90 pt-1 border-t border-slate-800/80 italic">
              "{data.ahaMoment}"
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Learning Curve Dynamics
          </h3>
          <p className="text-xs text-slate-400">
            Daily comprehension rate (1–10) & time invested per breakthrough
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Mastery Level (Area)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Hours Invested (Line)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="masteryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              domain={[0, 10]}
              ticks={[2, 4, 6, 8, 10]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="mastery"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#masteryGradient)"
            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: '#10b981', strokeWidth: 1, stroke: '#0f172a' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" />
          Steepest growth in Frontend & Architecture domains
        </span>
        <span className="text-slate-500 font-mono">
          Last {chartData.length} checkpoints
        </span>
      </div>
    </div>
  );
};
