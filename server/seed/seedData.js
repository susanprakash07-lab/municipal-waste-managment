const mongoose = require('mongoose');
const User = require('../models/User');
const WasteSegregation = require('../models/WasteSegregation');
const WasteCollection = require('../models/WasteCollection');
const WasteProcessing = require('../models/WasteProcessing');
const RecyclingPlant = require('../models/RecyclingPlant');
const Landfill = require('../models/Landfill');

const seedUsers = [
  {
    name: 'Rajesh Sharma',
    email: 'admin@municipal.com',
    password: 'Admin@123',
    role: 'ADMIN',
    department: 'Municipal Operations & Administration',
    phone: '+91 98765 43210'
  },
  {
    name: 'Priya Verma',
    email: 'staff@municipal.com',
    password: 'Staff@123',
    role: 'MUNICIPAL STAFF',
    department: 'Solid Waste Field Operations',
    phone: '+91 98123 45678'
  },
  {
    name: 'Anil Kumble',
    email: 'anil.staff@municipal.com',
    password: 'Staff@123',
    role: 'MUNICIPAL STAFF',
    department: 'Zone 3 Collection Unit',
    phone: '+91 97654 32109'
  }
];

const seedSegregation = [
  {
    recordId: 'SEG-1001',
    collectionPoint: 'Indiranagar Ward 4 Transfer Station',
    date: new Date('2026-09-20'),
    wasteType: 'Organic',
    quantity: 4250,
    unit: 'kg',
    status: 'Completed',
    segregatedBy: 'Priya Verma',
    remarks: 'Kitchen waste from local market and restaurants. Wet waste segregated properly.'
  },
  {
    recordId: 'SEG-1002',
    collectionPoint: 'Koramangala 5th Block Primary Depot',
    date: new Date('2026-09-21'),
    wasteType: 'Plastic',
    quantity: 1850,
    unit: 'kg',
    status: 'Completed',
    segregatedBy: 'Ramesh Babu',
    remarks: 'High density polyethylene (HDPE) bottles and wrappers bundled for MRF.'
  },
  {
    recordId: 'SEG-1003',
    collectionPoint: 'Jayanagar 4th Block Sorting Yard',
    date: new Date('2026-09-22'),
    wasteType: 'Paper',
    quantity: 1200,
    unit: 'kg',
    status: 'Completed',
    segregatedBy: 'Priya Verma',
    remarks: 'Cardboard boxes, newsprint, and office stationery sorted.'
  },
  {
    recordId: 'SEG-1004',
    collectionPoint: 'Malleshwaram 8th Cross Collection Center',
    date: new Date('2026-09-23'),
    wasteType: 'Glass',
    quantity: 820,
    unit: 'kg',
    status: 'Completed',
    segregatedBy: 'Sunil Kumar',
    remarks: 'Sorted by clear flint glass and amber bottles.'
  },
  {
    recordId: 'SEG-1005',
    collectionPoint: 'Whitefield Main Depot Facility',
    date: new Date('2026-09-24'),
    wasteType: 'Metal',
    quantity: 640,
    unit: 'kg',
    status: 'Completed',
    segregatedBy: 'Priya Verma',
    remarks: 'Tin cans, aluminum beverage containers, and iron scraps.'
  },
  {
    recordId: 'SEG-1006',
    collectionPoint: 'Indiranagar Ward 4 Transfer Station',
    date: new Date('2026-09-25'),
    wasteType: 'E-Waste',
    quantity: 350,
    unit: 'kg',
    status: 'Completed',
    segregatedBy: 'Anil Kumble',
    remarks: 'Small household electronics, wires, mobile adapters, and printed circuit boards.'
  },
  {
    recordId: 'SEG-1007',
    collectionPoint: 'HSR Layout Sector 2 Collection Point',
    date: new Date('2026-09-26'),
    wasteType: 'Organic',
    quantity: 3800,
    unit: 'kg',
    status: 'In Progress',
    segregatedBy: 'Kavitha R',
    remarks: 'Horticulture waste and garden trimmings queued for shredding.'
  },
  {
    recordId: 'SEG-1008',
    collectionPoint: 'BTM Layout 2nd Stage Sorting Unit',
    date: new Date('2026-09-27'),
    wasteType: 'Plastic',
    quantity: 2100,
    unit: 'kg',
    status: 'In Progress',
    segregatedBy: 'Sunil Kumar',
    remarks: 'Single-use packaging, PET bottles, and LDPE sheets.'
  },
  {
    recordId: 'SEG-1009',
    collectionPoint: 'Rajajinagar Industrial Area Depot',
    date: new Date('2026-09-28'),
    wasteType: 'Other',
    quantity: 950,
    unit: 'kg',
    status: 'Pending',
    segregatedBy: 'Priya Verma',
    remarks: 'Mixed textiles, rubber scraps, and ceramic debris.'
  },
  {
    recordId: 'SEG-1010',
    collectionPoint: 'Koramangala 5th Block Primary Depot',
    date: new Date('2026-09-29'),
    wasteType: 'Organic',
    quantity: 4500,
    unit: 'kg',
    status: 'Pending',
    segregatedBy: 'Anil Kumble',
    remarks: 'Morning vegetable market batch awaiting biological sorting.'
  },
  {
    recordId: 'SEG-1011',
    collectionPoint: 'Electronic City Phase 1 Point',
    date: new Date('2026-09-29'),
    wasteType: 'E-Waste',
    quantity: 520,
    unit: 'kg',
    status: 'In Progress',
    segregatedBy: 'Priya Verma',
    remarks: 'Office computer components and battery cells isolated.'
  }
];

