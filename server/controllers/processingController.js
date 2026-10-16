const WasteProcessing = require('../models/WasteProcessing');

// @desc    Get all processing records
// @route   GET /api/processing
// @access  Private
const getProcessings = async (req, res, next) => {
  try {
    const { search, facility, wasteType, method, status, startDate, endDate, page = 1, limit = 10, sort = '-processingDate' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { processingId: { $regex: search, $options: 'i' } },
        { wasteSource: { $regex: search, $options: 'i' } },
        { processingFacility: { $regex: search, $options: 'i' } },
        { outputType: { $regex: search, $options: 'i' } },
        { remarks: { $regex: search, $options: 'i' } }
      ];
    }

    if (facility && facility !== 'All') {
      query.processingFacility = { $regex: facility, $options: 'i' };
    }

    if (wasteType && wasteType !== 'All') {
      query.wasteType = wasteType;
    }

    if (method && method !== 'All') {
      query.processingMethod = method;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (startDate || endDate) {
      query.processingDate = {};
      if (startDate) query.processingDate.$gte = new Date(startDate);
      if (endDate) query.processingDate.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await WasteProcessing.countDocuments(query);
    const records = await WasteProcessing.find(query)
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

// @desc    Get single processing record
// @route   GET /api/processing/:id
// @access  Private
const getProcessingById = async (req, res, next) => {
  try {
    const record = await WasteProcessing.findById(req.params.id).populate('createdBy', 'name email role');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Processing record not found'
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

// @desc    Create processing record
// @route   POST /api/processing
// @access  Private
const createProcessing = async (req, res, next) => {
  try {
    const { wasteSource, processingFacility, wasteType, inputQuantity, processedQuantity, processingDate, processingMethod, outputType, status, remarks } = req.body;

    if (!wasteSource || !processingFacility || !wasteType || inputQuantity === undefined || processedQuantity === undefined || !processingMethod || !outputType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const input = Number(inputQuantity);
    const processed = Number(processedQuantity);

    if (input <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Input quantity must be greater than zero'
      });
    }

    if (processed < 0) {
      return res.status(400).json({
        success: false,
        message: 'Processed quantity cannot be negative'
      });
    }

    if (processed > input) {
      return res.status(400).json({
        success: false,
        message: 'Processed quantity cannot exceed input quantity'
      });
    }

    const efficiency = Number(((processed / input) * 100).toFixed(2));

    const record = await WasteProcessing.create({
      wasteSource,
      processingFacility,
      wasteType,
      inputQuantity: input,
      processedQuantity: processed,
      processingDate: processingDate || new Date(),
      processingMethod,
      outputType,
      efficiency,
      status: status || 'Pending',
      remarks: remarks || '',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Waste processing record created successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update processing record
// @route   PUT /api/processing/:id
// @access  Private
const updateProcessing = async (req, res, next) => {
  try {
    const record = await WasteProcessing.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Processing record not found'
      });
    }

    const input = req.body.inputQuantity !== undefined ? Number(req.body.inputQuantity) : record.inputQuantity;
    const processed = req.body.processedQuantity !== undefined ? Number(req.body.processedQuantity) : record.processedQuantity;

    if (input <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Input quantity must be greater than zero'
      });
    }

    if (processed < 0) {
      return res.status(400).json({
        success: false,
        message: 'Processed quantity cannot be negative'
      });
    }

    if (processed > input) {
      return res.status(400).json({
        success: false,
        message: 'Processed quantity cannot exceed input quantity'
      });
    }

    const updates = { ...req.body };
    updates.inputQuantity = input;
    updates.processedQuantity = processed;
    updates.efficiency = Number(((processed / input) * 100).toFixed(2));

    const updated = await WasteProcessing.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Processing record updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete processing record
// @route   DELETE /api/processing/:id
// @access  Private
const deleteProcessing = async (req, res, next) => {
  try {
    const record = await WasteProcessing.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Processing record not found'
      });
    }

    await WasteProcessing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Processing record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProcessings,
  getProcessingById,
  createProcessing,
  updateProcessing,
  deleteProcessing
};
