import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileCheck, 
  Printer, 
  Send, 
  Search, 
  DollarSign, 
  Clock, 
  Building,
  CreditCard,
  Download,
  AlertCircle,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function PoInvoiceGeneration() {
  const { purchaseOrders, addToast } = useDashboard();
  const [activeTab, setActiveTab] = useState('pos'); // pos, invoices
  const [selectedPoId, setSelectedPoId] = useState(
    purchaseOrders.length > 0 ? purchaseOrders[0].id : null
  );

  // Invoices mock database
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-0012', poId: 'PO-2026-0040', vendor: 'Dynatech Systems Inc.', amount: 12900.00, tax: 2322.00, total: 15222.00, dueDate: 'Jun 30, 2026', status: 'Unpaid' },
    { id: 'INV-2026-0011', poId: 'PO-2026-0039', vendor: 'Nexus Logistics & Telecom', amount: 6800.00, tax: 1224.00, total: 8024.00, dueDate: 'Jun 28, 2026', status: 'Paid' },
    { id: 'INV-2026-0010', poId: 'PO-2026-0038', vendor: 'Vickers Hydraulics Corp.', amount: 32150.00, tax: 5787.00, total: 37937.00, dueDate: 'Jul 10, 2026', status: 'Unpaid' },
    { id: 'INV-2026-0009', poId: 'PO-2026-0035', vendor: 'Dynatech Systems Inc.', amount: 8700.00, tax: 1566.00, total: 10266.00, dueDate: 'May 30, 2026', status: 'Paid' }
  ]);

  // Selected PO details
  const selectedPo = purchaseOrders.find(po => po.id === selectedPoId) || 
                      (purchaseOrders.length > 0 ? purchaseOrders[0] : null);

  const handleRegisterPayment = (invoiceId) => {
    setInvoices(prev => 
      prev.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv
      )
    );
    addToast(`Payment registered for Invoice ${invoiceId}`, 'success');
  };

  const handlePrint = (poId) => {
    addToast(`Exporting document ${poId} to print queue...`, 'info');
  };

  const handleSendSupplier = (poId, vendor) => {
    addToast(`Purchase order ${poId} dispatched to ${vendor}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Transaction Ledger</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Generate formal purchase orders and track accounts payable invoicing.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-850">
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer
              ${activeTab === 'pos'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }
            `}
          >
            <Briefcase className="h-3.5 w-3.5" />
            Purchase Orders
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer
              ${activeTab === 'invoices'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }
            `}
          >
            <FileCheck className="h-3.5 w-3.5" />
            Invoices & Ledger
          </button>
        </div>
      </div>

      {/* Tab Content: Purchase Orders */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* PO Sidebar Selector List */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 overflow-y-auto max-h-[560px] lg:col-span-1 space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Purchase Orders</h2>
            
            <div className="space-y-2">
              {purchaseOrders.map(po => {
                const isSelected = selectedPo?.id === po.id;
                return (
                  <div
                    key={po.id}
                    onClick={() => setSelectedPoId(po.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all text-left relative group
                      ${isSelected 
                        ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-950/10' 
                        : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-450">{po.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
                        ${po.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                        ${po.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : ''}
                        ${po.status === 'Fulfilled' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : ''}
                        ${po.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : ''}
                      `}>
                        {po.status}
                      </span>
                    </div>

                    <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-200 mt-2 truncate">
                      {po.subject}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{po.vendor}</p>

                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-50 dark:border-slate-800/50">
                      <span className="text-[10px] text-slate-400">{po.date}</span>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        ${po.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PO Document Preview Canvas */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
            {selectedPo ? (
              <div className="flex-grow flex flex-col h-full">
                {/* Print/Email Toolbar */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/20 dark:bg-slate-800/10 shrink-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official PO PDF Document</span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePrint(selectedPo.id)}
                      className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title="Print Requisition"
                    >
                      <Printer className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => handleSendSupplier(selectedPo.id, selectedPo.vendor)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/10 cursor-pointer transition-all"
                    >
                      <Send className="h-4 w-4" />
                      Send to Supplier
                    </button>
                  </div>
                </div>

                {/* The Invoice Document Sheet */}
                <div className="p-8 text-slate-700 dark:text-slate-350 max-h-[480px] overflow-y-auto space-y-8 relative text-left">
                  {/* Status Stamp Watermark */}
                  <div className="absolute top-24 right-12 select-none pointer-events-none transform rotate-12">
                    <span className={`inline-block border-4 px-4 py-2 text-xl font-bold uppercase tracking-widest rounded-lg opacity-25
                      ${selectedPo.status === 'Approved' ? 'border-emerald-500 text-emerald-500' : ''}
                      ${selectedPo.status === 'Pending' ? 'border-amber-500 text-amber-500' : ''}
                      ${selectedPo.status === 'Fulfilled' ? 'border-slate-500 text-slate-500' : ''}
                      ${selectedPo.status === 'Rejected' ? 'border-rose-500 text-rose-500' : ''}
                    `}>
                      {selectedPo.status}
                    </span>
                  </div>

                  {/* Header Title */}
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">Purchase Order</h2>
                      <p className="font-mono text-sm text-slate-400 font-semibold mt-1">PO Reference: {selectedPo.id}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-heading font-extrabold text-indigo-600 dark:text-indigo-400">VendorBridge</h3>
                      <p className="text-[10px] text-slate-400 mt-1">Enterprise Procurement ERP</p>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-2 gap-8 text-xs leading-relaxed">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bill & Ship To:</p>
                      <p className="font-bold text-slate-900 dark:text-white">VendorBridge Inc. - Corporate HQ</p>
                      <p className="text-slate-500">100 Technology Dr, Building 4</p>
                      <p className="text-slate-500">Austin, TX 78701, USA</p>
                      <p className="text-slate-400 mt-1">Email: finance@vendorbridge.com</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Issued Supplier Vendor:</p>
                      <p className="font-bold text-slate-900 dark:text-white">{selectedPo.vendor}</p>
                      <p className="text-slate-500">Sourced Partner Registry Database</p>
                      <p className="text-slate-400 mt-2">Delivery: Net 30 Terms</p>
                    </div>
                  </div>

                  {/* Logistics Info */}
                  <div className="grid grid-cols-4 gap-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100/50 dark:border-slate-800/20 text-xs">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">PO Date</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedPo.date}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Requested By</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{selectedPo.requester.split(' ')[0]}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Priority Urgency</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedPo.urgency}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Incoterm</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">FOB Destination</p>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Purchase Requisition Items</p>
                    
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                          <th className="py-2 text-left">Item Description</th>
                          <th className="py-2 text-center w-16">Qty</th>
                          <th className="py-2 text-right w-28">Unit Price</th>
                          <th className="py-2 text-right w-32">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        <tr>
                          <td className="py-3 font-semibold text-slate-850 dark:text-slate-200">
                            {selectedPo.subject}
                          </td>
                          <td className="py-3 text-center">1</td>
                          <td className="py-3 text-right font-mono">${selectedPo.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 text-right font-mono font-semibold">${selectedPo.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Calculation summary */}
                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-64 space-y-2.5 text-xs text-right">
                      <div className="flex justify-between text-slate-400">
                        <span>Subtotal Value:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">${selectedPo.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>GST/Tax (18%):</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">${(selectedPo.amount * 0.18).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 dark:text-white font-bold text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>Grand Total:</span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400">${(selectedPo.amount * 1.18).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center flex-grow">
                <FileSpreadsheet className="h-10 w-10 mb-3" />
                <p className="text-sm font-semibold">Select a purchase order to preview sheet document.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Invoices Ledger */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/10 flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acounts Payable Invoice Registry</h2>
            <button
              onClick={() => addToast('Exporting invoices to ledger spreadsheet...', 'info')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-350 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download Ledger
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[750px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-850 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">PO Reference</th>
                  <th className="py-3 px-4">Vendor Supplier</th>
                  <th className="py-3 px-4 text-right">Net Value</th>
                  <th className="py-3 px-4 text-right">GST Tax (18%)</th>
                  <th className="py-3 px-4 text-right">Total Invoice Billing</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-300">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-850/25 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">{inv.id}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{inv.poId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{inv.vendor}</td>
                    <td className="py-3.5 px-4 text-right font-mono">${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400">${inv.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">${inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3.5 px-4">{inv.dueDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold uppercase text-[9px]
                        ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}
                      `}>
                        <span className={`h-1 w-1 rounded-full ${inv.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {inv.status === 'Unpaid' ? (
                        <button
                          onClick={() => handleRegisterPayment(inv.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-[10px] shadow-sm hover:shadow cursor-pointer transition-all"
                        >
                          <CreditCard className="h-3 w-3" />
                          Pay Invoice
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                          ✓ Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
