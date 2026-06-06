import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Send, 
  Save, 
  Calendar, 
  Building, 
  Clock, 
  DollarSign, 
  HelpCircle,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function VendorQuoteSubmission() {
  const { rfqs, addToast } = useDashboard();
  const [selectedRfqId, setSelectedRfqId] = useState('RFQ-2026-012');
  const [deliveryDays, setDeliveryDays] = useState(7);
  const [notes, setNotes] = useState('');
  
  // Custom items list mapped to RFQs
  const rfqItemsMap = {
    'RFQ-2026-012': [
      { id: 101, name: '10 AWG Copper Grounding Wire (Green)', qty: 1000, unit: 'Meters', defaultPrice: 4.5 },
      { id: 102, name: 'Heavy Duty 3-Phase Core Cable 16mm', qty: 250, unit: 'Meters', defaultPrice: 45.0 }
    ],
    'RFQ-2026-013': [
      { id: 201, name: 'Samsung 990 Pro 2TB NVMe PCIe 4.0 SSD', qty: 50, unit: 'Units', defaultPrice: 130.0 }
    ],
    'RFQ-2026-014': [
      { id: 301, name: 'SMC Pneumatic Solenoid Valve 24VDC', qty: 15, unit: 'Units', defaultPrice: 120.0 }
    ]
  };

  const selectedRfq = rfqs.find(r => r.id === selectedRfqId) || rfqs[0];
  const [items, setItems] = useState([]);

  // Initialize/Update items when selected RFQ changes
  useEffect(() => {
    const defaultItems = rfqItemsMap[selectedRfqId] || [];
    // Initialize unit price inputs to empty or default
    setItems(defaultItems.map(item => ({
      ...item,
      unitPrice: ''
    })));
  }, [selectedRfqId]);

  const handlePriceChange = (itemId, val) => {
    // Sanitize non-negative decimals
    const numericVal = val === '' ? '' : Math.max(0, parseFloat(val) || 0);
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, unitPrice: val === '' ? '' : numericVal } : item
    ));
  };

  // Subtotal Calculation
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.unitPrice) || 0;
      return sum + (price * item.qty);
    }, 0);
  };

  const handleSaveDraft = () => {
    addToast(`Quotation draft saved for ${selectedRfqId}`, 'info');
  };

  const handleSubmitQuotation = (e) => {
    e.preventDefault();
    if (items.some(item => item.unitPrice === '')) {
      addToast('Please enter unit prices for all line items before submitting.', 'warning');
      return;
    }
    if (!deliveryDays || deliveryDays <= 0) {
      addToast('Please input a valid delivery timeline.', 'warning');
      return;
    }

    const subtotal = calculateSubtotal();
    addToast(`Quotation of $${subtotal.toLocaleString()} submitted successfully for ${selectedRfqId}!`, 'success');
    
    // Clear inputs or reset form
    setItems(items.map(item => ({ ...item, unitPrice: '' })));
    setNotes('');
    setDeliveryDays(7);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Quotation Submission Desk</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">As a vendor, provide pricing proposals and estimated delivery lead times for active RFQs.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select RFQ:</span>
          <select 
            value={selectedRfqId}
            onChange={(e) => setSelectedRfqId(e.target.value)}
            className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
          >
            {rfqs.map(rfq => (
              <option key={rfq.id} value={rfq.id}>{rfq.id} - {rfq.subject}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left 1/3 Panel: Read-only RFQ Details */}
        <div className="bg-slate-900 border border-slate-800 text-slate-350 p-6 rounded-xl space-y-6 lg:col-span-1 text-left flex flex-col justify-between relative overflow-hidden shadow-md">
          {/* Decorative glowing gradient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-800 shrink-0">
              <FileText className="h-5 w-5 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">RFQ Requisition Details</h2>
            </div>

            {/* Read-only Fields */}
            <div className="space-y-4 text-xs">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">RFQ Reference ID</p>
                <p className="font-mono font-bold text-indigo-400 mt-1 text-sm">{selectedRfqId}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Requisition Subject</p>
                <p className="font-semibold text-white mt-1 leading-relaxed text-sm">{selectedRfq?.subject || 'Bulk Materials'}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Department Description</p>
                <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">
                  {selectedRfqId === 'RFQ-2026-012' && 'Bidding open for premium copper grounding wires and three-phase industrial cables required for the plant expansion layout.'}
                  {selectedRfqId === 'RFQ-2026-013' && 'Procuring PCIe Gen 4.0 high-speed solid state storage modules for the core cloud servers deployment.'}
                  {selectedRfqId === 'RFQ-2026-014' && 'Procurement of pneumatic solenoid valve assemblies for automated hydraulic fluid loops controls.'}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Submission Deadline</p>
                <div className="flex items-center gap-2 text-rose-450 mt-1.5">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="font-semibold">{selectedRfq?.closeDate || 'Jun 30, 2026'}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Issuing Company</p>
                <div className="flex items-center gap-2 text-slate-350 mt-1.5">
                  <Building className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="font-semibold text-slate-200">VendorBridge Corp.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/65 text-[10px] text-slate-500">
            <span>Sourced via automated ERP RFQInvitation routing.</span>
          </div>
        </div>

        {/* Right 2/3 Panel: Interactive quotation entry form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 lg:col-span-2 flex flex-col justify-between shadow-sm">
          <form onSubmit={handleSubmitQuotation} className="space-y-6">
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <FileCheck className="h-5 w-5 text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Vendor Quotation Entry</h2>
            </div>

            {/* Form Fields: General pricing and timelines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-450">Delivery Timeline (Days) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="number" 
                    min="1"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400">Specify lead time to transport items to VendorBridge warehouse.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-450">Estimated Shipping Method</label>
                <select className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Expedited Road Logistics</option>
                  <option>Air Cargo Freight</option>
                  <option>Sea Vessel Carrier</option>
                </select>
              </div>
            </div>

            {/* Line Items Table with editable unit prices */}
            <div className="space-y-3 text-left">
              <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Line Item Pricing Worksheet</h3>
              
              <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-lg">
                <table className="w-full border-collapse text-left min-w-[550px] text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase">
                      <th className="py-2.5 px-4 w-3/5">Item Description</th>
                      <th className="py-2.5 px-4 w-20 text-center">Quantity</th>
                      <th className="py-2.5 px-4 w-32 text-right">Unit Price ($) <span className="text-rose-500">*</span></th>
                      <th className="py-2.5 px-4 w-32 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {items.map(item => {
                      const unitPriceNum = parseFloat(item.unitPrice) || 0;
                      const lineTotal = unitPriceNum * item.qty;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-850/15 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                            <span className="text-[10px] text-slate-400">UoM: {item.unit}</span>
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-slate-700 dark:text-slate-350">{item.qty}</td>
                          <td className="py-3 px-4">
                            <div className="relative">
                              <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                              <input 
                                type="number" 
                                step="0.01"
                                min="0.01"
                                placeholder={item.defaultPrice.toFixed(2)}
                                value={item.unitPrice}
                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                className="w-full pl-7 pr-2.5 py-1.5 border border-slate-200 dark:border-slate-850 bg-transparent rounded-md text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                required
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 dark:text-slate-150">
                            ${lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-indigo-50/10 dark:bg-slate-850/40 border-t border-slate-200 dark:border-slate-800 font-bold">
                      <td colSpan="3" className="py-3 px-4 text-slate-900 dark:text-white uppercase tracking-wider text-right font-bold">Quotation Subtotal:</td>
                      <td className="py-3 px-4 text-right font-mono text-indigo-650 dark:text-indigo-400 text-sm">
                        ${calculateSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes Textarea */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-450 font-heading">Quotation Notes / Terms & Conditions</label>
              <textarea 
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify warranty warranties, price validity expiration, payment terms, or shipping exemptions..."
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 rounded-lg text-xs bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Form Action Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <button 
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-250 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </button>
              <button 
                type="submit"
                className="flex items-center gap-1.5 px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-lg transition-all hover:shadow shadow-indigo-600/10 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Quotation Submission
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
