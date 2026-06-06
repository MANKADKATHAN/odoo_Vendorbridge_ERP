import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VendorManagement from './pages/VendorManagement';
import RfqCreation from './pages/RfqCreation';
import QuotationComparison from './pages/QuotationComparison';
import ApprovalWorkflow from './pages/ApprovalWorkflow';
import PoInvoiceGeneration from './pages/PoInvoiceGeneration';
import ActivityLogs from './pages/ActivityLogs';
import ReportsAnalytics from './pages/ReportsAnalytics';
import VendorQuoteSubmission from './pages/VendorQuoteSubmission';

function AppContent() {
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) {
    return <Login onLoginSuccess={setCurrentUser} />;
  }

  return (
    <Layout currentUser={currentUser} onLogout={() => setCurrentUser(null)}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vendors" element={<VendorManagement />} />
        <Route path="/rfq/create" element={<RfqCreation />} />
        <Route path="/quotation-comparison" element={<QuotationComparison />} />
        <Route path="/quote-submission" element={<VendorQuoteSubmission />} />
        <Route path="/approval-workflow" element={<ApprovalWorkflow />} />
        <Route path="/po-invoice" element={<PoInvoiceGeneration />} />
        <Route path="/reports-analytics" element={<ReportsAnalytics />} />
        <Route path="/activity-logs" element={<ActivityLogs />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </DashboardProvider>
  );
}
