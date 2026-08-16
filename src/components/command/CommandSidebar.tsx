import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  FileText, 
  Sparkles, 
  Send, 
  Shuffle, 
  ShieldCheck, 
  LogOut,
  Radio,
  Clock
} from 'lucide-react';

interface CommandSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const CommandSidebar: React.FC<CommandSidebarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { 
    citizenReports, 
    aiProposals, 
    officers, 
    operatorName, 
    logout 
  } = useApp();

  const newReportsCount = citizenReports.filter(r => r.status === 'New' || r.status === 'Under Review').length;
  const pendingProposalsCount = aiProposals.filter(p => p.status === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Nagpur Map & Hotspots', icon: Map },
    { id: 'roster', label: 'Police Roster & Schedule', icon: Users, badge: `${officers.filter(o => o.currentStatus === 'Available').length} Ready` },
    { id: 'reports', label: 'Citizen Reports Queue', icon: FileText, badge: newReportsCount > 0 ? `${newReportsCount} New` : undefined, badgeColor: 'bg-[#B8332C] text-white' },
    { id: 'ai-proposals', label: 'AI Deployment Proposals', icon: Sparkles, badge: pendingProposalsCount > 0 ? `${pendingProposalsCount} Action` : undefined, badgeColor: 'bg-[#E56B2F] text-white animate-pulse' },
    { id: 'deployments', label: 'Active Deployments', icon: Send },
    { id: 'redeployments', label: 'Dynamic Redeployments', icon: Shuffle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#DCDCD6] flex flex-col shrink-0 select-none h-full">
      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E625F] px-3 py-1 block">
          Command Modules
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#142C54] text-white shadow-xs'
                  : 'text-[#252525] hover:bg-[#FAF8F4] hover:text-[#142C54]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E56B2F]' : 'text-[#5E625F]'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.badgeColor || 'bg-[#FAF8F4] text-[#142C54] border border-[#DCDCD6]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Operator Session Info (PRD section 18: visually separated) */}
      <div className="p-3.5 border-t border-[#DCDCD6] bg-[#FAF8F4]">
        <div className="flex items-start gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-full bg-[#142C54] text-white flex items-center justify-center font-bold text-xs shrink-0">
            RS
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-[#142C54] block truncate leading-tight">
              {operatorName}
            </span>
            <span className="text-[10px] text-[#5E625F] block truncate">
              Duty Controller • Zone 1 Command
            </span>
            <div className="flex items-center gap-1 text-[10px] text-[#2E6B4A] font-semibold mt-0.5">
              <Radio className="w-2.5 h-2.5" />
              <span>Shift: 16:00 – 00:00 IST</span>
            </div>
          </div>
        </div>

        <button
          id="sidebar-logout-btn"
          onClick={logout}
          className="w-full py-1.5 text-xs font-semibold rounded bg-white hover:bg-red-50 text-[#B8332C] border border-[#DCDCD6] transition-colors flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Command Centre</span>
        </button>
      </div>
    </aside>
  );
};
