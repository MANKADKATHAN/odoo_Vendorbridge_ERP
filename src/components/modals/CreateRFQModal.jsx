import React, { useState } from 'react';
import { X, FileSpreadsheet } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function CreateRFQModal({ isOpen, onClose }) {
  const { createRFQ } = useDashboard();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Electrical Components');
  const [closeDate, setCloseDate] = useState('2026-06-20');
  const [scope, setScope] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    createRFQ({
      subject,
      category,
      closeDate: new Date(closeDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      scope
    });

    // Reset form and close
    setSubject('');
    setCategory('Electrical Components');
    setCloseDate('2026-06-20');
    setScope('');
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
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="text-base font-heading font-bold text-slate-800 m-0">Create Request for Quotation</h3>
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
              RFQ Subject / Item Name
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. 500m Fiber Optic Multi-Mode Cabling"
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
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Bid Submission Close Date
              </label>
              <input
                type="date"
                required
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-slate-800 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Technical Specifications / Scope (Optional)
            </label>
            <textarea
              rows={3}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="Provide detail specifications, certifications required, delivery terms..."
              className="w-full px-3.5 py-2 text-sm text-slate-800 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all resize-none"
            />
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
              Publish RFQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
