import React, { useState } from 'react';
import { X, Copy, Check, FileText, Download } from 'lucide-react';

export default function CoverLetterModal({ coverLetter, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!coverLetter) return null;

  const fullText = coverLetter.fullText || `${coverLetter.salutation}\n\n${coverLetter.opening}\n\n${(coverLetter.bodyParagraphs || []).join('\n\n')}\n\n${coverLetter.closing}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-card rounded-2xl border border-slate-800 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">AI Tailored Cover Letter</h3>
              <p className="text-xs text-slate-400">Generated strictly from candidate's verified achievements</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-200 text-sm leading-relaxed font-sans font-normal whitespace-pre-wrap">
          {fullText}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
