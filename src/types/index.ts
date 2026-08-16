export type UserRole = 
  | 'citizen' 
  | 'command_operator' 
  | 'control_room_operator' 
  | 'police_officer' 
  | 'admin';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type OfficerStatus = 
  | 'Available' 
  | 'Deployed' 
  | 'En Route' 
  | 'On Site' 
  | 'Off Duty' 
  | 'Emergency/Unavailable';

export type IncidentType = 
  | 'Accident' 
  | 'Heavy congestion' 
  | 'Road obstruction' 
  | 'Illegal parking' 
  | 'Vehicle breakdown' 
  | 'Road damage' 
  | 'Traffic signal issue' 
  | 'Waterlogging' 
  | 'Public event congestion' 
  | 'Other';

export type IncidentStatus = 
  | 'New' 
  | 'Under Review' 
  | 'Verified' 
  | 'Rejected' 
  | 'Action Initiated' 
  | 'Resolved';

export type ProposalStatus = 'pending' | 'accepted' | 'modified' | 'rejected';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  x: number; // For SVG map rendering (0 - 800)
  y: number; // For SVG map rendering (0 - 600)
}

export interface RiskFactor {
  name: string;
  points: number;
  category: 'congestion' | 'accident' | 'incident' | 'violation' | 'obstruction' | 'weather' | 'event' | 'coverage';
}

export interface Junction {
  id: string;
  name: string;
  marathiName?: string;
  zone: 'Central' | 'South' | 'North' | 'East' | 'West';
  coordinates: LocationCoordinates;
  currentRisk: number; // 0 - 100
  riskLevel: RiskLevel;
  requiredOfficers: number;
  presentOfficers: number;
  activeIncidentsCount: number;
  riskFactors: RiskFactor[];
  description: string;
  trafficVolumeHourly: number;
  primaryRoad: string;
  lastUpdated: string;
}

export interface Officer {
  id: string;
  serviceId: string;
  name: string;
  rank: 'Inspector' | 'Sub-Inspector' | 'Head Constable' | 'Constable' | 'Traffic Warden';
  phone: string;
  avatar?: string;
  currentStatus: OfficerStatus;
  currentLocationId: string;
  currentLocationName: string;
  assignedArea: string;
  shift: 'Morning (08:00–16:00)' | 'Evening (16:00–00:00)' | 'Night (00:00–08:00)';
  distanceKmToTarget?: number;
  suitabilityScore?: number;
  lastStatusUpdate: string;
}

export interface OfficerDutySchedule {
  id: string;
  timeRange: string;
  locationName: string;
  taskType: 'Briefing' | 'Traffic Regulation' | 'Break' | 'Patrol' | 'Junction Duty' | 'Special Assignment';
  isCurrent: boolean;
}

export interface CitizenReport {
  id: string;
  referenceId: string; // e.g. MR-INC-2026-00128
  type: IncidentType;
  locationId: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  description: string;
  evidenceUrl?: string;
  evidenceType?: 'image' | 'video' | 'none';
  evidenceAnalysis?: {
    authenticity: string;
    confidence: number;
    notes: string;
    exifDate?: string;
    compressionQuality?: string;
  };
  reporterName?: string;
  reporterContact?: string;
  submittedAt: string;
  status: IncidentStatus;
  priority: RiskLevel;
  riskImpactPoints: number;
  verifiedBy?: string;
  verifiedAt?: string;
  actionTaken?: string;
}

export interface AIProposal {
  id: string;
  incidentId?: string;
  locationId: string;
  locationName: string;
  priority: RiskLevel;
  currentRisk: number;
  requiredOfficers: number;
  presentOfficers: number;
  recommendedOfficersCount: number;
  suggestedOfficers: {
    officerId: string;
    name: string;
    serviceId: string;
    sourceArea: string;
    distanceKm: number;
    estimatedResponseMinutes: number;
    reasons: string[];
  }[];
  sourceArea: string;
  estimatedResponseTime: string;
  reasons: string[];
  confidenceScore: number;
  status: ProposalStatus;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  operatorNotes?: string;
  modifiedDetails?: {
    officerIds: string[];
    count: number;
    destinationId: string;
    priority: RiskLevel;
  };
}

export interface DeploymentRecord {
  id: string;
  officerId: string;
  officerName: string;
  serviceId: string;
  destinationLocationId: string;
  destinationName: string;
  sourceLocationName: string;
  priority: RiskLevel;
  reason: string;
  assignedAt: string;
  authorizedBy: string;
  status: 'Dispatched' | 'En Route' | 'On Site' | 'Completed' | 'Cancelled';
  acknowledgedAt?: string;
  arrivedAt?: string;
}

export interface DeploymentChange {
  id: string;
  timestamp: string;
  previousLocation: string;
  newLocation: string;
  reason: string;
  authorizedBy: string;
  priority: RiskLevel;
}

export interface OfficerNotification {
  id: string;
  officerId: string;
  title: string;
  message: string;
  type: 'NEW_DEPLOYMENT' | 'INCIDENT_ALERT' | 'ROUTE_UPDATE' | 'SYSTEM_MESSAGE' | 'EMERGENCY';
  timestamp: string;
  priority: 'Critical' | 'High' | 'Normal';
  read: boolean;
  acknowledged: boolean;
  actionUrl?: string;
}

export interface FeedbackSubmission {
  id: string;
  name?: string;
  contact?: string;
  feedbackType: 'Website experience' | 'Incident reporting' | 'Accessibility' | 'Suggestion' | 'Other';
  message: string;
  rating?: number;
  submittedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  details?: string;
}

export interface EmergencyServiceRequest {
  id: string;
  serviceType: 'Ambulance (108)' | 'Fire Brigade (101)' | 'Traffic Control Room' | 'Disaster Management';
  incidentId: string;
  locationName: string;
  requestedBy: string;
  timestamp: string;
  urgency: 'Critical' | 'High';
  status: 'Coordinated' | 'In Progress' | 'Acknowledged';
  notes: string;
}
