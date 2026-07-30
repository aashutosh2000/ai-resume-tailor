const mongoose = require('mongoose');

const tailoredResumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  baseResumeId: {
    type: String,
    required: true
  },
  jobId: String,
  jobTitle: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: 'Target Company'
  },
  templateId: {
    type: String,
    default: 'modern'
  },
  matchScore: {
    overall: { type: Number, default: 0 },
    skillsMatch: { type: Number, default: 0 },
    experienceMatch: { type: Number, default: 0 },
    atsReadability: { type: Number, default: 0 }
  },
  matchingKeywords: [String],
  missingSkills: [{
    skill: String,
    category: String,
    importance: String,
    recommendation: String
  }],
  tailoredContent: {
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      portfolio: String
    },
    summary: String,
    skills: {
      technical: [String],
      soft: [String],
      tools: [String]
    },
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      bullets: [String]
    }],
    education: [{
      degree: String,
      institution: String,
      year: String,
      score: String
    }],
    projects: [{
      title: String,
      description: String,
      techStack: [String],
      link: String
    }]
  },
  coverLetter: {
    salutation: String,
    opening: String,
    bodyParagraphs: [String],
    closing: String,
    fullText: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TailoredResume', tailoredResumeSchema);
