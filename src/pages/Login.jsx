import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, User, Building } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Login({ onLoginSuccess }) {
  const { addToast } = useDashboard();
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In inputs
  const [email, setEmail] = useState('procure@vendorbridge.com');
  const [password, setPassword] = useState('password123');

  // Sign Up inputs
  const [name, setName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState('PROCUREMENT_OFFICER');

  // Validation state triggers (true means touched and has error)
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [signUpNameError, setSignUpNameError] = useState('');
  const [signUpEmailError, setSignUpEmailError] = useState('');
  const [signUpPasswordError, setSignUpPasswordError] = useState('');

  // Validate Email on Blur
  const validateEmail = (val, isSignUp = false) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorMsg = !emailRegex.test(val) ? 'Please enter a valid work email address.' : '';
    if (isSignUp) {
      setSignUpEmailError(errorMsg);
    } else {
      setEmailError(errorMsg);
    }
  };

  // Validate Password on Blur
  const validatePassword = (val, isSignUp = false) => {
    const errorMsg = val.length < 6 ? 'Password must be at least 6 characters in length.' : '';
    if (isSignUp) {
      setSignUpPasswordError(errorMsg);
    } else {
      setPasswordError(errorMsg);
    }
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    
    // Explicit Validation Trigger before submit
    const isEmailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordInvalid = password.length < 6;
    
    if (isEmailInvalid) setEmailError('Please enter a valid work email address.');
    if (isPasswordInvalid) setPasswordError('Password must be at least 6 characters in length.');
    
    if (isEmailInvalid || isPasswordInvalid) {
      addToast('Please correct form validation errors before signing in.', 'warning');
      return;
    }

    // Auth validation matches
    let role = 'Procurement Lead';
    if (email === 'vendor@vendorbridge.com') role = 'Vendor Supplier';
    if (email === 'manager@vendorbridge.com') role = 'Financial Manager';
    
    addToast('Authentication verified successfully.', 'success');
    onLoginSuccess({ name: 'Admin Demo', email, role });
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    
    const isNameInvalid = name.trim().length === 0;
    const isEmailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpEmail);
    const isPasswordInvalid = signUpPassword.length < 6;
    
    if (isNameInvalid) setSignUpNameError('Display name cannot be empty.');
    if (isEmailInvalid) setSignUpEmailError('Please enter a valid work email address.');
    if (isPasswordInvalid) setSignUpPasswordError('Password must be at least 6 characters in length.');
    
    if (isNameInvalid || isEmailInvalid || isPasswordInvalid) {
      addToast('Please correct form validation errors before registering.', 'warning');
      return;
    }

    addToast('Vendor registration request submitted for audit compliance.', 'info');
    setIsLoginView(true); // Switch to sign in view
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Centered Split-Card Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        
        {/* Left Side: Branding / Illustration Area */}
        <div className="md:col-span-6 bg-slate-900 border-r border-slate-800 p-8 flex flex-col justify-between text-left relative overflow-hidden">
          {/* Glowing abstract graphic */}
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-650/15 rounded-full filter blur-[100px] pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-heading text-lg font-bold tracking-wide text-white">
              Vendor<span className="text-indigo-400">Bridge</span>
            </span>
          </div>

          <div className="my-auto space-y-4 max-w-sm relative z-10 py-12 md:py-0">
            <h1 className="text-3xl font-extrabold font-heading text-white leading-tight">
              VendorBridge
            </h1>
            <p className="text-xs text-indigo-300 font-semibold tracking-wider uppercase">
              Procurement & Vendor Management ERP
            </p>
            <p className="text-slate-400 text-xs leading-relaxed mt-2">
              Verify compliance trails, dispatch quotations, evaluate bids, and route purchase order requests safely.
            </p>
          </div>

          <div className="text-[10px] text-slate-500 relative z-10">
            <span>Enterprise Ledger Access Portal &copy; 2026.</span>
          </div>
        </div>

        {/* Right Side: The Functional Form Card */}
        <div className="md:col-span-6 p-8 flex flex-col justify-center text-left">
          
          {/* Card Toggle Tab Headers */}
          <div className="flex border-b border-slate-800 mb-6 shrink-0">
            <button
              onClick={() => {
                setIsLoginView(true);
                // Clear validation states
                setEmailError('');
                setPasswordError('');
              }}
              className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer
                ${isLoginView 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-400'
                }
              `}
            >
              Login View
            </button>
            <button
              onClick={() => {
                setIsLoginView(false);
                // Clear validation states
                setSignUpNameError('');
                setSignUpEmailError('');
                setSignUpPasswordError('');
              }}
              className={`flex-1 pb-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer
                ${!isLoginView 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-400'
                }
              `}
            >
              Signup View
            </button>
          </div>

          {isLoginView ? (
            /* LOGIN FORM */
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              
              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    onBlur={(e) => validateEmail(e.target.value, false)}
                    placeholder="procure@vendorbridge.com"
                    className={`w-full pl-10 pr-4 py-2 bg-slate-950 border rounded-lg text-xs text-slate-100 placeholder-slate-650 focus:outline-none transition-all
                      ${emailError 
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' 
                        : 'border-slate-800 focus:ring-1 focus:ring-indigo-500'
                      }
                    `}
                    required
                  />
                </div>
                {emailError && (
                  <p className="text-[10px] text-rose-500 font-semibold animate-slide-in">{emailError}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-400">Password</label>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); addToast('Reset instructions dispatched to email.', 'info'); }}
                    className="text-[10px] text-indigo-400 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    onBlur={(e) => validatePassword(e.target.value, false)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2 bg-slate-950 border rounded-lg text-xs text-slate-100 placeholder-slate-650 focus:outline-none transition-all
                      ${passwordError 
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' 
                        : 'border-slate-800 focus:ring-1 focus:ring-indigo-500'
                      }
                    `}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[10px] text-rose-500 font-semibold animate-slide-in">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                Sign In to Workspace
              </button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (signUpNameError) setSignUpNameError('');
                    }}
                    onBlur={(e) => setSignUpNameError(e.target.value.trim() === '' ? 'Display name is required.' : '')}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-2 bg-slate-950 border rounded-lg text-xs text-slate-100 placeholder-slate-650 focus:outline-none transition-all
                      ${signUpNameError 
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' 
                        : 'border-slate-800 focus:ring-1 focus:ring-indigo-500'
                      }
                    `}
                    required
                  />
                </div>
                {signUpNameError && (
                  <p className="text-[10px] text-rose-500 font-semibold animate-slide-in">{signUpNameError}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => {
                      setSignUpEmail(e.target.value);
                      if (signUpEmailError) setSignUpEmailError('');
                    }}
                    onBlur={(e) => validateEmail(e.target.value, true)}
                    placeholder="sales@company.com"
                    className={`w-full pl-10 pr-4 py-2 bg-slate-950 border rounded-lg text-xs text-slate-100 placeholder-slate-650 focus:outline-none transition-all
                      ${signUpEmailError 
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' 
                        : 'border-slate-800 focus:ring-1 focus:ring-indigo-500'
                      }
                    `}
                    required
                  />
                </div>
                {signUpEmailError && (
                  <p className="text-[10px] text-rose-500 font-semibold animate-slide-in">{signUpEmailError}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => {
                      setSignUpPassword(e.target.value);
                      if (signUpPasswordError) setSignUpPasswordError('');
                    }}
                    onBlur={(e) => validatePassword(e.target.value, true)}
                    placeholder="Min 6 characters"
                    className={`w-full pl-10 pr-4 py-2 bg-slate-950 border rounded-lg text-xs text-slate-100 placeholder-slate-650 focus:outline-none transition-all
                      ${signUpPasswordError 
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' 
                        : 'border-slate-800 focus:ring-1 focus:ring-indigo-500'
                      }
                    `}
                    required
                  />
                </div>
                {signUpPasswordError && (
                  <p className="text-[10px] text-rose-500 font-semibold animate-slide-in">{signUpPasswordError}</p>
                )}
              </div>

              {/* Strict dropdown access role selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">ERP Access Role Group</label>
                <select
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
                  <option value="VENDOR">Vendor</option>
                  <option value="MANAGER">Manager / Approver</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                Create Security Account
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
