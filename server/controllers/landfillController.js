const Landfill = require('../models/Landfill');

const calculateWarningLevel = (utilization) => {
  if (utilization < 60) return 'Normal';
  if (utilization < 80) return 'Moderate';
  if (utilization < 90) return 'High';
  return 'Critical';
};

// @desc    Get all landfills
// @route   GET /api/landfills
// @access  Private
const getLandfills = async (req, res, next) => {
  try {
    const { search, warningLevel, operationalStatus, page = 1, limit = 10, sort = '-date' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { landfillId: { $regex: search, $options: 'i' } },
        { landfillName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { remarks: { $regex: search, $options: 'i' } }
      ];
    }

    if (warningLevel && warningLevel !== 'All') {
      query.warningLevel = warningLevel;
    }

    if (operationalStatus && operationalStatus !== 'All') {
      query.operationalStatus = operationalStatus;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Landfill.countDocuments(query);
    const records = await Landfill.find(query)
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

// @desc    Get single landfill
// @route   GET /api/landfills/:id
// @access  Private
const getLandfillById = async (req, res, next) => {
  try {
    const record = await Landfill.findById(req.params.id).populate('createdBy', 'name email role');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Landfill record not found'
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

// @desc    Create landfill record
// @route   POST /api/landfills
// @access  Private
const createLandfill = async (req, res, next) => {
  try {
    const { landfillName, location, capacity, usedCapacity, wasteReceived, wasteType, date, operationalStatus, remarks } = req.body;

    if (!landfillName || !location || capacity === undefined || usedCapacity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Landfill Name, Location, Capacity, Used Capacity)'
      });
    }

    const cap = Number(capacity);
    const used = Number(usedCapacity);
    const received = wasteReceived !== undefined ? Number(wasteReceived) : 0;

    if (cap <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total capacity must be greater than zero'
      });
    }

    if (used < 0 || received < 0) {
      return res.status(400).json({
        success: false,
        message: 'Used capacity and waste received cannot be negative numbers'
      });
    }

    if (used > cap) {
      return res.status(400).json({
        success: false,
        message: 'Used capacity cannot exceed total capacity'
      });
    }

    const remaining = Math.max(0, Number((cap - used).toFixed(2)));
    const utilization = Number(((used / cap) * 100).toFixed(2));
    const warning = calculateWarningLevel(utilization);

    const record = await Landfill.create({
      landfillName,
      location,
      capacity: cap,
      usedCapacity: used,
      remainingCapacity: remaining,
      wasteReceived: received,
      wasteType: wasteType || 'Inert / Non-recyclable',
      date: date || new Date(),
      utilizationPercentage: utilization,
      warningLevel: warning,
      operationalStatus: operationalStatus || 'Operational',
      remarks: remarks || '',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Landfill record created successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update landfill record
// @route   PUT /api/landfills/:id
// @access  Private
const updateLandfill = async (req, res, next) => {
  try {
    const record = await Landfill.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Landfill record not found'
      });
    }

    const cap = req.body.capacity !== undefined ? Number(req.body.capacity) : record.capacity;
    const used = req.body.usedCapacity !== undefined ? Number(req.body.usedCapacity) : record.usedCapacity;
    const received = req.body.wasteReceived !== undefined ? Number(req.body.wasteReceived) : record.wasteReceived;

    if (cap <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total capacity must be greater than zero'
      });
    }

    if (used < 0 || received < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantities cannot be negative numbers'
      });
    }

    if (used > cap) {
      return res.status(400).json({
        success: false,
        message: 'Used capacity cannot exceed total capacity'
      });
    }

    const updates = { ...req.body };
    updates.capacity = cap;
    updates.usedCapacity = used;
    updates.wasteReceived = received;
    updates.remainingCapacity = Math.max(0, Number((cap - used).toFixed(2)));
    updates.utilizationPercentage = Number(((used / cap) * 100).toFixed(2));
    updates.warningLevel = calculateWarningLevel(updates.utilizationPercentage);

    const updated = await Landfill.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Landfill record updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete landfill record
// @route   DELETE /api/landfills/:id
// @access  Private
const deleteLandfill = async (req, res, next) => {
  try {
    const record = await Landfill.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Landfill record not found'
      });
    }

    await Landfill.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Landfill record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLandfills,
  getLandfillById,
  createLandfill,
  updateLandfill,
  deleteLandfill
};
