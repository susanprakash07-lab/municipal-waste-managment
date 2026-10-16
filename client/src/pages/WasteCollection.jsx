import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import StatusBadge from '../components/StatusBadge';
import { FormInput, SelectInput, TextareaInput } from '../components/FormControls';
import { collectionService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Truck, MapPin, Calendar, Clock, User, FileText } from 'lucide-react';

const WASTE_TYPES = ['Organic', 'Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Mixed / Other'];
const STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
const ZONES = ['All Zones', 'East Zone', 'West Zone', 'South Zone', 'North Zone', 'Central Zone'];

const initialFormData = {
  collectionPoint: '',
  area: 'South Zone',
  date: new Date().toISOString().split('T')[0],
  time: '08:00 AM',
  wasteType: 'Organic',
  quantity: '',
  unit: 'tons',
  vehicleNumber: '',
  driverName: '',
  collectorName: '',
  status: 'Scheduled',
  remarks: ''
};

const WasteCollection = () => {
  const { user, isAdmin } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('All');
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
        area: filterArea !== 'All' ? filterArea : undefined,
        wasteType: filterType !== 'All' ? filterType : undefined,
        status: filterStatus !== 'All' ? filterStatus : undefined
      };
      const res = await collectionService.getAll(params);
      if (res.data?.success) {
        setRecords(res.data.data);
        setTotalRecords(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showAlert('Failed to load collection records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [currentPage, search, filterArea, filterType, filterStatus]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormData({
      ...initialFormData,
      collectorName: user?.name || ''
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      collectionPoint: record.collectionPoint || '',
      area: record.area || 'South Zone',
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
      time: record.time || '08:00 AM',
      wasteType: record.wasteType || 'Organic',
      quantity: record.quantity || '',
      unit: record.unit || 'tons',
      vehicleNumber: record.vehicleNumber || '',
      driverName: record.driverName || '',
      collectorName: record.collectorName || '',
      status: record.status || 'Scheduled',
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
    if (!formData.vehicleNumber.trim()) errors.vehicleNumber = 'Vehicle number is required';
    if (!formData.driverName.trim()) errors.driverName = 'Driver name is required';
    if (!formData.collectorName.trim()) errors.collectorName = 'Collector name is required';
    if (!formData.quantity || Number(formData.quantity) <= 0) errors.quantity = 'Quantity must be greater than 0';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setFormSubmitting(true);
      if (editingRecord) {
        await collectionService.update(editingRecord._id, formData);
        showAlert('Collection record updated successfully!');
      } else {
        await collectionService.create(formData);
        showAlert('New waste collection logged successfully!');
      }
      setModalOpen(false);
      fetchRecords();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving collection record';
      showAlert(msg, 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;
    try {
      setDeleting(true);
      await collectionService.delete(recordToDelete._id);
      showAlert('Collection record deleted successfully!');
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
      fetchRecords();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error deleting collection';
      showAlert(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Collection ID',
      accessor: 'collectionId',
      className: 'font-mono font-semibold text-xs text-slate-900',
      render: (r) => r.collectionId || '-'
    },
    {
      header: 'Point & Area',
      accessor: 'collectionPoint',
      render: (r) => (
        <div>
          <p className="font-semibold text-slate-800 leading-tight">{r.collectionPoint}</p>
          <span className="text-xs text-slate-400">{r.area}</span>
        </div>
      )
    },
    {
      header: 'Vehicle & Crew',
      accessor: 'vehicleNumber',
      render: (r) => (
        <div>
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {r.vehicleNumber}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            D: {r.driverName} | C: {r.collectorName}
          </p>
        </div>
      )
    },
    {
      header: 'Type & Volume',
      accessor: 'quantity',
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900">{r.quantity} {r.unit}</span>
          <p className="text-xs text-slate-500">{r.wasteType}</p>
        </div>
      )
    },
    {
      header: 'Schedule',
      accessor: 'date',
      render: (r) => (
        <div>
          <span className="text-xs font-medium text-slate-700">{new Date(r.date).toLocaleDateString()}</span>
          <p className="text-[11px] text-slate-400">{r.time}</p>
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
    <Layout pageTitle="Waste Collection">
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
            Waste Collection & Fleet Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor primary and secondary municipal vehicle hauls, crew assignments, and tonnages
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
        searchPlaceholder="Search vehicle, driver, collector, location..."
        filterOptions={[
          {
            value: filterArea,
            onChange: setFilterArea,
            options: [{ value: 'All', label: 'All Zones' }, 'East Zone', 'West Zone', 'South Zone', 'North Zone', 'Central Zone']
          },
          {
            value: filterType,
            onChange: setFilterType,
            options: [{ value: 'All', label: 'All Types' }, ...WASTE_TYPES]
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
        addNewLabel="Dispatch / Log Collection"
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        canDelete={isAdmin}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRecord ? `Edit Collection ${editingRecord.collectionId}` : 'Log New Waste Collection Dispatch'}
        subtitle="Record trip details, vehicle license, crew and payload volume"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Collection Point"
              name="collectionPoint"
              value={formData.collectionPoint}
              onChange={(e) => setFormData({ ...formData, collectionPoint: e.target.value })}
              placeholder="e.g. Koramangala Sony World Junction"
              required
              error={formErrors.collectionPoint}
            />
            <SelectInput
              label="Area / Municipal Zone"
              name="area"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              options={['South Zone', 'North Zone', 'East Zone', 'West Zone', 'Central Zone']}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Collection Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <FormInput
              label="Collection Time"
              name="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g. 08:30 AM"
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
              label="Payload Quantity"
              name="quantity"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="e.g. 3.5"
              required
              error={formErrors.quantity}
            />
            <SelectInput
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              options={['tons', 'kg']}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Vehicle Registration"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              placeholder="e.g. KA-03-GA-1024"
              required
              error={formErrors.vehicleNumber}
            />
            <FormInput
              label="Driver Name"
              name="driverName"
              value={formData.driverName}
              onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
              placeholder="e.g. Manjunath Swamy"
              required
              error={formErrors.driverName}
            />
            <FormInput
              label="Collector Name"
              name="collectorName"
              value={formData.collectorName}
              onChange={(e) => setFormData({ ...formData, collectorName: e.target.value })}
              placeholder="e.g. Gopal Krishna"
              required
              error={formErrors.collectorName}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="Collection Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={STATUSES}
              required
            />
            <TextareaInput
              label="Trip Remarks / Route Notes"
              name="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Traffic conditions, bin fill levels, vehicle condition..."
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
              {formSubmitting ? 'Saving...' : editingRecord ? 'Update Collection' : 'Dispatch Vehicle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {selectedRecord && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Collection Manifest: ${selectedRecord.collectionId}`}
          subtitle="Trip details and vehicle crew log"
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Location</span>
                <span className="font-semibold text-slate-800">{selectedRecord.collectionPoint}</span>
                <p className="text-xs text-slate-500">{selectedRecord.area}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Date & Time</span>
                <span className="font-semibold text-slate-800">
                  {new Date(selectedRecord.date).toLocaleDateString()}
                </span>
                <p className="text-xs text-slate-500">{selectedRecord.time}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Vehicle Number</span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {selectedRecord.vehicleNumber}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Crew</span>
                <p className="font-medium text-slate-800">Driver: {selectedRecord.driverName}</p>
                <p className="text-xs text-slate-500">Collector: {selectedRecord.collectorName}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Payload</span>
                <span className="font-bold text-emerald-700 text-base">
                  {selectedRecord.quantity} {selectedRecord.unit}
                </span>
                <p className="text-xs text-slate-500">{selectedRecord.wasteType}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Dispatch Status</span>
                <StatusBadge status={selectedRecord.status} />
              </div>
            </div>

            {selectedRecord.remarks && (
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 block font-semibold uppercase mb-1">Remarks</span>
                <p className="text-slate-700 text-xs leading-relaxed">{selectedRecord.remarks}</p>
              </div>
            )}

            <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Logged by: {selectedRecord.createdBy?.name || 'Dispatcher'}</span>
              <span>Updated: {new Date(selectedRecord.updatedAt || selectedRecord.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Delete Collection Record"
        message={`Are you sure you want to delete collection ${recordToDelete?.collectionId}? This will remove the recorded vehicle trip.`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deleting}
      />
    </Layout>
  );
};

export default WasteCollection;
