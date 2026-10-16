const express = require('express');
const router = express.Router();
const {
  getSegregations,
  getSegregationById,
  createSegregation,
  updateSegregation,
  deleteSegregation
} = require('../controllers/segregationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getSegregations)
  .post(createSegregation);

router.route('/:id')
  .get(getSegregationById)
  .put(updateSegregation)
  .delete(authorize('ADMIN'), deleteSegregation);

module.exports = router;
