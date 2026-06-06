import React, { useState } from 'react';
import { 
  BarChart2, 
  CheckCircle2, 
  X, 
  HelpCircle, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  Award,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import WorkflowTracker from '../components/WorkflowTracker';

export default function QuotationComparison() {
  const { rfqs, addToast, generatePO } = useDashboard();
  const [selectedRfqId, setSelectedRfqId] = useState('RFQ-2026-012');

  // Quotation comparison mock database
  const quotationsDb = {
    'RFQ-2026-012': {
      subject: 'Bulk Copper Wiring (3-Phase)',
      items: [
        { name: '10 AWG Copper Grounding Wire (Green)', qty: 1000, unit: 'Meters' },
        { name: 'Heavy Duty 3-Phase Core Cable 16mm', qty: 250, unit: 'Meters' }
      ],
      vendors: [
        {
          id: 'VEN-0001',
          name: 'Sumitomo Electronics Ltd.',
          rating: 4.8,
          compliance: '98%',
          deliveryDays: 8,
          paymentTerms: 'Net 30',
          warranty: '2 Years',
          itemPrices: [4500, 11250], // total 15750
          totalPrice: 15750,
          isRecommended: true
        },
        {
          id: 'VEN-0004',
          name: 'Nexus Logistics & Telecom',
          rating: 4.2,
          compliance: '90%',
          deliveryDays: 14,
          paymentTerms: 'Net 15',
          warranty: '1 Year',
          itemPrices: [4900, 12000], // total 16900
          totalPrice: 16900,
          isRecommended: false
        },
        {
          id: 'VEN-0002',
          name: 'Apex Alloys Corp.',
          rating: 4.5,
          compliance: '94%',
          deliveryDays: 6,
          paymentTerms: 'Net 45',
          warranty: '3 Years',
          itemPrices: [4200, 12500], // total 16700
          totalPrice: 16700,
          isRecommended: false
        }
      ]
    },
    'RFQ-2026-013': {
      subject: 'SSD Storage Modules (M.2 NVMe)',
      items: [
        { name: 'Samsung 990 Pro 2TB NVMe PCIe 4.0 SSD', qty: 50, unit: 'Units' }
      ],
      vendors: [
        {
          id: 'VEN-0003',
          name: 'Dynatech Systems Inc.',
          rating: 4.9,
          compliance: '100%',
          deliveryDays: 3,
          paymentTerms: 'Net 30',
          warranty: '5 Years',
          itemPrices: [6500],
          totalPrice: 6500,
          isRecommended: true
        },
        {
          id: 'VEN-0001',
          name: 'Sumitomo Electronics Ltd.',
          rating: 4.8,
          compliance: '98%',
          deliveryDays: 5,
          paymentTerms: 'Net 30',
          warranty: '3 Years',
          itemPrices: [6900],
          totalPrice: 6900,
          isRecommended: false
        }
      ]
    },
    'RFQ-2026-014': {
      subject: 'Pneumatic Solenoid Valve Assemblies',
      items: [
        { name: 'SMC Pneumatic Solenoid Valve 24VDC', qty: 15, unit: 'Units' }
      ],
      vendors: [] // No bids yet (Draft state)
    }
  };

  // State to track excluded vendors for comparison
  const [excludedVendors, setExcludedVendors] = useState([]);

  const rfqData = quotationsDb[selectedRfqId] || { subject: 'Unknown RFQ', items: [], vendors: [] };
  
  // Filter active vendors in comparison
  const comparedVendors = rfqData.vendors.filter(v => !excludedVendors.includes(v.id));

  // Identify lowest price, best delivery, best compliance among active compared vendors
  const prices = comparedVendors.map(v => v.totalPrice);
  const deliveryTimes = comparedVendors.map(v => v.deliveryDays);
  
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const minDelivery = deliveryTimes.length > 0 ? Math.min(...deliveryTimes) : 0;

  const handleToggleVendor = (vendorId) => {
    setExcludedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleAwardRFQ = (vendor) => {
    // Generate PO based on the award details
    generatePO({
      subject: `RFQ Award: ${rfqData.subject}`,
      vendor: vendor.name,
      amount: vendor.totalPrice,
      urgency: 'Medium',
      notes: `Contract awarded via bidding on ${selectedRfqId}. Awarded to lowest conforming bidder: ${vendor.name} ($${vendor.totalPrice.toLocaleString()}).`
    });

    addToast(`Contract awarded to ${vendor.name}. Purchase order routing initiated.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Workflow Progress Tracker */}
      <WorkflowTracker currentStep={3} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Quotation Evaluation Matrix</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Compare vendor bids side-by-side on price, compliance, and lead time.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select RFQ:</span>
          <select 
            value={selectedRfqId}
            onChange={(e) => {
              setSelectedRfqId(e.target.value);
              setExcludedVendors([]); // Reset exclusion filters when changing RFQs
            }}
            className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
          >
            {rfqs.map(rfq => (
              <option key={rfq.id} value={rfq.id}>{rfq.id} - {rfq.subject} ({rfq.status})</option>
            ))}
          </select>
        </div>
      </div>

      {rfqData.vendors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-12 text-center text-slate-400 dark:text-slate-500">
          <BarChart2 className="h-10 w-10 mx-auto text-slate-350 dark:text-slate-650 mb-3" />
          <p className="text-sm font-semibold">No quotations submitted yet.</p>
          <p className="text-xs text-slate-400 mt-1">This RFQ is currently in Draft or is open for bidding but has not received supplier quotations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          {/* Left Panel: Vendor Selection Toggles */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 space-y-4 xl:col-span-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Options</h2>
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Select suppliers to include in the comparison grid:</p>
              
              <div className="space-y-2.5">
                {rfqData.vendors.map(vendor => (
                  <label 
                    key={vendor.id}
                    className="flex items-center gap-2.5 p-2.5 border border-slate-100 dark:border-slate-850 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <input 
                      type="checkbox"
                      checked={!excludedVendors.includes(vendor.id)}
                      onChange={() => handleToggleVendor(vendor.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <div className="text-xs leading-normal">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{vendor.name}</p>
                      <p className="text-[10px] text-slate-400">★ {vendor.rating} • {vendor.id}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 space-y-2 leading-relaxed">
              <p className="flex items-center gap-1.5 font-semibold text-slate-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Scorecard Key:
              </p>
              <div className="flex gap-2">
                <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-100/30">L.Price</span>
                <span>Lowest Unit/Total Cost</span>
              </div>
              <div className="flex gap-2">
                <span className="inline-block px-1.5 py-0.5 rounded bg-blue-550/10 text-indigo-500 font-semibold border border-indigo-100/10">F.Ship</span>
                <span>Fastest delivery lead-time</span>
              </div>
            </div>
          </div>

          {/* Right Panel: The Comparison Matrix Grid */}
          <div className="xl:col-span-3 space-y-6">
            {comparedVendors.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-12 text-center text-slate-400 dark:text-slate-500">
                <p className="text-sm font-semibold">Select at least one supplier vendor to display comparison matrix.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left min-w-[650px]">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-4 px-5 w-1/3">Evaluation Metric</th>
                        {comparedVendors.map(vendor => (
                          <th key={vendor.id} className="py-4 px-5 text-center">
                            <p className="font-bold text-slate-900 dark:text-white">{vendor.name}</p>
                            <p className="text-[10px] text-slate-400 font-normal mt-0.5">{vendor.id}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {/* Metric: Star Rating */}
                      <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20">
                        <td className="py-3.5 px-5 font-semibold text-slate-550 dark:text-slate-400">Vendor Rating</td>
                        {comparedVendors.map(vendor => (
                          <td key={vendor.id} className="py-3.5 px-5 text-center font-medium text-slate-800 dark:text-slate-200">
                            ★ {vendor.rating} / 5.0
                          </td>
                        ))}
                      </tr>

                      {/* Metric: Compliance Rating */}
                      <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20">
                        <td className="py-3.5 px-5 font-semibold text-slate-550 dark:text-slate-400">SLA Compliance Rate</td>
                        {comparedVendors.map(vendor => (
                          <td key={vendor.id} className="py-3.5 px-5 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-bold
                              ${parseInt(vendor.compliance) >= 95 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}
                            `}>
                              {vendor.compliance}
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Line Item Prices */}
                      {rfqData.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20 bg-slate-50/20 dark:bg-slate-900/10">
                          <td className="py-3.5 px-5">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Qty: {item.qty} {item.unit}</p>
                          </td>
                          {comparedVendors.map(vendor => {
                            const itemPrice = vendor.itemPrices[idx];
                            return (
                              <td key={vendor.id} className="py-3.5 px-5 text-center text-slate-700 dark:text-slate-300 font-mono font-medium">
                                ${itemPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </td>
                            );
                          })}
                        </tr>
                      ))}

                      {/* Metric: Total Quote Price */}
                      <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20 font-bold border-t border-slate-100 dark:border-slate-800 bg-indigo-50/5">
                        <td className="py-4 px-5 text-slate-900 dark:text-white font-bold text-sm">TOTAL OFFER VALUE</td>
                        {comparedVendors.map(vendor => {
                          const isLowest = vendor.totalPrice === minPrice;
                          return (
                            <td key={vendor.id} className="py-4 px-5 text-center text-sm font-mono">
                              <p className={`text-base ${isLowest ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                ${vendor.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </p>
                              {isLowest && (
                                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-heading text-[9px] uppercase tracking-wider font-extrabold border border-emerald-500/20 animate-pulse">
                                  Best Offer
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* Metric: Delivery Days */}
                      <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20">
                        <td className="py-3.5 px-5 font-semibold text-slate-550 dark:text-slate-400">Delivery Lead Time</td>
                        {comparedVendors.map(vendor => {
                          const isFastest = vendor.deliveryDays === minDelivery;
                          return (
                            <td key={vendor.id} className="py-3.5 px-5 text-center text-slate-700 dark:text-slate-300 font-medium">
                              <p>{vendor.deliveryDays} Days</p>
                              {isFastest && (
                                <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 font-semibold text-[9px]">
                                  Fastest
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* Metric: Payment Terms */}
                      <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20">
                        <td className="py-3.5 px-5 font-semibold text-slate-550 dark:text-slate-400">Credit Payment Terms</td>
                        {comparedVendors.map(vendor => (
                          <td key={vendor.id} className="py-3.5 px-5 text-center text-slate-700 dark:text-slate-300 font-medium">
                            {vendor.paymentTerms}
                          </td>
                        ))}
                      </tr>

                      {/* Metric: Warranty */}
                      <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20">
                        <td className="py-3.5 px-5 font-semibold text-slate-550 dark:text-slate-400">Warranty Term</td>
                        {comparedVendors.map(vendor => (
                          <td key={vendor.id} className="py-3.5 px-5 text-center text-slate-700 dark:text-slate-300 font-medium">
                            {vendor.warranty}
                          </td>
                        ))}
                      </tr>

                      {/* Action Award Row */}
                      <tr className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/10">
                        <td className="py-4 px-5"></td>
                        {comparedVendors.map(vendor => (
                          <td key={vendor.id} className="py-4 px-5 text-center">
                            <button
                              onClick={() => handleAwardRFQ(vendor)}
                              className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs shadow-md shadow-indigo-600/15 cursor-pointer hover:shadow-indigo-600/25 transition-all"
                            >
                              <Award className="h-3.5 w-3.5" />
                              Award RFQ Contract
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
