import React from 'react';
import { Logo } from '../Logo';
import { 
  Clock, 
  Radio
} from 'lucide-react';

export const CommandHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-[#DCDCD6] px-4 lg:px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Brand & Command Title */}
      <div className="flex items-center gap-3">
        <Logo variant="icon" size="sm" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-[#142C54] tracking-tight">
              MargRakshak Command Centre
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E56B2F]/10 text-[#B94A1F] border border-[#E56B2F]/30 uppercase">
              Operational
            </span>
          </div>
          <p className="text-[11px] text-[#5E625F]">
            AI-Assisted Traffic Risk & Police Deployment Decision Support
          </p>
        </div>
      </div>

      {/* System Status Indicators */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-3 bg-[#FAF8F4] px-3 py-1.5 rounded-lg border border-[#DCDCD6] text-xs">
          <div className="flex items-center gap-1.5 text-[#2E6B4A] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#2E6B4A] animate-pulse" />
            <span>Feed: Live</span>
          </div>
          <span className="text-[#DCDCD6]">|</span>
          <div className="flex items-center gap-1 text-[#5E625F]">
            <Clock className="w-3.5 h-3.5" />
            <span>Shift: Evening (16:00-00:00)</span>
          </div>
        </div>
      </div>
    </header>
  );
};

