import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { Task } from '../../types';
import { Layers } from 'lucide-react';

interface TaskDistributionChartProps {
  tasks: Task[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: '#06b6d4',       // Cyan
  Backend: '#10b981',        // Emerald
  'System Design': '#8b5cf6', // Violet
  DevOps: '#f59e0b',         // Amber
  Algorithms: '#ec4899',     // Pink
  Architecture: '#6366f1',   // Indigo
  'Soft Skills': '#64748b'   // Slate
};

export const TaskDistributionChart: React.FC<TaskDistributionChartProps> = ({ tasks }) => {
  // Count by category
  const categoryCounts: Record<string, number> = {};
  tasks.forEach((t) => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });

  const data = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#6366f1'
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0];
      const percentage = Math.round((d.value / tasks.length) * 100);
      return (
        <div className="bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
          <div className="font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.payload.color }} />
            {d.name}
          </div>
          <div className="text-slate-300">
            {d.value} Task{d.value > 1 ? 's' : ''} ({percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" />
            Task Focus by Domain
          </h3>
          <p className="text-xs text-slate-400">
            Time & task concentration distribution
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700">
          {tasks.length} Total
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Donut Chart */}
        <div className="h-52 w-full sm:w-1/2 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-full sm:w-1/2 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-300 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate">{item.name}</span>
              </span>
              <span className="font-semibold text-slate-400 ml-2 font-mono">
                {Math.round((item.value / tasks.length) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Balanced across engineering disciplines</span>
        <span className="text-indigo-400 font-semibold">Active Distribution</span>
      </div>
    </div>
  );
};
