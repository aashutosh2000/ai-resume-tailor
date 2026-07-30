import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Briefcase, Globe, Link2, Plus, Trash2, CheckCircle2, Loader2, Sparkles, Building } from 'lucide-react';

export default function JobDescriptions() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'manual'
  const [jobUrl, setJobUrl] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobText, setJobText] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await api.getUserJobs();
      setJobs(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlScrape = async (e) => {
    e.preventDefault();
    if (!jobUrl || !jobUrl.startsWith('http')) {
      setMessage({ type: 'error', text: 'Please enter a valid HTTP/HTTPS Job URL.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.scrapeJobUrl(jobUrl);
      setMessage({ type: 'success', text: 'Job description extracted and saved!' });
      setJobUrl('');
      fetchJobs();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Could not scrape URL. Try pasting text manually.' });
    } finally {
      setSaving(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle || !jobText || jobText.trim().length < 20) {
      setMessage({ type: 'error', text: 'Please fill in job title and detailed description.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.saveJob({
        title: jobTitle,
        company,
        rawText: jobText
      });
      setMessage({ type: 'success', text: 'Job description saved successfully!' });
      setJobTitle('');
      setCompany('');
      setJobText('');
      fetchJobs();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job description?')) {
      await api.deleteJob(id);
      fetchJobs();
      if (selectedJob?._id === id) setSelectedJob(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-sky-400" /> Target Job Description Studio
        </h1>
        <p className="text-xs text-slate-400 mt-1">Paste a job link URL or copy-paste job description text to tailor your resume against.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT FORM */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
          
          <div className="flex border-b border-slate-800 pb-3 gap-4">
            <button
              onClick={() => setActiveTab('url')}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                activeTab === 'url' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Parse Job URL
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                activeTab === 'manual' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Paste Description Text
            </button>
          </div>

          {message.text && (
            <div className={`p-3 rounded-xl text-xs font-medium ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {message.text}
            </div>
          )}

          {activeTab === 'url' ? (
            <form onSubmit={handleUrlScrape} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job URL</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/jobs/view/... or Lever/Greenhouse link"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Our automated scraper extracts key responsibilities and required skills.</p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-semibold rounded-xl text-sm shadow flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                {saving ? 'Scraping & Extracting Job Data...' : 'Scrape & Save Job URL'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Full Stack Developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Google / Microsoft / Startup"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description Body Text</label>
                <textarea
                  rows="8"
                  placeholder="Paste complete job requirements, responsibilities, technical tech stack..."
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-sm shadow flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Save Job Description
              </button>
            </form>
          )}

        </div>

        {/* RIGHT JOB LIST */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Building className="w-5 h-5 text-sky-400" /> Saved Target Jobs ({jobs.length})
          </h3>

          {jobs.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">No job descriptions saved yet.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedJob?._id === job._id
                      ? 'bg-sky-500/10 border-sky-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{job.title}</h4>
                    <p className="text-[11px] text-sky-400">{job.company || 'Target Employer'} • {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(job._id); }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* JOB INSPECTOR */}
      {selectedJob && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100">{selectedJob.title}</h3>
              <p className="text-xs text-sky-400">{selectedJob.company}</p>
            </div>
            <button
              onClick={() => setSelectedJob(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
            >
              Close
            </button>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl text-xs text-slate-300 max-h-60 overflow-y-auto font-mono whitespace-pre-wrap">
            {selectedJob.rawText}
          </div>
        </div>
      )}

    </div>
  );
}