const seedCollections = [
  {
    collectionId: 'COL-1001',
    collectionPoint: 'Indiranagar 100ft Road Market',
    area: 'East Zone',
    date: new Date('2026-09-18'),
    time: '06:30 AM',
    wasteType: 'Organic',
    quantity: 3.8,
    unit: 'tons',
    vehicleNumber: 'KA-03-GA-1024',
    driverName: 'Manjunath Swamy',
    collectorName: 'Gopal Krishna',
    status: 'Completed',
    remarks: 'Morning commercial vegetable market route completed smoothly.'
  },
  {
    collectionId: 'COL-1002',
    collectionPoint: 'Koramangala Sony World Junction',
    area: 'South Zone',
    date: new Date('2026-09-19'),
    time: '07:15 AM',
    wasteType: 'Plastic',
    quantity: 2.1,
    unit: 'tons',
    vehicleNumber: 'KA-05-MM-2201',
    driverName: 'Suresh Gowda',
    collectorName: 'Babu Rao',
    status: 'Completed',
    remarks: 'Dry waste segregation vehicle loaded and sealed.'
  },
  {
    collectionId: 'COL-1003',
    collectionPoint: 'Jayanagar 4th Block Shopping Complex',
    area: 'South Zone',
    date: new Date('2026-09-20'),
    time: '08:00 AM',
    wasteType: 'Paper',
    quantity: 1.6,
    unit: 'tons',
    vehicleNumber: 'KA-01-EA-4821',
    driverName: 'Venkatesh Rao',
    collectorName: 'Prakash M',
    status: 'Completed',
    remarks: 'Cardboard bales picked up from retail stores.'
  },
  {
    collectionId: 'COL-1004',
    collectionPoint: 'Whitefield ITPL Main Gate Area',
    area: 'East Zone',
    date: new Date('2026-09-21'),
    time: '09:30 AM',
    wasteType: 'Mixed / Other',
    quantity: 4.5,
    unit: 'tons',
    vehicleNumber: 'KA-53-Z-8842',
    driverName: 'Mahesh Reddy',
    collectorName: 'Santosh Kumar',
    status: 'Completed',
    remarks: 'Commercial complex trash bins cleared.'
  },
  {
    collectionId: 'COL-1005',
    collectionPoint: 'Malleshwaram Sampige Road',
    area: 'West Zone',
    date: new Date('2026-09-22'),
    time: '06:45 AM',
    wasteType: 'Organic',
    quantity: 3.2,
    unit: 'tons',
    vehicleNumber: 'KA-04-TR-9110',
    driverName: 'Deepak Patil',
    collectorName: 'Channappa',
    status: 'Completed',
    remarks: 'Flower market and temple organic offerings collected.'
  },
  {
    collectionId: 'COL-1006',
    collectionPoint: 'HSR Layout BDA Complex',
    area: 'South Zone',
    date: new Date('2026-09-23'),
    time: '07:30 AM',
    wasteType: 'Plastic',
    quantity: 1.8,
    unit: 'tons',
    vehicleNumber: 'KA-51-AB-3390',
    driverName: 'Shankar Lal',
    collectorName: 'Vijay Kumar',
    status: 'Completed',
    remarks: 'Collected from designated blue bins in residential sectors.'
  },
  {
    collectionId: 'COL-1007',
    collectionPoint: 'BTM Layout 1st Stage Water Tank',
    area: 'South Zone',
    date: new Date('2026-09-24'),
    time: '08:15 AM',
    wasteType: 'Glass',
    quantity: 0.9,
    unit: 'tons',
    vehicleNumber: 'KA-05-C-7741',
    driverName: 'Sanjay Nair',
    collectorName: 'Ramu K',
    status: 'Completed',
    remarks: 'Specialized glass crate transport vehicle used.'
  },
  {
    collectionId: 'COL-1008',
    collectionPoint: 'Shivajinagar Bus Stand Point',
    area: 'Central Zone',
    date: new Date('2026-09-25'),
    time: '05:45 AM',
    wasteType: 'Organic',
    quantity: 5.1,
    unit: 'tons',
    vehicleNumber: 'KA-02-MP-6623',
    driverName: 'Mohan Das',
    collectorName: 'Karthik S',
    status: 'Completed',
    remarks: 'Heavy morning haul from transit hub food stalls.'
  },
  {
    collectionId: 'COL-1009',
    collectionPoint: 'Rajajinagar 1st Block Metro',
    area: 'West Zone',
    date: new Date('2026-09-26'),
    time: '09:00 AM',
    wasteType: 'Metal',
    quantity: 1.1,
    unit: 'tons',
    vehicleNumber: 'KA-04-MK-1298',
    driverName: 'Basavaraj K',
    collectorName: 'Girish P',
    status: 'Completed',
    remarks: 'Construction and scrap metal clearance.'
  },
  {
    collectionId: 'COL-1010',
    collectionPoint: 'Electronic City Toll Plaza Zone',
    area: 'South Zone',
    date: new Date('2026-09-27'),
    time: '10:30 AM',
    wasteType: 'E-Waste',
    quantity: 0.7,
    unit: 'tons',
    vehicleNumber: 'KA-51-EF-4402',
    driverName: 'Naveen Raj',
    collectorName: 'Priya Verma',
    status: 'Completed',
    remarks: 'Weekend e-waste collection drive bins dispatched.'
  },
  {
    collectionId: 'COL-1011',
    collectionPoint: 'Indiranagar 12th Main Food Street',
    area: 'East Zone',
    date: new Date('2026-09-28'),
    time: '11:00 AM',
    wasteType: 'Organic',
    quantity: 4.2,
    unit: 'tons',
    vehicleNumber: 'KA-03-GA-1024',
    driverName: 'Manjunath Swamy',
    collectorName: 'Gopal Krishna',
    status: 'Completed',
    remarks: 'Mid-day restaurant pickup completed.'
  },
  {
    collectionId: 'COL-1012',
    collectionPoint: 'Koramangala 7th Block Depot',
    area: 'South Zone',
    date: new Date('2026-09-29'),
    time: '07:00 AM',
    wasteType: 'Organic',
    quantity: 3.5,
    unit: 'tons',
    vehicleNumber: 'KA-05-MM-2201',
    driverName: 'Suresh Gowda',
    collectorName: 'Babu Rao',
    status: 'In Progress',
    remarks: 'Vehicle on designated route, 70% bins emptied.'
  },
  {
    collectionId: 'COL-1013',
    collectionPoint: 'Whitefield Hope Farm Junction',
    area: 'East Zone',
    date: new Date('2026-09-29'),
    time: '08:30 AM',
    wasteType: 'Plastic',
    quantity: 2.4,
    unit: 'tons',
    vehicleNumber: 'KA-53-Z-8842',
    driverName: 'Mahesh Reddy',
    collectorName: 'Santosh Kumar',
    status: 'In Progress',
    remarks: 'Collecting dry waste from commercial tech parks.'
  },
  {
    collectionId: 'COL-1014',
    collectionPoint: 'Jayanagar 9th Block Park Side',
    area: 'South Zone',
    date: new Date('2026-09-29'),
    time: '02:00 PM',
    wasteType: 'Paper',
    quantity: 1.5,
    unit: 'tons',
    vehicleNumber: 'KA-01-EA-4821',
    driverName: 'Venkatesh Rao',
    collectorName: 'Prakash M',
    status: 'Scheduled',
    remarks: 'Scheduled afternoon pickup for community centers.'
  },
  {
    collectionId: 'COL-1015',
    collectionPoint: 'Malleshwaram 15th Cross Depot',
    area: 'West Zone',
    date: new Date('2026-09-29'),
    time: '03:30 PM',
    wasteType: 'Mixed / Other',
    quantity: 2.8,
    unit: 'tons',
    vehicleNumber: 'KA-04-TR-9110',
    driverName: 'Deepak Patil',
    collectorName: 'Channappa',
    status: 'Scheduled',
    remarks: 'Street sweepings scheduled transfer.'
  },
  {
    collectionId: 'COL-1016',
    collectionPoint: 'MG Road Metro Station North Entry',
    area: 'Central Zone',
    date: new Date('2026-09-28'),
    time: '01:00 PM',
    wasteType: 'Plastic',
    quantity: 1.2,
    unit: 'tons',
    vehicleNumber: 'KA-02-MP-6623',
    driverName: 'Mohan Das',
    collectorName: 'Karthik S',
    status: 'Cancelled',
    remarks: 'Route altered due to VIP convoy road closure.'
  }
];

