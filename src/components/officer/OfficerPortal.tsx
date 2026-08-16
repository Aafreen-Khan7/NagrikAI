import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OFFICER_DUTY_SCHEDULES } from '../../data/nagpurData';
import { 
  Shield, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  Send, 
  Bell, 
  Shuffle, 
  Radio, 
  LogOut, 
  User,
  Check,
  Flame,
  MessageSquare
} from 'lucide-react';

export const OfficerPortal: React.FC = () => {
  const { 
    currentOfficer, 
    setCurrentOfficer,
    officers,
    deployments, 
    deploymentChanges, 
    notifications, 
    citizenReports,
    updateOfficerStatus,
    acknowledgeOfficerDeployment,
    markOfficerOnSite,
    markOfficerCompleted,
    acknowledgeNotification,
    logout,
    setActiveView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'schedule' | 'deployment' | 'incidents' | 'notifications' | 'contact'>('deployment');
  const [contactMsg, setContactMsg] = useState<string>('');
  const [contactSuccess, setContactSuccess] = useState<string>('');
  const [assistanceRequested, setAssistanceRequested] = useState<boolean>(false);

  // Filter deployments for this officer
  const myDeployments = deployments.filter(d => d.officerId === currentOfficer.id);
  const activeDeployment = myDeployments[0] || null;

  // Filter notifications for this officer
  const myNotifications = notifications.filter(n => n.officerId === currentOfficer.id);
  const unreadNotifications = myNotifications.filter(n => !n.acknowledged);

  // Filter incidents in officer's sector
  const myAreaIncidents = citizenReports.filter(r => 
    r.locationId === currentOfficer.currentLocationId || 
    r.locationName.includes(currentOfficer.currentLocationName.split(' ')[0])
  );

  const handleSendMessage = () => {
    if (!contactMsg.trim()) return;
    setContactSuccess('Message transmitted to Control Room operator desk.');
    setContactMsg('');
    setTimeout(() => setContactSuccess(''), 4000);
  };

  const handleEmergencyAssistance = () => {
    setAssistanceRequested(true);
    setContactSuccess('URGENT: Backup assistance alert broadcast to Zone Command.');
    setTimeout(() => setContactSuccess(''), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col select-none">
      {/* Mobile-Friendly Officer Header (PRD Section 37) */}
      <header className="bg-[#142C54] text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E56B2F] text-white flex items-center justify-center font-extrabold text-sm border-2 border-white/20">
              {currentOfficer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold tracking-tight">
                  {currentOfficer.name}
                </h1>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-white/20 text-[#F4D8C7]">
                  {currentOfficer.serviceId}
                </span>
              </div>
              <p className="text-[11px] text-[#DCDCD6]">
                {currentOfficer.rank} • {currentOfficer.assignedArea}
              </p>
            </div>
          </div>

          {/* Quick Officer Switcher (For demo convenience) & Logout */}
          <div className="flex items-center gap-2">
            <select
              value={currentOfficer.id}
              onChange={(e) => {
                const target = officers.find(o => o.id === e.target.value);
                if (target) setCurrentOfficer(target);
              }}
              className="bg-white/10 text-white text-xs px-2 py-1 rounded border border-white/20 hidden sm:block focus:outline-none"
              title="Switch Officer for Testing"
            >
              {officers.slice(0, 5).map(o => (
                <option key={o.id} value={o.id} className="text-[#252525]">
                  {o.name} ({o.serviceId})
                </option>
              ))}
            </select>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded text-[#DCDCD6] hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Field Status Quick Bar */}
      <div className="bg-white border-b border-[#DCDCD6] px-4 py-2 shadow-xs">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#5E625F] font-semibold">Field Status:</span>
            <span className="px-2 py-0.5 rounded font-extrabold bg-[#2E6B4A]/15 text-[#2E6B4A] border border-[#2E6B4A]/30">
              {currentOfficer.currentStatus}
            </span>
            <span className="text-[#5E625F] text-[11px]">at {currentOfficer.currentLocationName.split('(')[0]}</span>
          </div>

          {/* Status Quick Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateOfficerStatus(currentOfficer.id, 'Available')}
              className={`px-2 py-1 rounded text-[11px] font-semibold ${
                currentOfficer.currentStatus === 'Available'
                  ? 'bg-[#2E6B4A] text-white'
                  : 'bg-[#FAF8F4] text-[#5E625F] hover:bg-[#DCDCD6]'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => updateOfficerStatus(currentOfficer.id, 'En Route')}
              className={`px-2 py-1 rounded text-[11px] font-semibold ${
                currentOfficer.currentStatus === 'En Route'
                  ? 'bg-[#E56B2F] text-white'
                  : 'bg-[#FAF8F4] text-[#5E625F] hover:bg-[#DCDCD6]'
              }`}
            >
              En Route
            </button>
            <button
              onClick={() => updateOfficerStatus(currentOfficer.id, 'On Site')}
              className={`px-2 py-1 rounded text-[11px] font-semibold ${
                currentOfficer.currentStatus === 'On Site'
                  ? 'bg-[#142C54] text-white'
                  : 'bg-[#FAF8F4] text-[#5E625F] hover:bg-[#DCDCD6]'
              }`}
            >
              On Site
            </button>
          </div>
        </div>
      </div>

      {/* Officer Navigation Tabs */}
      <div className="bg-white border-b border-[#DCDCD6]">
        <div className="max-w-4xl mx-auto flex items-center overflow-x-auto px-4 py-1 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('deployment')}
            className={`py-2 px-3 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'deployment'
                ? 'bg-[#E56B2F]/10 text-[#E56B2F] border-b-2 border-[#E56B2F]'
                : 'text-[#5E625F] hover:text-[#252525]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Current Deployment</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-2 px-3 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'schedule'
                ? 'bg-[#E56B2F]/10 text-[#E56B2F] border-b-2 border-[#E56B2F]'
                : 'text-[#5E625F] hover:text-[#252525]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Today's Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-3 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'notifications'
                ? 'bg-[#E56B2F]/10 text-[#E56B2F] border-b-2 border-[#E56B2F]'
                : 'text-[#5E625F] hover:text-[#252525]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications</span>
            {unreadNotifications.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#B8332C] text-white text-[9px] flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`py-2 px-3 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'incidents'
                ? 'bg-[#E56B2F]/10 text-[#E56B2F] border-b-2 border-[#E56B2F]'
                : 'text-[#5E625F] hover:text-[#252525]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Area Incidents ({myAreaIncidents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`py-2 px-3 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'contact'
                ? 'bg-[#E56B2F]/10 text-[#E56B2F] border-b-2 border-[#E56B2F]'
                : 'text-[#5E625F] hover:text-[#252525]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Contact Control</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full p-4 space-y-4 flex-1">
        
        {/* TAB 1: CURRENT DEPLOYMENT (PRD Section 39) */}
        {activeTab === 'deployment' && (
          <div className="space-y-4">
            {activeDeployment ? (
              <div className="bg-white rounded-xl border border-[#DCDCD6] p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between border-b border-[#DCDCD6] pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E56B2F] block">
                      Active Operational Deployment
                    </span>
                    <h2 className="text-xl font-extrabold text-[#142C54] mt-0.5">
                      {activeDeployment.destinationName}
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-extrabold uppercase bg-[#B8332C] text-white">
                    {activeDeployment.priority} Priority
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#DCDCD6]">
                    <span className="text-[10px] font-bold text-[#5E625F] uppercase block">Assigned Time</span>
                    <span className="font-bold text-[#142C54] mt-0.5 block">{activeDeployment.assignedAt}</span>
                  </div>

                  <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#DCDCD6]">
                    <span className="text-[10px] font-bold text-[#5E625F] uppercase block">Authorized By</span>
                    <span className="font-bold text-[#142C54] mt-0.5 block">{activeDeployment.authorizedBy}</span>
                  </div>

                  <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#DCDCD6]">
                    <span className="text-[10px] font-bold text-[#5E625F] uppercase block">Current Stage</span>
                    <span className="font-bold text-[#2E6B4A] mt-0.5 block">{activeDeployment.status}</span>
                  </div>
                </div>

                <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#DCDCD6] text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#5E625F] block">Deployment Objective:</span>
                  <p className="text-[#252525] font-medium">{activeDeployment.reason}</p>
                </div>

                {/* Field Action Buttons (PRD Section 39) */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <button
                    id="officer-acknowledge-btn"
                    onClick={() => acknowledgeOfficerDeployment(activeDeployment.id)}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-[#E56B2F] hover:bg-[#B94A1F] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Acknowledge Order</span>
                  </button>

                  <button
                    id="officer-onsite-btn"
                    onClick={() => markOfficerOnSite(activeDeployment.id)}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-[#2E6B4A] hover:bg-[#1F4E38] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Mark On Site</span>
                  </button>

                  <button
                    id="officer-completed-btn"
                    onClick={() => markOfficerCompleted(activeDeployment.id)}
                    className="py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 text-[#142C54] border border-[#DCDCD6] text-xs font-bold transition-colors"
                  >
                    Mark Completed
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#DCDCD6] p-8 text-center text-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#2E6B4A] mx-auto" />
                <h3 className="font-bold text-[#142C54] text-sm">No Active Emergency Deployment</h3>
                <p className="text-[#5E625F]">You are currently at your nominal sector post: {currentOfficer.currentLocationName}.</p>
              </div>
            )}

            {/* Deployment Changes / Redeployment History (PRD Section 40) */}
            <div className="bg-white rounded-xl border border-[#DCDCD6] p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#142C54] flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-[#E56B2F]" />
                <span>Deployment & Route Change Log</span>
              </h3>

              <div className="space-y-2 text-xs">
                {deploymentChanges.map((chg) => (
                  <div key={chg.id} className="p-2.5 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-[#142C54]">
                        <span>{chg.previousLocation}</span>
                        <span>→</span>
                        <span className="text-[#E56B2F]">{chg.newLocation}</span>
                      </div>
                      <p className="text-[11px] text-[#5E625F] mt-0.5">{chg.reason}</p>
                      <span className="text-[10px] text-[#5E625F] block mt-0.5">Authorized by: {chg.authorizedBy}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#5E625F] shrink-0">{chg.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TODAY'S SCHEDULE TIMELINE (PRD Section 38) */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-xl border border-[#DCDCD6] p-5 shadow-xs space-y-4">
            <div className="border-b border-[#DCDCD6] pb-3">
              <h2 className="text-base font-extrabold text-[#142C54]">
                Today’s Duty Schedule & Sector Allocation
              </h2>
              <p className="text-xs text-[#5E625F]">Evening Shift: 16:00 – 00:00 IST</p>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DCDCD6]">
              {OFFICER_DUTY_SCHEDULES.map((sch) => (
                <div key={sch.id} className="relative">
                  {/* Timeline bullet */}
                  <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white ${
                    sch.isCurrent ? 'bg-[#E56B2F] ring-4 ring-[#E56B2F]/20 animate-pulse' : 'bg-[#142C54]'
                  }`} />

                  <div className={`p-3 rounded-lg border text-xs ${
                    sch.isCurrent ? 'bg-[#E56B2F]/5 border-[#E56B2F]' : 'bg-[#FAF8F4] border-[#DCDCD6]'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#142C54] text-xs">{sch.locationName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sch.isCurrent ? 'bg-[#E56B2F] text-white' : 'bg-white text-[#5E625F] border border-[#DCDCD6]'
                      }`}>
                        {sch.timeRange}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5E625F] block">{sch.taskType} Assignment</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS (PRD Section 42) */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-xl border border-[#DCDCD6] p-4 shadow-xs space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#142C54] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#E56B2F]" />
              <span>Officer Mobile Notifications</span>
            </h2>

            <div className="space-y-2.5 text-xs">
              {myNotifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-3 rounded-lg border transition-all ${
                    n.priority === 'Critical'
                      ? 'bg-red-50/70 border-red-200'
                      : 'bg-[#FAF8F4] border-[#DCDCD6]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`font-bold ${n.priority === 'Critical' ? 'text-[#B8332C]' : 'text-[#142C54]'}`}>
                      {n.title}
                    </span>
                    <span className="text-[10px] text-[#5E625F] font-mono shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#252525] leading-relaxed mb-2">{n.message}</p>
                  
                  {!n.acknowledged && (
                    <button
                      onClick={() => acknowledgeNotification(n.id)}
                      className="px-2.5 py-1 rounded text-[10px] font-bold bg-white hover:bg-slate-100 text-[#142C54] border border-[#DCDCD6]"
                    >
                      ✓ Acknowledge Alert
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AREA INCIDENTS (PRD Section 41) */}
        {activeTab === 'incidents' && (
          <div className="bg-white rounded-xl border border-[#DCDCD6] p-4 shadow-xs space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#142C54] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E56B2F]" />
              <span>Incidents in Assigned Sector ({currentOfficer.assignedArea})</span>
            </h2>

            <div className="space-y-2 text-xs">
              {myAreaIncidents.map((inc) => (
                <div key={inc.id} className="p-3 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#142C54]">{inc.type}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#B8332C] text-white">
                      {inc.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5E625F]">{inc.description}</p>
                  <div className="text-[10px] text-[#5E625F] flex items-center justify-between pt-1 border-t border-[#DCDCD6]/50">
                    <span>{inc.locationName}</span>
                    <span>{inc.submittedAt}</span>
                  </div>
                </div>
              ))}

              {myAreaIncidents.length === 0 && (
                <div className="text-center py-6 text-xs text-[#5E625F]">
                  No active incidents currently reported in your sector.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT COMMAND CENTRE (PRD Section 43) */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-xl border border-[#DCDCD6] p-5 shadow-xs space-y-4">
            <div className="border-b border-[#DCDCD6] pb-3">
              <h2 className="text-base font-extrabold text-[#142C54]">
                Direct Contact with Command Center Desk
              </h2>
              <p className="text-xs text-[#5E625F]">Zone 1 Command Controller Desk (Insp. R. Sharma)</p>
            </div>

            {contactSuccess && (
              <div className="p-2.5 rounded-lg bg-[#2E6B4A]/10 border border-[#2E6B4A]/30 text-[#2E6B4A] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{contactSuccess}</span>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a
                href="tel:+917122561222"
                className="p-3 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] hover:border-[#142C54] transition-colors flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-[#142C54] text-white">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#142C54] block">Call Control Room Direct</span>
                  <span className="text-[10px] text-[#5E625F] font-mono">+91 712 2561222</span>
                </div>
              </a>

              <button
                id="officer-emergency-backup-btn"
                onClick={handleEmergencyAssistance}
                className="p-3 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-3 text-left"
              >
                <div className="p-2 rounded-lg bg-[#B8332C] text-white">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#B8332C] block">Request Immediate Backup</span>
                  <span className="text-[10px] text-red-600">Urgent reinforcement signal</span>
                </div>
              </button>
            </div>

            {/* Direct Message Transmitter */}
            <div className="space-y-2 text-xs pt-2 border-t border-[#DCDCD6]">
              <label className="font-bold text-[#142C54] block">Send Direct Message to Duty Operator:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Type message regarding local ground condition..."
                  className="flex-1 p-2 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] text-xs focus:outline-none focus:ring-1 focus:ring-[#E56B2F]"
                />
                <button
                  id="officer-send-msg-btn"
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-[#142C54] hover:bg-[#1f3f72] text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
