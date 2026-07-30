const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  parseJobUrl,
  createJobManual,
  getUserJobs,
  deleteJob
} = require('../controllers/jobController');

router.use(authMiddleware);

router.post('/scrape-url', parseJobUrl);
router.post('/', createJobManual);
router.get('/', getUserJobs);
router.delete('/:id', deleteJob);

module.exports = router;
