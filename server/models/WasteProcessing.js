const mongoose = require('mongoose');

const wasteProcessingSchema = new mongoose.Schema(
  {
    processingId: {
      type: String,
      unique: true,
      index: true
    },
    wasteSource: {
      type: String,
      required: [true, 'Waste source is required'],
      trim: true
    },
    processingFacility: {
      type: String,
      required: [true, 'Processing facility is required'],
      trim: true
    },
    wasteType: {
      type: String,
      required: [true, 'Waste type is required'],
      enum: ['Organic', 'Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Mixed / Other']
    },
    inputQuantity: {
      type: Number,
      required: [true, 'Input quantity is required'],
      min: [0.01, 'Input quantity must be greater than zero']
    },
    processedQuantity: {
      type: Number,
      required: [true, 'Processed quantity is required'],
      min: [0, 'Processed quantity cannot be negative']
    },
    processingDate: {
      type: Date,
      default: Date.now,
      required: [true, 'Processing date is required']
    },
    processingMethod: {
      type: String,
      required: [true, 'Processing method is required'],
      enum: ['Composting', 'Material Recovery', 'Recycling', 'Treatment', 'Other']
    },
    outputType: {
      type: String,
      required: [true, 'Output type is required'],
      trim: true
    },
    efficiency: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed'],
      default: 'Pending'
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

wasteProcessingSchema.pre('save', async function (next) {
  if (!this.processingId) {
    const count = await this.constructor.countDocuments();
    this.processingId = `PRC-${String(count + 1001).padStart(4, '0')}`;
  }
  if (this.inputQuantity > 0) {
    this.efficiency = Number(((this.processedQuantity / this.inputQuantity) * 100).toFixed(2));
  } else {
    this.efficiency = 0;
  }
  next();
});

module.exports = mongoose.model('WasteProcessing', wasteProcessingSchema);
