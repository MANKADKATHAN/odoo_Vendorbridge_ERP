import React, { useState } from 'react';
import { 
  FileCheck, 
  Check, 
  X, 
  Search, 
  Clock, 
  User, 
  Building, 
  FileText,
  DollarSign,
  AlertCircle,
  CornerDownRight,
  MessageSquare
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import WorkflowTracker from '../components/WorkflowTracker';

export default function ApprovalWorkflow() {
  const { approvals, approveRequest, rejectRequest, addToast } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // pending, history
  const [selectedApprovalId, setSelectedApprovalId] = useState(
    approvals.length > 0 ? approvals[0].id : null
  );
  const [comment, setComment] = useState('');
  const [approvalHistory, setApprovalHistory] = useState([
    {
      id: 'APP-9018',
      type: 'Purchase Order Approval',
      targetId: 'PO-2026-0035',
      item: 'Server Storage Hard Drives',
      vendor: 'Dynatech Systems Inc.',
      requester: 'Elena Rostova (Operations)',
      amount: 8700.00,
      date: 'May 12, 2026',
      status: 'Approved',
      reviewerComment: 'Fully within quarterly budget guidelines.'
    },
    {
      id: 'APP-9019',
      type: 'Vendor Compliance Authorization',
      targetId: 'VEN-0082',
      item: 'Onboard: Apex Alloys Corp.',
      vendor: 'Apex Alloys Corp.',
      requester: 'Marcus Brody (Procurement)',
      amount: 0,
      date: 'May 14, 2026',
      status: 'Approved',
      reviewerComment: 'GST compliance verified, bank details matched.'
    },
    {
      id: 'APP-9020',
      type: 'Purchase Order Approval',
      targetId: 'PO-2026-0036',
      item: 'Heavy Duty Machinery Engine Parts',
      vendor: 'Vickers Hydraulics Corp.',
      requester: 'Sarah Jenkins (Production)',
      amount: 145000.00,
      date: 'May 18, 2026',
      status: 'Rejected',
      reviewerComment: 'Amount exceeds immediate capital expenditure limit. Split into phased purchase orders.'
    }
  ]);

  // Handle selected item fallback
  const allCurrentApprovals = activeTab === 'pending' ? approvals : approvalHistory;
  
  const selectedApproval = allCurrentApprovals.find(a => a.id === selectedApprovalId) || 
                           (allCurrentApprovals.length > 0 ? allCurrentApprovals[0] : null);

  const filteredApprovals = allCurrentApprovals.filter(a => 
    a.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id) => {
    if (!id) return;
    
    if (activeTab === 'pending') {
      const appItem = approvals.find(a => a.id === id);
      approveRequest(id);
      
      // Move to history
      setApprovalHistory(prev => [
        {
          ...appItem,
          status: 'Approved',
          reviewerComment: comment || 'Approved with default confirmation.'
        },
        ...prev
      ]);
    }
    
    setComment('');
    addToast(`Approved request ${id}`, 'success');
  };

  const handleReject = (id) => {
    if (!id) return;
    
    if (activeTab === 'pending') {
      const appItem = approvals.find(a => a.id === id);
      rejectRequest(id);
      
      // Move to history
      setApprovalHistory(prev => [
        {
          ...appItem,
          status: 'Rejected',
          reviewerComment: comment || 'Rejected. Action requires revision.'
        },
        ...prev
      ]);
    }
    
    setComment('');
    addToast(`Rejected request ${id}`, 'warning');
  };

  return (
    <div className="space-y-6">
      {/* Workflow Progress Tracker */}
      <WorkflowTracker currentStep={4} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Approval Workflow Inbox</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Review pending requisitions, verify compliance parameters, and release purchase orders.</p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch min-h-[580px]">
        {/* Left Side: Inbox List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden lg:col-span-1">
          {/* Tabs header */}
          <div className="flex border-b border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => {
                setActiveTab('pending');
                setSelectedApprovalId(approvals.length > 0 ? approvals[0].id : null);
              }}
              className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer
                ${activeTab === 'pending' 
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }
              `}
            >
              Pending ({approvals.length})
            </button>
            <button 
              onClick={() => {
                setActiveTab('history');
                setSelectedApprovalId(approvalHistory.length > 0 ? approvalHistory[0].id : null);
              }}
              className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer
                ${activeTab === 'history' 
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }
              `}
            >
              History ({approvalHistory.length})
            </button>
          </div>

          {/* Search box */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search inbox..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-150 dark:border-slate-800 rounded-md text-xs bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* List content */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 max-h-[460px]">
            {filteredApprovals.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No approval entries found in this queue.
              </div>
            ) : (
              filteredApprovals.map(approval => {
                const isSelected = selectedApproval?.id === approval.id;
                return (
                  <div 
                    key={approval.id}
                    onClick={() => setSelectedApprovalId(approval.id)}
                    className={`p-3.5 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-850/20 transition-all text-left
                      ${isSelected ? 'bg-indigo-50/20 dark:bg-indigo-950/15 border-l-4 border-indigo-500 pl-2.5' : 'border-l-4 border-transparent'}
                    `}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">{approval.id}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{approval.date}</span>
                    </div>
                    
                    <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate mt-1">
                      {approval.item}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{approval.vendor}</p>

                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                      <span className="text-[10px] font-semibold text-slate-500">{approval.type.split(' ')[0]}</span>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        {approval.amount > 0 ? `$${approval.amount.toLocaleString()}` : '—'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Requisition Details */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
          {selectedApproval ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/20 dark:bg-slate-800/10 shrink-0">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-400">{selectedApproval.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                      {selectedApproval.type}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">{selectedApproval.item}</h2>
                </div>

                {activeTab === 'pending' ? (
                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    <button 
                      onClick={() => handleReject(selectedApproval.id)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-250 dark:border-slate-800 hover:border-rose-500 bg-transparent text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-450 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                    <button 
                      onClick={() => handleApprove(selectedApproval.id)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/10 cursor-pointer hover:shadow-indigo-600/25 transition-all"
                    >
                      <Check className="h-4 w-4" />
                      Approve & Release
                    </button>
                  </div>
                ) : (
                  <div className="shrink-0">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                      ${selectedApproval.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}
                    `}>
                      {selectedApproval.status === 'Approved' ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      {selectedApproval.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Scrollable details */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[380px] text-left">
                {/* Info block cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100/50 dark:border-slate-800/30 flex items-center gap-3">
                    <Building className="h-4 w-4 text-slate-400 shrink-0" />
                    <div className="truncate text-left">
                      <p className="text-[10px] text-slate-400">Supplier Vendor</p>
                      <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">{selectedApproval.vendor}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100/50 dark:border-slate-800/30 flex items-center gap-3">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    <div className="truncate text-left">
                      <p className="text-[10px] text-slate-400">Requisition Owner</p>
                      <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">{selectedApproval.requester}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100/50 dark:border-slate-800/30 flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-slate-400 shrink-0" />
                    <div className="truncate text-left">
                      <p className="text-[10px] text-slate-400">Total Value</p>
                      <p className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {selectedApproval.amount > 0 ? `$${selectedApproval.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 text-left">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Comments & Justification</h4>
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {selectedApproval.details || 'No justification narrative attached.'}
                  </div>
                </div>

                {/* Visual Workflow timeline */}
                <div className="space-y-3 text-left">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approval Routing Timeline</h4>
                  
                  <div className="relative pl-6 space-y-4 border-l border-slate-200 dark:border-slate-850 ml-2">
                    {/* Step 1: Draft */}
                    <div className="relative">
                      <span className="absolute -left-[30px] top-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white font-bold text-[9px]">
                        ✓
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Requisition Initiated</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Submitted by {selectedApproval.requester} on {selectedApproval.date}</p>
                    </div>

                    {/* Step 2: Policy check */}
                    <div className="relative">
                      <span className="absolute -left-[30px] top-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white font-bold text-[9px]">
                        ✓
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Compliance Verification</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Automated policy checks passed: Budget allocation confirmed, Vendor audit compliance OK.</p>
                    </div>

                    {/* Step 3: Current Supervisor Review */}
                    <div className="relative">
                      {activeTab === 'pending' ? (
                        <span className="absolute -left-[30px] top-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-indigo-500 text-white font-bold text-[10px] animate-pulse">
                          ●
                        </span>
                      ) : (
                        <span className={`absolute -left-[30px] top-0.5 flex items-center justify-center w-4 h-4 rounded-full text-white font-bold text-[9px]
                          ${selectedApproval.status === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'}
                        `}>
                          {selectedApproval.status === 'Approved' ? '✓' : '✗'}
                        </span>
                      )}
                      <p className="text-xs font-semibold text-slate-850 dark:text-white">Supervisor Review Queue</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">
                        {activeTab === 'pending' 
                          ? 'Awaiting validation from Admin Demo (Procurement Lead).'
                          : `Reviewed by Admin Demo. Comment: "${selectedApproval.reviewerComment}"`
                        }
                      </p>
                    </div>

                    {/* Step 4: Executive release */}
                    <div className="relative">
                      <span className="absolute -left-[30px] top-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold text-[9px]">
                        4
                      </span>
                      <p className="text-xs font-semibold text-slate-400">Executive Release Approval</p>
                      <p className="text-[10px] text-slate-400/80 mt-0.5">Required for requisitions exceeding $100,000. Under threshold: Auto-bypass enabled.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Comment Box (Only for Pending) */}
              {activeTab === 'pending' && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 space-y-3 shrink-0">
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <textarea 
                      rows="2"
                      placeholder="Add an evaluation note or reason for rejection (optional)..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12">
              <FileCheck className="h-12 w-12 text-slate-350 dark:text-slate-650 mb-3" />
              <p className="text-sm font-semibold">Select an approval requisition entry from list view to show details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
