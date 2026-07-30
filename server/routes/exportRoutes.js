const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { exportPDF, exportDOCX } = require('../controllers/exportController');

router.use(authMiddleware);

router.get('/pdf/:id', exportPDF);
router.get('/docx/:id', exportDOCX);

module.exports = router;
