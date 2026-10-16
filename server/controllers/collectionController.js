const WasteCollection = require('../models/WasteCollection');

// @desc    Get all collection records with search, filter, and pagination
// @route   GET /api/collections
// @access  Private
const getCollections = async (req, res, next) => {
  try {
    const { search, area, wasteType, status, startDate, endDate, page = 1, limit = 10, sort = '-date' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { collectionId: { $regex: search, $options: 'i' } },
        { collectionPoint: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } },
        { vehicleNumber: { $regex: search, $options: 'i' } },
        { driverName: { $regex: search, $options: 'i' } },
        { collectorName: { $regex: search, $options: 'i' } },
        { remarks: { $regex: search, $options: 'i' } }
      ];
    }

    if (area && area !== 'All') {
      query.area = area;
    }

    if (wasteType && wasteType !== 'All') {
      query.wasteType = wasteType;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await WasteCollection.countDocuments(query);
    const records = await WasteCollection.find(query)
      .populate('createdBy', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: records.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single collection record
// @route   GET /api/collections/:id
// @access  Private
const getCollectionById = async (req, res, next) => {
  try {
    const record = await WasteCollection.findById(req.params.id).populate('createdBy', 'name email role');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Collection record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create collection record
// @route   POST /api/collections
// @access  Private
const createCollection = async (req, res, next) => {
  try {
    const { collectionPoint, area, date, time, wasteType, quantity, unit, vehicleNumber, driverName, collectorName, status, remarks } = req.body;

    if (!collectionPoint || !area || !time || !wasteType || quantity === undefined || !vehicleNumber || !driverName || !collectorName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Collection Point, Area, Time, Waste Type, Quantity, Vehicle Number, Driver, Collector)'
      });
    }

    if (Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number greater than 0'
      });
    }

    const record = await WasteCollection.create({
      collectionPoint,
      area,
      date: date || new Date(),
      time,
      wasteType,
      quantity: Number(quantity),
      unit: unit || 'tons',
      vehicleNumber,
      driverName,
      collectorName,
      status: status || 'Scheduled',
      remarks: remarks || '',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Waste collection record created successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update collection record
// @route   PUT /api/collections/:id
// @access  Private
const updateCollection = async (req, res, next) => {
  try {
    const record = await WasteCollection.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Collection record not found'
      });
    }

    if (req.body.quantity !== undefined && Number(req.body.quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number greater than 0'
      });
    }

    const updated = await WasteCollection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Collection record updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete collection record
// @route   DELETE /api/collections/:id
// @access  Private
const deleteCollection = async (req, res, next) => {
  try {
    const record = await WasteCollection.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Collection record not found'
      });
    }

    await WasteCollection.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Collection record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
};
