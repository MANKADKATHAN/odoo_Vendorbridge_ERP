import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  FileText,
  User,
  Building,
  TrendingUp,
  Download,
  Eye
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import AddVendorModal from '../components/modals/AddVendorModal';

export default function VendorManagement() {
  const { vendors, addVendor, addToast } = useDashboard();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Categories & Statuses for filters
  const categories = ['All', 'Electrical Components', 'Raw Materials', 'IT Hardware', 'Logistics / Services', 'Mechanical Equipment', 'Scientific Instruments'];
  const statuses = ['All', 'Active', 'Pending Verification', 'Blocked'];

  // Detail fields mock data map (for a premium feel, since DashboardContext has simple objects)
  const vendorDetailsMap = {
    'VEN-0001': { gst: '27AAAAA1111A1Z1', email: 'sales@sumitomo-elec.com', phone: '+81-3-5555-0192', address: '1-3-12 Motoakasaka, Minato-ku, Tokyo, Japan', contact: 'Kenji Tanaka (Sales Dir)', joined: 'Jan 15, 2024' },
    'VEN-0002': { gst: '07BBBBB2222B2Z2', email: 'procure@apexalloys.com', phone: '+1-512-555-0143', address: '8400 Industrial Blvd, Austin, TX 78744, USA', contact: 'Robert Vance (VP Sales)', joined: 'Mar 10, 2024' },
    'VEN-0003': { gst: '33CCCCC3333C3Z3', email: 'support@dynatech-sys.com', phone: '+1-800-555-0177', address: '100 Silicon Way, San Jose, CA 95110, USA', contact: 'Sarah Jenkins (Enterprise Lead)', joined: 'Jun 22, 2024' },
    'VEN-0004': { gst: '19DDDDD4444D4Z4', email: 'ops@nexuslogistics.com', phone: '+91-22-5555-0811', address: 'Nariman Point, Sector 4, Mumbai, MH, India', contact: 'Rajesh Sharma (Logistics Head)', joined: 'Oct 05, 2024' },
    'VEN-0005': { gst: '29EEEEE5555E5Z5', email: 'info@vickers-hydraulics.com', phone: '+44-20-7946-0958', address: '45 Industrial Estate, Birmingham, UK', contact: 'Richard Vickers (Managing Partner)', joined: 'Nov 18, 2024' },
    'VEN-0006': { gst: '36FFFFF6666F6Z6', email: 'sales@opto-instruments.de', phone: '+49-89-555-9012', address: 'Carl-Zeiss-Strasse 12, Jena, Germany', contact: 'Dr. Dieter Schmitt (QC Dir)', joined: 'Feb 20, 2025' }
  };

  const getExtraDetails = (vendorId) => {
    return vendorDetailsMap[vendorId] || {
      gst: '27GSTINPENDING1Z0',
      email: 'contact@vendor-new.com',
      phone: '+1-555-0100',
      address: '100 Global Trade Parkway, Sector 9',
      contact: 'Onboarding Agent',
      joined: 'Just Now'
    };
  };

  // Filter vendors
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || vendor.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || vendor.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleExport = () => {
    addToast('Vendor registry exported to CSV successfully.', 'success');
  };

  const getStatusLabelCount = (status) => {
    if (status === 'All') return vendors.length;
    return vendors.filter(v => v.status === status).length;
  };

  const getStatusLabelText = (status) => {
    if (status === 'All') return 'All';
    if (status === 'Pending Verification') return 'Pending';
    return status;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-Black">Vendor Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage suppliers, onboard new vendors, and monitor compliance.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add New Vendor
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Total Vendors</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{vendors.length}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Active Partners</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {vendors.filter(v => v.status === 'Active').length}
            </h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Verification Pending</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {vendors.filter(v => v.status === 'Pending Verification').length}
            </h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Avg Rating</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {(vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(2)} ★
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, gst number, cat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {/* Horizontal tabs status filter - Matching Screen 4 */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-850 overflow-x-auto w-full md:w-auto shrink-0 scrollbar-none gap-1">
          {statuses.map((status, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap cursor-pointer transition-all
                ${selectedStatus === status
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }
              `}
            >
              {getStatusLabelText(status)} ({getStatusLabelCount(status)})
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Data Table */}
        <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden xl:col-span-2 ${selectedVendor ? '' : 'xl:col-span-3'}`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Vendor Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-center">Score / Rating</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-600 dark:text-slate-300">
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400 dark:text-slate-500">
                      No vendors match the search filters.
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      onClick={() => setSelectedVendor(vendor)}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer group
                        ${selectedVendor?.id === vendor.id ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''}
                      `}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-100/50 dark:border-indigo-900/30">
                            {vendor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {vendor.name}
                            </p>
                            <p className="text-xs text-slate-400">{vendor.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {vendor.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{vendor.rating}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                          ${vendor.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                          ${vendor.status === 'Inactive' ? 'bg-slate-500/10 text-slate-500' : ''}
                          ${vendor.status === 'Pending Verification' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : ''}
                          ${vendor.status === 'Blocked' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : ''}
                        `}>
                          <span className={`h-1.5 w-1.5 rounded-full 
                            ${vendor.status === 'Active' ? 'bg-emerald-500' : ''}
                            ${vendor.status === 'Inactive' ? 'bg-slate-400' : ''}
                            ${vendor.status === 'Pending Verification' ? 'bg-amber-500' : ''}
                            ${vendor.status === 'Blocked' ? 'bg-rose-500' : ''}
                          `} />
                          {vendor.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedVendor(vendor)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                            title="View Vendor Details"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </button>
                          <button
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                            title="Actions Menu"
                          >
                            <MoreVertical className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vendor Detail Card Side View */}
        {selectedVendor && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6 animate-slide-in relative xl:col-span-1">
            <button
              onClick={() => setSelectedVendor(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            >
              &times;
            </button>

            <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-2xl mx-auto mb-3 border border-indigo-100/50 dark:border-indigo-900/30">
                {selectedVendor.name.charAt(0)}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedVendor.name}</h2>
              <p className="text-xs text-slate-400 mb-2">{selectedVendor.id}</p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{selectedVendor.rating} Rating</span>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4 text-xs">
              <div>
                <p className="text-slate-400 uppercase tracking-wider font-semibold mb-1">Company Information</p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <Building className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-400">GST Registration Number</p>
                      <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{getExtraDetails(selectedVendor.id).gst}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <User className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-400">Primary Contact Person</p>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{getExtraDetails(selectedVendor.id).contact}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-slate-400 uppercase tracking-wider font-semibold mb-1">Contact Details</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <a href={`mailto:${getExtraDetails(selectedVendor.id).email}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                      {getExtraDetails(selectedVendor.id).email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{getExtraDetails(selectedVendor.id).phone}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-400">Corporate Address</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{getExtraDetails(selectedVendor.id).address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Joined Registry</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{getExtraDetails(selectedVendor.id).joined}</span>
                </div>
              </div>
            </div>

            {/* Actions for Vendor */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => addToast(`RFQ invitation triggered for ${selectedVendor.name}`, 'info')}
                className="py-2 px-3 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg text-center text-xs transition-colors cursor-pointer"
              >
                Send RFQ Inv
              </button>
              <button
                onClick={() => addToast(`Opening purchase contract with ${selectedVendor.name}`, 'info')}
                className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-center text-xs transition-colors cursor-pointer shadow-sm shadow-indigo-600/10"
              >
                View Agreement
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Onboarding Modal Integration */}
      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
