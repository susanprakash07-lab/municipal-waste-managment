const express = require('express');
const router = express.Router();
const {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/collectionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getCollections)
  .post(createCollection);

router.route('/:id')
  .get(getCollectionById)
  .put(updateCollection)
  .delete(authorize('ADMIN'), deleteCollection);

module.exports = router;
