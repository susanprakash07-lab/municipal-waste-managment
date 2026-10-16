const WasteSegregation = require('../models/WasteSegregation');
const WasteCollection = require('../models/WasteCollection');
const WasteProcessing = require('../models/WasteProcessing');
const RecyclingPlant = require('../models/RecyclingPlant');
const Landfill = require('../models/Landfill');

// @desc    Global unified search across all 5 operational modules
// @route   GET /api/search
// @access  Private
const globalSearch = async (req, res, next) => {
  try {
    const { q = '', category = 'All', status, wasteType, limit = 50 } = req.query;
    const searchRegex = q ? { $regex: q.trim(), $options: 'i' } : null;

    let results = [];

    // Helper to match
    const matchesFilter = (item) => {
      if (status && status !== 'All' && item.status !== status) return false;
      if (wasteType && wasteType !== 'All' && item.wasteType !== wasteType) return false;
      return true;
    };

    // 1. Search Waste Segregation
    if (category === 'All' || category === 'Segregation') {
      const segQuery = {};
      if (searchRegex) {
        segQuery.$or = [
          { recordId: searchRegex },
          { collectionPoint: searchRegex },
          { segregatedBy: searchRegex },
          { wasteType: searchRegex },
          { remarks: searchRegex }
        ];
      }
      if (status && status !== 'All') segQuery.status = status;
      if (wasteType && wasteType !== 'All') segQuery.wasteType = wasteType;

      const segs = await WasteSegregation.find(segQuery).limit(limit).sort({ date: -1 });
      segs.forEach(s => {
        results.push({
          id: s._id,
          code: s.recordId,
          module: 'Waste Segregation',
          title: `${s.wasteType} Segregation at ${s.collectionPoint}`,
          location: s.collectionPoint,
          wasteType: s.wasteType,
          quantity: `${s.quantity} ${s.unit}`,
          date: s.date,
          status: s.status,
          primaryPerson: s.segregatedBy,
          extraInfo: s.remarks || 'No remarks',
          route: '/segregation'
        });
      });
    }

    // 2. Search Waste Collection
    if (category === 'All' || category === 'Collection') {
      const colQuery = {};
      if (searchRegex) {
        colQuery.$or = [
          { collectionId: searchRegex },
          { collectionPoint: searchRegex },
          { area: searchRegex },
          { vehicleNumber: searchRegex },
          { driverName: searchRegex },
          { collectorName: searchRegex },
          { wasteType: searchRegex }
        ];
      }
      if (status && status !== 'All') colQuery.status = status;
      if (wasteType && wasteType !== 'All') colQuery.wasteType = wasteType;

      const cols = await WasteCollection.find(colQuery).limit(limit).sort({ date: -1 });
      cols.forEach(c => {
        results.push({
          id: c._id,
          code: c.collectionId,
          module: 'Waste Collection',
          title: `Fleet ${c.vehicleNumber} (${c.area})`,
          location: `${c.collectionPoint} (${c.area})`,
          wasteType: c.wasteType,
          quantity: `${c.quantity} tons`,
          date: c.date,
          status: c.status,
          primaryPerson: `Driver: ${c.driverName} | Collector: ${c.collectorName}`,
          extraInfo: `Vehicle: ${c.vehicleNumber} | Time: ${c.time}`,
          route: '/collection'
        });
      });
    }

    // 3. Search Waste Processing
    if (category === 'All' || category === 'Processing') {
      const prcQuery = {};
      if (searchRegex) {
        prcQuery.$or = [
          { processingId: searchRegex },
          { wasteSource: searchRegex },
          { processingFacility: searchRegex },
          { processingMethod: searchRegex },
          { outputType: searchRegex },
          { wasteType: searchRegex }
        ];
      }
      if (status && status !== 'All') prcQuery.status = status;
      if (wasteType && wasteType !== 'All') prcQuery.wasteType = wasteType;

      const prcs = await WasteProcessing.find(prcQuery).limit(limit).sort({ processingDate: -1 });
      prcs.forEach(p => {
        results.push({
          id: p._id,
          code: p.processingId,
          module: 'Waste Processing',
          title: `${p.processingMethod} (${p.outputType})`,
          location: p.processingFacility,
          wasteType: p.wasteType,
          quantity: `${p.processedQuantity} / ${p.inputQuantity} tons`,
          date: p.processingDate,
          status: p.status,
          primaryPerson: `Source: ${p.wasteSource}`,
          extraInfo: `Efficiency: ${p.efficiency}% | Output: ${p.outputType}`,
          route: '/processing'
        });
      });
    }

    // 4. Search Recycling Plants
    if (category === 'All' || category === 'Recycling') {
      const rplQuery = {};
      if (searchRegex) {
        rplQuery.$or = [
          { plantId: searchRegex },
          { plantName: searchRegex },
          { location: searchRegex },
          { wasteType: searchRegex }
        ];
      }
      if (status && status !== 'All') rplQuery.operationalStatus = status;
      if (wasteType && wasteType !== 'All') rplQuery.wasteType = wasteType;

      const rpls = await RecyclingPlant.find(rplQuery).limit(limit).sort({ processingDate: -1 });
      rpls.forEach(r => {
        results.push({
          id: r._id,
          code: r.plantId,
          module: 'Recycling Plant',
          title: r.plantName,
          location: r.location,
          wasteType: r.wasteType,
          quantity: `Recycled: ${r.recycledQuantity} tons`,
          date: r.processingDate,
          status: r.operationalStatus,
          primaryPerson: `Capacity: ${r.capacity} tons/day`,
          extraInfo: `Recycling Rate: ${r.recyclingRate}% | Utilization: ${r.utilization}%`,
          route: '/recycling'
        });
      });
    }

    // 5. Search Landfills
    if (category === 'All' || category === 'Landfill') {
      const lnfQuery = {};
      if (searchRegex) {
        lnfQuery.$or = [
          { landfillId: searchRegex },
          { landfillName: searchRegex },
          { location: searchRegex },
          { wasteType: searchRegex }
        ];
      }
      if (status && status !== 'All') lnfQuery.operationalStatus = status;

      const lnfs = await Landfill.find(lnfQuery).limit(limit).sort({ date: -1 });
      lnfs.forEach(l => {
        results.push({
          id: l._id,
          code: l.landfillId,
          module: 'Landfill Management',
          title: l.landfillName,
          location: l.location,
          wasteType: l.wasteType,
          quantity: `Used: ${l.usedCapacity.toLocaleString()} tons`,
          date: l.date,
          status: l.operationalStatus,
          primaryPerson: `Warning Level: ${l.warningLevel}`,
          extraInfo: `Utilization: ${l.utilizationPercentage}% | Remaining: ${l.remainingCapacity.toLocaleString()} tons`,
          route: '/landfills'
        });
      });
    }

    // Sort results by date descending
    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      query: q,
      category,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  globalSearch
};
