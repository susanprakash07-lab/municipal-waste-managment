import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { reportsService } from '../services/api';
import {
  FileBarChart,
  Printer,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  Layers,
  Truck,
  Cpu,
  Recycle,
  MountainSnow,
  RefreshCw
} from 'lucide-react';

const REPORT_TABS = [
  { id: 'daily', label: 'Daily Flow Report' },
  { id: 'monthly', label: 'Monthly Summary' },
  { id: 'wasteType', label: 'Waste Characterization' },
  { id: 'recycling', label: 'Recycling Plants' },
  { id: 'landfill', label: 'Landfill Capacity' },
  { id: 'collectionPerformance', label: 'Fleet Performance' }
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params = {
        reportType: activeTab,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };
      const res = await reportsService.getReports(params);
      if (res.data?.success) {
        setReportData(res.data.data);
      }
    } catch (err) {
      console.error('Report error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeTab]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportData) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    const filename = `Municipal_${activeTab}_report_${new Date().toISOString().split('T')[0]}.csv`;

    if (activeTab === 'daily' && reportData.details) {
      csvContent += 'Date,Collection Point,Area,Waste Type,Quantity (tons),Vehicle,Driver,Status\n';
      reportData.details.forEach((r) => {
        csvContent += `"${r.date}","${r.collectionPoint}","${r.area}","${r.wasteType}",${r.quantity},"${r.vehicleNumber}","${r.driverName}","${r.status}"\n`;
      });
    } else if (activeTab === 'monthly' && reportData.records) {
      csvContent += 'Month,Total Quantity (tons),Trips,Avg Per Trip (tons)\n';
      reportData.records.forEach((r) => {
        csvContent += `"${r.month}",${r.quantity},${r.trips},${r.averagePerTrip}\n`;
      });
    } else if (activeTab === 'wasteType' && reportData.records) {
      csvContent += 'Waste Type,Total Quantity (tons),Percentage (%),Batches\n';
      reportData.records.forEach((r) => {
        csvContent += `"${r.wasteType}",${r.quantity},${r.percentage},${r.batches}\n`;
      });
    } else if (activeTab === 'recycling' && reportData.records) {
      csvContent += 'Plant ID,Plant Name,Location,Stream,Capacity (t/d),Input,Recycled,Rate,Utilization,Status\n';
      reportData.records.forEach((r) => {
        csvContent += `"${r.plantId}","${r.plantName}","${r.location}","${r.wasteType}",${r.capacity},${r.inputQuantity},${r.recycledQuantity},"${r.recyclingRate}","${r.utilization}","${r.status}"\n`;
      });
    } else if (activeTab === 'landfill' && reportData.records) {
      csvContent += 'Site ID,Site Name,Location,Capacity (tons),Used,Remaining,Utilization,Alert Level,Status\n';
      reportData.records.forEach((r) => {
        csvContent += `"${r.landfillId}","${r.landfillName}","${r.location}",${r.capacity},${r.usedCapacity},${r.remainingCapacity},"${r.utilization}","${r.warningLevel}","${r.status}"\n`;
      });
    } else if (activeTab === 'collectionPerformance' && reportData.breakdown) {
      csvContent += 'Status,Trips,Quantity (tons),Percentage (%)\n';
      reportData.breakdown.forEach((r) => {
        csvContent += `"${r.status}",${r.count},${r.quantity},${r.percentage}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout pageTitle="Reports & Analytics">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Official Municipal Waste Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit-ready summaries, characterization percentages, recovery rates, and fleet KPIs
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs & Date Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-6 no-print">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
            {REPORT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Date Range Picker */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={fetchReport}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Report Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 print:p-0 print:border-none">
        {/* Printable Official Header */}
        <div className="border-b border-slate-200 pb-5 mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Official Municipal Audit Document
              </span>
              <span className="text-xs text-slate-400">
                Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {reportData?.title || 'Municipal Operations Report'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Solid Waste Management Directorate &bull; Urban Operations Cell
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16">
            <LoadingSpinner message="Calculating database report aggregation..." />
          </div>
        ) : !reportData ? (
          <p className="text-sm text-slate-500 text-center py-12">No data returned for this report.</p>
        ) : (
          <div className="space-y-6">
            {/* 1. Daily Flow Summary */}
            {activeTab === 'daily' && reportData.summary && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold block uppercase">Total Collected</span>
                    <span className="text-2xl font-extrabold text-slate-900">{reportData.summary.totalCollected}</span>
                    <span className="text-xs text-slate-500 ml-1">tons</span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-xs text-emerald-800 font-semibold block uppercase">Total Segregated</span>
                    <span className="text-2xl font-extrabold text-emerald-700">{reportData.summary.totalSegregated}</span>
                    <span className="text-xs text-emerald-600 ml-1">tons</span>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-xs text-blue-800 font-semibold block uppercase">Total Processed</span>
                    <span className="text-2xl font-extrabold text-blue-700">{reportData.summary.totalProcessed}</span>
                    <span className="text-xs text-blue-600 ml-1">tons</span>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                    <span className="text-xs text-teal-800 font-semibold block uppercase">Total Recycled</span>
                    <span className="text-2xl font-extrabold text-teal-700">{reportData.summary.totalRecycled}</span>
                    <span className="text-xs text-teal-600 ml-1">tons</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-800 mb-3">Manifest Log Details</h4>
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5">Collection Point</th>
                        <th className="px-4 py-2.5">Area</th>
                        <th className="px-4 py-2.5">Waste Type</th>
                        <th className="px-4 py-2.5">Tonnage</th>
                        <th className="px-4 py-2.5">Vehicle</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(reportData.details || []).map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5">{r.date}</td>
                          <td className="px-4 py-2.5 font-medium text-slate-800">{r.collectionPoint}</td>
                          <td className="px-4 py-2.5">{r.area}</td>
                          <td className="px-4 py-2.5">{r.wasteType}</td>
                          <td className="px-4 py-2.5 font-bold text-slate-900">{r.quantity} tons</td>
                          <td className="px-4 py-2.5 font-mono">{r.vehicleNumber}</td>
                          <td className="px-4 py-2.5"><StatusBadge status={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. Monthly Summary */}
            {activeTab === 'monthly' && reportData.records && (
              <div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Overall Recorded Tonnage</span>
                    <p className="text-2xl font-extrabold text-slate-900">
                      {reportData.summary?.overallTonnage?.toLocaleString()} tons
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Active Months</span>
                    <p className="text-2xl font-extrabold text-emerald-600">
                      {reportData.summary?.monthsRecorded}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2.5">Month</th>
                        <th className="px-4 py-2.5">Total Quantity</th>
                        <th className="px-4 py-2.5">Completed Trips</th>
                        <th className="px-4 py-2.5">Average Load Per Trip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reportData.records.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 font-bold text-slate-800">{r.month}</td>
                          <td className="px-4 py-2.5 font-bold text-emerald-700">{r.quantity} tons</td>
                          <td className="px-4 py-2.5">{r.trips} trips</td>
                          <td className="px-4 py-2.5">{r.averagePerTrip} tons/trip</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Waste Characterization */}
            {activeTab === 'wasteType' && reportData.records && (
              <div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Total Characterized Volume</span>
                  <p className="text-2xl font-extrabold text-slate-900">{reportData.totalOverall?.toLocaleString()} tons</p>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2.5">Waste Stream</th>
                        <th className="px-4 py-2.5">Total Tonnage</th>
                        <th className="px-4 py-2.5">Percentage Share</th>
                        <th className="px-4 py-2.5">Batch Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reportData.records.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 font-bold text-slate-800">{r.wasteType}</td>
                          <td className="px-4 py-2.5 font-semibold text-slate-900">{r.quantity} tons</td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${r.percentage}%` }} />
                              </div>
                              <span className="font-bold text-slate-800">{r.percentage}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">{r.batches} batches</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Recycling Plants Report */}
            {activeTab === 'recycling' && reportData.records && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold uppercase block">Active Plants</span>
                    <span className="text-2xl font-extrabold text-slate-900">{reportData.summary?.totalPlants}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold uppercase block">Total Capacity</span>
                    <span className="text-2xl font-extrabold text-slate-900">{reportData.summary?.totalCapacity} t/d</span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-xs text-emerald-800 font-semibold uppercase block">Recycled Output</span>
                    <span className="text-2xl font-extrabold text-emerald-700">{reportData.summary?.totalRecycled} t</span>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                    <span className="text-xs text-teal-800 font-semibold uppercase block">Avg Recovery Rate</span>
                    <span className="text-2xl font-extrabold text-teal-700">{reportData.summary?.averageRecyclingRate}%</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2.5">Plant ID</th>
                        <th className="px-4 py-2.5">Facility Name</th>
                        <th className="px-4 py-2.5">Location</th>
                        <th className="px-4 py-2.5">Stream</th>
                        <th className="px-4 py-2.5">Yield / Feedstock</th>
                        <th className="px-4 py-2.5">Recycling Rate</th>
                        <th className="px-4 py-2.5">Utilization</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reportData.records.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 font-mono">{r.plantId}</td>
                          <td className="px-4 py-2.5 font-bold text-slate-800">{r.plantName}</td>
                          <td className="px-4 py-2.5">{r.location}</td>
                          <td className="px-4 py-2.5">{r.wasteType}</td>
                          <td className="px-4 py-2.5 font-semibold">{r.recycledQuantity} / {r.inputQuantity} t</td>
                          <td className="px-4 py-2.5 font-bold text-emerald-700">{r.recyclingRate}</td>
                          <td className="px-4 py-2.5">{r.utilization}</td>
                          <td className="px-4 py-2.5"><StatusBadge status={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. Landfill Report */}
            {activeTab === 'landfill' && reportData.records && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold uppercase block">Total Sites</span>
                    <span className="text-2xl font-extrabold text-slate-900">{reportData.summary?.totalSites}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold uppercase block">Engineered Capacity</span>
                    <span className="text-2xl font-extrabold text-slate-900">{reportData.summary?.totalCapacity?.toLocaleString()} t</span>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="text-xs text-amber-800 font-semibold uppercase block">Used Airspace</span>
                    <span className="text-2xl font-extrabold text-amber-700">{reportData.summary?.totalUsed?.toLocaleString()} t</span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-xs text-emerald-800 font-semibold uppercase block">Remaining Safe Airspace</span>
                    <span className="text-2xl font-extrabold text-emerald-700">{reportData.summary?.totalRemaining?.toLocaleString()} t</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2.5">Site ID</th>
                        <th className="px-4 py-2.5">Landfill Name</th>
                        <th className="px-4 py-2.5">Total Capacity</th>
                        <th className="px-4 py-2.5">Used Airspace</th>
                        <th className="px-4 py-2.5">Remaining</th>
                        <th className="px-4 py-2.5">Utilization</th>
                        <th className="px-4 py-2.5">Threshold Alert</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reportData.records.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 font-mono">{r.landfillId}</td>
                          <td className="px-4 py-2.5 font-bold text-slate-800">{r.landfillName}</td>
                          <td className="px-4 py-2.5">{r.capacity?.toLocaleString()} t</td>
                          <td className="px-4 py-2.5 font-semibold text-slate-800">{r.usedCapacity?.toLocaleString()} t</td>
                          <td className="px-4 py-2.5 font-semibold text-emerald-700">{r.remainingCapacity?.toLocaleString()} t</td>
                          <td className="px-4 py-2.5 font-bold">{r.utilization}</td>
                          <td className="px-4 py-2.5"><StatusBadge status={r.warningLevel} /></td>
                          <td className="px-4 py-2.5"><StatusBadge status={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. Fleet & Collection Performance */}
            {activeTab === 'collectionPerformance' && reportData.breakdown && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold uppercase block">Total Scheduled Trips</span>
                    <span className="text-2xl font-extrabold text-slate-900">{reportData.summary?.totalTrips}</span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-xs text-emerald-800 font-semibold uppercase block">Successfully Completed</span>
                    <span className="text-2xl font-extrabold text-emerald-700">{reportData.summary?.completedTrips}</span>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-xs text-blue-800 font-semibold uppercase block">Pending / In Transit</span>
                    <span className="text-2xl font-extrabold text-blue-700">{reportData.summary?.pendingTrips}</span>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                    <span className="text-xs text-teal-800 font-semibold uppercase block">Fleet Completion Rate</span>
                    <span className="text-2xl font-extrabold text-teal-700">{reportData.summary?.completionRate}%</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2.5">Trip Status</th>
                        <th className="px-4 py-2.5">Trips Count</th>
                        <th className="px-4 py-2.5">Total Quantity Hauled</th>
                        <th className="px-4 py-2.5">Fleet Share (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reportData.breakdown.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 font-semibold text-slate-800">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className="px-4 py-2.5 font-bold text-slate-900">{r.count} trips</td>
                          <td className="px-4 py-2.5 font-bold text-emerald-700">{r.quantity} tons</td>
                          <td className="px-4 py-2.5">{r.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
