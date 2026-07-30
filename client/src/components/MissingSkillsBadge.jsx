import React from 'react';
import { AlertCircle, PlusCircle, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';

export default function MissingSkillsBadge({ missingSkills = [], matchingKeywords = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* MATCHING KEYWORDS */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">Verified Matching Skills</h4>
            <p className="text-[11px] text-slate-400">Skills present in your resume matching target job</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {matchingKeywords && matchingKeywords.length > 0 ? (
            matchingKeywords.map((kw, i) => (
              <span
                key={i}
                className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {kw}
              </span>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No exact matching keywords extracted.</p>
          )}
        </div>
      </div>

      {/* MISSING SKILLS LIST */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">Missing Skills Identified</h4>
            <p className="text-[11px] text-slate-400">Skills required by job absent from your base resume</p>
          </div>
        </div>

        <div className="space-y-2.5 mt-3">
          {missingSkills && missingSkills.length > 0 ? (
            missingSkills.map((item, i) => (
              <div
                key={i}
                className="bg-slate-900/70 border border-slate-800 p-3 rounded-xl flex flex-col gap-1 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <PlusCircle className="w-3.5 h-3.5 text-amber-400" /> {item.skill}
                  </span>
                  <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">
                    {item.importance || 'Recommended'}
                  </span>
                </div>
                {item.recommendation && (
                  <p className="text-[11px] text-slate-400 flex items-start gap-1 mt-1">
                    <Lightbulb className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{item.recommendation}</span>
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 py-2">
              <CheckCircle2 className="w-4 h-4" /> Great job! You have all primary skills required for this job.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
