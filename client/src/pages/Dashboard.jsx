import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { Sparkles, FileText, Briefcase, Wand2, History, TrendingUp, ShieldCheck, ArrowRight, Download, Plus } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rData, jData, hData] = await Promise.all([
          api.getUserResumes(),
          api.getUserJobs(),
          api.getTailoredHistory()
        ]);
        setResumes(rData || []);
        setJobs(jData || []);
        setHistory(hData || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const avgMatchScore = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.matchScore?.overall || 0), 0) / history.length)
    : 85;

  return (
    <div className="space-y-8 pb-12">
      
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-950 p-8 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Truthful AI Resume Engine Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-gradient">{user?.name || 'Developer'}</span>!
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Tailor your uploaded PDF/DOCX resumes for targeted jobs with 100% truthful keyword optimization, live ATS scoring, missing skill analysis, and cover letter generation.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/tailor"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Wand2 className="w-4 h-4" /> Start AI Tailoring Studio
            </Link>
            
            <Link
              to="/resumes"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Upload Base Resume
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Base Resumes</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{resumes.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Saved Target Jobs</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{jobs.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Tailored Resumes</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{history.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Wand2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Avg ATS Match</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{avgMatchScore}%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* RECENT TAILORINGS */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" /> Recent AI Tailoring Activity
          </h2>
          <Link to="/history" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
              <Wand2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-400">You haven't generated any tailored resumes yet.</p>
            <Link
              to="/tailor"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow"
            >
              Tailor Your First Resume
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {history.slice(0, 5).map((item) => (
              <div key={item._id} className="py-3.5 flex items-center justify-between hover:bg-slate-900/30 px-2 rounded-lg transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{item.jobTitle}</h4>
                  <p className="text-xs text-slate-400">{item.company} • {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.matchScore?.overall || 85}% Match
                  </span>
                  <a
                    href={api.getPDFExportUrl(item._id)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
