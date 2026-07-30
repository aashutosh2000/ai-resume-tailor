const JobDescription = require('../models/JobDescription');
const { scrapeJobFromUrl } = require('../services/scraperService');

const inMemoryJobs = [];

/**
 * Scrape job description from URL and save
 */
const parseJobUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.startsWith('http')) {
      return res.status(400).json({ message: 'Please provide a valid HTTP/HTTPS URL.' });
    }

    const scrapedData = await scrapeJobFromUrl(url);

    let savedJob = null;
    try {
      savedJob = await JobDescription.create({
        userId: req.user.userId,
        title: scrapedData.title,
        company: scrapedData.company,
        sourceUrl: url,
        rawText: scrapedData.rawText,
        extractedKeywords: {
          requiredSkills: [],
          preferredSkills: [],
          roleLevel: 'Mid/Senior'
        }
      });
    } catch (err) {
      savedJob = {
        _id: 'job_' + Date.now(),
        userId: req.user.userId,
        title: scrapedData.title,
        company: scrapedData.company,
        sourceUrl: url,
        rawText: scrapedData.rawText,
        extractedKeywords: { requiredSkills: [], preferredSkills: [], roleLevel: 'Mid/Senior' },
        createdAt: new Date()
      };
      inMemoryJobs.push(savedJob);
    }

    return res.status(201).json({
      message: 'Job description scraped successfully!',
      job: savedJob
    });
  } catch (error) {
    return res.status(500).json({ message: `Error scraping job URL: ${error.message}` });
  }
};

/**
 * Save job description manually (pasted text)
 */
const createJobManual = async (req, res) => {
  try {
    const { title, company, rawText } = req.body;

    if (!title || !rawText || rawText.trim().length < 20) {
      return res.status(400).json({ message: 'Job title and detailed description are required.' });
    }

    let savedJob = null;
    try {
      savedJob = await JobDescription.create({
        userId: req.user.userId,
        title,
        company: company || 'Target Company',
        rawText,
        extractedKeywords: { requiredSkills: [], preferredSkills: [], roleLevel: 'Standard' }
      });
    } catch (err) {
      savedJob = {
        _id: 'job_' + Date.now(),
        userId: req.user.userId,
        title,
        company: company || 'Target Company',
        rawText,
        extractedKeywords: { requiredSkills: [], preferredSkills: [], roleLevel: 'Standard' },
        createdAt: new Date()
      };
      inMemoryJobs.push(savedJob);
    }

    return res.status(201).json({
      message: 'Job description saved successfully!',
      job: savedJob
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get saved job descriptions for user
 */
const getUserJobs = async (req, res) => {
  try {
    let jobs = [];
    try {
      jobs = await JobDescription.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    } catch (err) {
      jobs = inMemoryJobs.filter(j => j.userId === req.user.userId);
    }
    return res.status(200).json({ jobs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Delete saved job
 */
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await JobDescription.deleteOne({ _id: id, userId: req.user.userId });
    } catch (err) {
      const idx = inMemoryJobs.findIndex(j => j._id === id && j.userId === req.user.userId);
      if (idx !== -1) inMemoryJobs.splice(idx, 1);
    }
    return res.status(200).json({ message: 'Job description deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  parseJobUrl,
  createJobManual,
  getUserJobs,
  deleteJob
};
