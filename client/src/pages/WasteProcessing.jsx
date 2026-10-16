import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import StatusBadge from '../components/StatusBadge';
import { FormInput, SelectInput, TextareaInput } from '../components/FormControls';
import { processingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Cpu, Zap, Activity, Building2, Layers } from 'lucide-react';

const METHODS = ['Composting', 'Material Recovery', 'Recycling', 'Treatment', 'Other'];
const STATUSES = ['Pending', 'Processing', 'Completed'];
const WASTE_TYPES = ['Organic', 'Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Mixed / Other'];

const initialFormData = {
  wasteSource: '',
  processingFacility: '',
  wasteType: 'Organic',
  inputQuantity: '',
  processedQuantity: '',
  processingDate: new Date().toISOString().split('T')[0],
  processingMethod: 'Composting',
  outputType: '',
  status: 'Pending',
  remarks: ''
};

const WasteProcessing = () => {
  const { user, isAdmin } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('All');
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
        method: filterMethod !== 'All' ? filterMethod : undefined,
        status: filterStatus !== 'All' ? filterStatus : undefined
      };
      const res = await processingService.getAll(params);
      if (res.data?.success) {
        setRecords(res.data.data);
        setTotalRecords(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showAlert('Failed to load processing records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [currentPage, search, filterMethod, filterStatus]);

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
      wasteSource: record.wasteSource || '',
      processingFacility: record.processingFacility || '',
      wasteType: record.wasteType || 'Organic',
      inputQuantity: record.inputQuantity || '',
      processedQuantity: record.processedQuantity || '',
      processingDate: record.processingDate ? new Date(record.processingDate).toISOString().split('T')[0] : '',
      processingMethod: record.processingMethod || 'Composting',
      outputType: record.outputType || '',
      status: record.status || 'Pending',
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
    if (!formData.wasteSource.trim()) errors.wasteSource = 'Waste source is required';
    if (!formData.processingFacility.trim()) errors.processingFacility = 'Facility name is required';
    if (!formData.outputType.trim()) errors.outputType = 'Output type is required';
    const input = Number(formData.inputQuantity);
    const processed = Number(formData.processedQuantity);
    if (!formData.inputQuantity || input <= 0) errors.inputQuantity = 'Input quantity must be greater than 0';
    if (formData.processedQuantity === '' || processed < 0) errors.processedQuantity = 'Processed quantity cannot be negative';
    if (processed > input) errors.processedQuantity = 'Processed quantity cannot exceed input quantity';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setFormSubmitting(true);
      if (editingRecord) {
        await processingService.update(editingRecord._id, formData);
        showAlert('Processing record updated successfully!');
      } else {
        await processingService.create(formData);
        showAlert('New waste processing batch logged!');
      }
      setModalOpen(false);
      fetchRecords();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving processing record';
      showAlert(msg, 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;
    try {
      setDeleting(true);
      await processingService.delete(recordToDelete._id);
      showAlert('Processing record deleted successfully!');
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

  // Live efficiency preview in modal
  const liveEfficiency =
    formData.inputQuantity && Number(formData.inputQuantity) > 0 && formData.processedQuantity !== ''
      ? Math.min(100, Number(((Number(formData.processedQuantity) / Number(formData.inputQuantity)) * 100).toFixed(1)))
      : 0;

  const columns = [
    {
      header: 'Processing ID',
      accessor: 'processingId',
      className: 'font-mono font-semibold text-xs text-slate-900',
      render: (r) => r.processingId || '-'
    },
    {
      header: 'Facility & Source',
      accessor: 'processingFacility',
      render: (r) => (
        <div>
          <p className="font-semibold text-slate-800 leading-tight">{r.processingFacility}</p>
          <span className="text-xs text-slate-400">Src: {r.wasteSource}</span>
        </div>
      )
    },
    {
      header: 'Method & Output',
      accessor: 'processingMethod',
      render: (r) => (
        <div>
          <span className="font-medium text-slate-800">{r.processingMethod}</span>
          <p className="text-xs text-emerald-600">{r.outputType}</p>
        </div>
      )
    },
    {
      header: 'Input / Output',
      accessor: 'inputQuantity',
      render: (r) => (
        <div>
          <span className="font-semibold text-slate-900">{r.processedQuantity}</span>
          <span className="text-xs text-slate-400"> / {r.inputQuantity} tons</span>
        </div>
      )
    },
    {
      header: 'Efficiency',
      accessor: 'efficiency',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                r.efficiency >= 85
                  ? 'bg-emerald-500'
                  : r.efficiency >= 70
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, r.efficiency || 0)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-700">{r.efficiency}%</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => <StatusBadge status={r.status} />
    }
  ];

  return (
    <Layout pageTitle="Waste Processing">
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
            Waste Processing & Transformation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track biological composting, material recovery facilities (MRF), and thermal treatment conversion
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
        searchPlaceholder="Search facility, method, output, or source..."
        filterOptions={[
          {
            value: filterMethod,
            onChange: setFilterMethod,
            options: [{ value: 'All', label: 'All Methods' }, ...METHODS]
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
        addNewLabel="New Processing Batch"
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        canDelete={isAdmin}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRecord ? `Edit Batch ${editingRecord.processingId}` : 'Log New Waste Processing Batch'}
        subtitle="Record facility inputs, outputs, and biological / physical processing efficiency"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Processing Facility / Plant"
              name="processingFacility"
              value={formData.processingFacility}
              onChange={(e) => setFormData({ ...formData, processingFacility: e.target.value })}
              placeholder="e.g. Mavallipura Central Bio-Composting Plant"
              required
              error={formErrors.processingFacility}
            />
            <FormInput
              label="Waste Source"
              name="wasteSource"
              value={formData.wasteSource}
              onChange={(e) => setFormData({ ...formData, wasteSource: e.target.value })}
              placeholder="e.g. South Zone Commercial Collection"
              required
              error={formErrors.wasteSource}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectInput
              label="Waste Type"
              name="wasteType"
              value={formData.wasteType}
              onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
              options={WASTE_TYPES}
              required
            />
            <SelectInput
              label="Processing Method"
              name="processingMethod"
              value={formData.processingMethod}
              onChange={(e) => setFormData({ ...formData, processingMethod: e.target.value })}
              options={METHODS}
              required
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Input Quantity (tons)"
              name="inputQuantity"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.inputQuantity}
              onChange={(e) => setFormData({ ...formData, inputQuantity: e.target.value })}
              placeholder="e.g. 25.0"
              required
              error={formErrors.inputQuantity}
            />
            <FormInput
              label="Processed Output Quantity (tons)"
              name="processedQuantity"
              type="number"
              step="0.1"
              min="0"
              value={formData.processedQuantity}
              onChange={(e) => setFormData({ ...formData, processedQuantity: e.target.value })}
              placeholder="e.g. 21.5"
              required
              error={formErrors.processedQuantity}
            />
          </div>

          {/* Dynamic Efficiency Indicator */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-900">
                Calculated Processing Efficiency:
              </span>
            </div>
            <span className="text-sm font-extrabold text-emerald-700 font-mono">
              {liveEfficiency}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Output Product Type"
              name="outputType"
              value={formData.outputType}
              onChange={(e) => setFormData({ ...formData, outputType: e.target.value })}
              placeholder="e.g. Organic Compost, RDF Pellets, Flakes"
              required
              error={formErrors.outputType}
            />
            <SelectInput
              label="Batch Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={STATUSES}
              required
            />
          </div>

          <TextareaInput
            label="Batch Notes & Process Parameters"
            name="remarks"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="Curing temperature, moisture retention, residual reject percentage..."
            rows={2}
          />

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
              {formSubmitting ? 'Saving...' : editingRecord ? 'Update Batch' : 'Commit Processing Batch'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {selectedRecord && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Processing Record: ${selectedRecord.processingId}`}
          subtitle="Facility transformation and conversion telemetry"
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Processing Facility</span>
                <span className="font-semibold text-slate-800">{selectedRecord.processingFacility}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Waste Source</span>
                <span className="font-semibold text-slate-800">{selectedRecord.wasteSource}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Method & Output</span>
                <span className="font-semibold text-slate-800">{selectedRecord.processingMethod}</span>
                <p className="text-xs text-emerald-600">{selectedRecord.outputType}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Date</span>
                <span className="font-semibold text-slate-800">
                  {new Date(selectedRecord.processingDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Quantities</span>
                <p className="font-bold text-slate-800">
                  Input: {selectedRecord.inputQuantity} tons
                </p>
                <p className="font-bold text-emerald-700">
                  Processed: {selectedRecord.processedQuantity} tons
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Efficiency & Status</span>
                <span className="text-sm font-extrabold text-emerald-700 block mb-1">
                  {selectedRecord.efficiency}%
                </span>
                <StatusBadge status={selectedRecord.status} />
              </div>
            </div>

            {selectedRecord.remarks && (
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 block font-semibold uppercase mb-1">Technical Remarks</span>
                <p className="text-slate-700 text-xs leading-relaxed">{selectedRecord.remarks}</p>
              </div>
            )}

            <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Logged by: {selectedRecord.createdBy?.name || 'Plant Officer'}</span>
              <span>Updated: {new Date(selectedRecord.updatedAt || selectedRecord.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Delete Processing Batch"
        message={`Are you sure you want to delete processing batch ${recordToDelete?.processingId}? This will remove the conversion log.`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deleting}
      />
    </Layout>
  );
};

export default WasteProcessing;
