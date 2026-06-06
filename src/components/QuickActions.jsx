import React from 'react';
import { FilePlus2, UserPlus, Receipt } from 'lucide-react';

export default function QuickActions({ onCreateRFQ, onAddVendor, onGeneratePO }) {
  const actions = [
    {
      label: 'Create New RFQ',
      description: 'Request pricing & bids from certified vendors',
      icon: FilePlus2,
      colorClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20',
      iconBg: 'bg-indigo-500',
      onClick: onCreateRFQ
    },
    {
      label: 'Add Vendor',
      description: 'Register and validate a new supplier',
      icon: UserPlus,
      colorClass: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-slate-100',
      iconBg: 'bg-slate-100 text-slate-600',
      onClick: onAddVendor
    },
    {
      label: 'Generate PO',
      description: 'Issue a formal Purchase Order to a vendor',
      icon: Receipt,
      colorClass: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-slate-100',
      iconBg: 'bg-slate-100 text-slate-600',
      onClick: onGeneratePO
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-heading font-bold text-slate-800 m-0">Procurement Command Center</h2>
          <p className="text-xs text-slate-400">Launch standard operational workflows and document generation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={act.onClick}
              className={`flex items-start gap-4 p-4 rounded-xl text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:translate-y-0 ${act.colorClass}`}
            >
              <div className={`p-2.5 rounded-lg shrink-0 ${act.iconBg} ${act.label.includes('Create') ? 'text-white' : ''}`}>
                <Icon className="h-5 w-5 shrink-0" />
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-bold truncate tracking-tight">{act.label}</span>
                <span className={`block text-[11px] mt-0.5 leading-snug line-clamp-2 ${act.label.includes('Create') ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {act.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
