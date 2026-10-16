const express = require('express');
const router = express.Router();
const {
  getProcessings,
  getProcessingById,
  createProcessing,
  updateProcessing,
  deleteProcessing
} = require('../controllers/processingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getProcessings)
  .post(createProcessing);

router.route('/:id')
  .get(getProcessingById)
  .put(updateProcessing)
  .delete(authorize('ADMIN'), deleteProcessing);

module.exports = router;
