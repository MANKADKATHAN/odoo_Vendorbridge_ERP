import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  // Stats state
  const [stats, setStats] = useState({
    pendingApprovals: 4,
    activeRfqs: 3,
    recentPOs: 6,
    recentInvoices: 12
  });

  // Recent Purchase Orders state
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: 'PO-2026-0042',
      subject: '120x ARM Cortex-M4 Microcontrollers',
      vendor: 'Sumitomo Electronics Ltd.',
      amount: 18450.00,
      date: 'Jun 05, 2026',
      status: 'Approved',
      urgency: 'Medium',
      requester: 'Sarah Jenkins (Production)'
    },
    {
      id: 'PO-2026-0041',
      subject: 'High-Grade Sheet Titanium (Grade 5)',
      vendor: 'Apex Alloys Corp.',
      amount: 54200.00,
      date: 'Jun 04, 2026',
      status: 'Pending',
      urgency: 'High',
      requester: 'Sarah Jenkins (Production)'
    },
    {
      id: 'PO-2026-0040',
      subject: 'Enterprise Server Chassis & Rack Units',
      vendor: 'Dynatech Systems Inc.',
      amount: 12900.00,
      date: 'Jun 02, 2026',
      status: 'Fulfilled',
      urgency: 'Low',
      requester: 'Elena Rostova (Operations)'
    },
    {
      id: 'PO-2026-0039',
      subject: 'Fiber Optic Cabling (Single Mode, 10km)',
      vendor: 'Nexus Logistics & Telecom',
      amount: 6800.00,
      date: 'May 28, 2026',
      status: 'Fulfilled',
      urgency: 'Low',
      requester: 'Marcus Brody (Procurement)'
    },
    {
      id: 'PO-2026-0038',
      subject: 'Industrial Hydraulic Pump Assemblies',
      vendor: 'Vickers Hydraulics Corp.',
      amount: 32150.00,
      date: 'May 25, 2026',
      status: 'Approved',
      urgency: 'High',
      requester: 'Elena Rostova (Operations)'
    },
    {
      id: 'PO-2026-0037',
      subject: 'Precision Calibration Laser Tooling',
      vendor: 'Opto-Instruments Gmbh',
      amount: 21400.00,
      date: 'May 20, 2026',
      status: 'Pending',
      urgency: 'Medium',
      requester: 'David Lee (QC & Testing)'
    }
  ]);

  // Pending Approvals state (items requiring urgent attention)
  const [approvals, setApprovals] = useState([
    {
      id: 'APP-9021',
      type: 'Purchase Order Approval',
      targetId: 'PO-2026-0041',
      item: 'High-Grade Sheet Titanium (Grade 5)',
      vendor: 'Apex Alloys Corp.',
      requester: 'Sarah Jenkins (Production)',
      amount: 54200.00,
      date: 'Jun 04, 2026',
      details: 'Critical purchase for aerospace turbine housing project. Required by mid-July.'
    },
    {
      id: 'APP-9022',
      type: 'Purchase Order Approval',
      targetId: 'PO-2026-0037',
      item: 'Precision Calibration Laser Tooling',
      vendor: 'Opto-Instruments Gmbh',
      requester: 'David Lee (QC & Testing)',
      amount: 21400.00,
      date: 'May 20, 2026',
      details: 'Urgent replacement of optical laser measurement units for laboratory 4 validation tests.'
    },
    {
      id: 'APP-9023',
      type: 'Vendor Compliance Authorization',
      targetId: 'VEN-0098',
      item: 'Onboard: Summit Logistics Services',
      vendor: 'Summit Logistics Services',
      requester: 'Elena Rostova (Operations)',
      amount: 0,
      date: 'Jun 05, 2026',
      details: 'Approval request for shipping partner. Credit check passed, compliance audit completed with high rating.'
    },
    {
      id: 'APP-9024',
      type: 'RFQ Awarding Permission',
      targetId: 'RFQ-2026-012',
      item: 'Award RFQ: Bulk Copper Wiring',
      vendor: 'Electra Cables Inc.',
      requester: 'Marcus Brody (Procurement)',
      amount: 15750.00,
      date: 'Jun 03, 2026',
      details: 'Approve award of contract to Electra Cables Inc., who was the lowest conforming bidder for the plant refit.'
    }
  ]);

  // RFQs state
  const [rfqs, setRfqs] = useState([
    { id: 'RFQ-2026-012', subject: 'Bulk Copper Wiring (3-Phase)', bidsCount: 3, closeDate: 'Jun 12, 2026', status: 'Open', vendorCategory: 'Electrical Components' },
    { id: 'RFQ-2026-013', subject: 'SSD Storage Modules (M.2 NVMe)', bidsCount: 5, closeDate: 'Jun 18, 2026', status: 'Open', vendorCategory: 'IT Hardware' },
    { id: 'RFQ-2026-014', subject: 'Pneumatic Solenoid Valve Assemblies', bidsCount: 0, closeDate: 'Jun 22, 2026', status: 'Draft', vendorCategory: 'Mechanical Equipment' }
  ]);

  // Vendor database
  const [vendors, setVendors] = useState([
    { id: 'VEN-0001', name: 'Sumitomo Electronics Ltd.', category: 'Electrical Components', rating: 4.8, status: 'Active' },
    { id: 'VEN-0002', name: 'Apex Alloys Corp.', category: 'Raw Materials', rating: 4.5, status: 'Active' },
    { id: 'VEN-0003', name: 'Dynatech Systems Inc.', category: 'IT Hardware', rating: 4.9, status: 'Active' },
    { id: 'VEN-0004', name: 'Nexus Logistics & Telecom', category: 'Logistics / Services', rating: 4.2, status: 'Active' },
    { id: 'VEN-0005', name: 'Vickers Hydraulics Corp.', category: 'Mechanical Equipment', rating: 4.6, status: 'Active' },
    { id: 'VEN-0006', name: 'Opto-Instruments Gmbh', category: 'Scientific Instruments', rating: 4.7, status: 'Active' },
    { id: 'VEN-0007', name: 'FastLog Transport & Cargo', category: 'Logistics / Services', rating: 3.9, status: 'Blocked' },
    { id: 'VEN-0008', name: 'Infra Supplies Pvt Ltd', category: 'Raw Materials', rating: 4.5, status: 'Pending Verification' }
  ]);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New bid submitted for RFQ-2026-012 by Electra Cables Inc.', time: '10m ago', unread: true, type: 'info' },
    { id: 2, text: 'Purchase Order PO-2026-0042 was approved by CFO', time: '1h ago', unread: true, type: 'success' },
    { id: 3, text: 'Compliance audit scheduled for Summit Logistics Services', time: '4h ago', unread: false, type: 'warning' }
  ]);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Toast utility
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Vendors and RFQs from backend with Authorization Bearer header
  useEffect(() => {
    const fetchApiData = async () => {
      const token = '5b3f7a1e0bca4876b6de52382c75a89274534ef0da05cf14e7a89270df8276f3';
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Determine backend host (FastAPI typical fallback is http://localhost:8000)
      const apiBase = window.location.origin.includes('localhost:5173') 
        ? 'http://localhost:8000' 
        : window.location.origin;

      try {
        console.log(`[ERP API] Requesting /vendors with Authorization Bearer token...`);
        const vendorsRes = await fetch(`${apiBase}/vendors`, { headers });
        if (vendorsRes.ok) {
          const vendorsData = await vendorsRes.json();
          setVendors(vendorsData.map(v => ({
            id: `VEN-0${v.id || '00' + v.user_id}`,
            name: v.company_name,
            category: v.category,
            rating: v.rating || 5.0,
            status: v.status === 'APPROVED' ? 'Active' : v.status === 'PENDING' ? 'Pending Verification' : 'Inactive'
          })));
          console.log(`[ERP API] /vendors loaded successfully.`);
        }
      } catch (err) {
        console.warn(`[ERP API] /vendors offline. Local mock fallback active:`, err.message);
      }

      try {
        console.log(`[ERP API] Requesting /rfqs with Authorization Bearer token...`);
        const rfqsRes = await fetch(`${apiBase}/rfqs`, { headers });
        if (rfqsRes.ok) {
          const rfqsData = await rfqsRes.json();
          setRfqs(rfqsData.map(r => ({
            id: `RFQ-2026-0${r.id}`,
            subject: r.title,
            bidsCount: r.quotations ? r.quotations.length : 0,
            closeDate: new Date(r.deadline).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: r.status === 'OPEN' ? 'Open' : r.status === 'CLOSED' ? 'Closed' : 'Draft',
            vendorCategory: r.category || 'Electrical Components'
          })));
          console.log(`[ERP API] /rfqs loaded successfully.`);
        }
      } catch (err) {
        console.warn(`[ERP API] /rfqs offline. Local mock fallback active:`, err.message);
      }
    };

    fetchApiData();
  }, []);

  // Action: Approve Request
  const approveRequest = useCallback((approvalId) => {
    const approval = approvals.find((a) => a.id === approvalId);
    if (!approval) return;

    // Update Approvals list
    setApprovals((prev) => prev.filter((a) => a.id !== approvalId));

    // Decrement pending approvals count
    setStats((prev) => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
    }));

    // If it's a Purchase Order approval, update the PO status to 'Approved'
    if (approval.targetId.startsWith('PO-')) {
      setPurchaseOrders((prev) =>
        prev.map((po) =>
          po.id === approval.targetId ? { ...po, status: 'Approved' } : po
        )
      );
    }

    // Add notification
    const newNotification = {
      id: Date.now(),
      text: `Approved: ${approval.item} requested by ${approval.requester}`,
      time: 'Just now',
      unread: true,
      type: 'success'
    };
    setNotifications((prev) => [newNotification, ...prev]);

    addToast(`Request approved successfully: ${approval.item}`, 'success');
  }, [approvals, addToast]);

  // Action: Reject Request
  const rejectRequest = useCallback((approvalId) => {
    const approval = approvals.find((a) => a.id === approvalId);
    if (!approval) return;

    // Update Approvals list
    setApprovals((prev) => prev.filter((a) => a.id !== approvalId));

    // Decrement pending approvals count
    setStats((prev) => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
    }));

    // If it's a Purchase Order approval, update the PO status to 'Rejected'
    if (approval.targetId.startsWith('PO-')) {
      setPurchaseOrders((prev) =>
        prev.map((po) =>
          po.id === approval.targetId ? { ...po, status: 'Rejected' } : po
        )
      );
    }

    // Add notification
    const newNotification = {
      id: Date.now(),
      text: `Rejected: ${approval.item} requested by ${approval.requester}`,
      time: 'Just now',
      unread: true,
      type: 'warning'
    };
    setNotifications((prev) => [newNotification, ...prev]);

    addToast(`Request rejected: ${approval.item}`, 'warning');
  }, [approvals, addToast]);

  // Action: Create RFQ
  const createRFQ = useCallback(async (rfqData) => {
    const newId = `RFQ-2026-0${rfqs.length + 12}`;
    const newRfq = {
      id: newId,
      subject: rfqData.subject,
      bidsCount: 0,
      closeDate: rfqData.closeDate,
      status: 'Open',
      vendorCategory: rfqData.category
    };

    setRfqs((prev) => [newRfq, ...prev]);
    setStats((prev) => ({
      ...prev,
      activeRfqs: prev.activeRfqs + 1
    }));

    const newNotification = {
      id: Date.now(),
      text: `New Request for Quotation created: ${newId} (${rfqData.subject})`,
      time: 'Just now',
      unread: true,
      type: 'info'
    };
    setNotifications((prev) => [newNotification, ...prev]);

    addToast(`RFQ ${newId} has been created successfully.`, 'success');

    // API Post Integration
    try {
      const token = '5b3f7a1e0bca4876b6de52382c75a89274534ef0da05cf14e7a89270df8276f3';
      const apiBase = window.location.origin.includes('localhost:5173') 
        ? 'http://localhost:8000' 
        : window.location.origin;

      await fetch(`${apiBase}/rfqs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: rfqData.subject,
          description: rfqData.description || 'Request for quotations',
          quantity: rfqData.quantity || 100,
          deadline: new Date(rfqData.closeDate || Date.now()).toISOString(),
          status: 'OPEN',
          created_by: 1
        })
      });
    } catch (err) {
      console.warn(`[ERP API] createRFQ post failed. API offline:`, err.message);
    }
  }, [rfqs, addToast]);

  // Action: Add Vendor
  const addVendor = useCallback(async (vendorData) => {
    const newId = `VEN-0${vendors.length + 10}`;
    const newVendor = {
      id: newId,
      name: vendorData.name,
      category: vendorData.category,
      rating: 5.0, // New vendors start with default rating
      status: 'Active'
    };

    setVendors((prev) => [...prev, newVendor]);

    const newNotification = {
      id: Date.now(),
      text: `Vendor ${vendorData.name} onboarded with ID ${newId}`,
      time: 'Just now',
      unread: true,
      type: 'success'
    };
    setNotifications((prev) => [newNotification, ...prev]);

    addToast(`Vendor "${vendorData.name}" has been registered.`, 'success');

    // API Post Integration
    try {
      const token = '5b3f7a1e0bca4876b6de52382c75a89274534534ef0da05cf14e7a89270df8276f3'; // Fallback token alignment
      const activeToken = '5b3f7a1e0bca4876b6de52382c75a89274534ef0da05cf14e7a89270df8276f3';
      const apiBase = window.location.origin.includes('localhost:5173') 
        ? 'http://localhost:8000' 
        : window.location.origin;

      await fetch(`${apiBase}/vendors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company_name: vendorData.name,
          gst_number: vendorData.gst || `27NEW${Date.now()}1Z5`,
          phone: vendorData.phone || '+1-555-0199',
          category: vendorData.category,
          rating: 5.0,
          status: 'PENDING',
          user_id: 2
        })
      });
    } catch (err) {
      console.warn(`[ERP API] addVendor post failed. API offline:`, err.message);
    }
  }, [vendors, addToast]);

  // Action: Generate Purchase Order
  const generatePO = useCallback((poData) => {
    const newId = `PO-2026-00${purchaseOrders.length + 37}`;
    const parsedAmount = parseFloat(poData.amount);

    const newPO = {
      id: newId,
      subject: poData.subject,
      vendor: poData.vendor,
      amount: parsedAmount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Pending',
      urgency: poData.urgency,
      requester: 'Current User (Procurement Admin)'
    };

    // Add to PO list
    setPurchaseOrders((prev) => [newPO, ...prev]);

    // Create an approval request for this new PO
    const approvalId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApproval = {
      id: approvalId,
      type: 'Purchase Order Approval',
      targetId: newId,
      item: poData.subject,
      vendor: poData.vendor,
      requester: 'Current User (Procurement Admin)',
      amount: parsedAmount,
      date: newPO.date,
      details: poData.notes || 'No notes provided. Automatically routed for supervisor approval.'
    };

    setApprovals((prev) => [newApproval, ...prev]);

    // Update Stats
    setStats((prev) => ({
      ...prev,
      recentPOs: prev.recentPOs + 1,
      pendingApprovals: prev.pendingApprovals + 1
    }));

    const newNotification = {
      id: Date.now(),
      text: `New Purchase Order ${newId} generated in Pending state. Approval routing initiated.`,
      time: 'Just now',
      unread: true,
      type: 'info'
    };
    setNotifications((prev) => [newNotification, ...prev]);

    addToast(`PO ${newId} generated. routed to supervisor under approval ${approvalId}`, 'success');
  }, [purchaseOrders, addToast]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        stats,
        purchaseOrders,
        approvals,
        rfqs,
        vendors,
        notifications,
        toasts,
        addToast,
        removeToast,
        approveRequest,
        rejectRequest,
        createRFQ,
        addVendor,
        generatePO,
        markAllNotificationsRead
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
