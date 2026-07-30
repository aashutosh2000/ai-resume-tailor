const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const {
  uploadAndParseResume,
  parsePastedResume,
  getUserResumes,
  getResumeById,
  deleteResume
} = require('../controllers/resumeController');

router.use(authMiddleware);

router.post('/upload', upload.single('resume'), uploadAndParseResume);
router.post('/paste', parsePastedResume);
router.get('/', getUserResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

module.exports = router;
