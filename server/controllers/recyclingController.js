const RecyclingPlant = require('../models/RecyclingPlant');

// @desc    Get all recycling plants
// @route   GET /api/recycling-plants
// @access  Private
const getPlants = async (req, res, next) => {
  try {
    const { search, wasteType, operationalStatus, page = 1, limit = 10, sort = '-processingDate' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { plantId: { $regex: search, $options: 'i' } },
        { plantName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { remarks: { $regex: search, $options: 'i' } }
      ];
    }

    if (wasteType && wasteType !== 'All') {
      query.wasteType = wasteType;
    }

    if (operationalStatus && operationalStatus !== 'All') {
      query.operationalStatus = operationalStatus;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await RecyclingPlant.countDocuments(query);
    const records = await RecyclingPlant.find(query)
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

// @desc    Get single recycling plant
// @route   GET /api/recycling-plants/:id
// @access  Private
const getPlantById = async (req, res, next) => {
  try {
    const record = await RecyclingPlant.findById(req.params.id).populate('createdBy', 'name email role');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Recycling plant record not found'
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

// @desc    Create recycling plant record
// @route   POST /api/recycling-plants
// @access  Private
const createPlant = async (req, res, next) => {
  try {
    const { plantName, location, wasteType, inputQuantity, recycledQuantity, processingDate, capacity, operationalStatus, remarks } = req.body;

    if (!plantName || !location || !wasteType || capacity === undefined || inputQuantity === undefined || recycledQuantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Plant Name, Location, Waste Type, Capacity, Input Qty, Recycled Qty)'
      });
    }

    const cap = Number(capacity);
    const input = Number(inputQuantity);
    const recycled = Number(recycledQuantity);

    if (cap <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be greater than zero'
      });
    }

    if (input < 0 || recycled < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantities cannot be negative numbers'
      });
    }

    if (recycled > input) {
      return res.status(400).json({
        success: false,
        message: 'Recycled quantity cannot exceed input quantity'
      });
    }

    const utilization = Number(((input / cap) * 100).toFixed(2));
    const recyclingRate = input > 0 ? Number(((recycled / input) * 100).toFixed(2)) : 0;

    const record = await RecyclingPlant.create({
      plantName,
      location,
      wasteType,
      inputQuantity: input,
      recycledQuantity: recycled,
      processingDate: processingDate || new Date(),
      capacity: cap,
      utilization,
      recyclingRate,
      operationalStatus: operationalStatus || 'Operational',
      remarks: remarks || '',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Recycling plant record created successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recycling plant record
// @route   PUT /api/recycling-plants/:id
// @access  Private
const updatePlant = async (req, res, next) => {
  try {
    const record = await RecyclingPlant.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Recycling plant record not found'
      });
    }

    const cap = req.body.capacity !== undefined ? Number(req.body.capacity) : record.capacity;
    const input = req.body.inputQuantity !== undefined ? Number(req.body.inputQuantity) : record.inputQuantity;
    const recycled = req.body.recycledQuantity !== undefined ? Number(req.body.recycledQuantity) : record.recycledQuantity;

    if (cap <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be greater than zero'
      });
    }

    if (input < 0 || recycled < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantities cannot be negative numbers'
      });
    }

    if (recycled > input) {
      return res.status(400).json({
        success: false,
        message: 'Recycled quantity cannot exceed input quantity'
      });
    }

    const updates = { ...req.body };
    updates.capacity = cap;
    updates.inputQuantity = input;
    updates.recycledQuantity = recycled;
    updates.utilization = Number(((input / cap) * 100).toFixed(2));
    updates.recyclingRate = input > 0 ? Number(((recycled / input) * 100).toFixed(2)) : 0;

    const updated = await RecyclingPlant.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Recycling plant updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recycling plant record
// @route   DELETE /api/recycling-plants/:id
// @access  Private
const deletePlant = async (req, res, next) => {
  try {
    const record = await RecyclingPlant.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Recycling plant record not found'
      });
    }

    await RecyclingPlant.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Recycling plant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant
};
