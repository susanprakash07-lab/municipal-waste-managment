import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import StatusBadge from '../components/StatusBadge';
import { FormInput, SelectInput, TextareaInput } from '../components/FormControls';
import { landfillService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MountainSnow, AlertTriangle, ShieldAlert, CheckCircle, BarChart3 } from 'lucide-react';

const STATUSES = ['Operational', 'Maintenance', 'Temporarily Closed'];
const WARNINGS = ['All', 'Normal', 'Moderate', 'High', 'Critical'];

const initialFormData = {
  landfillName: '',
  location: '',
  capacity: '',
  usedCapacity: '',
  wasteReceived: '',
  wasteType: 'Inert / Non-recyclable',
  date: new Date().toISOString().split('T')[0],
  operationalStatus: 'Operational',
  remarks: ''
};

const LandfillManagement = () => {
  const { user, isAdmin } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterWarning, setFilterWarning] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Alert toast
  const [alert, setAlert] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search,
        warningLevel: filterWarning !== 'All' ? filterWarning : undefined,
        operationalStatus: filterStatus !== 'All' ? filterStatus : undefined
      };
      const res = await landfillService.getAll(params);
      if (res.data?.success) {
        setRecords(res.data.data);
        setTotalRecords(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showAlert('Failed to load landfill records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [currentPage, search, filterWarning, filterStatus]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormData(initialFormData);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      landfillName: record.landfillName || '',
      location: record.location || '',
      capacity: record.capacity || '',
      usedCapacity: record.usedCapacity || '',
      wasteReceived: record.wasteReceived || '',
      wasteType: record.wasteType || 'Inert / Non-recyclable',
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
      operationalStatus: record.operationalStatus || 'Operational',
      remarks: record.remarks || ''
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenView = (record) => {
    setSelectedRecord(record);
    setViewModalOpen(true);
  };

  const handleOpenDelete = (record) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.landfillName.trim()) errors.landfillName = 'Landfill site name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';

    const cap = Number(formData.capacity);
    const used = Number(formData.usedCapacity);
    const received = Number(formData.wasteReceived);

    if (!formData.capacity || cap <= 0) errors.capacity = 'Total capacity must be greater than 0';
    if (formData.usedCapacity === '' || used < 0) errors.usedCapacity = 'Used capacity cannot be negative';
    if (used > cap) errors.usedCapacity = 'Used capacity cannot exceed total engineered capacity';
    if (formData.wasteReceived !== '' && received < 0) errors.wasteReceived = 'Waste received cannot be negative';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setFormSubmitting(true);
      if (editingRecord) {
        await landfillService.update(editingRecord._id, formData);
        showAlert('Landfill site updated successfully!');
      } else {
        await landfillService.create(formData);
        showAlert('New sanitary landfill site registered!');
      }
      setModalOpen(false);
      fetchRecords();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving landfill record';
      showAlert(msg, 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;
    try {
      setDeleting(true);
      await landfillService.delete(recordToDelete._id);
      showAlert('Landfill site deleted successfully!');
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
      fetchRecords();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error deleting landfill record';
      showAlert(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Dynamic preview in modal
  const liveCap = Number(formData.capacity) || 0;
  const liveUsed = Number(formData.usedCapacity) || 0;
  const liveRemaining = Math.max(0, liveCap - liveUsed);
  const liveUtilization = liveCap > 0 ? Number(((liveUsed / liveCap) * 100).toFixed(1)) : 0;
  const liveWarning =
    liveUtilization < 60 ? 'Normal' : liveUtilization < 80 ? 'Moderate' : liveUtilization < 90 ? 'High' : 'Critical';

  const columns = [
    {
      header: 'Landfill ID',
      accessor: 'landfillId',
      className: 'font-mono font-semibold text-xs text-slate-900',
      render: (r) => r.landfillId || '-'
    },
    {
      header: 'Site Name & Location',
      accessor: 'landfillName',
      render: (r) => (
        <div>
          <p className="font-semibold text-slate-800 leading-tight">{r.landfillName}</p>
          <span className="text-xs text-slate-400">{r.location}</span>
        </div>
      )
    },
    {
      header: 'Total Capacity',
      accessor: 'capacity',
      render: (r) => (
        <span className="font-semibold text-slate-900">{r.capacity?.toLocaleString()} tons</span>
      )
    },
    {
      header: 'Used / Remaining',
      accessor: 'usedCapacity',
      render: (r) => (
        <div>
          <span className="font-medium text-slate-800">{r.usedCapacity?.toLocaleString()} tons</span>
          <p className="text-xs text-slate-400">Left: {r.remainingCapacity?.toLocaleString()} tons</p>
        </div>
      )
    },
    {
      header: 'Utilization',
      accessor: 'utilizationPercentage',
      render: (r) => (
        <div className="w-36">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-slate-800">{r.utilizationPercentage}%</span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                r.warningLevel === 'Critical'
                  ? 'bg-rose-100 text-rose-700'
                  : r.warningLevel === 'High'
                  ? 'bg-orange-100 text-orange-700'
                  : r.warningLevel === 'Moderate'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {r.warningLevel}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                r.utilizationPercentage >= 90
                  ? 'bg-rose-600'
                  : r.utilizationPercentage >= 80
                  ? 'bg-orange-500'
                  : r.utilizationPercentage >= 60
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, r.utilizationPercentage || 0)}%` }}
            />
          </div>
        </div>
      )
    },
    {
      header: 'Daily Inflow',
      accessor: 'wasteReceived',
      render: (r) => (
        <span className="text-xs font-semibold text-slate-700">
          +{r.wasteReceived?.toLocaleString() || 0} tons/day
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'operationalStatus',
      render: (r) => <StatusBadge status={r.operationalStatus} />
    }
  ];

  return (
    <Layout pageTitle="Landfill Management">
      {/* Toast Alert */}
      {alert && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-lg border text-sm font-medium animate-in slide-in-from-top-2 duration-200 ${
            alert.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Sanitary Landfill Capacity & Utilization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time engineered airspace monitoring, weighbridge records, and threshold warning alerts
          </p>
        </div>
      </div>

      {/* Warning Level Quick Banner Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <div>
            <p className="text-xs font-bold text-emerald-900">&lt; 60%: Normal</p>
            <p className="text-[10px] text-emerald-700">Safe engineered airspace</p>
          </div>
        </div>
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div>
            <p className="text-xs font-bold text-amber-900">60% – 80%: Moderate</p>
            <p className="text-[10px] text-amber-700">Monitor daily tonnage</p>
          </div>
        </div>
        <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <div>
            <p className="text-xs font-bold text-orange-900">80% – 90%: High Warning</p>
            <p className="text-[10px] text-orange-700">Prepare diversion plan</p>
          </div>
        </div>
        <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
          <div>
            <p className="text-xs font-bold text-rose-900">&gt; 90%: Critical Alert</p>
            <p className="text-[10px] text-rose-700">Imminent site closure</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={records}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search landfill site, location, notes..."
        filterOptions={[
          {
            value: filterWarning,
            onChange: setFilterWarning,
            options: [{ value: 'All', label: 'All Warnings' }, 'Normal', 'Moderate', 'High', 'Critical']
          },
          {
            value: filterStatus,
            onChange: setFilterStatus,
            options: [{ value: 'All', label: 'All Statuses' }, ...STATUSES]
          }
        ]}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={setCurrentPage}
        onAddNew={handleOpenAdd}
        addNewLabel="Register Landfill Site"
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        canDelete={isAdmin}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRecord ? `Edit Landfill ${editingRecord.landfillId}` : 'Register New Landfill Repository'}
        subtitle="Specify total engineered airspace capacity, current used volume, and daily inflow"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Landfill Site Name"
              name="landfillName"
              value={formData.landfillName}
              onChange={(e) => setFormData({ ...formData, landfillName: e.target.value })}
              placeholder="e.g. Mittaganahalli Municipal Sanitary Landfill"
              required
              error={formErrors.landfillName}
            />
            <FormInput
              label="Location / GPS Sector"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Mittaganahalli, North East Bengaluru"
              required
              error={formErrors.location}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Total Engineered Capacity (tons)"
              name="capacity"
              type="number"
              step="100"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="e.g. 250000"
              required
              error={formErrors.capacity}
            />
            <FormInput
              label="Current Cumulative Used (tons)"
              name="usedCapacity"
              type="number"
              step="100"
              min="0"
              value={formData.usedCapacity}
              onChange={(e) => setFormData({ ...formData, usedCapacity: e.target.value })}
              placeholder="e.g. 215000"
              required
              error={formErrors.usedCapacity}
            />
          </div>

          {/* Dynamic Landfill Airspace & Warning Level Indicator */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Calculated Utilization:</span>
              <span className="font-extrabold text-slate-900 font-mono text-sm">{liveUtilization}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  liveUtilization >= 90
                    ? 'bg-rose-600'
                    : liveUtilization >= 80
                    ? 'bg-orange-500'
                    : liveUtilization >= 60
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, liveUtilization)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">
                Remaining Airspace: <strong className="text-slate-800">{liveRemaining.toLocaleString()} tons</strong>
              </span>
              <StatusBadge status={liveWarning} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Daily Inflow (tons/day)"
              name="wasteReceived"
              type="number"
              step="1"
              min="0"
              value={formData.wasteReceived}
              onChange={(e) => setFormData({ ...formData, wasteReceived: e.target.value })}
              placeholder="e.g. 380"
              error={formErrors.wasteReceived}
            />
            <FormInput
              label="Waste Fraction Type"
              name="wasteType"
              value={formData.wasteType}
              onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
              placeholder="Inert / Non-recyclable"
            />
            <FormInput
              label="Audit Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="Operational Status"
              name="operationalStatus"
              value={formData.operationalStatus}
              onChange={(e) => setFormData({ ...formData, operationalStatus: e.target.value })}
              options={STATUSES}
              required
            />
            <TextareaInput
              label="Site Engineering Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Leachate collection ponds, geomembrane lining, bio-mining progress..."
              rows={2}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {formSubmitting ? 'Saving...' : editingRecord ? 'Update Landfill' : 'Save Landfill Site'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {selectedRecord && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Landfill Site: ${selectedRecord.landfillName}`}
          subtitle="Airspace telemetry, warning levels and environmental status"
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Site ID</span>
                <span className="font-mono font-bold text-slate-800">{selectedRecord.landfillId}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Location</span>
                <span className="font-semibold text-slate-800">{selectedRecord.location}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Capacity Airspace</span>
                <span className="font-bold text-slate-900">{selectedRecord.capacity?.toLocaleString()} tons</span>
                <p className="text-xs text-slate-500">Used: {selectedRecord.usedCapacity?.toLocaleString()} tons</p>
                <p className="text-xs text-emerald-700 font-semibold">
                  Remaining: {selectedRecord.remainingCapacity?.toLocaleString()} tons
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Utilization & Alert</span>
                <span className="text-base font-extrabold text-slate-900 block mb-1">
                  {selectedRecord.utilizationPercentage}%
                </span>
                <StatusBadge status={selectedRecord.warningLevel} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Daily Inflow</span>
                <span className="font-semibold text-slate-800">
                  +{selectedRecord.wasteReceived?.toLocaleString() || 0} tons/day
                </span>
                <p className="text-xs text-slate-400">{selectedRecord.wasteType}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Status</span>
                <StatusBadge status={selectedRecord.operationalStatus} />
              </div>
            </div>

            {selectedRecord.remarks && (
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 block font-semibold uppercase mb-1">Field Remarks</span>
                <p className="text-slate-700 text-xs leading-relaxed">{selectedRecord.remarks}</p>
              </div>
            )}

            <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Logged by: {selectedRecord.createdBy?.name || 'Sanitation Engineer'}</span>
              <span>Updated: {new Date(selectedRecord.updatedAt || selectedRecord.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Delete Landfill Site"
        message={`Are you sure you want to delete ${recordToDelete?.landfillName}? This will permanently remove the repository.`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deleting}
      />
    </Layout>
  );
};

export default LandfillManagement;
