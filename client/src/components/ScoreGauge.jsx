import React from 'react';
import { Award, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ScoreGauge({ matchScore }) {
  const score = matchScore?.overall || 85;
  const skillsScore = matchScore?.skillsMatch || 80;
  const experienceScore = matchScore?.experienceMatch || 88;
  const atsScore = matchScore?.atsReadability || 95;

  // Determine color theme
  let strokeColor = '#3b82f6'; // Blue
  let badgeText = 'Good Match';
  let badgeBg = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

  if (score >= 85) {
    strokeColor = '#10b981'; // Emerald Green
    badgeText = 'Excellent Match';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (score < 70) {
    strokeColor = '#f59e0b'; // Amber
    badgeText = 'Moderate Match';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" /> ATS Compatibility Score
          </h3>
          <p className="text-xs text-slate-400">Match rating based on genuine resume skills vs target job</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeBg}`}>
          {badgeText}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        
        {/* CIRCULAR GAUGE */}
        <div className="flex flex-col items-center justify-center relative">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="45"
              stroke={strokeColor}
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-white tracking-tight">{score}%</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Match</span>
          </div>
        </div>

        {/* METRICS BREAKDOWN */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Skills Alignment</span>
              <span className="font-bold text-emerald-400">{skillsScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${skillsScore}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Experience Match</span>
              <span className="font-bold text-indigo-400">{experienceScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${experienceScore}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">ATS Readability</span>
              <span className="font-bold text-sky-400">{atsScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${atsScore}%` }}></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
