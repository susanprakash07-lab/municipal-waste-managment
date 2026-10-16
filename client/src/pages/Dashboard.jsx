import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DashboardCard from '../components/DashboardCard';
import ChartCard from '../components/ChartCard';
import StatusBadge from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { dashboardService } from '../services/api';
import {
  Truck,
  Layers,
  Cpu,
  Recycle,
  MountainSnow,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardService.getStats();
      if (res.data?.success) {
        setData(res.data);
      } else {
        setError(res.data?.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError('Unable to connect to backend server. Make sure MongoDB and Node server are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout pageTitle="Municipal Dashboard">
        <div className="py-20">
          <LoadingSpinner message="Calculating real-time municipal statistics from database..." size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout pageTitle="Municipal Dashboard">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center my-8">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-rose-800 mb-1">Dashboard Loading Error</h3>
          <p className="text-sm text-rose-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </Layout>
    );
  }

  const { summary, charts, recentActivities, alerts } = data;

  return (
    <Layout pageTitle="Municipal Dashboard">
      {/* Top Welcome & Refresh bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Central Waste Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time telemetry, stage progression, and municipal fleet utilization
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Critical / Operational Alerts Banner */}
      {alerts && alerts.length > 0 && (
        <div className="mb-6 space-y-2.5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                alert.type === 'critical'
                  ? 'bg-rose-50/90 border-rose-200 text-rose-800'
                  : alert.type === 'warning'
                  ? 'bg-amber-50/90 border-amber-200 text-amber-800'
                  : 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
              }`}
            >
              {alert.type === 'critical' ? (
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
              ) : alert.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold leading-tight">{alert.title}</h4>
                <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 8 Primary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        <DashboardCard
          title="Total Waste Collected"
          value={summary?.totalCollected}
          unit="tons"
          icon={Truck}
          color="emerald"
          subtitle="All active municipal zones"
          trend="+12% this week"
        />
        <DashboardCard
          title="Total Processed"
          value={summary?.totalProcessed}
          unit="tons"
          icon={Cpu}
          color="blue"
          subtitle="Composting, MRF & Energy"
        />
        <DashboardCard
          title="Total Recycled"
          value={summary?.totalRecycled}
          unit="tons"
          icon={Recycle}
          color="teal"
          subtitle="Recovered high-value raw material"
        />
        <DashboardCard
          title="Landfill Inflow"
          value={summary?.totalLandfilled}
          unit="tons"
          icon={MountainSnow}
          color="amber"
          subtitle="Inert residue deposited"
        />
        <DashboardCard
          title="Pending Collections"
          value={summary?.pendingCollections}
          unit="trips"
          icon={Clock}
          color="rose"
          subtitle="Scheduled / in progress routes"
        />
        <DashboardCard
          title="Collection Points"
          value={summary?.collectionPointsCount}
          unit="points"
          icon={MapPin}
          color="indigo"
          subtitle="Primary transfer stations"
        />
        <DashboardCard
          title="Recycling Plants"
          value={summary?.totalRecyclingPlants}
          unit="facilities"
          icon={Recycle}
          color="teal"
          subtitle="Plastics, Paper, Glass, Metals"
        />
        <DashboardCard
          title="Landfill Sites"
          value={summary?.totalLandfills}
          unit="sites"
          icon={MountainSnow}
          color="amber"
          subtitle="Sanitary repositories monitored"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 1. Waste Type Distribution */}
        <ChartCard
          title="Waste Type Distribution"
          subtitle="Tonnage breakdown across collected and segregated waste categories"
          badge="By Category"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts?.wasteTypeDistribution || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value) => [`${value} tons`, 'Quantity']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {(charts?.wasteTypeDistribution || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 2. Waste Processing Flow Overview */}
        <ChartCard
          title="Waste Processing Lifecycle"
          subtitle="End-to-end municipal volume progression through treatment stages"
          badge="Stage Flow"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts?.processingOverview || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value) => [`${value} tons`, 'Volume']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <Bar dataKey="quantity" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 3. Monthly Waste Collection Trends */}
        <ChartCard
          title="Monthly Waste Collection Trend"
          subtitle="Monthly fleet collection volume over current municipal fiscal year"
          badge="Trend"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={charts?.monthlyCollection || []}
                margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value) => [`${value} tons`, 'Collected']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="quantity"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 4. Recycling vs Landfill Ratio */}
        <ChartCard
          title="Resource Recovery vs Landfill Disposal"
          subtitle="Proportion of captured waste diverted to recycling versus final landfilling"
          badge="Diversion Ratio"
        >
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.recyclingVsLandfill || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {(charts?.recyclingVsLandfill || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} tons`, 'Volume']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Recent Operational Activities Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Recent Operational Activities</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live updates recorded across Segregation, Collection, and Treatment plants
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
            Latest 8 records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Stage / Type</th>
                <th className="px-6 py-3.5">Record ID</th>
                <th className="px-6 py-3.5">Activity Description</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Time Recorded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(recentActivities || []).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        item.type === 'Collection'
                          ? 'bg-blue-50 text-blue-700'
                          : item.type === 'Segregation'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-semibold text-slate-800">
                    {item.code}
                  </td>
                  <td className="px-6 py-4 text-slate-700 max-w-md truncate">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-slate-400">
                    {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
