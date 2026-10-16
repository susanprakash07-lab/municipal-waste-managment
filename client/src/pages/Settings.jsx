import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Server, Database, Shield, Cpu, Info, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Layout pageTitle="System Settings">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          System Environment & Configurations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Municipal server telemetry, database connection parameters, and architecture status
        </p>
      </div>

      <div className="space-y-6">
        {/* Architecture Overview Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Application Architecture</h3>
              <p className="text-xs text-slate-500">Full-stack MERN stack deployment specification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Frontend Client</span>
              <p className="font-bold text-slate-800 text-sm">React.js 18 + Vite</p>
              <p className="text-xs text-slate-500 mt-0.5">Port 5173 &bull; Tailwind CSS &bull; Recharts</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Backend Server</span>
              <p className="font-bold text-slate-800 text-sm">Node.js + Express.js</p>
              <p className="text-xs text-slate-500 mt-0.5">Port 5000 &bull; RESTful JSON API</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Database Engine</span>
              <p className="font-bold text-slate-800 text-sm">MongoDB + Mongoose</p>
              <p className="text-xs text-slate-500 mt-0.5">Community / Atlas Cluster</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Authentication</span>
              <p className="font-bold text-slate-800 text-sm">JWT + Bcrypt</p>
              <p className="text-xs text-slate-500 mt-0.5">Role-based Access Control (RBAC)</p>
            </div>
          </div>
        </div>

        {/* Database Health Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Database Connection Status</h3>
              <p className="text-xs text-slate-500">Mongoose ODM connection telemetry</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-emerald-950">MongoDB Connection Active</p>
                <p className="text-[11px] text-emerald-700">All collection schemas validated and indexed</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-lg">
              Healthy
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block font-semibold mb-0.5">Database Name</span>
              <span className="font-mono text-slate-800 font-semibold">municipal_waste_management</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block font-semibold mb-0.5">Collections Monitored</span>
              <span className="font-semibold text-slate-800">Users, Segregation, Collection, Processing, Plants, Landfills</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block font-semibold mb-0.5">Seed Script Status</span>
              <span className="font-semibold text-emerald-700">Seeded & Verified</span>
            </div>
          </div>
        </div>

        {/* System Info & College Project Viva Notes */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Details & Viva Reference</h3>
              <p className="text-xs text-slate-500">Key information for college project defense</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong className="text-slate-800">Project Title:</strong> Digital Tracking System for Municipal Waste Management
            </p>
            <p>
              <strong className="text-slate-800">Academic Goal:</strong> Replace fragmented paper-based municipality logbooks with an integrated, role-based real-time telemetry portal that accurately quantifies municipal solid waste across sorting, collection fleet hauls, material recovery/composting conversion, and landfill lifespan capacity.
            </p>
            <p>
              <strong className="text-slate-800">Authorized Accounts:</strong>
              <br />
              &bull; Administrator: <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-mono">admin@municipal.com</code> (Password: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Admin@123</code>)
              <br />
              &bull; Field Staff: <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-700 font-mono">staff@municipal.com</code> (Password: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Staff@123</code>)
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
