import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Officer, OfficerStatus } from '../../types';
import { 
  Users, 
  Shield, 
  MapPin, 
  Clock, 
  Phone, 
  Shuffle, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';

export const PoliceRosterTable: React.FC = () => {
  const { 
    officers, 
    junctions, 
    redeployOfficer, 
    updateOfficerStatus,
    operatorName 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [shiftFilter, setShiftFilter] = useState<string>('All');
  
  // Redeploy modal state
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [targetJunctionId, setTargetJunctionId] = useState<string>(junctions[0]?.id || '');
  const [redeployReason, setRedeployReason] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const filteredOfficers = officers.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        o.serviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        o.currentLocationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.currentStatus === statusFilter;
    const matchShift = shiftFilter === 'All' || o.shift.includes(shiftFilter);
    return matchSearch && matchStatus && matchShift;
  });

  const getStatusBadge = (status: OfficerStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-[#2E6B4A]/15 text-[#2E6B4A] border-[#2E6B4A]/30 font-bold';
      case 'On Site':
        return 'bg-blue-100 text-blue-800 border-blue-200 font-bold';
      case 'En Route':
        return 'bg-[#E56B2F]/15 text-[#E56B2F] border-[#E56B2F]/30 font-bold';
      case 'Deployed':
        return 'bg-[#C58A2A]/15 text-[#C58A2A] border-[#C58A2A]/30 font-bold';
      case 'Off Duty':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Emergency/Unavailable':
        return 'bg-red-100 text-red-700 border-red-200 font-bold';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleOpenRedeploy = (officer: Officer) => {
    setSelectedOfficer(officer);
    setTargetJunctionId(junctions[0]?.id || '');
    setRedeployReason(`Command Center re-allocation from ${officer.currentLocationName}`);
  };

  const handleConfirmRedeploy = () => {
    if (!selectedOfficer || !targetJunctionId) return;
    const targetJunc = junctions.find(j => j.id === targetJunctionId);
    redeployOfficer(selectedOfficer.id, targetJunctionId, redeployReason);
    setSuccessMsg(`Officer ${selectedOfficer.name} (${selectedOfficer.serviceId}) redeployed to ${targetJunc?.name}.`);
    setSelectedOfficer(null);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="bg-white rounded-xl border border-[#DCDCD6] p-4 shadow-xs flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#DCDCD6] mb-3">
        <div>
          <h2 className="text-sm font-extrabold text-[#142C54] tracking-tight uppercase flex items-center gap-2">
            <Users className="w-4 h-4 text-[#E56B2F]" />
            <span>Nagpur Police Personnel Roster</span>
          </h2>
          <p className="text-[11px] text-[#5E625F]">
            Active duty schedules, sector assignments, and dynamic field availability
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#5E625F]" />
            <input
              type="text"
              placeholder="Search officer name, MR ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-[#FAF8F4] border border-[#DCDCD6] rounded-md focus:ring-1 focus:ring-[#E56B2F] focus:outline-none"
            />
          </div>

          <select
            id="roster-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1 px-2 text-xs bg-[#FAF8F4] border border-[#DCDCD6] rounded-md text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#E56B2F]"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available (Ready)</option>
            <option value="On Site">On Site</option>
            <option value="En Route">En Route</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Emergency/Unavailable">Unavailable</option>
          </select>

          <select
            id="roster-shift-filter"
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="py-1 px-2 text-xs bg-[#FAF8F4] border border-[#DCDCD6] rounded-md text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#E56B2F]"
          >
            <option value="All">All Shifts</option>
            <option value="Morning">Morning Shift</option>
            <option value="Evening">Evening Shift (Active)</option>
            <option value="Night">Night Shift</option>
          </select>
        </div>
      </div>

      {successMsg && (
        <div className="mb-3 p-2 bg-[#2E6B4A]/10 border border-[#2E6B4A]/30 text-[#2E6B4A] rounded-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Roster Table (PRD Section 23: Table format required) */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#DCDCD6] text-[10px] uppercase font-bold text-[#5E625F] bg-[#FAF8F4]">
              <th className="py-2.5 px-3">Officer</th>
              <th className="py-2.5 px-3">Service ID</th>
              <th className="py-2.5 px-3">Current Status</th>
              <th className="py-2.5 px-3">Current Sector / Location</th>
              <th className="py-2.5 px-3">Duty Shift</th>
              <th className="py-2.5 px-3">Contact</th>
              <th className="py-2.5 px-3">Last Update</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCDCD6]/60">
            {filteredOfficers.map((officer) => (
              <tr key={officer.id} className="hover:bg-[#FAF8F4] transition-colors">
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#142C54] text-white flex items-center justify-center font-bold text-[10px]">
                      {officer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <span className="font-bold text-[#142C54] block leading-tight">{officer.name}</span>
                      <span className="text-[10px] text-[#5E625F]">{officer.rank}</span>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#252525]">
                  {officer.serviceId}
                </td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${getStatusBadge(officer.currentStatus)}`}>
                    {officer.currentStatus}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1 text-[#252525]">
                    <MapPin className="w-3 h-3 text-[#E56B2F] shrink-0" />
                    <span className="truncate max-w-[150px]" title={officer.currentLocationName}>
                      {officer.currentLocationName}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-[#5E625F]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#142C54]" />
                    <span>{officer.shift.split('(')[0]}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#5E625F]">
                  {officer.phone}
                </td>
                <td className="py-2.5 px-3 text-[11px] text-[#5E625F]">
                  {officer.lastStatusUpdate}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    id={`redeploy-btn-${officer.id}`}
                    onClick={() => handleOpenRedeploy(officer)}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-[#FAF8F4] hover:bg-[#E56B2F] hover:text-white text-[#142C54] border border-[#DCDCD6] transition-colors flex items-center gap-1 ml-auto"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Redeploy</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Redeploy Modal */}
      {selectedOfficer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-[#DCDCD6] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#142C54] border-b border-[#DCDCD6] pb-3">
              <Shuffle className="w-5 h-5 text-[#E56B2F]" />
              <div>
                <h3 className="text-sm font-extrabold">Redeploy Field Officer</h3>
                <p className="text-[11px] text-[#5E625F]">{selectedOfficer.name} ({selectedOfficer.serviceId})</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#FAF8F4] p-2.5 rounded border border-[#DCDCD6]">
                <span className="text-[10px] font-bold text-[#5E625F] uppercase block">Current Location</span>
                <span className="font-bold text-[#142C54]">{selectedOfficer.currentLocationName}</span>
              </div>

              <div>
                <label className="font-bold text-[#142C54] block mb-1">New Destination Sector:</label>
                <select
                  value={targetJunctionId}
                  onChange={(e) => setTargetJunctionId(e.target.value)}
                  className="w-full p-2 rounded bg-[#FAF8F4] border border-[#DCDCD6] text-xs font-semibold"
                >
                  {junctions.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name} (Risk: {j.currentRisk}/100 • {j.presentOfficers}/{j.requiredOfficers} Officers)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#142C54] block mb-1">Operational Order / Reason:</label>
                <input
                  type="text"
                  value={redeployReason}
                  onChange={(e) => setRedeployReason(e.target.value)}
                  placeholder="Reason for movement..."
                  className="w-full p-2 rounded bg-[#FAF8F4] border border-[#DCDCD6] text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCDCD6]">
              <button
                onClick={() => setSelectedOfficer(null)}
                className="px-3 py-1.5 text-xs text-[#5E625F] hover:bg-[#FAF8F4] rounded-md"
              >
                Cancel
              </button>
              <button
                id="confirm-redeploy-action-btn"
                onClick={handleConfirmRedeploy}
                className="px-4 py-1.5 text-xs font-bold bg-[#E56B2F] hover:bg-[#B94A1F] text-white rounded-md transition-colors"
              >
                Authorize Redeployment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
