const mongoose = require('mongoose');

const wasteSegregationSchema = new mongoose.Schema(
  {
    recordId: {
      type: String,
      unique: true,
      index: true
    },
    collectionPoint: {
      type: String,
      required: [true, 'Collection point is required'],
      trim: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, 'Date is required']
    },
    wasteType: {
      type: String,
      required: [true, 'Waste type is required'],
      enum: ['Organic', 'Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Other']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.01, 'Quantity must be positive']
    },
    unit: {
      type: String,
      enum: ['kg', 'tons'],
      default: 'kg'
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    segregatedBy: {
      type: String,
      required: [true, 'Segregated By is required'],
      trim: true
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

// Auto-generate recordId if not provided
wasteSegregationSchema.pre('save', async function (next) {
  if (!this.recordId) {
    const count = await this.constructor.countDocuments();
    this.recordId = `SEG-${String(count + 1001).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('WasteSegregation', wasteSegregationSchema);
