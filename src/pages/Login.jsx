import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Building, User, Eye, EyeOff } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Login({ onLoginSuccess }) {
  const { addToast } = useDashboard();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In inputs
  const [email, setEmail] = useState('procure@vendorbridge.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Procurement Lead');

  // Sign Up inputs
  const [signUpName, setSignUpName] = useState('');
  const [signUpCompany, setSignUpCompany] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState('Buyer Requisitioner');

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('Please enter your email and password.', 'warning');
      return;
    }
    
    // Trigger successful mock login session
    addToast(`Successfully authenticated as ${role}!`, 'success');
    onLoginSuccess({ name: 'Admin Demo', email, role });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpCompany.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      addToast('Please fill in all sign-up details.', 'warning');
      return;
    }
    
    addToast('Account registration request submitted for compliance review.', 'info');
    setIsLoginTab(true); // Switch back to Sign In
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-slate-100 font-sans">
      {/* Left Column: Visual Brand Intro */}
      <div className="hidden lg:flex lg:col-span-7 bg-slate-900 border-r border-slate-800 p-12 flex-col justify-between relative overflow-hidden text-left">
        {/* Abstract Glowing Gradients */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-650/20 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/10 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-650/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="font-heading text-xl font-bold tracking-wide">
            Vendor<span className="text-indigo-400">Bridge</span>
          </span>
        </div>

        <div className="space-y-6 max-w-lg relative z-10">
          <h1 className="text-4xl font-extrabold font-heading text-white leading-tight tracking-tight">
            Procurement & Vendor Compliance ERP
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Unify your supply chain with our modern transaction matrix. Dispatch requests for quotation, compare vendor offers, verify SLA compliance, and release purchase orders seamlessly.
          </p>
          
          {/* Mock Dashboard UI Preview Cards */}
          <div className="border border-slate-800 bg-slate-950/60 p-4.5 rounded-xl space-y-3 shadow-xl backdrop-blur-sm">
            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <span className="font-mono">LEDGER ID: TXN-2026-9023</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase">Compliance Cleared</span>
            </div>
            <p className="text-xs font-semibold text-slate-200">Sumitomo Electronics Ltd. Contract Release</p>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
              <span className="text-slate-450">SLA Audit Score</span>
              <span className="font-mono font-bold text-indigo-400">98.5% A+</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 relative z-10">
          <span>&copy; 2026 VendorBridge ERP. All rights reserved. Secure bank-grade encryption enabled.</span>
        </div>
      </div>

      {/* Right Column: Authentication Form Screen */}
      <div className="col-span-1 lg:col-span-5 flex flex-col justify-center items-center p-8 sm:p-12 relative text-left">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo visible on mobile */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-6">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white shadow-md">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-heading text-lg font-bold text-white tracking-wide">
              Vendor<span className="text-indigo-400">Bridge</span>
            </span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold font-heading text-white">
              {isLoginTab ? 'Access your workspace' : 'Register your organization'}
            </h2>
            <p className="text-xs text-slate-500">
              {isLoginTab ? 'Enter your credentials to manage procurement cycles.' : 'Sign up to request supplier access credentials.'}
            </p>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setIsLoginTab(true)}
              className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer
                ${isLoginTab 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-400'
                }
              `}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLoginTab(false)}
              className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer
                ${!isLoginTab 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-400'
                }
              `}
            >
              Register Supplier
            </button>
          </div>

          {isLoginTab ? (
            /* SIGN IN FORM */
            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Work Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="procure@vendorbridge.com"
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-400">Workspace Password</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); addToast('Reset link dispatched to registered email.', 'info'); }} className="text-[10px] text-indigo-400 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">ERP Operator Role</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="Procurement Lead">Procurement Lead (Admin Demo)</option>
                    <option value="Financial Auditor">Financial Auditor / CFO</option>
                    <option value="Supplier Partner">Supplier Partner / Vendor Manager</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/10 cursor-pointer transition-all hover:shadow-indigo-650/20"
              >
                Sign In to Workspace
              </button>
            </form>
          ) : (
            /* SIGN UP REGISTER FORM */
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Company / Organization Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text"
                    value={signUpCompany}
                    onChange={(e) => setSignUpCompany(e.target.value)}
                    placeholder="Acme Electronics Ltd."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Corporate Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="sales@company.com"
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Supplier Relationship Intent</label>
                <select
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Material Supplier">Raw Material Supplier</option>
                  <option value="Logistics Service">Logistics Service Provider</option>
                  <option value="IT Equipment Contractor">IT Equipment Contractor</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/10 cursor-pointer transition-all hover:shadow-indigo-650/20"
              >
                Submit Registration Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
