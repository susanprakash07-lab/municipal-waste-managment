const WasteSegregation = require('../models/WasteSegregation');

// @desc    Get all segregation records with search, filter, and pagination
// @route   GET /api/segregation
// @access  Private
const getSegregations = async (req, res, next) => {
  try {
    const { search, wasteType, status, startDate, endDate, page = 1, limit = 10, sort = '-date' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { recordId: { $regex: search, $options: 'i' } },
        { collectionPoint: { $regex: search, $options: 'i' } },
        { segregatedBy: { $regex: search, $options: 'i' } },
        { remarks: { $regex: search, $options: 'i' } }
      ];
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

    const total = await WasteSegregation.countDocuments(query);
    const records = await WasteSegregation.find(query)
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

// @desc    Get single segregation record
// @route   GET /api/segregation/:id
// @access  Private
const getSegregationById = async (req, res, next) => {
  try {
    const record = await WasteSegregation.findById(req.params.id).populate('createdBy', 'name email role');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Segregation record not found'
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

// @desc    Create segregation record
// @route   POST /api/segregation
// @access  Private
const createSegregation = async (req, res, next) => {
  try {
    const { collectionPoint, date, wasteType, quantity, unit, status, segregatedBy, remarks } = req.body;

    // Validation
    if (!collectionPoint || !wasteType || quantity === undefined || !segregatedBy) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Collection Point, Waste Type, Quantity, Segregated By)'
      });
    }

    if (Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number greater than 0'
      });
    }

    const record = await WasteSegregation.create({
      collectionPoint,
      date: date || new Date(),
      wasteType,
      quantity: Number(quantity),
      unit: unit || 'kg',
      status: status || 'Pending',
      segregatedBy,
      remarks: remarks || '',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Waste segregation record created successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update segregation record
// @route   PUT /api/segregation/:id
// @access  Private
const updateSegregation = async (req, res, next) => {
  try {
    const record = await WasteSegregation.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Segregation record not found'
      });
    }

    if (req.body.quantity !== undefined && Number(req.body.quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number greater than 0'
      });
    }

    const updated = await WasteSegregation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Segregation record updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete segregation record
// @route   DELETE /api/segregation/:id
// @access  Private
const deleteSegregation = async (req, res, next) => {
  try {
    const record = await WasteSegregation.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Segregation record not found'
      });
    }

    await WasteSegregation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Segregation record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSegregations,
  getSegregationById,
  createSegregation,
  updateSegregation,
  deleteSegregation
};
