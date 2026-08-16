import React from 'react';
import { Target, Cpu, Users, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 lg:py-16 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142C54] tracking-tight">
          About MargRakshak Platform
        </h1>
        <p className="text-sm sm:text-base text-[#5E625F] leading-relaxed">
          MargRakshak is an AI-assisted traffic risk assessment and police deployment decision support system designed specifically for the road network, seasonal challenges, and urban growth of Nagpur City.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#DCDCD6] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#142C54] text-[#E56B2F] flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-base font-extrabold text-[#142C54]">Our Mission</h2>
          <p className="text-xs text-[#5E625F] leading-relaxed">
            Eliminate reactive policing by providing real-time risk scoring, predicting congestion choke points before they lock up, and saving critical emergency response minutes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DCDCD6] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#E56B2F] text-white flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-base font-extrabold text-[#142C54]">Explainable AI</h2>
          <p className="text-xs text-[#5E625F] leading-relaxed">
            Every deployment recommendation comes with transparent reasoning factors—distance, historic accident frequency, weather impact, and real-time coverage deficits.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DCDCD6] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#2E6B4A] text-white flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-base font-extrabold text-[#142C54]">Human in the Loop</h2>
          <p className="text-xs text-[#5E625F] leading-relaxed">
            AI never autonomously orders officers. Authorized Control Room Controllers retain complete authority to accept, modify, or reject every tactical deployment plan.
          </p>
        </div>
      </div>

      {/* Nagpur Context */}
      <div className="bg-[#FAF8F4] p-8 rounded-2xl border border-[#DCDCD6] space-y-4">
        <h2 className="text-xl font-extrabold text-[#142C54]">
          Tailored for Nagpur’s Road Geometry & Growth
        </h2>
        <p className="text-xs sm:text-sm text-[#5E625F] leading-relaxed">
          As India’s Zero Mile city and a rapidly expanding metropolitan hub with the Nagpur Metro and high-volume Wardha Road and Ring Road arterial corridors, the city faces distinct traffic dynamics. MargRakshak integrates real-time sensors, citizen reports, weather events, and police shift rosters into a single cohesive operating picture.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2 text-[#142C54] font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#2E6B4A]" />
            <span>12 High-Priority Traffic Sectors Mapped</span>
          </div>
          <div className="flex items-center gap-2 text-[#142C54] font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#2E6B4A]" />
            <span>AI Evidence & EXIF Verification Pipeline</span>
          </div>
          <div className="flex items-center gap-2 text-[#142C54] font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#2E6B4A]" />
            <span>Integrated Duty Shift & Dynamic Redeployment</span>
          </div>
          <div className="flex items-center gap-2 text-[#142C54] font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#2E6B4A]" />
            <span>Tamper-evident Immutable Audit Trails</span>
          </div>
        </div>
      </div>
    </div>
  );
};
