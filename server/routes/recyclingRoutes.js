const express = require('express');
const router = express.Router();
const {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant
} = require('../controllers/recyclingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPlants)
  .post(createPlant);

router.route('/:id')
  .get(getPlantById)
  .put(updatePlant)
  .delete(authorize('ADMIN'), deletePlant);

module.exports = router;
