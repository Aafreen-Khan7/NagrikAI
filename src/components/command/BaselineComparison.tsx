import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, TrendingUp, ArrowRight, BarChart2, CheckCircle2 } from 'lucide-react';

export const BaselineComparison: React.FC = () => {
  const { junctions, metrics } = useApp();

  const keyJunctions = junctions.slice(0, 4);

  return (
    <div className="bg-white rounded-xl border border-[#DCDCD6] p-4 shadow-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DCDCD6] mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#E56B2F]" />
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#142C54]">
              Baseline vs. AI Recommended Deployment
            </h3>
            <p className="text-[11px] text-[#5E625F]">Impact on Nagpur Priority Hotspot Coverage</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2E6B4A]/10 text-[#2E6B4A] border border-[#2E6B4A]/30 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>+25% Coverage Boost</span>
        </span>
      </div>

      {/* Coverage Progress Comparison Meter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Baseline State */}
        <div className="bg-[#FAF8F4] p-3 rounded-lg border border-[#DCDCD6]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E625F]">
              Current / Baseline Coverage
            </span>
            <span className="text-xs font-extrabold text-[#B8332C]">61%</span>
          </div>
          <div className="w-full bg-[#DCDCD6] h-2.5 rounded-full overflow-hidden mb-2">
            <div className="bg-[#B8332C] h-full rounded-full transition-all duration-500" style={{ width: '61%' }} />
          </div>
          <span className="text-[10px] text-[#5E625F] block">
            Severe manpower deficits across Central & South Highway corridors.
          </span>
        </div>

        {/* AI Recommended State */}
        <div className="bg-[#E56B2F]/5 p-3 rounded-lg border border-[#E56B2F]/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#142C54] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#2E6B4A]" />
              <span>AI Optimized Post-Deployment</span>
            </span>
            <span className="text-xs font-extrabold text-[#2E6B4A]">86%</span>
          </div>
          <div className="w-full bg-[#DCDCD6] h-2.5 rounded-full overflow-hidden mb-2">
            <div className="bg-[#2E6B4A] h-full rounded-full transition-all duration-500" style={{ width: '86%' }} />
          </div>
          <span className="text-[10px] text-[#142C54] font-medium block">
            Critical choke points manned while preserving minimum sector safety baselines.
          </span>
        </div>
      </div>

      {/* Junction by Junction Allocation Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#DCDCD6] text-[10px] uppercase font-bold text-[#5E625F] bg-[#FAF8F4]">
              <th className="py-2 px-3">Priority Junction</th>
              <th className="py-2 px-3">Current Staffing</th>
              <th className="py-2 px-3 text-center">→</th>
              <th className="py-2 px-3">AI Recommended</th>
              <th className="py-2 px-3 text-right">Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCDCD6]/60">
            {keyJunctions.map((j) => {
              const recommended = j.requiredOfficers;
              const current = j.presentOfficers;
              const delta = recommended - current;

              return (
                <tr key={j.id} className="hover:bg-[#FAF8F4]/80 transition-colors">
                  <td className="py-2 px-3 font-bold text-[#142C54]">
                    {j.name.split('(')[0]}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`font-semibold ${current < j.requiredOfficers ? 'text-[#B8332C]' : 'text-[#2E6B4A]'}`}>
                      {current} / {j.requiredOfficers}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center text-[#5E625F]">
                    <ArrowRight className="w-3 h-3 inline" />
                  </td>
                  <td className="py-2 px-3 font-bold text-[#2E6B4A]">
                    {recommended} / {j.requiredOfficers}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {delta > 0 ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#2E6B4A]/10 text-[#2E6B4A]">
                        +{delta} Officers
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#5E625F]">Optimal</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
