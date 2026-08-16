import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, FileWarning, Users, ShieldCheck, TrendingUp } from 'lucide-react';

export const KPICards: React.FC = () => {
  const { metrics, setActiveView } = useApp();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Critical Hotspots */}
      <div 
        onClick={() => setActiveView('command-map')}
        className="bg-white p-4 rounded-xl border border-[#DCDCD6] hover:border-[#B8332C] transition-all cursor-pointer shadow-xs group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5E625F]">
            Critical Hotspots
          </span>
          <div className="p-2 rounded-lg bg-[#B8332C]/10 text-[#B8332C]">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-[#B8332C]">
            {metrics.criticalHotspots < 10 ? `0${metrics.criticalHotspots}` : metrics.criticalHotspots}
          </span>
          <span className="text-xs font-semibold text-[#5E625F]">Critical locations</span>
        </div>
        <p className="text-[11px] text-[#5E625F] mt-1.5 flex items-center gap-1">
          <span className="text-[#B8332C] font-semibold">Sitabuldi & Wardha Rd</span> require immediate police cover
        </p>
      </div>

      {/* 2. Active Incidents */}
      <div 
        onClick={() => setActiveView('command-reports')}
        className="bg-white p-4 rounded-xl border border-[#DCDCD6] hover:border-[#E56B2F] transition-all cursor-pointer shadow-xs group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5E625F]">
            Active Incidents
          </span>
          <div className="p-2 rounded-lg bg-[#E56B2F]/10 text-[#E56B2F]">
            <FileWarning className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-[#142C54]">
            {metrics.activeIncidents}
          </span>
          <span className="text-xs font-semibold text-[#5E625F]">Open incidents</span>
        </div>
        <p className="text-[11px] text-[#5E625F] mt-1.5 flex items-center gap-1">
          <span className="text-[#2E6B4A] font-semibold">14 resolved</span> during current duty shift
        </p>
      </div>

      {/* 3. Available Officers */}
      <div 
        onClick={() => setActiveView('command-roster')}
        className="bg-white p-4 rounded-xl border border-[#DCDCD6] hover:border-[#2E6B4A] transition-all cursor-pointer shadow-xs group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5E625F]">
            Available Personnel
          </span>
          <div className="p-2 rounded-lg bg-[#2E6B4A]/10 text-[#2E6B4A]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-[#2E6B4A]">
            {metrics.availableOfficers}
          </span>
          <span className="text-xs font-semibold text-[#5E625F]">Ready for deployment</span>
        </div>
        <p className="text-[11px] text-[#5E625F] mt-1.5 flex items-center gap-1">
          <span>Sectors 1, 2, 3 reserve active</span>
        </p>
      </div>

      {/* 4. Priority Area Coverage */}
      <div 
        onClick={() => setActiveView('command-ai-proposals')}
        className="bg-white p-4 rounded-xl border border-[#DCDCD6] hover:border-[#E56B2F] transition-all cursor-pointer shadow-xs group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5E625F]">
            Priority Area Coverage
          </span>
          <div className="p-2 rounded-lg bg-[#E56B2F]/10 text-[#E56B2F]">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-[#E56B2F]">
            {metrics.priorityCoverage}%
          </span>
          <span className="text-xs font-bold text-[#2E6B4A] flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+21% vs Baseline</span>
          </span>
        </div>
        <p className="text-[11px] text-[#5E625F] mt-1.5">
          Baseline 61% → AI target 86% coverage
        </p>
      </div>
    </div>
  );
};
