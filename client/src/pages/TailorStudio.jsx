import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import MissingSkillsBadge from '../components/MissingSkillsBadge';
import TemplatePreview from '../components/TemplatePreview';
import CoverLetterModal from '../components/CoverLetterModal';
import { Wand2, Download, FileText, Briefcase, Layout, ShieldCheck, Sparkles, Loader2, RefreshCw, Copy, Check } from 'lucide-react';

export default function TailorStudio() {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customJobText, setCustomJobText] = useState('');
  const [useCustomJob, setUseCustomJob] = useState(false);

  const [loading, setLoading] = useState(true);
  const [tailoring, setTailoring] = useState(false);
  const [tailoredResult, setTailoredResult] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState('modern'); // modern, executive, minimalist, compact
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [rList, jList] = await Promise.all([
        api.getUserResumes(),
        api.getUserJobs()
      ]);
      setResumes(rList || []);
      setJobs(jList || []);
      
      if (rList && rList.length > 0) setSelectedResumeId(rList[0]._id);
      if (jList && jList.length > 0) setSelectedJobId(jList[0]._id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTailored = async () => {
    if (!selectedResumeId) {
      setErrorMsg('Please upload or select a Base Resume first.');
      return;
    }

    if (!useCustomJob && !selectedJobId) {
      setErrorMsg('Please select a target job or input custom job details.');
      return;
    }

    setTailoring(true);
    setErrorMsg('');

    try {
      const payload = {
        baseResumeId: selectedResumeId,
        templateId: activeTemplate
      };

      if (useCustomJob) {
        payload.jobTitle = customJobTitle || 'Software Engineer';
        payload.company = customCompany || 'Target Employer';
        payload.jobText = customJobText;
      } else {
        payload.jobId = selectedJobId;
      }

      const res = await api.generateTailored(payload);
      setTailoredResult(res.tailoredResume);
    } catch (error) {
      setErrorMsg(error.message || 'Tailoring failed.');
    } finally {
      setTailoring(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-indigo-400" /> AI Resume Tailoring Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Truthful Guarantee — Strictly uses your actual achievements & skills
          </p>
        </div>
      </div>

      {/* INPUT SELECTION CARDS */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* BASE RESUME SELECTOR */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" /> Select Base Resume
            </label>
            {resumes.length === 0 ? (
              <p className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                No base resumes uploaded yet. Please upload a PDF/DOCX resume in "My Resumes" first.
              </p>
            ) : (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>{r.title} ({r.originalFileName || 'Text'})</option>
                ))}
              </select>
            )}
          </div>

          {/* TARGET JOB SELECTOR */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-sky-400" /> Target Job Description
              </label>
              <button
                onClick={() => setUseCustomJob(!useCustomJob)}
                className="text-[11px] text-sky-400 hover:underline"
              >
                {useCustomJob ? 'Select Saved Job' : 'Input Direct Job Text'}
              </button>
            </div>

            {!useCustomJob ? (
              jobs.length === 0 ? (
                <p className="text-xs text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  No saved jobs found. Switch to "Input Direct Job Text" or save jobs in Job Studio.
                </p>
              ) : (
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>{j.title} @ {j.company}</option>
                  ))}
                </select>
              )
            ) : (
              <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <input
                  type="text"
                  placeholder="Target Job Title (e.g. Full Stack Developer)"
                  value={customJobTitle}
                  onChange={(e) => setCustomJobTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                />
                <textarea
                  rows="3"
                  placeholder="Paste Job Description text..."
                  value={customJobText}
                  onChange={(e) => setCustomJobText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                ></textarea>
              </div>
            )}
          </div>

        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleGenerateTailored}
          disabled={tailoring || resumes.length === 0}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-bold rounded-xl text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
        >
          {tailoring ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5 text-indigo-200" />}
          {tailoring ? 'Tailoring Resume with Truthful AI Engine...' : 'Tailor Resume Now'}
        </button>

      </div>

      {/* TAILORED RESULTS SECTION */}
      {tailoredResult && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* ATS SCORE GAUGE */}
          <ScoreGauge matchScore={tailoredResult.matchScore} />

          {/* MISSING SKILLS AND VERIFIED MATCHES */}
          <MissingSkillsBadge
            missingSkills={tailoredResult.missingSkills}
            matchingKeywords={tailoredResult.matchingKeywords}
          />

          {/* TEMPLATE SWITCHER & EXPORT BAR */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            
            {/* TEMPLATES */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Layout className="w-4 h-4 text-indigo-400" /> Template:
              </span>
              <div className="flex gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTemplate('modern')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeTemplate === 'modern' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Modern Tech
                </button>
                <button
                  onClick={() => setActiveTemplate('executive')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeTemplate === 'executive' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Executive
                </button>
                <button
                  onClick={() => setActiveTemplate('minimalist')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeTemplate === 'minimalist' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Minimalist
                </button>
                <button
                  onClick={() => setActiveTemplate('compact')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeTemplate === 'compact' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowCoverLetter(true)}
                className="px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-4 h-4 text-indigo-400" /> View Cover Letter
              </button>

              <a
                href={api.getPDFExportUrl(tailoredResult._id, activeTemplate)}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-all"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>

              <a
                href={api.getDOCXExportUrl(tailoredResult._id)}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-all"
              >
                <Download className="w-4 h-4" /> Download DOCX
              </a>
            </div>

          </div>

          {/* LIVE TEMPLATE PREVIEW */}
          <TemplatePreview
            tailoredData={tailoredResult}
            templateId={activeTemplate}
          />

          {/* COVER LETTER MODAL */}
          {showCoverLetter && (
            <CoverLetterModal
              coverLetter={tailoredResult.coverLetter}
              onClose={() => setShowCoverLetter(false)}
            />
          )}

        </div>
      )}

    </div>
  );
}
