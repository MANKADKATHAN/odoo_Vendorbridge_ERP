import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function AddVendorModal({ isOpen, onClose }) {
  const { addVendor } = useDashboard();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electrical Components');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [taxId, setTaxId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addVendor({
      name,
      category,
      contactName,
      email,
      taxId
    });

    // Reset and close
    setName('');
    setCategory('Electrical Components');
    setContactName('');
    setEmail('');
    setTaxId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      
      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <UserPlus className="h-5 w-5" />
            </div>
            <h3 className="text-base font-heading font-bold text-slate-800 m-0">Onboard Supplier</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Vendor / Supplier Legal Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex Industrial Solutions Inc."
              className="w-full px-3.5 py-2 text-sm text-slate-800 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Vendor Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-slate-800 border border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all"
              >
                <option value="Electrical Components">Electrical Components</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="IT Hardware">IT Hardware</option>
                <option value="Mechanical Equipment">Mechanical Equipment</option>
                <option value="Scientific Instruments">Scientific Instruments</option>
                <option value="Logistics / Services">Logistics / Services</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Tax Identification Number
              </label>
              <input
                type="text"
                required
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="e.g. US-89-029410A"
                className="w-full px-3.5 py-2 text-sm text-slate-800 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Primary Contact Name
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Johnathan Smith"
                className="w-full px-3.5 py-2 text-sm text-slate-800 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Primary Contact Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. j.smith@apexindustrial.com"
                className="w-full px-3.5 py-2 text-sm text-slate-800 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow-indigo-600/10 transition-colors"
            >
              Register Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
