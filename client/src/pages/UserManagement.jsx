import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import StatusBadge from '../components/StatusBadge';
import { FormInput, SelectInput } from '../components/FormControls';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, UserPlus, Mail, Phone, Building } from 'lucide-react';

const ROLES = ['ADMIN', 'MUNICIPAL STAFF'];

const initialFormData = {
  name: '',
  email: '',
  password: '',
  role: 'MUNICIPAL STAFF',
  department: 'Solid Waste Management',
  phone: ''
};

const UserManagement = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [alert, setAlert] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search,
        role: filterRole !== 'All' ? filterRole : undefined
      };
      const res = await userService.getUsers(params);
      if (res.data?.success) {
        setUsers(res.data.data);
        setTotalUsers(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      showAlert('Failed to load user accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search, filterRole]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData(initialFormData);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', // Blank unless modifying
      role: user.role || 'MUNICIPAL STAFF',
      department: user.department || 'Solid Waste Management',
      phone: user.phone || ''
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenDelete = (user) => {
    if (user._id === currentUser?._id) {
      showAlert('You cannot delete your own administrative account.', 'error');
      return;
    }
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email address is required';
    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      errors.password = 'Password is required and must be at least 6 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setFormSubmitting(true);
      if (editingUser) {
        await userService.updateUser(editingUser._id, formData);
        showAlert('User credentials updated successfully!');
      } else {
        await userService.createUser(formData);
        showAlert('New municipal user account created!');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving user';
      showAlert(msg, 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      setDeleting(true);
      await userService.deleteUser(userToDelete._id);
      showAlert('User account removed successfully!');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error deleting user';
      showAlert(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Staff Member',
      accessor: 'name',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
            {u.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-800 leading-tight">{u.name}</p>
            <span className="text-xs text-slate-400">{u.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (u) => <StatusBadge status={u.role} />
    },
    {
      header: 'Department / Unit',
      accessor: 'department',
      render: (u) => <span className="text-slate-700 text-xs">{u.department}</span>
    },
    {
      header: 'Contact Phone',
      accessor: 'phone',
      render: (u) => <span className="text-slate-600 text-xs">{u.phone || 'Not listed'}</span>
    },
    {
      header: 'Created On',
      accessor: 'createdAt',
      render: (u) => new Date(u.createdAt).toLocaleDateString()
    }
  ];

  return (
    <Layout pageTitle="User Management">
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
            Municipal User & Role Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Admin access control: provision staff accounts, assign field roles, and audit credentials
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email, department..."
        filterOptions={[
          {
            value: filterRole,
            onChange: setFilterRole,
            options: [{ value: 'All', label: 'All Roles' }, ...ROLES]
          }
        ]}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalUsers}
        onPageChange={setCurrentPage}
        onAddNew={handleOpenAdd}
        addNewLabel="Provision New User"
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        canDelete={true}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? `Edit Account: ${editingUser.name}` : 'Provision Municipal Staff Account'}
        subtitle="Specify credentials and administrative permissions"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Babu"
              required
              error={formErrors.name}
            />
            <FormInput
              label="Official Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. ramesh@municipal.com"
              required
              error={formErrors.email}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="System Access Role"
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={ROLES}
              required
            />
            <FormInput
              label={editingUser ? 'Reset Password (leave blank to keep current)' : 'Account Password'}
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required={!editingUser}
              error={formErrors.password}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Department / Unit"
              name="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Zone 4 Transfer Stations"
            />
            <FormInput
              label="Official Phone / Mobile"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +91 98765 43210"
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
              {formSubmitting ? 'Saving...' : editingUser ? 'Update Account' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Revoke User Access"
        message={`Are you sure you want to permanently delete the account for ${userToDelete?.name} (${userToDelete?.email})?`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deleting}
      />
    </Layout>
  );
};

export default UserManagement;
