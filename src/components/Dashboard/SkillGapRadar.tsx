import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip 
} from 'recharts';
import { UpskillGap } from '../../types';
import { Target, ArrowUpRight } from 'lucide-react';

interface SkillGapRadarProps {
  gaps: UpskillGap[];
}

export const SkillGapRadar: React.FC<SkillGapRadarProps> = ({ gaps }) => {
  // Format data for radar
  const radarData = gaps.slice(0, 6).map((gap) => {
    // Shorten long skill names for chart readability
    const shortName = gap.skillName.length > 18 
      ? gap.skillName.substring(0, 16) + '...' 
      : gap.skillName;

    return {
      skill: shortName,
      fullName: gap.skillName,
      category: gap.category,
      Current: gap.currentProficiency,
      Target: gap.targetProficiency,
      gapDelta: gap.targetProficiency - gap.currentProficiency
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
          <div className="font-bold text-white text-xs">{data.fullName}</div>
          <div className="text-[10px] text-indigo-400 font-semibold">{data.category}</div>
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="text-slate-400">Current Level:</span>
            <strong className="text-indigo-400">{data.Current}/10</strong>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Target Level:</span>
            <strong className="text-emerald-400">{data.Target}/10</strong>
          </div>
          <div className="flex items-center justify-between gap-4 text-amber-400 font-semibold pt-1 border-t border-slate-800">
            <span>Upskill Gap:</span>
            <span>+{data.gapDelta} pts</span>
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
            <Target className="w-4 h-4 text-indigo-400" />
            Upskill Gap Radar
          </h3>
          <p className="text-xs text-slate-400">
            Current proficiency vs target benchmark level
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            Current
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Target
          </span>
        </div>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        {radarData.length < 3 ? (
          <div className="text-xs text-slate-500 text-center py-10">
            Add at least 3 upskill goals to generate full radar geometry.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 10, right: 25, bottom: 10, left: 25 }}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="skill" 
                stroke="#94a3b8" 
                tick={{ fill: '#cbd5e1', fontSize: 11 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 10]} 
                stroke="#475569" 
                tick={{ fill: '#64748b', fontSize: 9 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="Current"
                dataKey="Current"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.35}
              />
              <Radar
                name="Target"
                dataKey="Target"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.15}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 text-emerald-400">
          <ArrowUpRight className="w-3.5 h-3.5" />
          Primary target: Distributed Systems & DB Internals
        </span>
        <span className="text-slate-500 font-mono">
          {gaps.length} Target Competencies
        </span>
      </div>
    </div>
  );
};
