const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: 'Target Employer'
  },
  sourceUrl: String,
  rawText: {
    type: String,
    required: true
  },
  extractedKeywords: {
    requiredSkills: [String],
    preferredSkills: [String],
    roleLevel: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
