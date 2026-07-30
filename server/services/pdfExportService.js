const PDFDocument = require('pdfkit');

/**
 * Generate PDF buffer for tailored resume based on selected template layout
 */
const generateResumePDF = (tailoredData, templateId = 'modern') => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const { personalInfo, summary, skills, experience, education, projects } = tailoredData.tailoredContent;

      // Primary colors based on template
      let primaryColor = '#1e293b'; // Slate 800
      let accentColor = '#4f46e5';  // Indigo 600
      
      if (templateId === 'executive') {
        primaryColor = '#0f172a';
        accentColor = '#0284c7'; // Sky 600
      } else if (templateId === 'minimalist') {
        primaryColor = '#111827';
        accentColor = '#374151'; // Neutral Dark
      } else if (templateId === 'compact') {
        primaryColor = '#18181b';
        accentColor = '#0d9488'; // Teal 600
      }

      // HEADER
      doc.fillColor(primaryColor).fontSize(22).font('Helvetica-Bold').text(personalInfo.fullName || 'Candidate Name', { align: 'center' });
      
      doc.moveDown(0.2);
      const contactText = [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin]
        .filter(Boolean)
        .join(' | ');
      doc.fillColor('#64748b').fontSize(9).font('Helvetica').text(contactText, { align: 'center' });

      doc.moveDown(0.8);
      doc.strokeColor(accentColor).lineWidth(1.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(0.8);

      // PROFESSIONAL SUMMARY
      if (summary) {
        doc.fillColor(accentColor).fontSize(12).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
        doc.moveDown(0.3);
        doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(summary, { align: 'justify', lineGap: 2 });
        doc.moveDown(0.8);
      }

      // TECHNICAL SKILLS
      if (skills) {
        doc.fillColor(accentColor).fontSize(12).font('Helvetica-Bold').text('TECHNICAL SKILLS');
        doc.moveDown(0.3);
        
        if (skills.technical && skills.technical.length > 0) {
          doc.fillColor('#1e293b').fontSize(9.5).font('Helvetica-Bold').text('Technical: ', { continued: true });
          doc.font('Helvetica').fillColor('#334155').text(skills.technical.join(', '));
        }
        if (skills.soft && skills.soft.length > 0) {
          doc.fillColor('#1e293b').fontSize(9.5).font('Helvetica-Bold').text('Soft Skills: ', { continued: true });
          doc.font('Helvetica').fillColor('#334155').text(skills.soft.join(', '));
        }
        if (skills.tools && skills.tools.length > 0) {
          doc.fillColor('#1e293b').fontSize(9.5).font('Helvetica-Bold').text('Tools: ', { continued: true });
          doc.font('Helvetica').fillColor('#334155').text(skills.tools.join(', '));
        }
        doc.moveDown(0.8);
      }

      // WORK EXPERIENCE
      if (experience && experience.length > 0) {
        doc.fillColor(accentColor).fontSize(12).font('Helvetica-Bold').text('WORK EXPERIENCE');
        doc.moveDown(0.3);

        experience.forEach(exp => {
          doc.fillColor('#0f172a').fontSize(10.5).font('Helvetica-Bold').text(exp.title || 'Role Title', { continued: true });
          doc.fillColor('#64748b').fontSize(9.5).font('Helvetica').text(` — ${exp.company || 'Company'} (${exp.startDate || ''} - ${exp.endDate || 'Present'})`, { align: 'left' });
          doc.moveDown(0.2);

          if (exp.bullets && exp.bullets.length > 0) {
            exp.bullets.forEach(bullet => {
              doc.fillColor('#334155').fontSize(9).font('Helvetica').text(`•  ${bullet}`, { indent: 10, lineGap: 1.5 });
            });
          }
          doc.moveDown(0.5);
        });
        doc.moveDown(0.5);
      }

      // EDUCATION
      if (education && education.length > 0) {
        doc.fillColor(accentColor).fontSize(12).font('Helvetica-Bold').text('EDUCATION');
        doc.moveDown(0.3);

        education.forEach(edu => {
          doc.fillColor('#0f172a').fontSize(10).font('Helvetica-Bold').text(edu.degree || 'Degree', { continued: true });
          doc.fillColor('#64748b').fontSize(9).font('Helvetica').text(` | ${edu.institution || ''} (${edu.year || ''})`);
        });
        doc.moveDown(0.8);
      }

      // PROJECTS
      if (projects && projects.length > 0) {
        doc.fillColor(accentColor).fontSize(12).font('Helvetica-Bold').text('KEY PROJECTS');
        doc.moveDown(0.3);

        projects.forEach(proj => {
          doc.fillColor('#0f172a').fontSize(10).font('Helvetica-Bold').text(proj.title || 'Project Title');
          if (proj.description) {
            doc.fillColor('#334155').fontSize(9).font('Helvetica').text(proj.description, { indent: 5 });
          }
          doc.moveDown(0.3);
        });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generateResumePDF
};