const seedProcessing = [
  {
    processingId: 'PRC-1001',
    wasteSource: 'South Zone Commercial Collection',
    processingFacility: 'Mavallipura Central Bio-Composting Plant',
    wasteType: 'Organic',
    inputQuantity: 25.0,
    processedQuantity: 21.5,
    processingDate: new Date('2026-09-20'),
    processingMethod: 'Composting',
    outputType: 'Organic Compost / Fertilizer',
    efficiency: 86.0,
    status: 'Completed',
    remarks: 'Aerobic windrow composting process completed. High-grade nutrient soil conditioner yielded.'
  },
  {
    processingId: 'PRC-1002',
    wasteSource: 'East Zone Secondary Sorting Depot',
    processingFacility: 'Whitefield Material Recovery Facility (MRF)',
    wasteType: 'Plastic',
    inputQuantity: 14.0,
    processedQuantity: 12.6,
    processingDate: new Date('2026-09-21'),
    processingMethod: 'Material Recovery',
    outputType: 'Shredded HDPE / PET Flakes',
    efficiency: 90.0,
    status: 'Completed',
    remarks: 'Optical sorting and shredding line yielded high quality flaked polymers.'
  },
  {
    processingId: 'PRC-1003',
    wasteSource: 'Citywide Retail Paper Hauls',
    processingFacility: 'Peenya Eco Pulp & Fiber Mill',
    wasteType: 'Paper',
    inputQuantity: 10.5,
    processedQuantity: 9.2,
    processingDate: new Date('2026-09-22'),
    processingMethod: 'Recycling',
    outputType: 'Recycled Kraft Pulp Sheets',
    efficiency: 87.62,
    status: 'Completed',
    remarks: 'De-inking and de-pulping process run without interruptions.'
  },
  {
    processingId: 'PRC-1004',
    wasteSource: 'North Zone Transfer Station',
    processingFacility: 'Doddaballapur Waste to Energy Unit',
    wasteType: 'Mixed / Other',
    inputQuantity: 30.0,
    processedQuantity: 24.0,
    processingDate: new Date('2026-09-23'),
    processingMethod: 'Treatment',
    outputType: 'Refuse Derived Fuel (RDF) Pellets',
    efficiency: 80.0,
    status: 'Completed',
    remarks: 'Non-recyclable combustible fraction converted into RDF briquettes for cement kilns.'
  },
  {
    processingId: 'PRC-1005',
    wasteSource: 'Hospitality & Beverage Outlets',
    processingFacility: 'Hosur Road Glass Cullet Plant',
    wasteType: 'Glass',
    inputQuantity: 6.0,
    processedQuantity: 5.7,
    processingDate: new Date('2026-09-24'),
    processingMethod: 'Recycling',
    outputType: 'Crushed Glass Cullet (Color-Sorted)',
    efficiency: 95.0,
    status: 'Completed',
    remarks: 'Clean cullet ready for furnace remelt with minimal contamination.'
  },
  {
    processingId: 'PRC-1006',
    wasteSource: 'Industrial & Demolition Sites',
    processingFacility: 'Peenya Scrap Refining & Smelting Works',
    wasteType: 'Metal',
    inputQuantity: 8.5,
    processedQuantity: 8.1,
    processingDate: new Date('2026-09-25'),
    processingMethod: 'Material Recovery',
    outputType: 'Baled Aluminum & Ferrous Scrap',
    efficiency: 95.29,
    status: 'Completed',
    remarks: 'Magnetic separation and hydraulic baling completed.'
  },
  {
    processingId: 'PRC-1007',
    wasteSource: 'South Zone Wet Waste Stream',
    processingFacility: 'Koramangala Bio-Methanation Center',
    wasteType: 'Organic',
    inputQuantity: 18.0,
    processedQuantity: 15.3,
    processingDate: new Date('2026-09-26'),
    processingMethod: 'Composting',
    outputType: 'Compressed Bio-Gas (CBG) & Digested Slurry',
    efficiency: 85.0,
    status: 'Completed',
    remarks: 'Anaerobic digestion yielded 320 cubic meters of methane gas.'
  },
  {
    processingId: 'PRC-1008',
    wasteSource: 'Central Zone IT Corridor',
    processingFacility: 'Electronic City Authorized E-Waste Smelter',
    wasteType: 'E-Waste',
    inputQuantity: 3.5,
    processedQuantity: 2.9,
    processingDate: new Date('2026-09-27'),
    processingMethod: 'Material Recovery',
    outputType: 'Precious Metals & Disassembled Plastics',
    efficiency: 82.86,
    status: 'Completed',
    remarks: 'Manual disassembly followed by hydrometallurgical extraction.'
  },
  {
    processingId: 'PRC-1009',
    wasteSource: 'West Zone Residential Centers',
    processingFacility: 'Mavallipura Central Bio-Composting Plant',
    wasteType: 'Organic',
    inputQuantity: 22.0,
    processedQuantity: 17.0,
    processingDate: new Date('2026-09-28'),
    processingMethod: 'Composting',
    outputType: 'Enriched Humus Compost',
    efficiency: 77.27,
    status: 'Processing',
    remarks: 'Currently undergoing active thermophilic curing stage.'
  },
  {
    processingId: 'PRC-1010',
    wasteSource: 'East Zone Commercial Centers',
    processingFacility: 'Whitefield Material Recovery Facility (MRF)',
    wasteType: 'Plastic',
    inputQuantity: 12.5,
    processedQuantity: 8.0,
    processingDate: new Date('2026-09-29'),
    processingMethod: 'Recycling',
    outputType: 'Polymer Granules',
    efficiency: 64.0,
    status: 'Processing',
    remarks: 'Extrusion and pelletizing line active.'
  },
  {
    processingId: 'PRC-1011',
    wasteSource: 'Zone 4 Transfer Yard',
    processingFacility: 'Doddaballapur Waste to Energy Unit',
    wasteType: 'Mixed / Other',
    inputQuantity: 16.0,
    processedQuantity: 0.0,
    processingDate: new Date('2026-09-29'),
    processingMethod: 'Treatment',
    outputType: 'Inert Ash & Flue Slag',
    efficiency: 0,
    status: 'Pending',
    remarks: 'Batch inspected and queued for rotary incinerator.'
  }
];

