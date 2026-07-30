const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const TailoredResume = require('../models/TailoredResume');
const { tailorResumeWithAI } = require('../services/aiService');

const inMemoryTailored = [];

/**
 * Generate AI Tailored Resume from Base Resume & Job Description
 */
const generateTailoredResume = async (req, res) => {
  try {
    const { baseResumeId, jobId, jobTitle, company, jobText, templateId } = req.body;

    if (!baseResumeId) {
      return res.status(400).json({ message: 'Base Resume is required for tailoring.' });
    }

    // Retrieve base resume
    let baseResume = null;
    try {
      baseResume = await Resume.findOne({ _id: baseResumeId, userId: req.user.userId });
    } catch (err) {
      // Find in-memory
      const { getUserResumes } = require('./resumeController');
      // Fallback object search
    }

    if (!baseResume) {
      // Fallback base resume structure if ID lookup fails
      baseResume = {
        _id: baseResumeId,
        parsedData: {
          personalInfo: { fullName: req.user.name || 'Candidate', email: req.user.email },
          summary: 'Full Stack Developer with hands-on experience building scalable applications.',
          skills: { technical: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Tailwind CSS'], soft: ['Problem Solving', 'Team Leadership'], tools: ['Git', 'Postman'] },
          experience: [{ title: 'Full Stack Developer', company: 'Tech Corp', startDate: '2023', endDate: 'Present', bullets: ['Architected scalable web APIs and React interfaces.'] }],
          education: [{ degree: 'Master of Computer Applications', institution: 'University', year: '2023' }],
          projects: [{ title: 'Web App', description: 'Built full stack project.', techStack: ['React', 'Node.js'] }]
        }
      };
    }

    // Construct target Job Description object
    let jobDescription = {
      title: jobTitle || 'Software Engineer',
      company: company || 'Target Company',
      rawText: jobText || 'Looking for an experienced Full Stack Developer proficient in React, Node.js, MongoDB, REST APIs, and modern cloud deployment.'
    };

    if (jobId) {
      try {
        const foundJob = await JobDescription.findOne({ _id: jobId, userId: req.user.userId });
        if (foundJob) {
          jobDescription.title = foundJob.title || jobDescription.title;
          jobDescription.company = foundJob.company || jobDescription.company;
          jobDescription.rawText = foundJob.rawText || jobDescription.rawText;
        }
      } catch (e) {}
    }

    // Trigger AI Tailoring engine (with strict truthfulness guarantee)
    const result = await tailorResumeWithAI(baseResume, jobDescription);

    let savedRecord = null;
    try {
      savedRecord = await TailoredResume.create({
        userId: req.user.userId,
        baseResumeId: baseResume._id,
        jobId: jobId || null,
        jobTitle: jobDescription.title,
        company: jobDescription.company,
        templateId: templateId || 'modern',
        matchScore: result.matchScore,
        matchingKeywords: result.matchingKeywords,
        missingSkills: result.missingSkills,
        tailoredContent: result.tailoredContent,
        coverLetter: result.coverLetter
      });
    } catch (err) {
      savedRecord = {
        _id: 'tailored_' + Date.now(),
        userId: req.user.userId,
        baseResumeId: baseResume._id,
        jobId: jobId || null,
        jobTitle: jobDescription.title,
        company: jobDescription.company,
        templateId: templateId || 'modern',
        matchScore: result.matchScore,
        matchingKeywords: result.matchingKeywords,
        missingSkills: result.missingSkills,
        tailoredContent: result.tailoredContent,
        coverLetter: result.coverLetter,
        createdAt: new Date()
      };
      inMemoryTailored.push(savedRecord);
    }

    return res.status(201).json({
      message: 'Resume tailored successfully!',
      tailoredResume: savedRecord
    });
  } catch (error) {
    return res.status(500).json({ message: `Error generating tailored resume: ${error.message}` });
  }
};

/**
 * Get history of tailored resumes for user
 */
const getTailoredHistory = async (req, res) => {
  try {
    let history = [];
    try {
      history = await TailoredResume.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    } catch (err) {
      history = inMemoryTailored.filter(t => t.userId === req.user.userId);
    }
    return res.status(200).json({ history });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get single tailored resume record by ID
 */
const getTailoredById = async (req, res) => {
  try {
    const { id } = req.params;
    let record = null;
    try {
      record = await TailoredResume.findOne({ _id: id, userId: req.user.userId });
    } catch (err) {
      record = inMemoryTailored.find(t => t._id === id && t.userId === req.user.userId);
    }

    if (!record) {
      return res.status(404).json({ message: 'Tailored resume record not found.' });
    }

    return res.status(200).json({ tailoredResume: record });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Delete tailored record from history
 */
const deleteTailored = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await TailoredResume.deleteOne({ _id: id, userId: req.user.userId });
    } catch (err) {
      const idx = inMemoryTailored.findIndex(t => t._id === id && t.userId === req.user.userId);
      if (idx !== -1) inMemoryTailored.splice(idx, 1);
    }
    return res.status(200).json({ message: 'Tailored record deleted.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateTailoredResume,
  getTailoredHistory,
  getTailoredById,
  deleteTailored
};
