import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  Check, 
  X, 
  FileSignature, 
  FileText, 
  UserPlus, 
  AlertCircle,
  Inbox
} from 'lucide-react';

export default function PendingApprovalsList() {
  const { approvals, approveRequest, rejectRequest } = useDashboard();

  const getApprovalIcon = (type) => {
    switch (type) {
      case 'Purchase Order Approval':
        return <FileText className="h-5 w-5 text-indigo-600" />;
      case 'Vendor Compliance Authorization':
        return <UserPlus className="h-5 w-5 text-sky-600" />;
      case 'RFQ Awarding Permission':
        return <FileSignature className="h-5 w-5 text-emerald-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-slate-600" />;
    }
  };

  const getApprovalBg = (type) => {
    switch (type) {
      case 'Purchase Order Approval':
        return 'bg-indigo-50 border-indigo-100';
      case 'Vendor Compliance Authorization':
        return 'bg-sky-50 border-sky-100';
      case 'RFQ Awarding Permission':
        return 'bg-emerald-50 border-emerald-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-heading font-bold text-slate-800 m-0">Pending Approvals</h2>
            <p className="text-xs text-slate-400">Items requiring your urgent operational authorization</p>
          </div>
          <span className="bg-amber-100 text-amber-800 font-bold text-xs px-2 py-0.5 rounded-full">
            {approvals.length} Urgent
          </span>
        </div>
      </div>

      {/* List content */}
      <div className="flex-1 p-5 overflow-y-auto divide-y-0 space-y-4 scrollbar-none bg-slate-50/20">
        {approvals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center h-full">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mb-3.5 shadow-sm">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">All caught up!</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">No pending procurement approvals require action.</p>
          </div>
        ) : (
          approvals.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 group"
            >
              {/* Top row: icon and info */}
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border ${getApprovalBg(app.type)}`}>
                  {getApprovalIcon(app.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">{app.type}</span>
                  <h4 className="text-sm font-bold text-slate-800 truncate leading-snug group-hover:text-indigo-600 transition-colors mt-0.5">
                    {app.item}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Vendor: <span className="font-semibold text-slate-700">{app.vendor}</span>
                  </p>
                </div>
              </div>

              {/* Middle row: request details */}
              <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-2.5 text-[11px] text-slate-600 leading-relaxed font-medium">
                {app.details}
              </div>

              {/* Metrics & requester row */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2.5">
                <div>
                  Requested by <span className="font-semibold text-slate-600">{app.requester}</span>
                </div>
                {app.amount > 0 && (
                  <div className="text-xs font-extrabold text-slate-700">
                    ${app.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => rejectRequest(app.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 hover:bg-rose-50/50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 active:scale-98"
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </button>
                <button
                  onClick={() => approveRequest(app.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow-indigo-600/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-98"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