const seedRecyclingPlants = [
  {
    plantId: 'RPL-1001',
    plantName: 'GreenTech Polymers Recycling Plant',
    location: 'Peenya Industrial Estate, Bengaluru',
    wasteType: 'Plastic',
    inputQuantity: 45.0,
    recycledQuantity: 39.5,
    processingDate: new Date('2026-09-28'),
    capacity: 60.0,
    utilization: 75.0,
    recyclingRate: 87.78,
    operationalStatus: 'Operational',
    remarks: 'Fully certified ISO 14001 plastics recycling facility with continuous extrusion.'
  },
  {
    plantId: 'RPL-1002',
    plantName: 'EcoVikas Paper & Board Reclaimers',
    location: 'Bommasandra Industrial Area, Bengaluru',
    wasteType: 'Paper',
    inputQuantity: 32.0,
    recycledQuantity: 28.8,
    processingDate: new Date('2026-09-28'),
    capacity: 40.0,
    utilization: 80.0,
    recyclingRate: 90.0,
    operationalStatus: 'Operational',
    remarks: 'Supplies corrugated packaging paper to regional FMCG distributors.'
  },
  {
    plantId: 'RPL-1003',
    plantName: 'Surya Smelters & Glass Recycling Works',
    location: 'Hosur Road Industrial Corridor, Anekal',
    wasteType: 'Glass',
    inputQuantity: 18.0,
    recycledQuantity: 16.9,
    processingDate: new Date('2026-09-27'),
    capacity: 25.0,
    utilization: 72.0,
    recyclingRate: 93.89,
    operationalStatus: 'Operational',
    remarks: 'Color sorting optics operating at 99% accuracy.'
  },
  {
    plantId: 'RPL-1004',
    plantName: 'Karnataka Metals Recovery Hub',
    location: 'Doddaballapur Integrated Industrial Park',
    wasteType: 'Metal',
    inputQuantity: 28.0,
    recycledQuantity: 26.5,
    processingDate: new Date('2026-09-29'),
    capacity: 35.0,
    utilization: 80.0,
    recyclingRate: 94.64,
    operationalStatus: 'Operational',
    remarks: 'Furnace temperature calibrated; recycling aluminum alloys and steel scrap.'
  },
  {
    plantId: 'RPL-1005',
    plantName: 'E-Clean Tech Circular Solutions',
    location: 'Electronic City Phase II, Bengaluru',
    wasteType: 'E-Waste',
    inputQuantity: 8.0,
    recycledQuantity: 6.8,
    processingDate: new Date('2026-09-26'),
    capacity: 15.0,
    utilization: 53.33,
    recyclingRate: 85.0,
    operationalStatus: 'Operational',
    remarks: 'Authorized Central Pollution Control Board (CPCB) dismantler.'
  },
  {
    plantId: 'RPL-1006',
    plantName: 'Swachh Multi-Waste Processing Plant',
    location: 'Nelamangala Highway Zone',
    wasteType: 'Organic / Multi',
    inputQuantity: 15.0,
    recycledQuantity: 11.2,
    processingDate: new Date('2026-09-25'),
    capacity: 50.0,
    utilization: 30.0,
    recyclingRate: 74.67,
    operationalStatus: 'Maintenance',
    remarks: 'Undergoing routine centrifuge and conveyor lubrication overhaul.'
  }
];

