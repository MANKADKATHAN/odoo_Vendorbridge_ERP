import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  FileText, 
  UserPlus, 
  CheckCircle, 
  AlertTriangle, 
  Cpu, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function ActivityLogs() {
  const { addToast } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedLogId, setExpandedLogId] = useState(null);

  const filters = ['All', 'Purchases', 'Vendor Registry', 'RFQ Triggers', 'Approval Actions', 'System Audit'];

  // Mock activity logs database
  const [logs, setLogs] = useState([
    {
      id: 'LOG-88021',
      category: 'Approval Actions',
      event: 'Purchase Order Approved',
      user: 'Admin Demo',
      role: 'Procurement Lead',
      details: 'Approved PO-2026-0042 (120x ARM Cortex-M4 Microcontrollers) for Sumitomo Electronics Ltd. value $18,450.00',
      timestamp: 'Jun 06, 2026 10:42 AM',
      ip: '192.168.1.104',
      meta: { approvalId: 'APP-9021', reviewer: 'Admin Demo', approvalTime: '2026-06-06T10:42:00Z', policyPassed: true }
    },
    {
      id: 'LOG-88020',
      category: 'RFQ Triggers',
      event: 'RFQ Invitation Sent',
      user: 'Admin Demo',
      role: 'Procurement Lead',
      details: 'Dispatched bidding invitations for RFQ-2026-012 (Bulk Copper Wiring) to Apex Alloys Corp. and Nexus Logistics.',
      timestamp: 'Jun 06, 2026 10:20 AM',
      ip: '192.168.1.104',
      meta: { rfqId: 'RFQ-2026-012', invitedVendors: ['VEN-0002', 'VEN-0004'], mailerServiceStatus: 'Delivered' }
    },
    {
      id: 'LOG-88019',
      category: 'Vendor Registry',
      event: 'Vendor Compliance Verified',
      user: 'System Security Validator',
      role: 'System Job',
      details: 'Automated GSTIN compliance verification passed for newly onboarded Vendor: Summit Logistics Services.',
      timestamp: 'Jun 05, 2026 04:15 PM',
      ip: '10.0.8.21',
      meta: { vendorId: 'VEN-0098', gstInwardHash: 'a5e9f88c321d21ef', validationService: 'GSTN-API-V2' }
    },
    {
      id: 'LOG-88018',
      category: 'Purchases',
      event: 'Purchase Order Drafted',
      user: 'Elena Rostova',
      role: 'Operations Administrator',
      details: 'Created draft Purchase Order PO-2026-0040 for Enterprise Server Chassis.',
      timestamp: 'Jun 02, 2026 09:30 AM',
      ip: '192.168.1.112',
      meta: { poId: 'PO-2026-0040', totalAmount: 12900.00, itemsCount: 1 }
    },
    {
      id: 'LOG-88017',
      category: 'System Audit',
      event: 'Database Checkpoint Created',
      user: 'DB Maintenance Service',
      role: 'System Job',
      details: 'Daily database backup and replication completed successfully to regional AWS cloud storage container.',
      timestamp: 'Jun 01, 2026 12:00 AM',
      ip: '10.0.1.5',
      meta: { backupSize: '412 MB', latencyMs: 245, checksum: 'sha256:88fb82101' }
    },
    {
      id: 'LOG-88016',
      category: 'Approval Actions',
      event: 'Requisition Rejected',
      user: 'Admin Demo',
      role: 'Procurement Lead',
      details: 'Rejected PO-2026-0036 engine parts request due to capital expenditure constraints. Comment: Split into phases.',
      timestamp: 'May 18, 2026 02:45 PM',
      ip: '192.168.1.104',
      meta: { poId: 'PO-2026-0036', capExLimit: 100000.00, requisitionAmount: 145000.00 }
    }
  ]);

  const toggleExpandLog = (id) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const getLogIcon = (category) => {
    switch (category) {
      case 'Purchases':
        return <FileText className="h-4 w-4 text-indigo-500" />;
      case 'Vendor Registry':
        return <UserPlus className="h-4 w-4 text-emerald-500" />;
      case 'RFQ Triggers':
        return <History className="h-4 w-4 text-blue-500" />;
      case 'Approval Actions':
        return <CheckCircle className="h-4 w-4 text-amber-500" />;
      case 'System Audit':
        return <Cpu className="h-4 w-4 text-slate-500" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-indigo-500" />;
    }
  };

  // Filter logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.event.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'All' || log.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleExportLogs = () => {
    try {
      const jsonString = JSON.stringify(logs, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `vendorbridge_audit_trail_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast('Audit logs database successfully exported to JSON format.', 'success');
    } catch (err) {
      addToast('Export failed: ' + err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">System Audit Trail</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Verifiable logging ledger of all transactions, compliance checks, and approval actions.</p>
        </div>
        
        <button
          onClick={handleExportLogs}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <Download className="h-4 w-4" />
          Export Audit Trail
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search audit trail by event description or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {filters.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all
                ${activeFilter === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
        <div className="relative border-l border-slate-100 dark:border-slate-800/80 ml-3 pl-8 space-y-6">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
              No audit logs matched your query.
            </div>
          ) : (
            filteredLogs.map(log => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div key={log.id} className="relative group text-left">
                  {/* Category icon node */}
                  <span className="absolute -left-[44px] top-0.5 flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 shadow-sm shrink-0">
                    {getLogIcon(log.category)}
                  </span>

                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white hover:text-indigo-600 cursor-pointer" onClick={() => toggleExpandLog(log.id)}>
                          {log.event}
                        </span>
                        <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                          {log.id}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-350" />
                        {log.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed max-w-3xl">
                      {log.details}
                    </p>

                    {/* Metadata Header line */}
                    <div className="flex items-center gap-4 pt-1 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {log.user} ({log.role})
                      </span>
                      <span className="font-mono">IP: {log.ip}</span>
                      <button 
                        onClick={() => toggleExpandLog(log.id)}
                        className="flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        {isExpanded ? (
                          <>Hide Metadata <ChevronUp className="h-3 w-3" /></>
                        ) : (
                          <>Show Metadata <ChevronDown className="h-3 w-3" /></>
                        )}
                      </button>
                    </div>

                    {/* Expanded JSON payload wrapper */}
                    {isExpanded && (
                      <div className="mt-3 p-4 bg-slate-950 rounded-lg border border-slate-900 text-[10px] font-mono text-indigo-300 overflow-x-auto max-w-xl animate-slide-in">
                        <p className="text-slate-500 mb-1">// Event transaction trace payload metadata</p>
                        <pre>{JSON.stringify(log.meta, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
