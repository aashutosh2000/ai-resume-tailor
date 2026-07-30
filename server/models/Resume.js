const mongoose = require('mongoose');

const experienceItemSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  startDate: String,
  endDate: String,
  bullets: [String]
}, { _id: false });

const educationItemSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
  score: String
}, { _id: false });

const projectItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  techStack: [String],
  link: String
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'My Base Resume'
  },
  originalFileName: String,
  fileType: String,
  rawText: {
    type: String,
    required: true
  },
  parsedData: {
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
    experience: [experienceItemSchema],
    education: [educationItemSchema],
    projects: [projectItemSchema]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