const seedLandfills = [
  {
    landfillId: 'LNF-1001',
    landfillName: 'Mittaganahalli Municipal Sanitary Landfill',
    location: 'Mittaganahalli, North East Bengaluru',
    capacity: 250000,
    usedCapacity: 215000,
    remainingCapacity: 35000,
    wasteReceived: 380,
    wasteType: 'Inert / Construction Residue',
    date: new Date('2026-09-28'),
    utilizationPercentage: 86.0,
    warningLevel: 'High',
    operationalStatus: 'Operational',
    remarks: 'Cell 4 receiving capped daily quotas. Leachate collection and gas flaring active.'
  },
  {
    landfillId: 'LNF-1002',
    landfillName: 'Bellahalli Quarry Pit Landfill',
    location: 'Bellahalli, Yelahanka Zone',
    capacity: 180000,
    usedCapacity: 168000,
    remainingCapacity: 12000,
    wasteReceived: 210,
    wasteType: 'Non-Biodegradable Inerts',
    date: new Date('2026-09-28'),
    utilizationPercentage: 93.33,
    warningLevel: 'Critical',
    operationalStatus: 'Operational',
    remarks: 'CRITICAL ALERT: Site nearing maximum engineered life. Divert trucks to Kanakapura.'
  },
  {
    landfillId: 'LNF-1003',
    landfillName: 'Mandur Remediation & Sanitary Repository',
    location: 'Mandur Village, East Bengaluru',
    capacity: 320000,
    usedCapacity: 230000,
    remainingCapacity: 90000,
    wasteReceived: 140,
    wasteType: 'Biomined Reject Residue',
    date: new Date('2026-09-27'),
    utilizationPercentage: 71.88,
    warningLevel: 'Moderate',
    operationalStatus: 'Operational',
    remarks: 'Moderate volume inflow. Bio-mining operations recovering 40% landfill soil.'
  },
  {
    landfillId: 'LNF-1004',
    landfillName: 'Kanakapura Regional Eco-Engineered Landfill',
    location: 'Harohalli, Kanakapura Road',
    capacity: 500000,
    usedCapacity: 195000,
    remainingCapacity: 305000,
    wasteReceived: 410,
    wasteType: 'Stabilized Ash & Non-Recyclables',
    date: new Date('2026-09-29'),
    utilizationPercentage: 39.0,
    warningLevel: 'Normal',
    operationalStatus: 'Operational',
    remarks: 'State-of-the-art double composite geomembrane liner installed. Well within safe capacity.'
  },
  {
    landfillId: 'LNF-1005',
    landfillName: 'Bingipura Engineered Disposal Ground',
    location: 'Bingipura, South Bengaluru',
    capacity: 150000,
    usedCapacity: 142000,
    remainingCapacity: 8000,
    wasteReceived: 0,
    wasteType: 'Historical Capped Solid Waste',
    date: new Date('2026-09-26'),
    utilizationPercentage: 94.67,
    warningLevel: 'Critical',
    operationalStatus: 'Maintenance',
    remarks: 'Closed for fresh unsegregated dumping. Permanent capping and solar farm project underway.'
  },
  {
    landfillId: 'LNF-1006',
    landfillName: 'Nelamangala West Sub-Regional Landfill',
    location: 'Nelamangala Bypass Sector',
    capacity: 220000,
    usedCapacity: 110000,
    remainingCapacity: 110000,
    wasteReceived: 185,
    wasteType: 'Treated Municipal Waste Ash',
    date: new Date('2026-09-29'),
    utilizationPercentage: 50.0,
    warningLevel: 'Normal',
    operationalStatus: 'Operational',
    remarks: 'Operating smoothly with strict weighbridge logging.'
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing collections
    await User.deleteMany({});
    await WasteSegregation.deleteMany({});
    await WasteCollection.deleteMany({});
    await WasteProcessing.deleteMany({});
    await RecyclingPlant.deleteMany({});
    await Landfill.deleteMany({});

    console.log(' Cleared previous database records.');

    // Seed users
    const createdUsers = [];
    for (const u of seedUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    const adminUser = createdUsers.find(u => u.role === 'ADMIN');
    const staffUser = createdUsers.find(u => u.role === 'MUNICIPAL STAFF');

    // Attach createdBy references
    const segregationWithUsers = seedSegregation.map((item, index) => ({
      ...item,
      createdBy: index % 2 === 0 ? adminUser._id : staffUser._id
    }));
    await WasteSegregation.insertMany(segregationWithUsers);

    const collectionsWithUsers = seedCollections.map((item, index) => ({
      ...item,
      createdBy: index % 2 === 0 ? adminUser._id : staffUser._id
    }));
    await WasteCollection.insertMany(collectionsWithUsers);

    const processingWithUsers = seedProcessing.map((item, index) => ({
      ...item,
      createdBy: index % 2 === 0 ? adminUser._id : staffUser._id
    }));
    await WasteProcessing.insertMany(processingWithUsers);

    const plantsWithUsers = seedRecyclingPlants.map((item, index) => ({
      ...item,
      createdBy: index % 2 === 0 ? adminUser._id : staffUser._id
    }));
    await RecyclingPlant.insertMany(plantsWithUsers);

    const landfillsWithUsers = seedLandfills.map((item, index) => ({
      ...item,
      createdBy: index % 2 === 0 ? adminUser._id : staffUser._id
    }));
    await Landfill.insertMany(landfillsWithUsers);

    console.log(' Database populated with realistic municipal demo records:');
    console.log(`   - Users: ${createdUsers.length} (Admin: admin@municipal.com, Staff: staff@municipal.com)`);
    console.log(`   - Segregation Records: ${seedSegregation.length}`);
    console.log(`   - Collection Records: ${seedCollections.length}`);
    console.log(`   - Processing Records: ${seedProcessing.length}`);
    console.log(`   - Recycling Plants: ${seedRecyclingPlants.length}`);
    console.log(`   - Landfill Sites: ${seedLandfills.length}`);

    return true;
  } catch (error) {
    console.error(' Error seeding database:', error);
    throw error;
  }
};

module.exports = {
  seedDatabase,
  seedUsers,
  seedSegregation,
  seedCollections,
  seedProcessing,
  seedRecyclingPlants,
  seedLandfills
};
