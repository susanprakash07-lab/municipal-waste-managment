import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import StatusBadge from '../components/StatusBadge';
import { FormInput, SelectInput, TextareaInput } from '../components/FormControls';
import { segregationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Layers, Plus, Calendar, Scale, Tag, User, MapPin } from 'lucide-react';

const WASTE_TYPES = ['Organic', 'Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Other'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];
const UNITS = ['kg', 'tons'];

const initialFormData = {
  collectionPoint: '',
  date: new Date().toISOString().split('T')[0],
  wasteType: 'Organic',
  quantity: '',
  unit: 'kg',
  status: 'Pending',
  segregatedBy: '',
  remarks: ''
};

const WasteSegregation = () => {
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
        status: filterStatus !== 'All' ? filterStatus : undefined
      };
      const res = await segregationService.getAll(params);
      if (res.data?.success) {
        setRecords(res.data.data);
        setTotalRecords(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showAlert('Failed to load segregation records', 'error');
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
    setFormData({
      ...initialFormData,
      segregatedBy: user?.name || ''
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      collectionPoint: record.collectionPoint || '',
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
      wasteType: record.wasteType || 'Organic',
      quantity: record.quantity || '',
      unit: record.unit || 'kg',
      status: record.status || 'Pending',
      segregatedBy: record.segregatedBy || '',
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
    if (!formData.collectionPoint.trim()) errors.collectionPoint = 'Collection point is required';
    if (!formData.quantity || Number(formData.quantity) <= 0) errors.quantity = 'Quantity must be greater than 0';
    if (!formData.segregatedBy.trim()) errors.segregatedBy = 'Segregator name is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setFormSubmitting(true);
      if (editingRecord) {
        await segregationService.update(editingRecord._id, formData);
        showAlert('Segregation record updated successfully!');
      } else {
        await segregationService.create(formData);
        showAlert('New segregation record added successfully!');
      }
      setModalOpen(false);
      fetchRecords();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving record';
      showAlert(msg, 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;
    try {
      setDeleting(true);
      await segregationService.delete(recordToDelete._id);
      showAlert('Segregation record deleted successfully!');
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

  const columns = [
    {
      header: 'Record ID',
      accessor: 'recordId',
      className: 'font-mono font-semibold text-xs text-slate-900',
      render: (r) => r.recordId || '-'
    },
    {
      header: 'Collection Point',
      accessor: 'collectionPoint',
      className: 'font-medium text-slate-800'
    },
    {
      header: 'Waste Type',
      accessor: 'wasteType',
      render: (r) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
          {r.wasteType}
        </span>
      )
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      render: (r) => (
        <span className="font-semibold text-slate-900">
          {r.quantity?.toLocaleString()} <span className="text-xs font-normal text-slate-500">{r.unit}</span>
        </span>
      )
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (r) => new Date(r.date).toLocaleDateString()
    },
    {
      header: 'Segregated By',
      accessor: 'segregatedBy',
      className: 'text-xs text-slate-600'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => <StatusBadge status={r.status} />
    }
  ];

  return (
    <Layout pageTitle="Waste Segregation">
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
            Waste Segregation Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log and audit manual and mechanical waste sorting across municipal transfer stations
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
        searchPlaceholder="Search by ID, location, segregator, or notes..."
        filterOptions={[
          {
            value: filterType,
            onChange: setFilterType,
            options: [{ value: 'All', label: 'All Waste Types' }, ...WASTE_TYPES]
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
        addNewLabel="New Segregation Record"
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        canDelete={isAdmin}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRecord ? `Edit Record ${editingRecord.recordId}` : 'New Waste Segregation Entry'}
        subtitle="Specify waste characterization, depot weight, and sorting progress"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Collection Point / Depot"
              name="collectionPoint"
              value={formData.collectionPoint}
              onChange={(e) => setFormData({ ...formData, collectionPoint: e.target.value })}
              placeholder="e.g. Indiranagar Ward 4 Transfer Station"
              required
              error={formErrors.collectionPoint}
            />
            <FormInput
              label="Date of Sorting"
              name="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
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
            <FormInput
              label="Quantity"
              name="quantity"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="e.g. 1500"
              required
              error={formErrors.quantity}
            />
            <SelectInput
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              options={UNITS}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="Segregation Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={STATUSES}
              required
            />
            <FormInput
              label="Segregated By (Staff / Officer)"
              name="segregatedBy"
              value={formData.segregatedBy}
              onChange={(e) => setFormData({ ...formData, segregatedBy: e.target.value })}
              placeholder="e.g. Priya Verma"
              required
              error={formErrors.segregatedBy}
            />
          </div>

          <TextareaInput
            label="Operational Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="Details on contamination levels, source category, moisture level..."
            rows={3}
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
              {formSubmitting ? 'Saving...' : editingRecord ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {selectedRecord && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Segregation Record: ${selectedRecord.recordId}`}
          subtitle="Detailed audit trail and parameters"
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Collection Point</span>
                <span className="font-semibold text-slate-800">{selectedRecord.collectionPoint}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Date</span>
                <span className="font-semibold text-slate-800">
                  {new Date(selectedRecord.date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Waste Type</span>
                <span className="font-semibold text-slate-800">{selectedRecord.wasteType}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Quantity</span>
                <span className="font-bold text-emerald-700">
                  {selectedRecord.quantity?.toLocaleString()} {selectedRecord.unit}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Status</span>
                <StatusBadge status={selectedRecord.status} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Segregated By</span>
                <span className="font-semibold text-slate-800">{selectedRecord.segregatedBy}</span>
              </div>
            </div>

            {selectedRecord.remarks && (
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 block font-semibold uppercase mb-1">Remarks</span>
                <p className="text-slate-700 text-xs leading-relaxed">{selectedRecord.remarks}</p>
              </div>
            )}

            <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Logged by: {selectedRecord.createdBy?.name || 'System Staff'}</span>
              <span>Updated: {new Date(selectedRecord.updatedAt || selectedRecord.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Delete Segregation Record"
        message={`Are you sure you want to permanently delete record ${recordToDelete?.recordId}? This action cannot be reversed.`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deleting}
      />
    </Layout>
  );
};

export default WasteSegregation;
