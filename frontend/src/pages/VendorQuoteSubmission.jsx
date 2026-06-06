import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Send, 
  Save, 
  Calendar, 
  Building, 
  Clock, 
  DollarSign, 
  Percent,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function VendorQuoteSubmission() {
  const { rfqs, addToast } = useDashboard();
  const [selectedRfqId, setSelectedRfqId] = useState('RFQ-2026-012');
  const [deliveryDays, setDeliveryDays] = useState(7);
  const [validTill, setValidTill] = useState('30 Days');
  const [taxPercent, setTaxPercent] = useState(9);
  const [gstPercent, setGstPercent] = useState(9);
  const [notes, setNotes] = useState('');
  
  // Custom items list mapped to RFQs
  const rfqItemsMap = {
    'RFQ-2026-012': [
      { id: 101, name: 'Ergonomic chairs', qty: 25, unit: 'Units', defaultPrice: 3500 },
      { id: 102, name: 'Standing desk', qty: 10, unit: 'Units', defaultPrice: 8200 }
    ],
    'RFQ-2026-013': [
      { id: 201, name: 'Samsung 990 Pro 2TB NVMe PCIe 4.0 SSD', qty: 50, unit: 'Units', defaultPrice: 130 }
    ],
    'RFQ-2026-014': [
      { id: 301, name: 'SMC Pneumatic Solenoid Valve 24VDC', qty: 15, unit: 'Units', defaultPrice: 120 }
    ]
  };

  const selectedRfq = rfqs.find(r => r.id === selectedRfqId) || rfqs[0];
  const [items, setItems] = useState([]);

  // Initialize/Update items when selected RFQ changes
  useEffect(() => {
    const defaultItems = rfqItemsMap[selectedRfqId] || [];
    setItems(defaultItems.map(item => ({
      ...item,
      unitPrice: item.defaultPrice // Default to database seed figures
    })));
  }, [selectedRfqId]);

  const handlePriceChange = (itemId, val) => {
    const numericVal = val === '' ? '' : Math.max(0, parseFloat(val) || 0);
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, unitPrice: val === '' ? '' : numericVal } : item
    ));
  };

  const handleDeliveryChange = (itemId, val) => {
    const numericVal = val === '' ? '' : Math.max(1, parseInt(val) || 1);
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, deliveryDays: val === '' ? '' : numericVal } : item
    ));
  };

  // Calculations
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.unitPrice) || 0;
      return sum + (price * item.qty);
    }, 0);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * ((parseFloat(taxPercent) || 0) / 100);
    const gst = subtotal * ((parseFloat(gstPercent) || 0) / 100);
    return subtotal + tax + gst;
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

    const total = calculateGrandTotal();
    addToast(`Quotation of $${total.toLocaleString(undefined, { maximumFractionDigits: 2 })} submitted successfully for ${selectedRfqId}!`, 'success');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Submit Quotations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">RFQ: {selectedRfq?.subject || 'office furniture procurement q2'} - deadline {selectedRfq?.closeDate || '15 June 2025'}</p>
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
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-800 shrink-0">
              <FileText className="h-5 w-5 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">RFQ Summary</h2>
            </div>

            {/* Read-only Fields */}
            <div className="space-y-4 text-xs">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">RFQ Reference ID</p>
                <p className="font-mono font-bold text-indigo-400 mt-1 text-sm">{selectedRfqId}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Line Items Scope</p>
                <p className="font-semibold text-white mt-1 leading-relaxed text-[11px] p-3 bg-slate-950/40 border border-slate-850 rounded-lg">
                  {selectedRfqId === 'RFQ-2026-012' ? 'Ergonomic chairs * 25, standing desk * 10 - category Furniture' : 'Standard requisitions list.'}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Submission Deadline</p>
                <div className="flex items-center gap-2 text-rose-450 mt-1.5">
                  <span className="font-semibold">{selectedRfq?.closeDate || '15 June 2025'}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Company Name</p>
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
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Your Quotation</h2>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-450">Valid Till / Terms</label>
                <input 
                  type="text" 
                  value={validTill}
                  onChange={(e) => setValidTill(e.target.value)}
                  placeholder="e.g. 30 Days"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-450">Tax (%)</label>
                <div className="relative">
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input 
                    type="number" 
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pr-8 pl-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-450">GST (%)</label>
                <div className="relative">
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input 
                    type="number" 
                    value={gstPercent}
                    onChange={(e) => setGstPercent(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pr-8 pl-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Line Items Table with editable unit prices & delivery timelines */}
            <div className="space-y-3 text-left">
              <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Line Item Pricing Worksheet</h3>
              
              <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-lg">
                <table className="w-full border-collapse text-left min-w-[550px] text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase">
                      <th className="py-2.5 px-4 w-1/3">Item Description</th>
                      <th className="py-2.5 px-4 w-16 text-center">Quantity</th>
                      <th className="py-2.5 px-4 w-24 text-right">Unit Price ($) <span className="text-rose-500">*</span></th>
                      <th className="py-2.5 px-4 w-24 text-center">Delivery (Days)</th>
                      <th className="py-2.5 px-4 w-24 text-right">Line Total</th>
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
                                placeholder={item.defaultPrice.toString()}
                                value={item.unitPrice}
                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                className="w-full pl-7 pr-2.5 py-1 bg-transparent border border-slate-200 dark:border-slate-850 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                required
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input 
                              type="number"
                              min="1"
                              value={item.deliveryDays || 10}
                              onChange={(e) => handleDeliveryChange(item.id, e.target.value)}
                              className="w-16 mx-auto py-1 px-2 border border-slate-200 dark:border-slate-850 bg-transparent rounded-md text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 dark:text-slate-150">
                            ${lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50/40 dark:bg-slate-850/20 border-t border-slate-200 dark:border-slate-800">
                      <td colSpan="4" className="py-2.5 px-4 text-slate-550 text-right">Subtotal:</td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                        ${calculateSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="bg-slate-50/45 dark:bg-slate-850/25">
                      <td colSpan="4" className="py-1 px-4 text-slate-500 text-right">Tax & GST Summary:</td>
                      <td className="py-1 px-4 text-right font-mono text-slate-500">
                        ${(calculateSubtotal() * ((taxPercent + gstPercent) / 100)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="bg-indigo-50/10 dark:bg-slate-850/40 border-t border-slate-200 dark:border-slate-800 font-bold">
                      <td colSpan="4" className="py-3 px-4 text-slate-900 dark:text-white uppercase tracking-wider text-right font-bold text-xs">Grand Total:</td>
                      <td className="py-3 px-4 text-right font-mono text-indigo-600 dark:text-indigo-400 text-sm">
                        ${calculateGrandTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                placeholder="Specify warranties, price validity expiration, payment terms, or shipping exemptions..."
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-850 rounded-lg text-xs bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Form Action Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <button 
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-250 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-655 dark:text-slate-355 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </button>
              <button 
                type="submit"
                className="flex items-center gap-1.5 px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-lg transition-all hover:shadow shadow-indigo-600/10 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Submit Quotation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
