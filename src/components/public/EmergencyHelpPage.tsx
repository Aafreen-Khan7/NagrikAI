import React from 'react';
import { OFFICIAL_HELPLINES } from '../../data/nagpurData';
import { Phone, Shield, AlertTriangle, Activity, Flame, HeartHandshake, PhoneCall } from 'lucide-react';

export const EmergencyHelpPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 lg:py-16 space-y-10 select-none">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B8332C] bg-red-50 px-3 py-1 rounded-full border border-red-200">
          Emergency Response
        </span>
        <h1 className="text-3xl font-extrabold text-[#142C54] tracking-tight">
          Nagpur Emergency Helplines & Assistance
        </h1>
        <p className="text-xs sm:text-sm text-[#5E625F]">
          Verified direct emergency contact numbers for Nagpur City. Available 24 hours a day, 7 days a week.
        </p>
      </div>

      {/* Critical Highlight Banner */}
      <div className="bg-gradient-to-r from-[#142C54] to-[#1f3f72] text-white p-6 rounded-2xl border border-[#DCDCD6] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F4D8C7]">
            All-In-One National Emergency Number
          </span>
          <h2 className="text-2xl font-extrabold">Dial 112 (Emergency Response Support System)</h2>
          <p className="text-xs text-[#DCDCD6]">Police, Fire, and Ambulance coordinated response across Maharashtra.</p>
        </div>

        <a
          href="tel:112"
          className="px-6 py-3 rounded-xl bg-[#E56B2F] hover:bg-[#B94A1F] text-white text-sm font-extrabold transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call 112 Now</span>
        </a>
      </div>

      {/* Helpline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {OFFICIAL_HELPLINES.map((hl, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-[#DCDCD6] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#E56B2F] transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E6B4A] bg-[#2E6B4A]/10 px-2 py-0.5 rounded">
                  24x7 Official
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B4A]" />
              </div>
              <h3 className="text-base font-extrabold text-[#142C54]">
                {hl.name}
              </h3>
              <p className="text-xs text-[#5E625F] leading-relaxed">
                {hl.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#DCDCD6] flex items-center justify-between">
              <span className="font-mono text-sm font-extrabold text-[#142C54]">
                {hl.number}
              </span>
              <a
                href={`tel:${hl.number.replace(/\s+/g, '')}`}
                className="px-3 py-1.5 rounded-lg bg-[#FAF8F4] hover:bg-[#E56B2F] hover:text-white text-[#142C54] text-xs font-bold border border-[#DCDCD6] transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Advisory Note */}
      <div className="bg-[#FAF8F4] p-5 rounded-xl border border-[#DCDCD6] text-xs text-[#5E625F] leading-relaxed space-y-1">
        <strong className="text-[#142C54] block">Nagpur Traffic Safety Advisory:</strong>
        <p>
          In the event of a road traffic collision, please ensure you move to a safe pedestrian refuge or shoulder away from oncoming highway traffic before attempting phone calls. If anyone is injured, inform medical response (108) with the exact landmark and nearest metro pillar number.
        </p>
      </div>
    </div>
  );
};
