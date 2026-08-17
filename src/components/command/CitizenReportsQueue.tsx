import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenReport, IncidentStatus, RiskLevel } from '../../types';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Phone, 
  Flame, 
  Activity, 
  MapPin, 
  Clock, 
  Eye, 
  ShieldAlert, 
  Sparkles,
  AlertTriangle,
  Radio,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';

export const CitizenReportsQueue: React.FC = () => {
  const { 
    citizenReports, 
    verifyCitizenReport, 
    rejectCitizenReport, 
    takeReportAction,
    createEmergencyRequest,
    setActiveView 
  } = useApp();

  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [showRejectBox, setShowRejectBox] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  const filteredReports = citizenReports.filter((r) => {
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchType = typeFilter === 'All' || r.type === typeFilter;
    return matchStatus && matchType;
  });

  const formatTimeOnly = (value: string) => value.replace(/\s*\(.*\)$/, '').trim();

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Verified':
        return 'bg-[#2E6B4A]/15 text-[#2E6B4A] border-[#2E6B4A]/30';
      case 'Action Initiated':
        return 'bg-[#E56B2F]/15 text-[#E56B2F] border-[#E56B2F]/30';
      case 'Resolved':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityBadge = (priority: RiskLevel) => {
    switch (priority) {
      case 'Critical':
        return 'bg-[#B8332C] text-white';
      case 'High':
        return 'bg-[#E56B2F] text-white';
      case 'Moderate':
        return 'bg-[#C58A2A] text-white';
      case 'Low':
        return 'bg-[#2E6B4A] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleVerify = (report: CitizenReport) => {
    verifyCitizenReport(report.id);
    setActionSuccessMsg(`Report ${report.referenceId} verified. Risk and deployment updated.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleReject = (report: CitizenReport) => {
    if (!rejectReason.trim()) return;
    rejectCitizenReport(report.id, rejectReason);
    setShowRejectBox(false);
    setRejectReason('');
    setActionSuccessMsg(`Report ${report.referenceId} marked Rejected.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleDispatchAmbulance = (report: CitizenReport) => {
    createEmergencyRequest({
      serviceType: 'Ambulance (108)',
      incidentId: report.id,
      locationName: report.locationName,
      requestedBy: 'Command Center Duty Officer',
      urgency: 'Critical',
      notes: `Dispatched medical unit for incident ${report.referenceId} (${report.description.substring(0, 40)}...)`,
    });
    takeReportAction(report.id, 'Ambulance 108 Coordinated');
    setActionSuccessMsg('Emergency Ambulance (108) response coordinated.');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleDispatchFire = (report: CitizenReport) => {
    createEmergencyRequest({
      serviceType: 'Fire Brigade (101)',
      incidentId: report.id,
      locationName: report.locationName,
      requestedBy: 'Command Center Duty Officer',
      urgency: 'High',
      notes: `Fire & rescue coordinated for ${report.referenceId} at ${report.locationName}`,
    });
    takeReportAction(report.id, 'Fire Brigade 101 Coordinated');
    setActionSuccessMsg('Fire Brigade (101) dispatch alert sent.');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  return (
    <div className="bg-white rounded-xl border border-[#DCDCD6] p-4 shadow-xs flex flex-col h-full select-none">
      {/* Header & Status Alert */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#DCDCD6] mb-3">
        <div>
          <h2 className="text-sm font-extrabold text-[#142C54] tracking-tight uppercase flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#E56B2F]" />
            <span>Citizen Incident Reports Queue</span>
          </h2>
          <p className="text-[11px] text-[#5E625F]">
            Controlled operational queue with AI evidence confidence classification
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <select
            id="reports-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1 px-2.5 text-xs bg-[#FAF8F4] border border-[#DCDCD6] rounded-md text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#E56B2F]"
          >
            <option value="All">All Statuses</option>
            <option value="New">New Reports</option>
            <option value="Under Review">Under Review</option>
            <option value="Verified">Verified</option>
            <option value="Action Initiated">Action Initiated</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            id="reports-type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-1 px-2.5 text-xs bg-[#FAF8F4] border border-[#DCDCD6] rounded-md text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#E56B2F]"
          >
            <option value="All">All Types</option>
            <option value="Accident">Accident</option>
            <option value="Heavy congestion">Heavy congestion</option>
            <option value="Road obstruction">Road obstruction</option>
            <option value="Illegal parking">Illegal parking</option>
            <option value="Traffic signal issue">Signal issue</option>
            <option value="Waterlogging">Waterlogging</option>
          </select>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="mb-3 p-2 bg-[#2E6B4A]/10 border border-[#2E6B4A]/30 text-[#2E6B4A] rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Reports Table (PRD Section 25) */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#DCDCD6] text-[10px] uppercase font-bold text-[#5E625F] bg-[#FAF8F4]">
              <th className="py-2.5 px-3">Report Ref</th>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Incident Type</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">AI Evidence Check</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCDCD6]/60">
            {filteredReports.map((report) => (
              <tr 
                key={report.id}
                className={`hover:bg-[#FAF8F4] transition-colors cursor-pointer ${
                  selectedReport?.id === report.id ? 'bg-[#E56B2F]/5' : ''
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <td className="py-2.5 px-3 font-mono font-bold text-[#142C54]">
                  {report.referenceId}
                </td>
                <td className="py-2.5 px-3 text-[#5E625F] whitespace-nowrap">
                  {formatTimeOnly(report.submittedAt)}
                </td>
                <td className="py-2.5 px-3 font-semibold text-[#252525]">
                  {report.type}
                </td>
                <td className="py-2.5 px-3 text-[#5E625F] max-w-[160px] truncate" title={report.locationName}>
                  {report.locationName}
                </td>
                <td className="py-2.5 px-3">
                  {report.evidenceAnalysis ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2E6B4A] bg-[#2E6B4A]/10 px-2 py-0.5 rounded border border-[#2E6B4A]/20">
                      <Sparkles className="w-3 h-3 text-[#E56B2F]" />
                      <span>{report.evidenceAnalysis.confidence}% Confident</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#5E625F]">Text Only</span>
                  )}
                </td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityBadge(report.priority)}`}>
                    {report.priority}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    id={`view-report-btn-${report.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReport(report);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-[#FAF8F4] hover:bg-[#DCDCD6]/50 text-[#142C54] border border-[#DCDCD6] transition-colors"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Full Citizen Report Detail Modal (PRD Section 27) */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-5 border border-[#DCDCD6] shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#DCDCD6] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-[#142C54]">
                    Incident Report: {selectedReport.referenceId}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getPriorityBadge(selectedReport.priority)}`}>
                    {selectedReport.priority}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusBadge(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                </div>
                <p className="text-xs text-[#5E625F] mt-0.5">
                  Reported at {selectedReport.submittedAt} by {selectedReport.reporterName || 'Anonymous Citizen'}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded text-[#5E625F] hover:bg-[#FAF8F4]"
              >
                ✕
              </button>
            </div>

            {/* Description & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#DCDCD6]">
                <span className="text-[10px] font-bold uppercase text-[#5E625F] block mb-1">
                  Location & Sector
                </span>
                <span className="font-bold text-[#142C54] block">{selectedReport.locationName}</span>
                <span className="text-[11px] text-[#5E625F]">Coordinates: {selectedReport.coordinates.lat}, {selectedReport.coordinates.lng}</span>
              </div>

              <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#DCDCD6]">
                <span className="text-[10px] font-bold uppercase text-[#5E625F] block mb-1">
                  Reporter Contact (If provided)
                </span>
                <span className="font-bold text-[#142C54] block">{selectedReport.reporterName || 'Anonymous'}</span>
                <span className="text-[11px] text-[#5E625F]">{selectedReport.reporterContact || 'No phone supplied'}</span>
              </div>
            </div>

            {/* Incident Description */}
            <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#DCDCD6] text-xs">
              <span className="text-[10px] font-bold uppercase text-[#5E625F] block mb-1">
                Citizen Narrative:
              </span>
              <p className="text-[#252525] leading-relaxed">{selectedReport.description}</p>
            </div>

            {/* AI Evidence Verification Assessment (PRD Section 16) */}
            {selectedReport.evidenceAnalysis && (
              <div className="bg-[#E56B2F]/5 p-3.5 rounded-lg border border-[#E56B2F]/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-[#142C54]">
                    <Sparkles className="w-4 h-4 text-[#E56B2F]" />
                    <span>AI Evidence Authenticity Classification</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-[#2E6B4A] text-white">
                    {selectedReport.evidenceAnalysis.authenticity} ({selectedReport.evidenceAnalysis.confidence}%)
                  </span>
                </div>
                
                <p className="text-[11px] text-[#252525]">{selectedReport.evidenceAnalysis.notes}</p>
                
                <div className="flex flex-wrap gap-4 text-[10px] text-[#5E625F] pt-1 border-t border-[#E56B2F]/20">
                  <span>EXIF Date: <strong>{selectedReport.evidenceAnalysis.exifDate}</strong></span>
                  <span>Compression: <strong>{selectedReport.evidenceAnalysis.compressionQuality}</strong></span>
                  <span>Risk Impact: <strong className="text-[#B8332C]">+{selectedReport.riskImpactPoints} Risk Points</strong></span>
                </div>
              </div>
            )}

            {/* Evidence Image Preview */}
            {selectedReport.evidenceUrl && (
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase text-[#5E625F] block">
                  Uploaded Visual Evidence:
                </span>
                <div className="rounded-lg overflow-hidden border border-[#DCDCD6] max-h-56 bg-black/5">
                  <img
                    src={selectedReport.evidenceUrl}
                    alt="Citizen incident evidence"
                    className="w-full h-56 object-cover"
                  />
                </div>
              </div>
            )}

            {/* Operational Action Controls (PRD Section 26) */}
            <div className="pt-3 border-t border-[#DCDCD6] space-y-3">
              <span className="text-[10px] font-bold uppercase text-[#5E625F] block">
                Command Actions:
              </span>

              {/* Main row */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedReport.status !== 'Verified' && (
                  <button
                    id="modal-verify-report-btn"
                    onClick={() => handleVerify(selectedReport)}
                    className="px-3.5 py-1.5 text-xs font-bold rounded bg-[#2E6B4A] hover:bg-[#1F4E38] text-white transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify Report</span>
                  </button>
                )}

                <button
                  id="modal-propose-deploy-btn"
                  onClick={() => {
                    setSelectedReport(null);
                    setActiveView('command-ai-proposals');
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold rounded bg-[#E56B2F] hover:bg-[#B94A1F] text-white transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Deploy Police Officers</span>
                </button>

                <button
                  id="modal-dispatch-ambulance-btn"
                  onClick={() => handleDispatchAmbulance(selectedReport)}
                  className="px-3.5 py-1.5 text-xs font-bold rounded bg-white hover:bg-emerald-50 text-[#2E6B4A] border border-[#2E6B4A]/50 transition-colors flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Request Ambulance (108)</span>
                </button>

                <button
                  id="modal-dispatch-fire-btn"
                  onClick={() => handleDispatchFire(selectedReport)}
                  className="px-3.5 py-1.5 text-xs font-bold rounded bg-white hover:bg-orange-50 text-[#B94A1F] border border-[#B94A1F]/50 transition-colors flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Request Fire Brigade (101)</span>
                </button>

                <button
                  id="modal-reject-toggle-btn"
                  onClick={() => setShowRejectBox(!showRejectBox)}
                  className="px-3 py-1.5 text-xs font-bold rounded bg-white hover:bg-red-50 text-[#B8332C] border border-[#B8332C]/40 transition-colors"
                >
                  Reject Report
                </button>
              </div>

              {/* Reject with Reason Input */}
              {showRejectBox && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2 animate-fade-in text-xs">
                  <span className="font-bold text-[#B8332C] block">State reason for rejecting report:</span>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="E.g. Duplicate report already handled / Unrelated photo."
                    className="w-full p-2 rounded bg-white border border-red-300 text-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowRejectBox(false)}
                      className="px-2 py-1 text-xs text-[#5E625F]"
                    >
                      Cancel
                    </button>
                    <button
                      id="modal-confirm-reject-btn"
                      disabled={!rejectReason.trim()}
                      onClick={() => handleReject(selectedReport)}
                      className="px-3 py-1 text-xs font-bold bg-[#B8332C] text-white rounded disabled:opacity-50"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2 border-t border-[#DCDCD6]">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded bg-[#FAF8F4] text-[#5E625F] hover:bg-[#DCDCD6]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
