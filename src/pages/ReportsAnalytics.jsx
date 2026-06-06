import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Percent, 
  FileText,
  Activity,
  Award,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';

export default function ReportsAnalytics() {
  const { addToast } = useDashboard();

  // Spend analytics data
  const monthlySpendData = [
    { month: 'Jan', spend: 85000, savings: 9200 },
    { month: 'Feb', spend: 112000, savings: 12400 },
    { month: 'Mar', spend: 94000, savings: 11100 },
    { month: 'Apr', spend: 135000, savings: 14800 },
    { month: 'May', spend: 182000, savings: 19500 },
    { month: 'Jun', spend: 245000, savings: 28400 },
  ];

  // Category distribution data
  const categoryData = [
    { name: 'Electrical Components', value: 45000 },
    { name: 'Raw Materials', value: 92000 },
    { name: 'IT Hardware', value: 28000 },
    { name: 'Mechanical Equipment', value: 64000 },
    { name: 'Logistics / Services', value: 16000 }
  ];

  // Colors for pie cells
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#6366f1'];

  const handleExportPDF = () => {
    addToast('Generating executive financial report PDF...', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Procurement Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Executive dashboard displaying financial spend patterns, savings ratios, and performance metrics.</p>
        </div>
        
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md shadow-indigo-600/15 hover:shadow-indigo-650/25 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          Export Executive Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              +14.2%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Value Spend</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 font-mono">$868,000.00</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Year to Date cumulative</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Percent className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              +8.5%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Target Cost Savings</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 font-mono">$95,400.00</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">YTD negotiation savings</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-semibold text-rose-600">
              <TrendingDown className="h-3 w-3" />
              -12.4%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">RFQ Cycle Lead Time</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">4.2 Days</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Average creation to release</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              +2.1%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Bid Return Ratio</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">84.5%</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Responses per invited RFQ</p>
          </div>
        </div>
      </div>

      {/* Chart Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Monthly Trend Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center text-left">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-white">Procurement Spend & Savings Trend</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Monthly breakdown of capital expenditure</p>
            </div>
          </div>

          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlySpendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} stroke="#94a3b8" />
                <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} 
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }} 
                />
                <Legend iconType="circle" />
                <Bar dataKey="spend" name="Gross Spend" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" name="Cost Savings" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie Distribution Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 lg:col-span-1 space-y-4">
          <div className="text-left">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">Spend by Category</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Distribution across primary product categories</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} 
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary Label */}
            <div className="absolute text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
              <p className="text-lg font-bold font-mono text-slate-800 dark:text-white mt-0.5">$245.0k</p>
            </div>
          </div>

          {/* Custom Legends list */}
          <div className="space-y-1.5 text-xs text-left">
            {categoryData.map((entry, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2 truncate">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[11px] text-slate-500 truncate">{entry.name}</span>
                </div>
                <span className="font-mono text-slate-850 dark:text-slate-200 font-semibold">${entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supplier Quality and Spend Ratings Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="text-left">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white font-heading">Supplier Performance Quadrant</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Top performing partners ranked by total procurement value and verified SLA metrics.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-slate-600 dark:text-slate-350">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-semibold uppercase">
                <th className="py-2.5">Supplier Name</th>
                <th className="py-2.5">Category Group</th>
                <th className="py-2.5 text-center">Orders Placed</th>
                <th className="py-2.5 text-right">Aggregate Spend</th>
                <th className="py-2.5 text-center">SLA Compliance</th>
                <th className="py-2.5 text-right">Lead Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
              <tr className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10">
                <td className="py-3 font-semibold text-slate-850 dark:text-slate-200">Sumitomo Electronics Ltd.</td>
                <td className="py-3">Electrical Components</td>
                <td className="py-3 text-center font-bold">14</td>
                <td className="py-3 text-right font-mono font-semibold">$182,400.00</td>
                <td className="py-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">98%</span>
                </td>
                <td className="py-3 text-right font-medium">8.2 Days</td>
              </tr>
              <tr className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10">
                <td className="py-3 font-semibold text-slate-850 dark:text-slate-200">Apex Alloys Corp.</td>
                <td className="py-3">Raw Materials</td>
                <td className="py-3 text-center font-bold">8</td>
                <td className="py-3 text-right font-mono font-semibold">$340,500.00</td>
                <td className="py-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">94%</span>
                </td>
                <td className="py-3 text-right font-medium">6.0 Days</td>
              </tr>
              <tr className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10">
                <td className="py-3 font-semibold text-slate-850 dark:text-slate-200">Dynatech Systems Inc.</td>
                <td className="py-3">IT Hardware</td>
                <td className="py-3 text-center font-bold">12</td>
                <td className="py-3 text-right font-mono font-semibold">$112,900.00</td>
                <td className="py-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">100%</span>
                </td>
                <td className="py-3 text-right font-medium">3.0 Days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
