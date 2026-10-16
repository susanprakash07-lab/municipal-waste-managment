import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import StatusBadge from '../components/StatusBadge';
import { FormInput, SelectInput, TextareaInput } from '../components/FormControls';
import { recyclingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Recycle, Activity, Building, BarChart2, ShieldCheck } from 'lucide-react';

const WASTE_TYPES = ['Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Organic / Multi'];
const STATUSES = ['Operational', 'Maintenance', 'Temporarily Closed'];

const initialFormData = {
  plantName: '',
  location: '',
  wasteType: 'Plastic',
  inputQuantity: '',
  recycledQuantity: '',
  processingDate: new Date().toISOString().split('T')[0],
  capacity: '',
  operationalStatus: 'Operational',
  remarks: ''
};

const RecyclingPlant = () => {
  const { user, isAdmin } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
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
        wasteType: filterType !== 'All' ? filterType : undefined,
        operationalStatus: filterStatus !== 'All' ? filterStatus : undefined
      };
      const res = await recyclingService.getAll(params);
      if (res.data?.success) {
        setRecords(res.data.data);
        setTotalRecords(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showAlert('Failed to load recycling plant records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [currentPage, search, filterType, filterStatus]);

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
      plantName: record.plantName || '',
      location: record.location || '',
      wasteType: record.wasteType || 'Plastic',
      inputQuantity: record.inputQuantity || '',
      recycledQuantity: record.recycledQuantity || '',
      processingDate: record.processingDate ? new Date(record.processingDate).toISOString().split('T')[0] : '',
      capacity: record.capacity || '',
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
    if (!formData.plantName.trim()) errors.plantName = 'Plant name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    const cap = Number(formData.capacity);
    const input = Number(formData.inputQuantity);
    const recycled = Number(formData.recycledQuantity);

    if (!formData.capacity || cap <= 0) errors.capacity = 'Capacity must be greater than 0';
    if (formData.inputQuantity === '' || input < 0) errors.inputQuantity = 'Input quantity cannot be negative';
    if (formData.recycledQuantity === '' || recycled < 0) errors.recycledQuantity = 'Recycled quantity cannot be negative';
    if (recycled > input) errors.recycledQuantity = 'Recycled quantity cannot exceed input quantity';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setFormSubmitting(true);
      if (editingRecord) {
        await recyclingService.update(editingRecord._id, formData);
        showAlert('Recycling plant updated successfully!');
      } else {
        await recyclingService.create(formData);
        showAlert('New recycling plant facility registered!');
      }
      setModalOpen(false);
      fetchRecords();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving recycling plant record';
      showAlert(msg, 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;
    try {
      setDeleting(true);
      await recyclingService.delete(recordToDelete._id);
      showAlert('Recycling plant deleted successfully!');
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
      fetchRecords();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error deleting record';
      showAlert(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const liveRate =
    formData.inputQuantity && Number(formData.inputQuantity) > 0 && formData.recycledQuantity !== ''
      ? Math.min(100, Number(((Number(formData.recycledQuantity) / Number(formData.inputQuantity)) * 100).toFixed(1)))
      : 0;

  const liveUtilization =
    formData.capacity && Number(formData.capacity) > 0 && formData.inputQuantity !== ''
      ? Math.min(100, Number(((Number(formData.inputQuantity) / Number(formData.capacity)) * 100).toFixed(1)))
      : 0;

  const columns = [
    {
      header: 'Plant ID',
      accessor: 'plantId',
      className: 'font-mono font-semibold text-xs text-slate-900',
      render: (r) => r.plantId || '-'
    },
    {
      header: 'Plant Name & Location',
      accessor: 'plantName',
      render: (r) => (
        <div>
          <p className="font-semibold text-slate-800 leading-tight">{r.plantName}</p>
          <span className="text-xs text-slate-400">{r.location}</span>
        </div>
      )
    },
    {
      header: 'Stream & Capacity',
      accessor: 'wasteType',
      render: (r) => (
        <div>
          <span className="font-medium text-slate-800">{r.wasteType}</span>
          <p className="text-xs text-slate-400">Cap: {r.capacity} tons/day</p>
        </div>
      )
    },
    {
      header: 'Input / Recycled',
      accessor: 'recycledQuantity',
      render: (r) => (
        <div>
          <span className="font-semibold text-emerald-700">{r.recycledQuantity}</span>
          <span className="text-xs text-slate-400"> / {r.inputQuantity} tons</span>
        </div>
      )
    },
    {
      header: 'Recycling Rate',
      accessor: 'recyclingRate',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(100, r.recyclingRate || 0)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-800">{r.recyclingRate}%</span>
        </div>
      )
    },
    {
      header: 'Utilization',
      accessor: 'utilization',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                r.utilization >= 80 ? 'bg-amber-500' : 'bg-teal-500'
              }`}
              style={{ width: `${Math.min(100, r.utilization || 0)}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-600">{r.utilization}%</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'operationalStatus',
      render: (r) => <StatusBadge status={r.operationalStatus} />
    }
  ];

  return (
    <Layout pageTitle="Recycling Plants">
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
            Recycling Plants & Circular Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor circular recovery rates, plant daily utilization, and polymer/scrap reprocessing throughput
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={records}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search plant name, location, or remarks..."
        filterOptions={[
          {
            value: filterType,
            onChange: setFilterType,
            options: [{ value: 'All', label: 'All Streams' }, ...WASTE_TYPES]
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
        addNewLabel="Register Recycling Plant"
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        canDelete={isAdmin}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRecord ? `Edit Plant ${editingRecord.plantId}` : 'Register New Recycling Facility'}
        subtitle="Manage daily plant throughput, engineered capacity, and operational status"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Plant Facility Name"
              name="plantName"
              value={formData.plantName}
              onChange={(e) => setFormData({ ...formData, plantName: e.target.value })}
              placeholder="e.g. GreenTech Polymers Recycling Plant"
              required
              error={formErrors.plantName}
            />
            <FormInput
              label="Industrial Location / Zone"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Peenya Industrial Estate, Bengaluru"
              required
              error={formErrors.location}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="Primary Waste Stream Processed"
              name="wasteType"
              value={formData.wasteType}
              onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
              options={WASTE_TYPES}
              required
            />
            <FormInput
              label="Design Daily Capacity (tons/day)"
              name="capacity"
              type="number"
              step="1"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="e.g. 60"
              required
              error={formErrors.capacity}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Input Feedstock (tons)"
              name="inputQuantity"
              type="number"
              step="0.1"
              min="0"
              value={formData.inputQuantity}
              onChange={(e) => setFormData({ ...formData, inputQuantity: e.target.value })}
              placeholder="e.g. 45.0"
              required
              error={formErrors.inputQuantity}
            />
            <FormInput
              label="Recycled Yield (tons)"
              name="recycledQuantity"
              type="number"
              step="0.1"
              min="0"
              value={formData.recycledQuantity}
              onChange={(e) => setFormData({ ...formData, recycledQuantity: e.target.value })}
              placeholder="e.g. 39.5"
              required
              error={formErrors.recycledQuantity}
            />
            <FormInput
              label="Processing Date"
              name="processingDate"
              type="date"
              value={formData.processingDate}
              onChange={(e) => setFormData({ ...formData, processingDate: e.target.value })}
              required
            />
          </div>

          {/* Dynamic Progress Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-semibold block mb-1">
                Recycling Recovery Rate:
              </span>
              <span className="text-base font-extrabold text-emerald-700">
                {liveRate}%
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block mb-1">
                Facility Utilization:
              </span>
              <span className="text-base font-extrabold text-teal-700">
                {liveUtilization}%
              </span>
            </div>
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
              label="Technical Remarks / Certifications"
              name="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="ISO standard certification, pelletizing line health..."
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
              {formSubmitting ? 'Saving...' : editingRecord ? 'Update Plant' : 'Register Plant'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {selectedRecord && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Recycling Plant: ${selectedRecord.plantName}`}
          subtitle="Facility operational status and circular metric analysis"
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Plant Code</span>
                <span className="font-mono font-bold text-slate-800">{selectedRecord.plantId}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Location</span>
                <span className="font-semibold text-slate-800">{selectedRecord.location}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Waste Stream</span>
                <span className="font-semibold text-slate-800">{selectedRecord.wasteType}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Design Capacity</span>
                <span className="font-semibold text-slate-800">{selectedRecord.capacity} tons/day</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Recycling Rate</span>
                <span className="text-base font-extrabold text-emerald-700">{selectedRecord.recyclingRate}%</span>
                <p className="text-xs text-slate-500">{selectedRecord.recycledQuantity} tons of {selectedRecord.inputQuantity} tons</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Plant Utilization</span>
                <span className="text-base font-extrabold text-teal-700">{selectedRecord.utilization}%</span>
                <div className="mt-1">
                  <StatusBadge status={selectedRecord.operationalStatus} />
                </div>
              </div>
            </div>

            {selectedRecord.remarks && (
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 block font-semibold uppercase mb-1">Remarks</span>
                <p className="text-slate-700 text-xs leading-relaxed">{selectedRecord.remarks}</p>
              </div>
            )}

            <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Logged by: {selectedRecord.createdBy?.name || 'Administrator'}</span>
              <span>Updated: {new Date(selectedRecord.updatedAt || selectedRecord.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Delete Recycling Plant"
        message={`Are you sure you want to delete ${recordToDelete?.plantName}? This will remove the facility from tracking.`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deleting}
      />
    </Layout>
  );
};

export default RecyclingPlant;
