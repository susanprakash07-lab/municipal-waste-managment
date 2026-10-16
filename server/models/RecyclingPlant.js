const mongoose = require('mongoose');

const recyclingPlantSchema = new mongoose.Schema(
  {
    plantId: {
      type: String,
      unique: true,
      index: true
    },
    plantName: {
      type: String,
      required: [true, 'Plant name is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    wasteType: {
      type: String,
      required: [true, 'Waste type processed is required'],
      enum: ['Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Organic / Multi']
    },
    inputQuantity: {
      type: Number,
      required: [true, 'Input quantity is required'],
      min: [0, 'Input quantity cannot be negative']
    },
    recycledQuantity: {
      type: Number,
      required: [true, 'Recycled quantity is required'],
      min: [0, 'Recycled quantity cannot be negative']
    },
    processingDate: {
      type: Date,
      default: Date.now,
      required: [true, 'Processing date is required']
    },
    capacity: {
      type: Number,
      required: [true, 'Plant daily capacity is required'],
      min: [1, 'Capacity must be at least 1 ton']
    },
    utilization: {
      type: Number,
      default: 0
    },
    recyclingRate: {
      type: Number,
      default: 0
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

recyclingPlantSchema.pre('save', async function (next) {
  if (!this.plantId) {
    const count = await this.constructor.countDocuments();
    this.plantId = `RPL-${String(count + 1001).padStart(4, '0')}`;
  }
  if (this.capacity > 0) {
    this.utilization = Number(((this.inputQuantity / this.capacity) * 100).toFixed(2));
  }
  if (this.inputQuantity > 0) {
    this.recyclingRate = Number(((this.recycledQuantity / this.inputQuantity) * 100).toFixed(2));
  } else {
    this.recyclingRate = 0;
  }
  next();
});

module.exports = mongoose.model('RecyclingPlant', recyclingPlantSchema);
