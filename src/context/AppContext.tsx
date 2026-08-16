import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Junction,
  Officer,
  CitizenReport,
  AIProposal,
  DeploymentRecord,
  DeploymentChange,
  OfficerNotification,
  AuditLogEntry,
  EmergencyServiceRequest,
  FeedbackSubmission,
  OfficerStatus,
  IncidentStatus,
  RiskLevel,
} from '../types';
import {
  NAGPUR_JUNCTIONS,
  INITIAL_OFFICERS,
  INITIAL_CITIZEN_REPORTS,
  INITIAL_AI_PROPOSALS,
} from '../data/nagpurData';

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedJunctionId: string | null;
  setSelectedJunctionId: (id: string | null) => void;
  
  // Auth profiles
  currentOfficer: Officer;
  setCurrentOfficer: (officer: Officer) => void;
  operatorName: string;
  isLoggedIn: boolean;
  loginAs: (role: UserRole, officerId?: string) => void;
  logout: () => void;

  // Domain State
  junctions: Junction[];
  officers: Officer[];
  citizenReports: CitizenReport[];
  aiProposals: AIProposal[];
  deployments: DeploymentRecord[];
  deploymentChanges: DeploymentChange[];
  notifications: OfficerNotification[];
  auditLogs: AuditLogEntry[];
  emergencyRequests: EmergencyServiceRequest[];
  feedbackSubmissions: FeedbackSubmission[];

  // Metrics
  metrics: {
    criticalHotspots: number;
    activeIncidents: number;
    availableOfficers: number;
    priorityCoverage: number;
    baselineCoverage: number;
    resolvedToday: number;
  };

  // Actions
  submitCitizenReport: (report: Omit<CitizenReport, 'id' | 'referenceId' | 'submittedAt' | 'status' | 'riskImpactPoints' | 'priority'> & { priority?: RiskLevel }) => string;
  submitCitizenFeedback: (feedback: { rating: number; category: string; comment: string; citizenName?: string }) => void;
  citizenFeedback: { id: string; rating: number; category: string; comment: string; citizenName: string; submittedAt: string }[];
  verifyCitizenReport: (reportId: string, notes?: string) => void;
  rejectCitizenReport: (reportId: string, reason: string) => void;
  takeReportAction: (reportId: string, actionType: string, note?: string) => void;
  
  acceptAIProposal: (proposalId: string, operatorNotes?: string) => void;
  modifyAIProposal: (
    proposalId: string, 
    modifications: { officerIds: string[]; count: number; destinationId: string; priority: RiskLevel }, 
    notes: string
  ) => void;
  rejectAIProposal: (proposalId: string, reason: string) => void;

  redeployOfficer: (officerId: string, destinationId: string, reason: string) => void;
  updateOfficerStatus: (officerId: string, status: OfficerStatus) => void;
  acknowledgeOfficerDeployment: (deploymentId: string) => void;
  markOfficerOnSite: (deploymentId: string) => void;
  markOfficerCompleted: (deploymentId: string) => void;
  acknowledgeNotification: (notificationId: string) => void;

  submitFeedback: (feedback: Omit<FeedbackSubmission, 'id' | 'submittedAt'>) => void;
  createEmergencyRequest: (request: Omit<EmergencyServiceRequest, 'id' | 'timestamp' | 'status'>) => void;

  // Demo Simulation Controllers
  triggerSimulatedEvent: (eventType: 'accident_sitabuldi' | 'congestion_wardha' | 'waterlogging_sadar' | 'vip_convoy' | 'signal_failure') => void;
  resetDemoData: () => void;
  activeDemoStep: number;
  runDemoNextStep: () => void;
  setDemoStep: (step: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedJunctionId, setSelectedJunctionId] = useState<string | null>('junc-sitabuldi');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [operatorName] = useState<string>('Insp. R. Sharma (Duty Commander)');

  // Domain Collections
  const [junctions, setJunctions] = useState<Junction[]>(NAGPUR_JUNCTIONS);
  const [officers, setOfficers] = useState<Officer[]>(INITIAL_OFFICERS);
  const [currentOfficer, setCurrentOfficer] = useState<Officer>(INITIAL_OFFICERS[0]); // Constable Sachin Patil MR-104
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(INITIAL_CITIZEN_REPORTS);
  const [aiProposals, setAiProposals] = useState<AIProposal[]>(INITIAL_AI_PROPOSALS);
  
  const [deployments, setDeployments] = useState<DeploymentRecord[]>([
    {
      id: 'dep-001',
      officerId: 'off-101',
      officerName: 'Inspector Rajesh Sharma',
      serviceId: 'MR-101',
      destinationLocationId: 'junc-sitabuldi',
      destinationName: 'Sitabuldi Junction',
      sourceLocationName: 'Central HQ',
      priority: 'Critical',
      reason: 'Routine Peak Hour Supervision & Incident Oversight',
      assignedAt: '16:15 IST',
      authorizedBy: 'ACP Traffic Nagpur',
      status: 'On Site',
    },
    {
      id: 'dep-002',
      officerId: 'off-106',
      officerName: 'Sub-Inspector Ananya Joshi',
      serviceId: 'MR-106',
      destinationLocationId: 'junc-wardha-rd',
      destinationName: 'Wardha Road (Chhatrapati Sq)',
      sourceLocationName: 'South Ward Station',
      priority: 'High',
      reason: 'Highway Merging Regulation',
      assignedAt: '16:30 IST',
      authorizedBy: 'Insp. R. Sharma',
      status: 'On Site',
    },
  ]);

  const [deploymentChanges, setDeploymentChanges] = useState<DeploymentChange[]>([
    {
      id: 'chg-001',
      timestamp: '16:30 IST',
      previousLocation: 'Ajni Square',
      newLocation: 'Wardha Road (Chhatrapati Sq)',
      reason: 'Highway rush hour surge',
      authorizedBy: 'Insp. R. Sharma',
      priority: 'High',
    },
  ]);

  const [notifications, setNotifications] = useState<OfficerNotification[]>([
    {
      id: 'notif-001',
      officerId: 'off-104',
      title: 'CRITICAL ALERT — Sitabuldi Junction',
      message: 'Accident reported at Sitabuldi flyover underpass. High congestion buildup. Standby for immediate deployment order.',
      type: 'INCIDENT_ALERT',
      timestamp: '18:45 IST',
      priority: 'Critical',
      read: false,
      acknowledged: false,
    },
    {
      id: 'notif-002',
      officerId: 'off-118',
      title: 'TRAFFIC SURGE — Central Sector',
      message: 'High priority alert generated for Central Corridor. Potential redeployment from Sector 2 reserve pending.',
      type: 'INCIDENT_ALERT',
      timestamp: '18:43 IST',
      priority: 'High',
      read: false,
      acknowledged: false,
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-001',
      timestamp: '18:46 IST',
      user: 'Insp. R. Sharma',
      role: 'Command Operator',
      action: 'Verified Citizen Report',
      entity: 'CitizenReport',
      entityId: 'MR-INC-2026-00128',
      newValue: 'Status: Verified (Risk +25 pts)',
      details: 'Collision under metro pillar 42 confirmed via verified EXIF evidence',
    },
    {
      id: 'log-002',
      timestamp: '18:46 IST',
      user: 'AI Decision Engine v2.4',
      role: 'Automated System',
      action: 'Generated Deployment Proposal',
      entity: 'AIProposal',
      entityId: 'prop-001',
      newValue: 'Recommend 2 Officers (MR-118 & MR-104) to Sitabuldi',
      details: 'Coverage gap: 1/3 (33%) -> Target 3/3 (100%)',
    },
    {
      id: 'log-003',
      timestamp: '18:35 IST',
      user: 'Insp. R. Sharma',
      role: 'Command Operator',
      action: 'Initiated Action',
      entity: 'CitizenReport',
      entityId: 'MR-INC-2026-00130',
      newValue: 'Tow crane dispatch alert sent for Sadar double parking',
      details: 'Bus transit lane cleared',
    },
  ]);

  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyServiceRequest[]>([
    {
      id: 'emg-001',
      serviceType: 'Ambulance (108)',
      incidentId: 'rep-001',
      locationName: 'Sitabuldi Junction Underpass',
      requestedBy: 'Insp. R. Sharma',
      timestamp: '18:47 IST',
      urgency: 'Critical',
      status: 'Coordinated',
      notes: 'Paramedic team dispatched from GMC Nagpur for tempo driver minor lacerations.',
    },
  ]);

  const [feedbackSubmissions, setFeedbackSubmissions] = useState<FeedbackSubmission[]>([]);
  const [activeDemoStep, setActiveDemoStep] = useState<number>(0);

  // Compute operational metrics
  const criticalHotspots = junctions.filter(j => j.riskLevel === 'Critical').length;
  const activeIncidents = citizenReports.filter(r => r.status !== 'Resolved' && r.status !== 'Rejected').length;
  const availableOfficers = officers.filter(o => o.currentStatus === 'Available').length;
  
  // Calculate priority coverage
  const priorityJunctions = junctions.filter(j => j.riskLevel === 'Critical' || j.riskLevel === 'High');
  const totalRequired = priorityJunctions.reduce((acc, j) => acc + j.requiredOfficers, 0);
  const totalPresent = priorityJunctions.reduce((acc, j) => acc + Math.min(j.presentOfficers, j.requiredOfficers), 0);
  const priorityCoverage = totalRequired > 0 ? Math.round((totalPresent / totalRequired) * 100) : 100;
  const baselineCoverage = 61; // Fixed baseline for comparison

  const metrics = {
    criticalHotspots,
    activeIncidents,
    availableOfficers,
    priorityCoverage,
    baselineCoverage,
    resolvedToday: 14,
  };

  // Auth methods
  const loginAs = (role: UserRole, officerId?: string) => {
    setCurrentRole(role);
    setIsLoggedIn(true);
    if (role === 'police_officer') {
      const selected = officers.find(o => o.id === officerId) || officers[0];
      setCurrentOfficer(selected);
      setActiveView('officer-portal');
    } else if (role === 'command_operator' || role === 'control_room_operator' || role === 'admin') {
      setActiveView('command-dashboard');
    } else {
      setActiveView('home');
    }
  };

  const logout = () => {
    setCurrentRole('citizen');
    setIsLoggedIn(false);
    setActiveView('home');
  };

  // Citizen Report Submission
  const submitCitizenReport = (reportData: Omit<CitizenReport, 'id' | 'referenceId' | 'submittedAt' | 'status' | 'riskImpactPoints' | 'priority'> & { priority?: RiskLevel }): string => {
    const nextNum = String(citizenReports.length + 128).padStart(5, '0');
    const refId = `MR-INC-2026-${nextNum}`;
    const id = `rep-${Date.now()}`;

    // Deterministic AI evidence analysis
    const confidenceScore = Math.floor(Math.random() * 12) + 82; // 82 - 94%
    const riskPoints = reportData.type === 'Accident' ? 25 : reportData.type === 'Heavy congestion' ? 20 : 15;
    const determinedPriority: RiskLevel = reportData.priority || (reportData.type === 'Accident' ? 'Critical' : reportData.type === 'Heavy congestion' ? 'High' : 'Moderate');

    const newReport: CitizenReport = {
      ...reportData,
      id,
      referenceId: refId,
      submittedAt: 'Just now (New)',
      status: 'New',
      priority: determinedPriority,
      riskImpactPoints: riskPoints,
      evidenceAnalysis: reportData.evidenceAnalysis || {
        authenticity: 'Likely authentic',
        confidence: confidenceScore,
        notes: `AI vision scan: Image features align with ${reportData.locationName}. Vehicle density, license plates, and environment verified authentic.`,
        exifDate: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
        compressionQuality: 'Standard camera JPEG, 90%',
      },
    };

    setCitizenReports(prev => [newReport, ...prev]);

    // Recalculate junction risk
    setJunctions(prev => prev.map(j => {
      if (j.id === reportData.locationId) {
        const updatedRisk = Math.min(100, j.currentRisk + riskPoints);
        const newLevel: RiskLevel = updatedRisk >= 85 ? 'Critical' : updatedRisk >= 70 ? 'High' : updatedRisk >= 45 ? 'Moderate' : 'Low';
        return {
          ...j,
          currentRisk: updatedRisk,
          riskLevel: newLevel,
          activeIncidentsCount: j.activeIncidentsCount + 1,
          riskFactors: [
            { name: `Citizen Report: ${reportData.type}`, points: riskPoints, category: 'incident' },
            ...j.riskFactors,
          ],
        };
      }
      return j;
    }));

    // Add Audit Log
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        user: reportData.reporterName || 'Anonymous Citizen',
        role: 'Citizen',
        action: 'Submitted Traffic Incident Report',
        entity: 'CitizenReport',
        entityId: refId,
        newValue: `${reportData.type} at ${reportData.locationName}`,
        details: reportData.description,
      },
      ...prev,
    ]);

    return refId;
  };

  // Verify Report
  const verifyCitizenReport = (reportId: string, notes?: string) => {
    const report = citizenReports.find(r => r.id === reportId);
    if (!report) return;

    setCitizenReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'Verified' as IncidentStatus,
          verifiedBy: operatorName,
          verifiedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
          actionTaken: notes || 'Verified by Control Room Operator. Deployment evaluation initiated.',
        };
      }
      return r;
    }));

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        user: operatorName,
        role: 'Command Operator',
        action: 'Verified Citizen Report',
        entity: 'CitizenReport',
        entityId: report.referenceId,
        oldValue: 'Status: Under Review',
        newValue: 'Status: Verified',
        details: notes || 'Evidence and ground report verified',
      },
      ...prev,
    ]);
  };

  // Reject Report
  const rejectCitizenReport = (reportId: string, reason: string) => {
    const report = citizenReports.find(r => r.id === reportId);
    if (!report) return;

    setCitizenReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'Rejected' as IncidentStatus,
          verifiedBy: operatorName,
          verifiedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
          actionTaken: `Rejected: ${reason}`,
        };
      }
      return r;
    }));

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        user: operatorName,
        role: 'Command Operator',
        action: 'Rejected Citizen Report',
        entity: 'CitizenReport',
        entityId: report.referenceId,
        oldValue: 'Status: ' + report.status,
        newValue: 'Status: Rejected',
        details: `Reason: ${reason}`,
      },
      ...prev,
    ]);
  };

  // Take Report Action
  const takeReportAction = (reportId: string, actionType: string, note?: string) => {
    const report = citizenReports.find(r => r.id === reportId);
    if (!report) return;

    setCitizenReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'Action Initiated' as IncidentStatus,
          actionTaken: `${actionType} ${note ? `(${note})` : ''}`,
        };
      }
      return r;
    }));

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        user: operatorName,
        role: 'Command Operator',
        action: `Action Initiated: ${actionType}`,
        entity: 'CitizenReport',
        entityId: report.referenceId,
        newValue: actionType,
        details: note || 'Dispatched field units / coordinated support',
      },
      ...prev,
    ]);
  };

  // Accept AI Proposal
  const acceptAIProposal = (proposalId: string, operatorNotes?: string) => {
    const proposal = aiProposals.find(p => p.id === proposalId);
    if (!proposal) return;

    // Update proposal status
    setAiProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          status: 'accepted' as const,
          reviewedBy: operatorName,
          reviewedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
          operatorNotes: operatorNotes || 'Approved without modifications.',
        };
      }
      return p;
    }));

    // Deploy the suggested officers
    const deployedOfficerNames: string[] = [];
    proposal.suggestedOfficers.forEach(sug => {
      deployedOfficerNames.push(sug.name);
      
      // Update officer status
      setOfficers(prev => prev.map(o => {
        if (o.id === sug.officerId) {
          return {
            ...o,
            currentStatus: 'En Route',
            currentLocationId: proposal.locationId,
            currentLocationName: proposal.locationName,
            lastStatusUpdate: 'Just now',
          };
        }
        return o;
      }));

      // Create deployment record
      const depRecord: DeploymentRecord = {
        id: `dep-${Date.now()}-${sug.officerId}`,
        officerId: sug.officerId,
        officerName: sug.name,
        serviceId: sug.serviceId,
        destinationLocationId: proposal.locationId,
        destinationName: proposal.locationName,
        sourceLocationName: sug.sourceArea,
        priority: proposal.priority,
        reason: `AI Recommendation: High priority dispatch for ${proposal.locationName} (${proposal.currentRisk}/100 Risk)`,
        assignedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        authorizedBy: operatorName,
        status: 'Dispatched',
      };
      setDeployments(prev => [depRecord, ...prev]);

      // Create deployment change entry
      setDeploymentChanges(prev => [
        {
          id: `chg-${Date.now()}-${sug.officerId}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
          previousLocation: sug.sourceArea,
          newLocation: proposal.locationName,
          reason: `High risk incident response (Risk: ${proposal.currentRisk})`,
          authorizedBy: operatorName,
          priority: proposal.priority,
        },
        ...prev,
      ]);

      // Send high priority notification to officer
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}-${sug.officerId}`,
          officerId: sug.officerId,
          title: `NEW DEPLOYMENT: ${proposal.locationName}`,
          message: `You have been deployed by Command Control to ${proposal.locationName}. Priority: ${proposal.priority}. Estimated transit: ${sug.estimatedResponseMinutes} mins. Acknowledge and proceed immediately.`,
          type: 'NEW_DEPLOYMENT',
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
          priority: proposal.priority === 'Critical' ? 'Critical' : 'High',
          read: false,
          acknowledged: false,
        },
        ...prev,
      ]);
    });

    // Update destination junction coverage
    setJunctions(prev => prev.map(j => {
      if (j.id === proposal.locationId) {
        return {
          ...j,
          presentOfficers: j.presentOfficers + proposal.suggestedOfficers.length,
          // Risk stabilizes slightly with police presence
          currentRisk: Math.max(20, j.currentRisk - 15),
          riskLevel: j.currentRisk - 15 >= 85 ? 'Critical' : j.currentRisk - 15 >= 70 ? 'High' : 'Moderate',
        };
      }
      return j;
    }));

    // Log Audit
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        user: operatorName,
        role: 'Command Operator',
        action: 'Accepted AI Deployment Proposal',
        entity: 'AIProposal',
        entityId: proposal.id,
        newValue: `Deployed ${proposal.suggestedOfficers.length} Officers (${deployedOfficerNames.join(', ')}) to ${proposal.locationName}`,
        details: operatorNotes || 'All recommended units dispatched. Officer notifications triggered.',
      },
      ...prev,
    ]);
  };

  // Modify AI Proposal
  const modifyAIProposal = (
    proposalId: string,
    modifications: { officerIds: string[]; count: number; destinationId: string; priority: RiskLevel },
    notes: string
  ) => {
    const proposal = aiProposals.find(p => p.id === proposalId);
    if (!proposal) return;

    setAiProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          status: 'modified' as const,
          reviewedBy: operatorName,
          reviewedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
          operatorNotes: notes,
          modifiedDetails: modifications,
        };
      }
      return p;
    }));

    // Deploy modified selected officers
    modifications.officerIds.forEach(offId => {
      const officer = officers.find(o => o.id === offId);
      if (officer) {
        setOfficers(prev => prev.map(o => o.id === offId ? { ...o, currentStatus: 'En Route', lastStatusUpdate: 'Just now' } : o));
        
        const destination = junctions.find(j => j.id === modifications.destinationId) || junctions[0];

        setDeployments(prev => [
          {
            id: `dep-${Date.now()}-${offId}`,
            officerId: offId,
            officerName: officer.name,
            serviceId: officer.serviceId,
            destinationLocationId: destination.id,
            destinationName: destination.name,
            sourceLocationName: officer.currentLocationName,
            priority: modifications.priority,
            reason: `Modified AI Proposal: ${notes}`,
            assignedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
            authorizedBy: operatorName,
            status: 'Dispatched',
          },
          ...prev,
        ]);

        setNotifications(prev => [
          {
            id: `notif-${Date.now()}-${offId}`,
            officerId: offId,
            title: `DEPLOYMENT ORDER (MODIFIED): ${destination.name}`,
            message: `Command Center has assigned you to ${destination.name}. Priority: ${modifications.priority}. ${notes}`,
            type: 'NEW_DEPLOYMENT',
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
            priority: 'High',
            read: false,
            acknowledged: false,
          },
          ...prev,
        ]);
      }
    });

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        user: operatorName,
        role: 'Command Operator',
        action: 'Modified & Approved AI Proposal',
        entity: 'AIProposal',
        entityId: proposal.id,
        newValue: `Modified deployment: ${modifications.officerIds.length} officers assigned`,
        details: `Reason/Notes: ${notes}`,
      },
      ...prev,
    ]);
  };

  // Reject AI Proposal
  const rejectAIProposal = (proposalId: string, reason: string) => {
    const proposal = aiProposals.find(p => p.id === proposalId);
    if (!proposal) return;

    setAiProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          status: 'rejected' as const,
          reviewedBy: operatorName,
          reviewedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
          operatorNotes: `Rejected: ${reason}`,
        };
      }
      return p;
    }));

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        user: operatorName,
        role: 'Command Operator',
        action: 'Rejected AI Deployment Proposal',
        entity: 'AIProposal',
        entityId: proposal.id,
        oldValue: 'Status: Pending Review',
        newValue: 'Status: Rejected',
        details: `Operator Justification: ${reason}`,
      },
      ...prev,
    ]);
  };

  // Direct Officer Redeployment
  const redeployOfficer = (officerId: string, destinationId: string, reason: string) => {
    const officer = officers.find(o => o.id === officerId);
    const destination = junctions.find(j => j.id === destinationId);
    if (!officer || !destination) return;

    const prevLocation = officer.currentLocationName;

    // Update officer
    setOfficers(prev => prev.map(o => {
      if (o.id === officerId) {
        return {
          ...o,
          currentStatus: 'En Route',
          currentLocationId: destination.id,
          currentLocationName: destination.name,
          lastStatusUpdate: 'Just now',
        };
      }
      return o;
    }));

    // Update source & destination counts
    setJunctions(prev => prev.map(j => {
      if (j.id === officer.currentLocationId) {
        return { ...j, presentOfficers: Math.max(0, j.presentOfficers - 1) };
      }
      if (j.id === destination.id) {
        return { ...j, presentOfficers: j.presentOfficers + 1 };
      }
      return j;
    }));

    // Create deployment record
    setDeployments(prev => [
      {
        id: `dep-${Date.now()}`,
        officerId: officer.id,
        officerName: officer.name,
        serviceId: officer.serviceId,
        destinationLocationId: destination.id,
        destinationName: destination.name,
        sourceLocationName: prevLocation,
        priority: 'High',
        reason,
        assignedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        authorizedBy: operatorName,
        status: 'Dispatched',
      },
      ...prev,
    ]);

    // Record change
    setDeploymentChanges(prev => [
      {
        id: `chg-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        previousLocation: prevLocation,
        newLocation: destination.name,
        reason,
        authorizedBy: operatorName,
        priority: 'High',
      },
      ...prev,
    ]);

    // Officer notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        officerId: officer.id,
        title: `REDEPLOYMENT: ${destination.name}`,
        message: `Command control has redeployed you from ${prevLocation} to ${destination.name}. Reason: ${reason}. Acknowledge and proceed.`,
        type: 'ROUTE_UPDATE',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        priority: 'High',
        read: false,
        acknowledged: false,
      },
      ...prev,
    ]);

    // Audit log
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        user: operatorName,
        role: 'Command Operator',
        action: 'Manual Officer Redeployment',
        entity: 'Officer',
        entityId: officer.serviceId,
        oldValue: prevLocation,
        newValue: destination.name,
        details: `Reason: ${reason}`,
      },
      ...prev,
    ]);
  };

  // Officer status transitions
  const updateOfficerStatus = (officerId: string, status: OfficerStatus) => {
    setOfficers(prev => prev.map(o => o.id === officerId ? { ...o, currentStatus: status, lastStatusUpdate: 'Just now' } : o));
    if (currentOfficer.id === officerId) {
      setCurrentOfficer(prev => ({ ...prev, currentStatus: status, lastStatusUpdate: 'Just now' }));
    }
  };

  const acknowledgeOfficerDeployment = (deploymentId: string) => {
    setDeployments(prev => prev.map(d => {
      if (d.id === deploymentId) {
        return {
          ...d,
          status: 'En Route',
          acknowledgedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        };
      }
      return d;
    }));
    updateOfficerStatus(currentOfficer.id, 'En Route');
  };

  const markOfficerOnSite = (deploymentId: string) => {
    setDeployments(prev => prev.map(d => {
      if (d.id === deploymentId) {
        return {
          ...d,
          status: 'On Site',
          arrivedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        };
      }
      return d;
    }));
    updateOfficerStatus(currentOfficer.id, 'On Site');
  };

  const markOfficerCompleted = (deploymentId: string) => {
    setDeployments(prev => prev.map(d => {
      if (d.id === deploymentId) {
        return {
          ...d,
          status: 'Completed',
        };
      }
      return d;
    }));
    updateOfficerStatus(currentOfficer.id, 'Available');
  };

  const acknowledgeNotification = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true, acknowledged: true } : n));
  };

  const [citizenFeedback, setCitizenFeedback] = useState<{ id: string; rating: number; category: string; comment: string; citizenName: string; submittedAt: string }[]>([
    { id: 'fb-1', rating: 5, category: 'Response Time', comment: 'Quick clearance of broken down tempo near Sitabuldi flyover.', citizenName: 'Pooja Kulkarni (Dharampeth)', submittedAt: 'Yesterday' },
    { id: 'fb-2', rating: 4, category: 'Police Visibility', comment: 'Noticeable presence of traffic constables during evening rush on Wardha road.', citizenName: 'Dr. Anand Joshi (Dhantoli)', submittedAt: '2 days ago' },
    { id: 'fb-3', rating: 5, category: 'Platform Ease of Use', comment: 'Very easy to upload accident photo with GPS tag.', citizenName: 'Sumit Sharma (Sadar)', submittedAt: '3 days ago' },
  ]);

  const submitCitizenFeedback = (feedback: { rating: number; category: string; comment: string; citizenName?: string }) => {
    const newFb = {
      id: `fb-${Date.now()}`,
      rating: feedback.rating,
      category: feedback.category,
      comment: feedback.comment,
      citizenName: feedback.citizenName || 'Nagpur Citizen',
      submittedAt: 'Just now',
    };
    setCitizenFeedback(prev => [newFb, ...prev]);
  };

  const createEmergencyRequest = (reqData: Omit<EmergencyServiceRequest, 'id' | 'timestamp' | 'status'>) => {
    const newReq: EmergencyServiceRequest = {
      ...reqData,
      id: `emg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      status: 'Coordinated',
    };
    setEmergencyRequests(prev => [newReq, ...prev]);

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: newReq.timestamp,
        user: operatorName,
        role: 'Command Operator',
        action: `Triggered Emergency Request: ${reqData.serviceType}`,
        entity: 'EmergencyServiceRequest',
        entityId: newReq.id,
        newValue: reqData.locationName,
        details: reqData.notes,
      },
      ...prev,
    ]);
  };

  // Demo simulator scenarios
  const triggerSimulatedEvent = (eventType: 'accident_sitabuldi' | 'congestion_wardha' | 'waterlogging_sadar' | 'vip_convoy' | 'signal_failure') => {
    if (eventType === 'accident_sitabuldi') {
      submitCitizenReport({
        type: 'Accident',
        locationId: 'junc-sitabuldi',
        locationName: 'Sitabuldi Junction Main Flyover',
        coordinates: { lat: 21.1458, lng: 79.0882 },
        description: 'Auto-rickshaw and SUV collision blocking 2 lanes on the flyover ramp. Spill on asphalt.',
        reporterName: 'Simulated Citizen Bot',
        reporterContact: '+91 98220 00999',
        evidenceType: 'image',
        evidenceUrl: 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?auto=format&fit=crop&w=800&q=80',
      });
    } else if (eventType === 'congestion_wardha') {
      submitCitizenReport({
        type: 'Heavy congestion',
        locationId: 'junc-wardha-rd',
        locationName: 'Wardha Road (Chhatrapati Sq)',
        coordinates: { lat: 21.1120, lng: 79.0665 },
        description: 'Sudden bottleneck surge due to industrial shift traffic from MIHAN expressway.',
        reporterName: 'Traffic Loop Sensor #44',
        evidenceType: 'none',
      });
    } else if (eventType === 'waterlogging_sadar') {
      submitCitizenReport({
        type: 'Waterlogging',
        locationId: 'junc-sadar',
        locationName: 'Sadar Residency Road (Near Katol Naka)',
        coordinates: { lat: 21.1625, lng: 79.0825 },
        description: 'Drainage overflow after intense cloudburst. Vehicles wading through 1.5 ft water.',
        reporterName: 'Sadar Residents Association',
        evidenceType: 'image',
        evidenceUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
      });
    } else if (eventType === 'vip_convoy') {
      setAuditLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
          user: 'Nagpur Police Protocol Cell',
          role: 'Police Command',
          action: 'VIP Convoy Route Activated',
          entity: 'Junction',
          entityId: 'junc-zero-mile',
          newValue: 'Green Corridor Active',
          details: 'Zero Mile to Raj Bhavan protocol convoy passage',
        },
        ...prev,
      ]);
    } else if (eventType === 'signal_failure') {
      submitCitizenReport({
        type: 'Traffic signal issue',
        locationId: 'junc-medical-sq',
        locationName: 'Medical Square',
        coordinates: { lat: 21.1340, lng: 79.1020 },
        description: 'Phase 3 red-amber lamp controller short circuit. Blinking amber on all 4 arms.',
        reporterName: 'Traffic Warden Rakesh Bele',
        reporterContact: '+91 94228 71120',
        evidenceType: 'none',
      });
    }
  };

  const resetDemoData = () => {
    setJunctions(NAGPUR_JUNCTIONS);
    setOfficers(INITIAL_OFFICERS);
    setCitizenReports(INITIAL_CITIZEN_REPORTS);
    setAiProposals(INITIAL_AI_PROPOSALS);
    setActiveDemoStep(0);
  };

  const runDemoNextStep = () => {
    setActiveDemoStep(prev => (prev + 1) % 6);
  };

  const setDemoStep = (step: number) => {
    setActiveDemoStep(step);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeView,
        setActiveView,
        selectedJunctionId,
        setSelectedJunctionId,
        currentOfficer,
        setCurrentOfficer,
        operatorName,
        isLoggedIn,
        loginAs,
        logout,
        junctions,
        officers,
        citizenReports,
        aiProposals,
        deployments,
        deploymentChanges,
        notifications,
        auditLogs,
        emergencyRequests,
        feedbackSubmissions,
        metrics,
        submitCitizenReport,
        verifyCitizenReport,
        rejectCitizenReport,
        takeReportAction,
        acceptAIProposal,
        modifyAIProposal,
        rejectAIProposal,
        redeployOfficer,
        updateOfficerStatus,
        acknowledgeOfficerDeployment,
        markOfficerOnSite,
        markOfficerCompleted,
        acknowledgeNotification,
        submitCitizenFeedback,
        citizenFeedback,
        createEmergencyRequest,
        triggerSimulatedEvent,
        resetDemoData,
        activeDemoStep,
        runDemoNextStep,
        setDemoStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
