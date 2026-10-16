import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { FormInput } from '../components/FormControls';
import StatusBadge from '../components/StatusBadge';
import { authService } from '../services/api';
import { User, Lock, Mail, Building, Phone, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, updateUserContext } = useAuth();

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || ''
  });
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    try {
      setProfileSubmitting(true);
      const res = await authService.updateProfile(profileData);
      if (res.data?.success) {
        updateUserContext(res.data.user);
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => setProfileSuccess(''), 4000);
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    try {
      setPasswordSubmitting(true);
      const res = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (res.data?.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccess(''), 4000);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Error changing password');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <Layout pageTitle="User Profile">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Municipal Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          View authenticated credentials, update contact details, and manage password security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 ring-4 ring-emerald-50">
            {user?.name?.charAt(0) || 'U'}
          </div>

          <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>

          <div className="mt-3">
            <StatusBadge status={user?.role || 'MUNICIPAL STAFF'} />
          </div>

          <div className="w-full mt-6 pt-6 border-t border-slate-100 text-left space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{user?.department || 'Solid Waste Management'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{user?.phone || 'No phone registered'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}</span>
            </div>
          </div>
        </div>

        {/* Right Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Edit Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Personal Details</h3>
            <p className="text-xs text-slate-500 mb-5">Update your display name and contact numbers</p>

            {profileSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800">
                {profileError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
                <FormInput
                  label="Official Email Address"
                  name="email"
                  value={user?.email || ''}
                  disabled
                  helperText="Email cannot be changed directly"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Department / Unit"
                  name="department"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                />
                <FormInput
                  label="Contact Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {profileSubmitting ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Password Change Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Change Account Password</h3>
            <p className="text-xs text-slate-500 mb-5">Ensure your account uses a secure password</p>

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{passwordSuccess}</span>
              </div>
            )}
            {passwordError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <FormInput
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                placeholder="••••••••"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  placeholder="Minimum 6 characters"
                />
                <FormInput
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 active:bg-black rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {passwordSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
