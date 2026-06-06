import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsGrid from '../components/StatsGrid';
import QuickActions from '../components/QuickActions';
import RecentOrdersTable from '../components/RecentOrdersTable';
import PendingApprovalsList from '../components/PendingApprovalsList';

// Modals
import AddVendorModal from '../components/modals/AddVendorModal';
import GeneratePOModal from '../components/modals/GeneratePOModal';
import PODetailModal from '../components/modals/PODetailModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [isPOOpen, setIsPOOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);

  const handleViewDetails = (po) => {
    setSelectedPO(po);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards (Top Row) */}
      <StatsGrid />

      {/* Quick Action Buttons */}
      <QuickActions 
        onCreateRFQ={() => navigate('/rfq/create')}
        onAddVendor={() => setIsVendorOpen(true)}
        onGeneratePO={() => setIsPOOpen(true)}
      />

      {/* Main Content Area: Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Column: Recent Purchase Orders Table */}
        <div className="lg:col-span-2">
          <RecentOrdersTable onViewDetails={handleViewDetails} />
        </div>

        {/* Right Column: Pending Approvals List */}
        <div className="lg:col-span-1">
          <PendingApprovalsList />
        </div>
      </div>

      {/* Modals Container */}
      <AddVendorModal 
        isOpen={isVendorOpen} 
        onClose={() => setIsVendorOpen(false)} 
      />
      <GeneratePOModal 
        isOpen={isPOOpen} 
        onClose={() => setIsPOOpen(false)} 
      />
      <PODetailModal 
        isOpen={isDetailOpen} 
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedPO(null);
        }}
        po={selectedPO}
      />
    </div>
  );
}
