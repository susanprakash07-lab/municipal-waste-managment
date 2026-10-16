import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, AlertCircle, ArrowRight, Shield, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email address and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/20 mb-4 ring-4 ring-emerald-500/20">
            <Leaf className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Municipal Waste Tracking
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Centralized Digital Management & Operations Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Account Login</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your authorized municipal staff credentials
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs sm:text-sm animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@municipal.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Quick-Fill section */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              College Viva Demo Quick Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@municipal.com', 'Admin@123')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-800 text-xs font-semibold transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('staff@municipal.com', 'Staff@123')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Staff Login</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2.5">
              Click either button above to auto-populate test credentials
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Municipal Waste Management Digital Tracking System &bull; College Project 2026
        </p>
      </div>
    </div>
  );
};

export default Login;
