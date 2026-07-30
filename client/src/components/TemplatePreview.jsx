import React from 'react';
import { Mail, Phone, MapPin, Linkedin, ExternalLink, Briefcase, GraduationCap, Code, Layout, Layers } from 'lucide-react';

export default function TemplatePreview({ tailoredData, templateId = 'modern' }) {
  if (!tailoredData || !tailoredData.tailoredContent) {
    return (
      <div className="p-8 text-center text-slate-500">
        No tailored content loaded.
      </div>
    );
  }

  const { personalInfo = {}, summary = '', skills = {}, experience = [], education = [], projects = [] } = tailoredData.tailoredContent;

  // TEMPLATE STYLES
  if (templateId === 'executive') {
    return (
      <div id="resume-preview-container" className="bg-slate-900 text-slate-100 p-8 rounded-2xl border border-slate-800 shadow-2xl font-serif max-w-4xl mx-auto space-y-6">
        {/* EXECUTIVE HEADER */}
        <div className="border-b border-sky-500/40 pb-4 text-center">
          <h1 className="text-3xl font-extrabold tracking-wide text-sky-300 font-sans">{personalInfo.fullName || 'Candidate Name'}</h1>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400 font-sans mt-2">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* SUMMARY */}
        {summary && (
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400 font-sans border-b border-slate-800 pb-1">Executive Summary</h2>
            <p className="text-xs leading-relaxed text-slate-300 font-sans">{summary}</p>
          </section>
        )}

        {/* SKILLS */}
        {skills && (
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400 font-sans border-b border-slate-800 pb-1">Core Competencies</h2>
            <div className="flex flex-wrap gap-2 font-sans">
              {(skills.technical || []).concat(skills.soft || []).map((sk, i) => (
                <span key={i} className="bg-sky-500/10 text-sky-300 text-xs px-2.5 py-1 rounded border border-sky-500/20">{sk}</span>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400 font-sans border-b border-slate-800 pb-1">Professional Experience</h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1.5 font-sans">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-white">{exp.title}</h3>
                  <span className="text-xs text-slate-400">{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                <div className="text-xs font-semibold text-sky-300">{exp.company} {exp.location && `| ${exp.location}`}</div>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                  {(exp.bullets || []).map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <section className="space-y-2 font-sans">
            <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-1">Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs text-slate-300">
                <span className="font-bold text-white">{edu.degree}</span> – {edu.institution} ({edu.year})
              </div>
            ))}
          </section>
        )}
      </div>
    );
  }

  if (templateId === 'minimalist') {
    return (
      <div id="resume-preview-container" className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl font-sans max-w-4xl mx-auto space-y-6">
        {/* MINIMALIST HEADER */}
        <div className="border-b-2 border-slate-900 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{personalInfo.fullName || 'Candidate Name'}</h1>
          <div className="flex flex-wrap gap-4 text-xs text-slate-600 mt-2 font-medium">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* SUMMARY */}
        {summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">Summary</h2>
            <p className="text-xs leading-relaxed text-slate-700">{summary}</p>
          </section>
        )}

        {/* SKILLS */}
        {skills && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">Skills</h2>
            <p className="text-xs text-slate-800">
              {(skills.technical || []).concat(skills.tools || []).join(' • ')}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">Experience</h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-900">
                  <span>{exp.title} | {exp.company}</span>
                  <span className="text-slate-500 font-normal">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                  {(exp.bullets || []).map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs text-slate-800 font-medium">
                {edu.degree} — {edu.institution} ({edu.year})
              </div>
            ))}
          </section>
        )}
      </div>
    );
  }

  if (templateId === 'compact') {
    return (
      <div id="resume-preview-container" className="bg-slate-950 text-slate-200 p-6 rounded-2xl border border-teal-500/20 shadow-2xl font-sans max-w-4xl mx-auto space-y-5">
        {/* COMPACT TEAL HEADER */}
        <div className="bg-teal-950/40 p-4 rounded-xl border border-teal-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-teal-300">{personalInfo.fullName || 'Candidate Name'}</h1>
            <p className="text-xs text-teal-400/80 font-medium">Verified Full Stack Developer</p>
          </div>
          <div className="text-xs text-slate-400 space-y-0.5">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
          </div>
        </div>

        {/* SUMMARY */}
        {summary && (
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-300">
            {summary}
          </div>
        )}

        {/* SKILLS */}
        {skills && (
          <div>
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">Technical Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {(skills.technical || []).map((s, i) => (
                <span key={i} className="bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded text-[11px] font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Experience</h3>
            {experience.map((exp, idx) => (
              <div key={idx} className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>{exp.title} <span className="text-teal-400 font-normal">@ {exp.company}</span></span>
                  <span className="text-slate-400 text-[11px]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 pl-3 list-disc">
                  {(exp.bullets || []).map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // DEFAULT: MODERN TECH TEMPLATE
  return (
    <div id="resume-preview-container" className="bg-[#0f172a] text-slate-100 p-8 rounded-2xl border border-indigo-500/30 shadow-2xl font-sans max-w-4xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="border-b border-indigo-500/30 pb-5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight text-gradient">{personalInfo.fullName || 'Candidate Name'}</h1>
        <div className="flex flex-wrap gap-3 text-xs text-slate-400 mt-2">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-indigo-400" /> {personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5 text-indigo-400" /> {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Layout className="w-4 h-4" /> Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
            {summary}
          </p>
        </section>
      )}

      {/* SKILLS */}
      {skills && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Code className="w-4 h-4" /> Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {(skills.technical || []).map((sk, i) => (
              <span key={i} className="bg-indigo-500/10 text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-lg border border-indigo-500/20">
                {sk}
              </span>
            ))}
            {(skills.soft || []).map((sk, i) => (
              <span key={i} className="bg-slate-800 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-700">
                {sk}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" /> Professional Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex flex-wrap justify-between items-baseline">
                <h3 className="text-sm font-bold text-white">{exp.title}</h3>
                <span className="text-xs text-indigo-400 font-semibold">{exp.startDate} – {exp.endDate || 'Present'}</span>
              </div>
              <div className="text-xs font-semibold text-slate-400">{exp.company} {exp.location && `• ${exp.location}`}</div>
              <ul className="space-y-1.5 pt-1">
                {(exp.bullets || []).map((bullet, bi) => (
                  <li key={bi} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" /> Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex justify-between">
              <div>
                <span className="font-bold text-white">{edu.degree}</span>
                <span className="text-slate-400"> — {edu.institution}</span>
              </div>
              <span className="text-indigo-400">{edu.year}</span>
            </div>
          ))}
        </section>
      )}

    </div>
  );
}
