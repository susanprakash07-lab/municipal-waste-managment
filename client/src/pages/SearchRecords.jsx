import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { searchService } from '../services/api';
import {
  Search,
  Filter,
  ArrowRight,
  Calendar,
  Layers,
  Truck,
  Cpu,
  Recycle,
  MountainSnow,
  Eye,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Segregation', 'Collection', 'Processing', 'Recycling', 'Landfill'];
const STATUSES = ['All', 'Completed', 'In Progress', 'Scheduled', 'Pending', 'Operational', 'Maintenance', 'Cancelled'];

const SearchRecords = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const performSearch = async () => {
    try {
      setLoading(true);
      const params = {
        q: query,
        category: category !== 'All' ? category : undefined,
        status: status !== 'All' ? status : undefined
      };
      const res = await searchService.search(params);
      if (res.data?.success) {
        setResults(res.data.data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
  }, [category, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleViewDetails = (item) => {
    setSelectedResult(item);
    setDetailModalOpen(true);
  };

  const getModuleIcon = (mod) => {
    switch (mod) {
      case 'Waste Segregation':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'Waste Collection':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'Waste Processing':
        return <Cpu className="w-4 h-4 text-purple-600" />;
      case 'Recycling Plant':
        return <Recycle className="w-4 h-4 text-teal-600" />;
      case 'Landfill Management':
        return <MountainSnow className="w-4 h-4 text-amber-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <Layout pageTitle="Unified Search Records">
      {/* Header Info */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Global Cross-Module Search & Retrieval
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Unified query engine across segregation, vehicle hauls, processing batches, recycling plants, and landfill sites
        </p>
      </div>

      {/* Main Search Bar & Filter Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm mb-6">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ID (SEG/COL/PRC/RPL/LNF), location, vehicle license, crew, or material..."
                className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Records</span>
            </button>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Module:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  category === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st === 'All' ? 'All Statuses' : st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800">
              Query Results
            </h3>
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              {results.length} found
            </span>
          </div>
          {query && (
            <span className="text-xs text-slate-500">
              Filtered by: "<strong className="text-slate-800">{query}</strong>"
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-16">
            <LoadingSpinner message="Searching indexed municipal records..." />
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            title="No Matching Records Found"
            message="No records matched your search query. Try searching with different keywords or clear the category filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Module / Stage</th>
                  <th className="px-6 py-3.5">Record ID</th>
                  <th className="px-6 py-3.5">Entity / Title</th>
                  <th className="px-6 py-3.5">Location / Point</th>
                  <th className="px-6 py-3.5">Waste Stream & Volume</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((item) => (
                  <tr key={`${item.module}-${item.id}`} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getModuleIcon(item.module)}
                        <span className="text-xs font-semibold text-slate-800">{item.module}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-slate-900">
                      {item.code}
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-medium">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">{item.quantity}</span>
                      {item.wasteType && (
                        <span className="block text-[11px] text-slate-400">{item.wasteType}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {selectedResult && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`${selectedResult.module} - ${selectedResult.code}`}
          subtitle="Record attributes and operational parameters"
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Category / Stage</span>
                <span className="font-bold text-slate-800">{selectedResult.module}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Record Code</span>
                <span className="font-mono font-bold text-slate-900">{selectedResult.code}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Title / Entity</span>
                <span className="font-semibold text-slate-800">{selectedResult.title}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Location</span>
                <span className="font-semibold text-slate-800">{selectedResult.location}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Tonnage / Quantity</span>
                <span className="font-bold text-emerald-700 text-base">{selectedResult.quantity}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Status</span>
                <StatusBadge status={selectedResult.status} />
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-xs text-slate-400 block font-semibold uppercase mb-1">Additional Telemetry</span>
              <p className="text-xs text-slate-700 leading-relaxed font-mono">{selectedResult.extraInfo}</p>
              {selectedResult.primaryPerson && (
                <p className="text-xs text-slate-500 mt-1">{selectedResult.primaryPerson}</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Logged Date: {new Date(selectedResult.date).toLocaleDateString()}
              </span>
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  navigate(selectedResult.route);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <span>Go to Module Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default SearchRecords;
