const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');
const {
  uploadPaper,
  getPapers,
  getSlotPapers,
  getPYQs,
  getMyUploadedPapers,
  deleteOwnPaper,
  getPaperFile,
} = require('../controllers/paperController');

// POST /api/papers/upload
router.post('/upload', authenticate, upload.single('file'), uploadPaper);

// GET /api/papers  (all papers, optional ?courseCode=&slot=&examType=&category=)
router.get('/', getPapers);

// GET /api/papers/slot  (slot papers with optional filters)
router.get('/slot', getSlotPapers);

// GET /api/papers/pyq  (PYQs with optional filters)
router.get('/pyq', getPYQs);

// GET /api/papers/my-uploads
router.get('/my-uploads', authenticate, getMyUploadedPapers);

// GET /api/papers/:id/file
router.get('/:id/file', getPaperFile);

// DELETE /api/papers/:id
router.delete('/:id', authenticate, deleteOwnPaper);

module.exports = router;
