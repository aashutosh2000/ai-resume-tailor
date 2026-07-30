const Resume = require('../models/Resume');
const { extractTextFromFile, parseResumeText } = require('../services/parserService');
const fs = require('fs');

const inMemoryResumes = [];

/**
 * Upload PDF/DOCX file, parse text, extract structured data and save resume
 */
const uploadAndParseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF or DOCX file.' });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    const originalFileName = req.file.originalname;

    // Extract text from file
    const rawText = await extractTextFromFile(filePath, fileType);

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from the file. Please ensure it is not empty or scanned image PDF.' });
    }

    // Parse text into structured sections
    const parsedData = parseResumeText(rawText);

    const resumeTitle = req.body.title || originalFileName.replace(/\.[^/.]+$/, "") || 'My Resume';

    let savedResume = null;
    try {
      savedResume = await Resume.create({
        userId: req.user.userId,
        title: resumeTitle,
        originalFileName,
        fileType,
        rawText,
        parsedData
      });
    } catch (err) {
      savedResume = {
        _id: 'res_' + Date.now(),
        userId: req.user.userId,
        title: resumeTitle,
        originalFileName,
        fileType,
        rawText,
        parsedData,
        createdAt: new Date()
      };
      inMemoryResumes.push(savedResume);
    }

    // Clean up temp file
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }

    return res.status(201).json({
      message: 'Resume uploaded and parsed successfully!',
      resume: savedResume
    });
  } catch (error) {
    return res.status(500).json({ message: `Error parsing resume: ${error.message}` });
  }
};

/**
 * Parse raw pasted resume text manually
 */
const parsePastedResume = async (req, res) => {
  try {
    const { title, rawText } = req.body;

    if (!rawText || rawText.trim().length < 20) {
      return res.status(400).json({ message: 'Please provide valid resume text.' });
    }

    const parsedData = parseResumeText(rawText);
    const resumeTitle = title || 'Pasted Base Resume';

    let savedResume = null;
    try {
      savedResume = await Resume.create({
        userId: req.user.userId,
        title: resumeTitle,
        originalFileName: 'manual_input.txt',
        fileType: 'text/plain',
        rawText,
        parsedData
      });
    } catch (err) {
      savedResume = {
        _id: 'res_' + Date.now(),
        userId: req.user.userId,
        title: resumeTitle,
        originalFileName: 'manual_input.txt',
        fileType: 'text/plain',
        rawText,
        parsedData,
        createdAt: new Date()
      };
      inMemoryResumes.push(savedResume);
    }

    return res.status(201).json({
      message: 'Resume text parsed successfully!',
      resume: savedResume
    });
  } catch (error) {
    return res.status(500).json({ message: `Error parsing pasted text: ${error.message}` });
  }
};

/**
 * Get all base resumes for the current logged-in user
 */
const getUserResumes = async (req, res) => {
  try {
    let resumes = [];
    try {
      resumes = await Resume.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    } catch (err) {
      resumes = inMemoryResumes.filter(r => r.userId === req.user.userId);
    }
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get single base resume by ID
 */
const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    let resume = null;

    try {
      resume = await Resume.findOne({ _id: id, userId: req.user.userId });
    } catch (err) {
      resume = inMemoryResumes.find(r => r._id === id && r.userId === req.user.userId);
    }

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Delete resume by ID
 */
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Resume.deleteOne({ _id: id, userId: req.user.userId });
    } catch (err) {
      const idx = inMemoryResumes.findIndex(r => r._id === id && r.userId === req.user.userId);
      if (idx !== -1) inMemoryResumes.splice(idx, 1);
    }
    return res.status(200).json({ message: 'Resume deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadAndParseResume,
  parsePastedResume,
  getUserResumes,
  getResumeById,
  deleteResume
};
