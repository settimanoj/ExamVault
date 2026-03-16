const express = require('express');
const {
  getAllPapersForAdmin,
  adminDeletePaper,
} = require('../controllers/paperController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/papers', getAllPapersForAdmin);
router.delete('/papers/:id', adminDeletePaper);

module.exports = router;
