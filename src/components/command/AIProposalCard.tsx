import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIProposal, RiskLevel } from '../../types';
import { 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  XCircle, 
  Clock, 
  MapPin, 
  UserCheck, 
  AlertTriangle,
  Info,
  Shield,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface AIProposalCardProps {
  proposal: AIProposal;
}

export const AIProposalCard: React.FC<AIProposalCardProps> = ({ proposal }) => {
  const { 
    acceptAIProposal, 
    modifyAIProposal, 
    rejectAIProposal, 
    junctions, 
    officers 
  } = useApp();

  const [showModifyModal, setShowModifyModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  
  // Modify form state
  const [selectedOfficerIds, setSelectedOfficerIds] = useState<string[]>(
    proposal.suggestedOfficers.map(s => s.officerId)
  );
  const [modifiedDestination, setModifiedDestination] = useState<string>(proposal.locationId);
  const [modifiedPriority, setModifiedPriority] = useState<RiskLevel>(proposal.priority);
  const [modifyNotes, setModifyNotes] = useState<string>('');

  const isPending = proposal.status === 'pending';

  const handleAccept = () => {
    acceptAIProposal(proposal.id);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) return;
    rejectAIProposal(proposal.id, rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
  };

  const handleConfirmModify = () => {
    if (selectedOfficerIds.length === 0) return;
    modifyAIProposal(
      proposal.id,
      {
        officerIds: selectedOfficerIds,
        count: selectedOfficerIds.length,
        destinationId: modifiedDestination,
        priority: modifiedPriority,
      },
      modifyNotes || 'Operator customized officer selection.'
    );
    setShowModifyModal(false);
  };

  const toggleOfficerSelection = (id: string) => {
    if (selectedOfficerIds.includes(id)) {
      setSelectedOfficerIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedOfficerIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#DCDCD6] shadow-sm overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className={`px-4 py-3 flex items-center justify-between border-b ${
        proposal.priority === 'Critical' 
          ? 'bg-[#B8332C]/5 border-[#B8332C]/20' 
          : 'bg-[#E56B2F]/5 border-[#E56B2F]/20'
      }`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#E56B2F] text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#142C54]">
              AI Deployment Proposal
            </h3>
            <span className="text-[10px] text-[#5E625F]">Confidence Score: {proposal.confidenceScore}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-extrabold uppercase ${
            proposal.priority === 'Critical'
              ? 'bg-[#B8332C] text-white'
              : 'bg-[#E56B2F] text-white'
          }`}>
            {proposal.priority} Priority
          </span>

          {proposal.status !== 'pending' && (
            <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize ${
              proposal.status === 'accepted'
                ? 'bg-[#2E6B4A]/15 text-[#2E6B4A] border border-[#2E6B4A]/30'
                : proposal.status === 'modified'
                ? 'bg-[#C58A2A]/15 text-[#C58A2A] border border-[#C58A2A]/30'
                : 'bg-[#B8332C]/15 text-[#B8332C] border border-[#B8332C]/30'
            }`}>
              {proposal.status}
            </span>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-4 space-y-4 flex-1">
        {/* Destination & Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#FAF8F4] p-2.5 rounded-lg border border-[#DCDCD6]">
            <span className="text-[10px] uppercase font-bold text-[#5E625F] block">Target Location</span>
            <span className="text-xs font-extrabold text-[#142C54] block truncate mt-0.5">
              {proposal.locationName}
            </span>
          </div>

          <div className="bg-[#FAF8F4] p-2.5 rounded-lg border border-[#DCDCD6]">
            <span className="text-[10px] uppercase font-bold text-[#5E625F] block">Current Risk</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-extrabold text-[#B8332C]">{proposal.currentRisk}</span>
              <span className="text-[10px] text-[#5E625F]">/ 100</span>
            </div>
          </div>

          <div className="bg-[#FAF8F4] p-2.5 rounded-lg border border-[#DCDCD6]">
            <span className="text-[10px] uppercase font-bold text-[#5E625F] block">Coverage Deficit</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-extrabold text-[#B8332C]">
                {proposal.presentOfficers} / {proposal.requiredOfficers}
              </span>
              <span className="text-[10px] text-[#5E625F]">Present</span>
            </div>
          </div>

          <div className="bg-[#FAF8F4] p-2.5 rounded-lg border border-[#DCDCD6]">
            <span className="text-[10px] uppercase font-bold text-[#5E625F] block">Est. Response Time</span>
            <div className="flex items-center gap-1 mt-0.5 text-xs font-bold text-[#2E6B4A]">
              <Clock className="w-3 h-3" />
              <span>{proposal.estimatedResponseTime}</span>
            </div>
          </div>
        </div>

        {/* Recommended Action Summary */}
        <div className="bg-[#E56B2F]/10 border border-[#E56B2F]/30 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-[#E56B2F]" />
            <div>
              <span className="text-xs font-bold text-[#142C54] block">
                Recommended Action: Deploy {proposal.recommendedOfficersCount} Officers to {proposal.locationName}
              </span>
              <span className="text-[11px] text-[#5E625F]">
                Source Reserve: {proposal.sourceArea}
              </span>
            </div>
          </div>
        </div>

        {/* Suggested Personnel Cards */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E625F] block mb-2">
            Suggested Officers for Deployment:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {proposal.suggestedOfficers.map((sug) => (
              <div key={sug.officerId} className="p-2.5 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#142C54]">
                    <UserCheck className="w-3.5 h-3.5 text-[#2E6B4A]" />
                    <span>{sug.name}</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white text-[#142C54] border border-[#DCDCD6]">
                    {sug.serviceId}
                  </span>
                </div>
                <div className="text-[11px] text-[#5E625F] mb-1.5 flex items-center justify-between">
                  <span>From: {sug.sourceArea.split('(')[0]}</span>
                  <span className="font-semibold text-[#2E6B4A]">~{sug.distanceKm} km ({sug.estimatedResponseMinutes} min)</span>
                </div>
                <ul className="text-[10px] text-[#5E625F] space-y-0.5">
                  {sug.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-[#E56B2F] font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Explainable Reasoning Bullet Points */}
        <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#DCDCD6]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E625F] block mb-1.5 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#142C54]" />
            <span>AI Reasoning & Impact Justification:</span>
          </span>
          <ul className="text-xs text-[#252525] space-y-1">
            {proposal.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#E56B2F] font-bold mt-0.5">•</span>
                <span className="text-[11px]">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Human Operator Action Controls (PRD Section 29) */}
      <div className="px-4 py-3 bg-white border-t border-[#DCDCD6] flex flex-wrap items-center justify-between gap-3">
        <span className="text-[11px] text-[#5E625F] italic">
          Human Operator in the loop • All decisions logged to audit trail
        </span>

        {isPending ? (
          <div className="flex items-center gap-2">
            <button
              id={`proposal-reject-btn-${proposal.id}`}
              onClick={() => setShowRejectModal(true)}
              className="px-3 py-1.5 text-xs font-bold rounded bg-white hover:bg-red-50 text-[#B8332C] border border-[#B8332C]/40 transition-colors flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>

            <button
              id={`proposal-modify-btn-${proposal.id}`}
              onClick={() => setShowModifyModal(true)}
              className="px-3 py-1.5 text-xs font-bold rounded bg-white hover:bg-slate-50 text-[#142C54] border border-[#DCDCD6] transition-colors flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Modify</span>
            </button>

            <button
              id={`proposal-accept-btn-${proposal.id}`}
              onClick={handleAccept}
              className="px-4 py-1.5 text-xs font-bold rounded bg-[#2E6B4A] hover:bg-[#1F4E38] text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Accept Recommendation</span>
            </button>
          </div>
        ) : (
          <div className="text-xs font-medium text-[#5E625F]">
            Reviewed by: <strong className="text-[#142C54]">{proposal.reviewedBy || 'Operator'}</strong> at {proposal.reviewedAt}
          </div>
        )}
      </div>

      {/* REJECT MODAL (Requires Reason - PRD Section 29, 76) */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-[#DCDCD6] shadow-2xl">
            <div className="flex items-center gap-2 text-[#B8332C] mb-2 font-bold text-sm">
              <XCircle className="w-5 h-5" />
              <h3>Reject AI Deployment Recommendation</h3>
            </div>
            <p className="text-xs text-[#5E625F] mb-3 leading-relaxed">
              Mandatory compliance policy: You must state the operational justification for overriding this AI proposal. This will be recorded in the official audit trail.
            </p>

            <textarea
              id="reject-reason-textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g. Source sector (Manish Nagar) has impending local school dispersal; alternative patrol already dispatched."
              className="w-full text-xs p-2.5 rounded-lg border border-[#DCDCD6] bg-[#FAF8F4] focus:ring-1 focus:ring-[#B8332C] focus:outline-none mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#5E625F] hover:bg-[#FAF8F4] rounded-md"
              >
                Cancel
              </button>
              <button
                id="confirm-reject-btn"
                disabled={!rejectReason.trim()}
                onClick={handleConfirmReject}
                className="px-4 py-1.5 text-xs font-bold bg-[#B8332C] hover:bg-red-800 disabled:opacity-50 text-white rounded-md transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODIFY MODAL (PRD Section 29) */}
      {showModifyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 border border-[#DCDCD6] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 text-[#142C54] mb-2 font-bold text-sm">
              <Sliders className="w-5 h-5 text-[#E56B2F]" />
              <h3>Modify Deployment Recommendation</h3>
            </div>
            <p className="text-xs text-[#5E625F] mb-4">
              Select or replace officers, adjust priority, or change destination as per local ground conditions.
            </p>

            <div className="space-y-4 text-xs">
              {/* Destination selector */}
              <div>
                <label className="font-bold text-[#142C54] block mb-1">Destination Junction:</label>
                <select
                  value={modifiedDestination}
                  onChange={(e) => setModifiedDestination(e.target.value)}
                  className="w-full p-2 rounded bg-[#FAF8F4] border border-[#DCDCD6]"
                >
                  {junctions.map((j) => (
                    <option key={j.id} value={j.id}>{j.name} ({j.zone} Zone, Risk: {j.currentRisk})</option>
                  ))}
                </select>
              </div>

              {/* Priority selector */}
              <div>
                <label className="font-bold text-[#142C54] block mb-1">Deployment Priority:</label>
                <select
                  value={modifiedPriority}
                  onChange={(e) => setModifiedPriority(e.target.value as RiskLevel)}
                  className="w-full p-2 rounded bg-[#FAF8F4] border border-[#DCDCD6]"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Officer checklist */}
              <div>
                <label className="font-bold text-[#142C54] block mb-1">Select Officers to Dispatch ({selectedOfficerIds.length} chosen):</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 border border-[#DCDCD6] p-2 rounded bg-[#FAF8F4]">
                  {officers
                    .filter(o => o.currentStatus !== 'Off Duty')
                    .map((off) => {
                      const isChecked = selectedOfficerIds.includes(off.id);
                      return (
                        <label
                          key={off.id}
                          className={`flex items-center justify-between p-1.5 rounded cursor-pointer ${
                            isChecked ? 'bg-[#E56B2F]/10 border border-[#E56B2F]/30' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleOfficerSelection(off.id)}
                              className="rounded text-[#E56B2F] focus:ring-[#E56B2F]"
                            />
                            <span className="font-semibold text-[#142C54]">{off.name} ({off.serviceId})</span>
                          </div>
                          <span className="text-[10px] text-[#5E625F]">{off.currentStatus} • {off.currentLocationName.split('(')[0]}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Operator note */}
              <div>
                <label className="font-bold text-[#142C54] block mb-1">Operator Notes / Rationale:</label>
                <input
                  type="text"
                  value={modifyNotes}
                  onChange={(e) => setModifyNotes(e.target.value)}
                  placeholder="Reason for modification..."
                  className="w-full p-2 rounded bg-[#FAF8F4] border border-[#DCDCD6]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-[#DCDCD6]">
              <button
                onClick={() => setShowModifyModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#5E625F] hover:bg-[#FAF8F4] rounded-md"
              >
                Cancel
              </button>
              <button
                id="confirm-modify-btn"
                disabled={selectedOfficerIds.length === 0}
                onClick={handleConfirmModify}
                className="px-4 py-1.5 text-xs font-bold bg-[#E56B2F] hover:bg-[#B94A1F] disabled:opacity-50 text-white rounded-md transition-colors"
              >
                Apply & Dispatch Modified Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
