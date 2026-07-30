const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  generateTailoredResume,
  getTailoredHistory,
  getTailoredById,
  deleteTailored
} = require('../controllers/tailorController');

router.use(authMiddleware);

router.post('/generate', generateTailoredResume);
router.get('/history', getTailoredHistory);
router.get('/:id', getTailoredById);
router.delete('/:id', deleteTailored);

module.exports = router;
