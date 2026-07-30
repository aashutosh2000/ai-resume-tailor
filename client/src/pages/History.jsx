import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CoverLetterModal from '../components/CoverLetterModal';
import { History as HistoryIcon, Download, Trash2, FileText, Award, Calendar, Building, Eye } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await api.getTailoredHistory();
      setHistory(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this tailored resume record from history?')) {
      await api.deleteTailored(id);
      fetchHistory();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <HistoryIcon className="w-6 h-6 text-indigo-400" /> Tailored Resume History
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review past AI-tailored resumes, re-download PDFs/DOCXs, and access generated cover letters.</p>
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <HistoryIcon className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No Tailored Resume History Yet</p>
          <p className="text-xs text-slate-500">Tailored resumes you generate will appear here for easy retrieval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((item) => (
            <div key={item._id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white">{item.jobTitle}</h3>
                  <p className="text-xs text-sky-400 font-semibold flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5" /> {item.company}
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {item.matchScore?.overall || 85}% Match
                </span>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Generated on {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                
                {item.coverLetter && (
                  <button
                    onClick={() => setSelectedCoverLetter(item.coverLetter)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> Cover Letter
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <a
                    href={api.getPDFExportUrl(item._id, item.templateId)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </a>

                  <a
                    href={api.getDOCXExportUrl(item._id)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> DOCX
                  </a>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {selectedCoverLetter && (
        <CoverLetterModal
          coverLetter={selectedCoverLetter}
          onClose={() => setSelectedCoverLetter(null)}
        />
      )}

    </div>
  );
}
