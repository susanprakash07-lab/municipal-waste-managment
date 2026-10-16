const mongoose = require('mongoose');

const landfillSchema = new mongoose.Schema(
  {
    landfillId: {
      type: String,
      unique: true,
      index: true
    },
    landfillName: {
      type: String,
      required: [true, 'Landfill name is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Total capacity is required'],
      min: [1, 'Capacity must be at least 1 ton']
    },
    usedCapacity: {
      type: Number,
      required: [true, 'Used capacity is required'],
      min: [0, 'Used capacity cannot be negative']
    },
    remainingCapacity: {
      type: Number,
      default: 0
    },
    wasteReceived: {
      type: Number,
      default: 0,
      min: [0, 'Waste received cannot be negative']
    },
    wasteType: {
      type: String,
      default: 'Inert / Non-recyclable',
      trim: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, 'Date is required']
    },
    utilizationPercentage: {
      type: Number,
      default: 0
    },
    warningLevel: {
      type: String,
      enum: ['Normal', 'Moderate', 'High', 'Critical'],
      default: 'Normal'
    },
    operationalStatus: {
      type: String,
      enum: ['Operational', 'Maintenance', 'Temporarily Closed'],
      default: 'Operational'
    },
    remarks: {
      type: String,
      trim: true,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

landfillSchema.pre('save', async function (next) {
  if (!this.landfillId) {
    const count = await this.constructor.countDocuments();
    this.landfillId = `LNF-${String(count + 1001).padStart(4, '0')}`;
  }
  // Calculations
  this.remainingCapacity = Math.max(0, Number((this.capacity - this.usedCapacity).toFixed(2)));
  if (this.capacity > 0) {
    this.utilizationPercentage = Number(((this.usedCapacity / this.capacity) * 100).toFixed(2));
  } else {
    this.utilizationPercentage = 0;
  }

  // Warning level
  if (this.utilizationPercentage < 60) {
    this.warningLevel = 'Normal';
  } else if (this.utilizationPercentage < 80) {
    this.warningLevel = 'Moderate';
  } else if (this.utilizationPercentage < 90) {
    this.warningLevel = 'High';
  } else {
    this.warningLevel = 'Critical';
  }

  next();
});

module.exports = mongoose.model('Landfill', landfillSchema);
