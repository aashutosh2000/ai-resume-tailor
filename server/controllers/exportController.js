const TailoredResume = require('../models/TailoredResume');
const { generateResumePDF } = require('../services/pdfExportService');
const { generateResumeDOCX } = require('../services/docxExportService');
const { getTailoredHistory } = require('./tailorController');

/**
 * Export tailored resume as downloadable PDF
 */
const exportPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const { template } = req.query;

    let record = null;
    try {
      record = await TailoredResume.findById(id);
    } catch (err) {
      // Find in-memory fallback
    }

    if (!record) {
      return res.status(404).json({ message: 'Tailored resume not found for export.' });
    }

    const templateId = template || record.templateId || 'modern';
    const pdfBuffer = await generateResumePDF(record, templateId);

    const filename = `${record.jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Tailored_Resume.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ message: `PDF Generation failed: ${error.message}` });
  }
};

/**
 * Export tailored resume as downloadable DOCX
 */
const exportDOCX = async (req, res) => {
  try {
    const { id } = req.params;

    let record = null;
    try {
      record = await TailoredResume.findById(id);
    } catch (err) {}

    if (!record) {
      return res.status(404).json({ message: 'Tailored resume not found for export.' });
    }

    const docxBuffer = await generateResumeDOCX(record);

    const filename = `${record.jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Tailored_Resume.docx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(docxBuffer);
  } catch (error) {
    return res.status(500).json({ message: `DOCX Generation failed: ${error.message}` });
  }
};

module.exports = {
  exportPDF,
  exportDOCX
};
