import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Layers, 
  Users, 
  Paperclip, 
  Plus, 
  Trash2, 
  Send, 
  Save, 
  ArrowLeft,
  UploadCloud,
  FileCheck
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function RfqCreation() {
  const { vendors, createRFQ, addToast } = useDashboard();
  
  // Form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Electrical Components');
  const [closeDate, setCloseDate] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryTerms, setDeliveryTerms] = useState('FOB - Free On Board');
  
  // Line items state
  const [lineItems, setLineItems] = useState([
    { id: 1, name: '', quantity: 1, uom: 'Units', requiredDate: '' }
  ]);

  // Selected vendors state
  const [selectedVendors, setSelectedVendors] = useState([]);

  // File upload state (mock)
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleAddLineItem = () => {
    const newId = lineItems.length > 0 ? Math.max(...lineItems.map(item => item.id)) + 1 : 1;
    setLineItems([...lineItems, { id: newId, name: '', quantity: 1, uom: 'Units', requiredDate: '' }]);
  };

  const handleRemoveLineItem = (id) => {
    if (lineItems.length === 1) {
      addToast('An RFQ must have at least one line item.', 'warning');
      return;
    }
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleLineItemChange = (id, field, value) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const toggleVendorSelection = (vendorId) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleFileUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + ' MB'
      }));
      setUploadedFiles([...uploadedFiles, ...files]);
      addToast('Files attached successfully.', 'success');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      addToast('Please enter an RFQ subject/title.', 'warning');
      return;
    }
    if (!closeDate) {
      addToast('Please select a closing date.', 'warning');
      return;
    }
    if (lineItems.some(item => !item.name.trim())) {
      addToast('Please fill out all line item descriptions.', 'warning');
      return;
    }
    if (selectedVendors.length === 0) {
      addToast('Please invite at least one vendor to bid.', 'warning');
      return;
    }

    // Call context to add the RFQ
    createRFQ({
      subject,
      category,
      closeDate: new Date(closeDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    });

    // Reset form
    setSubject('');
    setCloseDate('');
    setDescription('');
    setLineItems([{ id: 1, name: '', quantity: 1, uom: 'Units', requiredDate: '' }]);
    setSelectedVendors([]);
    setUploadedFiles([]);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter vendors that match the selected RFQ category for recommendation
  const recommendedVendors = vendors.filter(v => v.category === category && v.status === 'Active');
  const otherVendors = vendors.filter(v => v.category !== category && v.status === 'Active');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => window.history.back()}
          className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Create Request for Quotation (RFQ)</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Request formal quotes from registered suppliers and vendors.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Info */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <FileText className="h-5 w-5 text-indigo-500" />
            <h2 className="text-md font-bold text-slate-900 dark:text-white">1. General Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">RFQ Subject / Title <span className="text-rose-500">*</span></label>
              <input 
                type="text"
                placeholder="e.g. Bulk Copper Wiring for Factory Extension Project"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Category Group <span className="text-rose-500">*</span></label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Electrical Components">Electrical Components</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="IT Hardware">IT Hardware</option>
                <option value="Logistics / Services">Logistics / Services</option>
                <option value="Mechanical Equipment">Mechanical Equipment</option>
                <option value="Scientific Instruments">Scientific Instruments</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Response Closing Date <span className="text-rose-500">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input 
                  type="date"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Delivery Terms</label>
              <select 
                value={deliveryTerms}
                onChange={(e) => setDeliveryTerms(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="FOB - Free On Board">FOB - Free On Board</option>
                <option value="CIF - Cost, Insurance & Freight">CIF - Cost, Insurance & Freight</option>
                <option value="DDP - Delivered Duty Paid">DDP - Delivered Duty Paid</option>
                <option value="EXW - Ex Works">EXW - Ex Works</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Procurement Officer</label>
              <input 
                type="text"
                value="Admin Demo"
                disabled
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed font-medium"
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Special Instructions / Scope of Work</label>
              <textarea 
                rows="3"
                placeholder="Include specifications, tolerance requirements, delivery timelines, or payment schedules..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Line Items */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              <h2 className="text-md font-bold text-slate-900 dark:text-white">2. Line Items</h2>
            </div>
            <button 
              type="button"
              onClick={handleAddLineItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Item Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 pr-4 w-12 text-center">#</th>
                  <th className="py-2.5 px-4 w-2/5">Item Description / Part Number <span className="text-rose-500">*</span></th>
                  <th className="py-2.5 px-4 w-24">Quantity <span className="text-rose-500">*</span></th>
                  <th className="py-2.5 px-4 w-28">UoM</th>
                  <th className="py-2.5 px-4 w-44">Target Delivery Date</th>
                  <th className="py-2.5 pl-4 w-12 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lineItems.map((item, index) => (
                  <tr key={item.id} className="group hover:bg-slate-50/20 dark:hover:bg-slate-800/10">
                    <td className="py-3 pr-4 text-center font-medium text-slate-400">{index + 1}</td>
                    <td className="py-3 px-4">
                      <input 
                        type="text" 
                        placeholder="e.g. 10 AWG Copper Grounding Wire (Green)"
                        value={item.name}
                        onChange={(e) => handleLineItemChange(item.id, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-md text-xs bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input 
                        type="number" 
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-md text-xs bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </td>
                    <td className="py-3 px-4">
                      <select 
                        value={item.uom}
                        onChange={(e) => handleLineItemChange(item.id, 'uom', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-800 rounded-md text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Units">Units</option>
                        <option value="Meters">Meters</option>
                        <option value="Kilograms">Kilograms</option>
                        <option value="Liters">Liters</option>
                        <option value="Rolls">Rolls</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input 
                        type="date" 
                        value={item.requiredDate}
                        onChange={(e) => handleLineItemChange(item.id, 'requiredDate', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-md text-xs bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <button 
                        type="button"
                        onClick={() => handleRemoveLineItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Vendor Assignment */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Users className="h-5 w-5 text-indigo-500" />
            <h2 className="text-md font-bold text-slate-900 dark:text-white">3. Invite Vendors <span className="text-rose-500">*</span></h2>
          </div>

          {/* Recommended Vendors */}
          {recommendedVendors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Recommended Partners (Matches '{category}' group)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedVendors.map(vendor => (
                  <div 
                    key={vendor.id}
                    onClick={() => toggleVendorSelection(vendor.id)}
                    className={`border p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between h-28 relative group
                      ${selectedVendors.includes(vendor.id) 
                        ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-sm' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-850 dark:text-white text-xs">{vendor.name}</p>
                        <p className="text-[10px] text-slate-400">{vendor.id}</p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() => {}} // Controlled via card click
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 pointer-events-none"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] border-t border-slate-100 dark:border-slate-800/80 pt-2 shrink-0">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">
                        Recommended
                      </span>
                      <span className="text-slate-500">★ {vendor.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Active Vendors */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Other Registered Vendors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {otherVendors.map(vendor => (
                <div 
                  key={vendor.id}
                  onClick={() => toggleVendorSelection(vendor.id)}
                  className={`border p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between h-28 relative group
                    ${selectedVendors.includes(vendor.id) 
                      ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-sm' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-850 dark:text-white text-xs">{vendor.name}</p>
                      <p className="text-[10px] text-slate-400">{vendor.id}</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={() => {}} // Controlled via card click
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 pointer-events-none"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] border-t border-slate-100 dark:border-slate-800/80 pt-2 shrink-0">
                    <span className="text-slate-400 font-medium">
                      {vendor.category}
                    </span>
                    <span className="text-slate-500">★ {vendor.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Attachments */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Paperclip className="h-5 w-5 text-indigo-500" />
            <h2 className="text-md font-bold text-slate-900 dark:text-white">4. Technical Drawings & Attachments</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Dropzone */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center bg-slate-50/20 dark:bg-slate-950/20 relative">
              <input 
                type="file" 
                multiple 
                onChange={handleFileUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="h-8 w-8 text-indigo-500 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Drag & Drop Files Here</p>
              <p className="text-[10px] text-slate-400 mt-1">Accepts PDF, CAD models, drawings, spreadsheets up to 10MB</p>
            </div>

            {/* List of uploaded files */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-3 bg-slate-50/40 dark:bg-slate-950/10">
              <h3 className="text-xs font-bold text-slate-750 dark:text-slate-300">Attached Documents</h3>
              {uploadedFiles.length === 0 ? (
                <div className="h-24 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
                  No attachments added yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-lg text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="font-medium text-slate-700 dark:text-slate-250 truncate">{file.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">{file.size}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Action Button Sticky Footer bar */}
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg sticky bottom-4 z-10">
          <div className="text-slate-400 text-xs hidden sm:block">
            <span>Fields marked with </span><span className="text-rose-400">*</span><span> are required before publishing.</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto justify-end">
            <button 
              type="button"
              onClick={() => {
                addToast('Draft RFQ saved successfully.', 'info');
                window.history.back();
              }}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-700 hover:border-slate-600 bg-transparent text-slate-300 hover:text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
            <button 
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-600/20 hover:shadow-indigo-700/30 transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
              Publish RFQ
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
