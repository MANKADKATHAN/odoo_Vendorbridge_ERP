import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Search, Eye, ArrowUpDown, SlidersHorizontal } from 'lucide-react';

export default function RecentOrdersTable({ onViewDetails }) {
  const { purchaseOrders } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Toggle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter & Search POs
  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch = 
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || po.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort POs
  const sortedPOs = [...filteredPOs].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'amount') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    
    if (sortField === 'date') {
      return sortAsc 
        ? new Date(aVal) - new Date(bVal) 
        : new Date(bVal) - new Date(aVal);
    }

    aVal = aVal.toString().toLowerCase();
    bVal = bVal.toString().toLowerCase();
    
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/50">
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/50">
            Pending
          </span>
        );
      case 'Fulfilled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            Fulfilled
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/50">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200/50">
            {status}
          </span>
        );
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'High':
        return <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">HIGH</span>;
      case 'Medium':
        return <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">MED</span>;
      default:
        return <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">LOW</span>;
    }
  };

  const filters = ['All', 'Pending', 'Approved', 'Fulfilled'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Table Header Section */}
      <div className="p-5 border-b border-slate-100 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-heading font-bold text-slate-800 m-0">Recent Purchase Orders</h2>
            <p className="text-xs text-slate-400">Track states, details, and delivery validation of generated POs</p>
          </div>
          
          {/* Status Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 border border-slate-200/50 rounded-xl max-w-max self-start sm:self-auto">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 focus:outline-none
                  ${statusFilter === f 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Utility Bar */}
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, item, or vendor..."
              className="w-full pl-9 pr-4 py-2 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3.5 whitespace-nowrap">Order ID</th>
              <th className="px-5 py-3.5 whitespace-nowrap min-w-[200px]">Item Description</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Vendor</th>
              <th className="px-5 py-3.5 whitespace-nowrap cursor-pointer hover:bg-slate-100/50 hover:text-slate-600 transition-colors" onClick={() => handleSort('amount')}>
                <div className="flex items-center gap-1.5">
                  Amount <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th className="px-5 py-3.5 whitespace-nowrap cursor-pointer hover:bg-slate-100/50 hover:text-slate-600 transition-colors" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1.5">
                  Date <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th className="px-5 py-3.5 whitespace-nowrap">Status</th>
              <th className="px-5 py-3.5 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {sortedPOs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-medium bg-slate-50/10">
                  No purchase orders found matching current criteria.
                </td>
              </tr>
            ) : (
              sortedPOs.map((po) => (
                <tr 
                  key={po.id}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => onViewDetails(po)}
                >
                  <td className="px-5 py-4 font-bold text-slate-800 font-heading whitespace-nowrap">
                    {po.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {po.subject}
                      </span>
                      <div className="flex items-center gap-2">
                        {getUrgencyBadge(po.urgency)}
                        <span className="text-[10px] text-slate-400">By {po.requester.split(' ')[0]}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">
                    {po.vendor}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-700 whitespace-nowrap">
                    ${po.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                    {po.date}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {getStatusBadge(po.status)}
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onViewDetails(po)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100/50"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
