import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FileUp, FileText, CheckCircle2, Trash2, Edit3, ShieldCheck, Sparkles, Loader2, Code, Briefcase } from 'lucide-react';

export default function UploadResume() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedResumeView, setSelectedResumeView] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await api.getUserResumes();
      setResumes(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please choose a PDF or DOCX file to upload.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('title', resumeTitle || selectedFile.name.replace(/\.[^/.]+$/, ""));

      const res = await api.uploadResume(formData);
      setMessage({ type: 'success', text: 'Resume uploaded and parsed successfully!' });
      setSelectedFile(null);
      setResumeTitle('');
      fetchResumes();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'File upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    if (!pastedText || pastedText.trim().length < 20) {
      setMessage({ type: 'error', text: 'Please paste sufficient resume text.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.pasteResume({
        title: resumeTitle || 'Pasted Resume',
        rawText: pastedText
      });
      setMessage({ type: 'success', text: 'Resume text parsed and saved!' });
      setPastedText('');
      setResumeTitle('');
      fetchResumes();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this resume?')) {
      await api.deleteResume(id);
      fetchResumes();
      if (selectedResumeView?._id === id) setSelectedResumeView(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-400" /> Resume Manager
        </h1>
        <p className="text-xs text-slate-400 mt-1">Upload your official PDF or DOCX resume. The system will parse your real experience and skills.</p>
      </div>

      {/* UPLOAD CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: UPLOAD / PASTE FORM */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
          
          {/* TAB SWITCHER */}
          <div className="flex border-b border-slate-800 pb-3 gap-4">
            <button
              onClick={() => setActiveTab('upload')}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                activeTab === 'upload' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Upload PDF / DOCX
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                activeTab === 'paste' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Paste Text
            </button>
          </div>

          {message.text && (
            <div className={`p-3 rounded-xl text-xs font-medium ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {message.text}
            </div>
          )}

          {activeTab === 'upload' ? (
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resume Label / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Aashutosh Full Stack Resume 2026"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* DROPZONE */}
              <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 rounded-2xl p-8 text-center transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileUp className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click or Drag & Drop PDF / DOCX resume file here'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports PDF & DOCX formats up to 10MB</p>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {uploading ? 'Extracting & Parsing Resume...' : 'Upload & Parse Resume'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resume Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Developer Resume"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Paste Raw Resume Text</label>
                <textarea
                  rows="8"
                  placeholder="Paste work experience, technical skills, education, and projects here..."
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow flex items-center justify-center gap-2"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Parse Pasted Resume Text
              </button>
            </form>
          )}

        </div>

        {/* RIGHT: LIST OF UPLOADED RESUMES */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Saved Base Resumes
          </h3>

          {resumes.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">No base resumes uploaded yet.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {resumes.map((res) => (
                <div
                  key={res._id}
                  onClick={() => setSelectedResumeView(res)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedResumeView?._id === res._id
                      ? 'bg-indigo-500/10 border-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{res.title}</h4>
                    <p className="text-[11px] text-slate-400">{res.originalFileName || 'Text Resume'} • {new Date(res.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(res._id); }}
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

      {/* PARSED RESUME INSPECTOR DRAWER */}
      {selectedResumeView && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" /> Parsed Resume Data Inspector
              </h3>
              <p className="text-xs text-slate-400">Verifying extracted skills and experience for: {selectedResumeView.title}</p>
            </div>
            <button
              onClick={() => setSelectedResumeView(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
            >
              Close Inspector
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* EXTRACTED SKILLS */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-4 h-4" /> Extracted Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {(selectedResumeView.parsedData?.skills?.technical || []).map((sk, idx) => (
                  <span key={idx} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-lg">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* EXTRACTED EXPERIENCE */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> Extracted Work Experience Entries
              </h4>
              <div className="space-y-2">
                {(selectedResumeView.parsedData?.experience || []).map((exp, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <div className="font-bold text-white">{exp.title} @ {exp.company}</div>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-slate-400">
                      {(exp.bullets || []).map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
