const express = require('express');
const router = express.Router();
const {
  getLandfills,
  getLandfillById,
  createLandfill,
  updateLandfill,
  deleteLandfill
} = require('../controllers/landfillController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getLandfills)
  .post(createLandfill);

router.route('/:id')
  .get(getLandfillById)
  .put(updateLandfill)
  .delete(authorize('ADMIN'), deleteLandfill);

module.exports = router;
