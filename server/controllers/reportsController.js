const WasteSegregation = require('../models/WasteSegregation');
const WasteCollection = require('../models/WasteCollection');
const WasteProcessing = require('../models/WasteProcessing');
const RecyclingPlant = require('../models/RecyclingPlant');
const Landfill = require('../models/Landfill');

// @desc    Get aggregated municipal waste reports based on type and date range
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res, next) => {
  try {
    const { reportType = 'daily', startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }

    const processingDateFilter = {};
    if (startDate || endDate) {
      processingDateFilter.processingDate = {};
      if (startDate) processingDateFilter.processingDate.$gte = new Date(startDate);
      if (endDate) processingDateFilter.processingDate.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }

    let reportData = {};

    switch (reportType) {
      case 'daily': {
        // Daily breakdown of waste collected, segregated, processed, recycled, landfilled
        const collections = await WasteCollection.find(dateFilter).sort({ date: -1 });
        const segregations = await WasteSegregation.find(dateFilter).sort({ date: -1 });
        const processing = await WasteProcessing.find(processingDateFilter).sort({ processingDate: -1 });

        const totalCollected = collections.reduce((acc, cur) => acc + (cur.quantity || 0), 0);
        const totalSegregated = segregations.reduce((acc, cur) => {
          const val = cur.unit === 'kg' ? cur.quantity / 1000 : cur.quantity;
          return acc + (val || 0);
        }, 0);
        const totalProcessed = processing.reduce((acc, cur) => acc + (cur.processedQuantity || 0), 0);
        const totalRecycled = processing.filter(p => p.processingMethod === 'Recycling')
          .reduce((acc, cur) => acc + (cur.processedQuantity || 0), 0);

        reportData = {
          title: 'Daily Municipal Waste Flow Report',
          period: { startDate, endDate },
          summary: {
            totalCollected: Number(totalCollected.toFixed(2)),
            totalSegregated: Number(totalSegregated.toFixed(2)),
            totalProcessed: Number(totalProcessed.toFixed(2)),
            totalRecycled: Number(totalRecycled.toFixed(2)),
            unit: 'tons'
          },
          details: collections.map(c => ({
            date: c.date.toISOString().split('T')[0],
            collectionPoint: c.collectionPoint,
            area: c.area,
            wasteType: c.wasteType,
            quantity: c.quantity,
            vehicleNumber: c.vehicleNumber,
            driverName: c.driverName,
            status: c.status
          }))
        };
        break;
      }

      case 'monthly': {
        const monthlyAgg = await WasteCollection.aggregate([
          {
            $group: {
              _id: {
                year: { $year: '$date' },
                month: { $month: '$date' }
              },
              totalQuantity: { $sum: '$quantity' },
              totalTrips: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': -1, '_id.month': -1 } }
        ]);

        const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        reportData = {
          title: 'Monthly Waste Collection Analysis',
          summary: {
            monthsRecorded: monthlyAgg.length,
            overallTonnage: Number(monthlyAgg.reduce((acc, m) => acc + m.totalQuantity, 0).toFixed(2))
          },
          records: monthlyAgg.map(m => ({
            month: `${monthNames[m._id.month]} ${m._id.year}`,
            quantity: Number(m.totalQuantity.toFixed(2)),
            trips: m.totalTrips,
            averagePerTrip: Number((m.totalQuantity / m.totalTrips).toFixed(2))
          }))
        };
        break;
      }

      case 'wasteType': {
        const wasteTypeAgg = await WasteCollection.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: '$wasteType',
              totalQuantity: { $sum: '$quantity' },
              count: { $sum: 1 }
            }
          },
          { $sort: { totalQuantity: -1 } }
        ]);

        const totalOverall = wasteTypeAgg.reduce((acc, w) => acc + w.totalQuantity, 0);

        reportData = {
          title: 'Waste Type Characterization & Proportion Report',
          totalOverall: Number(totalOverall.toFixed(2)),
          records: wasteTypeAgg.map(w => ({
            wasteType: w._id,
            quantity: Number(w.totalQuantity.toFixed(2)),
            percentage: totalOverall > 0 ? Number(((w.totalQuantity / totalOverall) * 100).toFixed(1)) : 0,
            batches: w.count
          }))
        };
        break;
      }

      case 'recycling': {
        const plants = await RecyclingPlant.find().sort({ plantName: 1 });
        const totalCapacity = plants.reduce((acc, p) => acc + p.capacity, 0);
        const totalInput = plants.reduce((acc, p) => acc + p.inputQuantity, 0);
        const totalRecycled = plants.reduce((acc, p) => acc + p.recycledQuantity, 0);

        reportData = {
          title: 'Municipal Recycling Operations & Plant Efficiency',
          summary: {
            totalPlants: plants.length,
            totalCapacity: Number(totalCapacity.toFixed(2)),
            totalInput: Number(totalInput.toFixed(2)),
            totalRecycled: Number(totalRecycled.toFixed(2)),
            averageRecyclingRate: totalInput > 0 ? Number(((totalReccycled = totalRecycled / totalInput) * 100).toFixed(1)) : 0
          },
          records: plants.map(p => ({
            plantId: p.plantId,
            plantName: p.plantName,
            location: p.location,
            wasteType: p.wasteType,
            capacity: p.capacity,
            inputQuantity: p.inputQuantity,
            recycledQuantity: p.recycledQuantity,
            recyclingRate: `${p.recyclingRate}%`,
            utilization: `${p.utilization}%`,
            status: p.operationalStatus
          }))
        };
        break;
      }

      case 'landfill': {
        const landfills = await Landfill.find().sort({ utilizationPercentage: -1 });
        const totalCapacity = landfills.reduce((acc, l) => acc + l.capacity, 0);
        const totalUsed = landfills.reduce((acc, l) => acc + l.usedCapacity, 0);
        const totalReceived = landfills.reduce((acc, l) => acc + l.wasteReceived, 0);

        reportData = {
          title: 'Landfill Capacity, Utilization & Warning Report',
          summary: {
            totalSites: landfills.length,
            totalCapacity: Number(totalCapacity.toFixed(2)),
            totalUsed: Number(totalUsed.toFixed(2)),
            totalRemaining: Number((totalCapacity - totalUsed).toFixed(2)),
            overallUtilization: totalCapacity > 0 ? Number(((totalUsed / totalCapacity) * 100).toFixed(1)) : 0,
            todayReceived: Number(totalReceived.toFixed(2))
          },
          records: landfills.map(l => ({
            landfillId: l.landfillId,
            landfillName: l.landfillName,
            location: l.location,
            capacity: l.capacity,
            usedCapacity: l.usedCapacity,
            remainingCapacity: l.remainingCapacity,
            wasteReceived: l.wasteReceived,
            utilization: `${l.utilizationPercentage}%`,
            warningLevel: l.warningLevel,
            status: l.operationalStatus
          }))
        };
        break;
      }

      case 'collectionPerformance': {
        const performanceAgg = await WasteCollection.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalQuantity: { $sum: '$quantity' }
            }
          }
        ]);

        const totalTrips = performanceAgg.reduce((acc, p) => acc + p.count, 0);
        const completedTrips = performanceAgg.find(p => p._id === 'Completed')?.count || 0;
        const pendingTrips = (performanceAgg.find(p => p._id === 'Scheduled')?.count || 0) +
          (performanceAgg.find(p => p._id === 'In Progress')?.count || 0);
        const cancelledTrips = performanceAgg.find(p => p._id === 'Cancelled')?.count || 0;

        reportData = {
          title: 'Waste Collection Operational Performance & Fleet Efficiency',
          summary: {
            totalTrips,
            completedTrips,
            pendingTrips,
            cancelledTrips,
            completionRate: totalTrips > 0 ? Number(((completedTrips / totalTrips) * 100).toFixed(1)) : 0
          },
          breakdown: performanceAgg.map(p => ({
            status: p._id,
            count: p.count,
            quantity: Number(p.totalQuantity.toFixed(2)),
            percentage: totalTrips > 0 ? Number(((p.count / totalTrips) * 100).toFixed(1)) : 0
          }))
        };
        break;
      }

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type requested'
        });
    }

    res.status(200).json({
      success: true,
      reportType,
      generatedAt: new Date(),
      data: reportData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReports
};
