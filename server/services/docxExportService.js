const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = require('docx');

/**
 * Generate DOCX buffer for tailored resume
 */
const generateResumeDOCX = async (tailoredData) => {
  const { personalInfo, summary, skills, experience, education, projects } = tailoredData.tailoredContent;

  const children = [];

  // Name Header
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: personalInfo.fullName || 'Candidate Name',
          bold: true,
          size: 32,
          color: '1E293B'
        })
      ]
    })
  );

  // Contact Info Line
  const contactParts = [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin].filter(Boolean);
  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: contactParts.join(' | '),
            size: 18,
            color: '64748B'
          })
        ]
      })
    );
  }

  children.push(new Paragraph({ text: '', margin: { bottom: 200 } }));

  // Summary Section
  if (summary) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, size: 22, color: '4F46E5' })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: summary, size: 20, color: '334155' })
        ]
      }),
      new Paragraph({ text: '' })
    );
  }

  // Skills Section
  if (skills) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({ text: 'TECHNICAL SKILLS', bold: true, size: 22, color: '4F46E5' })
        ]
      })
    );

    if (skills.technical && skills.technical.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Technical: ', bold: true, size: 20 }),
            new TextRun({ text: skills.technical.join(', '), size: 20 })
          ]
        })
      );
    }
    if (skills.soft && skills.soft.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Soft Skills: ', bold: true, size: 20 }),
            new TextRun({ text: skills.soft.join(', '), size: 20 })
          ]
        })
      );
    }
    children.push(new Paragraph({ text: '' }));
  }

  // Work Experience Section
  if (experience && experience.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({ text: 'WORK EXPERIENCE', bold: true, size: 22, color: '4F46E5' })
        ]
      })
    );

    experience.forEach(exp => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.title || 'Role', bold: true, size: 21, color: '0F172A' }),
            new TextRun({ text: ` — ${exp.company || 'Company'} (${exp.startDate || ''} - ${exp.endDate || ''})`, italic: true, size: 19, color: '64748B' })
          ]
        })
      );

      (exp.bullets || []).forEach(b => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: b, size: 19, color: '334155' })
            ]
          })
        );
      });
      children.push(new Paragraph({ text: '' }));
    });
  }

  // Education
  if (education && education.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({ text: 'EDUCATION', bold: true, size: 22, color: '4F46E5' })
        ]
      })
    );

    education.forEach(edu => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree || 'Degree', bold: true, size: 20 }),
            new TextRun({ text: ` | ${edu.institution || ''} (${edu.year || ''})`, size: 19, color: '64748B' })
          ]
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children
      }
    ]
  });

  return await Packer.toBuffer(doc);
};

module.exports = {
  generateResumeDOCX
};
