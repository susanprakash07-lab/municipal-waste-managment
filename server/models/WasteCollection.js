const mongoose = require('mongoose');

const wasteCollectionSchema = new mongoose.Schema(
  {
    collectionId: {
      type: String,
      unique: true,
      index: true
    },
    collectionPoint: {
      type: String,
      required: [true, 'Collection point is required'],
      trim: true
    },
    area: {
      type: String,
      required: [true, 'Area / Zone is required'],
      trim: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, 'Collection date is required']
    },
    time: {
      type: String,
      required: [true, 'Collection time is required'],
      trim: true
    },
    wasteType: {
      type: String,
      required: [true, 'Waste type is required'],
      enum: ['Organic', 'Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Mixed / Other']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.01, 'Quantity must be positive']
    },
    unit: {
      type: String,
      default: 'tons'
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required'],
      trim: true
    },
    driverName: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true
    },
    collectorName: {
      type: String,
      required: [true, 'Collector name is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Scheduled'
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

wasteCollectionSchema.pre('save', async function (next) {
  if (!this.collectionId) {
    const count = await this.constructor.countDocuments();
    this.collectionId = `COL-${String(count + 1001).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('WasteCollection', wasteCollectionSchema);
