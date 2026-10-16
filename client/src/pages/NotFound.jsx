import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Municipal Route Not Found</h2>
        <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
          The requested system screen or URL does not exist or has been relocated by the municipal administration.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
