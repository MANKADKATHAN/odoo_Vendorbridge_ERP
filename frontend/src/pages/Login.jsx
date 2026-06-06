import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, User, Building, Phone, Globe, Info } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Login({ onLoginSuccess }) {
  const { addToast } = useDashboard();
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In inputs
  const [email, setEmail] = useState('procure@vendorbridge.com');
  const [password, setPassword] = useState('password123');

  // Sign Up inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [signUpRole, setSignUpRole] = useState('PROCUREMENT_OFFICER');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [signUpFirstNameError, setSignUpFirstNameError] = useState('');
  const [signUpLastNameError, setSignUpLastNameError] = useState('');
  const [signUpEmailError, setSignUpEmailError] = useState('');
  const [signUpPasswordError, setSignUpPasswordError] = useState('');

  const validateEmail = (val, isSignUp = false) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorMsg = !emailRegex.test(val) ? 'Please enter a valid work email address.' : '';
    if (isSignUp) {
      setSignUpEmailError(errorMsg);
    } else {
      setEmailError(errorMsg);
    }
  };

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
    const isEmailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordInvalid = password.length < 6;
    
    if (isEmailInvalid) setEmailError('Please enter a valid work email address.');
    if (isPasswordInvalid) setPasswordError('Password must be at least 6 characters in length.');
    
    if (isEmailInvalid || isPasswordInvalid) {
      addToast('Please correct form validation errors before signing in.', 'warning');
      return;
    }

    let role = 'Procurement Lead';
    if (email === 'vendor@vendorbridge.com') role = 'Vendor Supplier';
    if (email === 'manager@vendorbridge.com') role = 'Financial Manager';
    
    addToast('Authentication verified successfully.', 'success');
    onLoginSuccess({ name: 'Admin Demo', email, role });
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    const isFirstNameInvalid = firstName.trim().length === 0;
    const isLastNameInvalid = lastName.trim().length === 0;
    const isEmailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpEmail);
    const isPasswordInvalid = signUpPassword.length < 6;
    
    if (isFirstNameInvalid) setSignUpFirstNameError('First name is required.');
    if (isLastNameInvalid) setSignUpLastNameError('Last name is required.');
    if (isEmailInvalid) setSignUpEmailError('Please enter a valid work email address.');
    if (isPasswordInvalid) setSignUpPasswordError('Password must be at least 6 characters in length.');
    
    if (isFirstNameInvalid || isLastNameInvalid || isEmailInvalid || isPasswordInvalid) {
      addToast('Please correct form validation errors before registering.', 'warning');
      return;
    }

    addToast('Supplier registration submitted successfully. Approvals pending.', 'success');
    setIsLoginView(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Centered Split-Card Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        
        {/* Left Side: Branding / Illustration Area */}
        <div className="md:col-span-5 bg-slate-900 border-r border-slate-800 p-8 flex flex-col justify-between text-left relative overflow-hidden">
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/15 rounded-full filter blur-[100px] pointer-events-none" />
          
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
        <div className="md:col-span-7 p-8 flex flex-col justify-center text-left">
          
          {/* Card Toggle Tab Headers */}
          <div className="flex border-b border-slate-800 mb-6 shrink-0">
            <button
              onClick={() => {
                setIsLoginView(true);
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
                setSignUpFirstNameError('');
                setSignUpLastNameError('');
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
              
              {/* Photo Avatar Placeholder Circle */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full border-2 border-slate-800 bg-slate-950 flex items-center justify-center text-slate-500 text-xs font-semibold uppercase">
                  Photo
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="email"
                    id="login-email"
                    name="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    onBlur={(e) => validateEmail(e.target.value, false)}
                    placeholder="procure@vendorbridge.com"
                    className={`w-full pl-10 pr-4 py-2 bg-slate-955 border rounded-lg text-xs text-slate-100 placeholder-slate-655 focus:outline-none transition-all
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
                    id="login-password"
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    onBlur={(e) => validatePassword(e.target.value, false)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2 bg-slate-955 border rounded-lg text-xs text-slate-100 placeholder-slate-655 focus:outline-none transition-all
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
            /* SIGNUP REGISTRATION FORM - Matching Screen 2 */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">

              {/* Grid: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input 
                      type="text"
                      id="signup-first-name"
                      name="firstName"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (signUpFirstNameError) setSignUpFirstNameError('');
                      }}
                      onBlur={(e) => setSignUpFirstNameError(e.target.value.trim() === '' ? 'First name is required.' : '')}
                      placeholder="Jane"
                      className={`w-full pl-10 pr-4 py-1.5 bg-slate-955 border rounded-lg text-xs text-slate-100 placeholder-slate-655 focus:outline-none transition-all
                        ${signUpFirstNameError 
                          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' 
                          : 'border-slate-800 focus:ring-1 focus:ring-indigo-500'
                        }
                      `}
                      required
                    />
                  </div>
                  {signUpFirstNameError && (
                    <p className="text-[10px] text-rose-500 font-semibold animate-slide-in">{signUpFirstNameError}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input 
                      type="text"
                      id="signup-last-name"
                      name="lastName"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (signUpLastNameError) setSignUpLastNameError('');
                      }}
                      onBlur={(e) => setSignUpLastNameError(e.target.value.trim() === '' ? 'Last name is required.' : '')}
                      placeholder="Doe"
                      className={`w-full pl-10 pr-4 py-1.5 bg-slate-955 border rounded-lg text-xs text-slate-100 placeholder-slate-655 focus:outline-none transition-all
                        ${signUpLastNameError 
                          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' 
                          : 'border-slate-800 focus:ring-1 focus:ring-indigo-500'
                        }
                      `}
                      required
                    />
                  </div>
                  {signUpLastNameError && (
                    <p className="text-[10px] text-rose-500 font-semibold animate-slide-in">{signUpLastNameError}</p>
                  )}
                </div>
              </div>

              {/* Grid: Email Address & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input 
                      type="email"
                      id="signup-email"
                      name="email"
                      autoComplete="email"
                      value={signUpEmail}
                      onChange={(e) => {
                        setSignUpEmail(e.target.value);
                        if (signUpEmailError) setSignUpEmailError('');
                      }}
                      onBlur={(e) => validateEmail(e.target.value, true)}
                      placeholder="jane.doe@company.com"
                      className={`w-full pl-10 pr-4 py-1.5 bg-slate-955 border rounded-lg text-xs text-slate-100 placeholder-slate-655 focus:outline-none transition-all
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

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input 
                      type="tel"
                      id="signup-phone"
                      name="phone"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 0199"
                      className="w-full pl-10 pr-4 py-1.5 bg-slate-955 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Grid: Role Selection & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Role Access</label>
                  <select
                    id="signup-role"
                    name="role"
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-955 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
                    <option value="VENDOR">Vendor</option>
                    <option value="MANAGER">Manager / Approver</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input 
                      type="text"
                      id="signup-country"
                      name="country"
                      autoComplete="country-name"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India"
                      className="w-full pl-10 pr-4 py-1.5 bg-slate-955 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input 
                    type="password"
                    id="signup-password"
                    name="password"
                    autoComplete="new-password"
                    value={signUpPassword}
                    onChange={(e) => {
                      setSignUpPassword(e.target.value);
                      if (signUpPasswordError) setSignUpPasswordError('');
                    }}
                    onBlur={(e) => validatePassword(e.target.value, true)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-1.5 bg-slate-955 border rounded-lg text-xs text-slate-100 placeholder-slate-655 focus:outline-none transition-all
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

              {/* Additional Information Textarea */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Additional Information</label>
                <div className="relative">
                  <Info className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-500" />
                  <textarea 
                    rows="2"
                    id="signup-additional-info"
                    name="additionalInfo"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Enter compliance details or registration notes..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-955 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                Register
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
