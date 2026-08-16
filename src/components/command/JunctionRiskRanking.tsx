import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Junction, RiskLevel } from '../../types';
import { Search, Filter, ArrowUpDown, MapPin, Users, AlertTriangle } from 'lucide-react';

export const JunctionRiskRanking: React.FC = () => {
  const { junctions, selectedJunctionId, setSelectedJunctionId } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [zoneFilter, setZoneFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'risk' | 'coverageGap' | 'volume'>('risk');

  // Filter and sort
  const filteredJunctions = junctions
    .filter((j) => {
      const matchSearch = j.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (j.marathiName && j.marathiName.includes(searchTerm)) ||
                          j.primaryRoad.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZone = zoneFilter === 'All' || j.zone === zoneFilter;
      const matchRisk = riskFilter === 'All' || j.riskLevel === riskFilter;
      return matchSearch && matchZone && matchRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'risk') {
        return b.currentRisk - a.currentRisk;
      } else if (sortBy === 'coverageGap') {
        const gapA = a.requiredOfficers - a.presentOfficers;
        const gapB = b.requiredOfficers - b.presentOfficers;
        return gapB - gapA;
      } else {
        return b.trafficVolumeHourly - a.trafficVolumeHourly;
      }
    });

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'Critical':
        return 'bg-[#B8332C]/10 text-[#B8332C] border-[#B8332C]/30';
      case 'High':
        return 'bg-[#E56B2F]/10 text-[#B94A1F] border-[#E56B2F]/30';
      case 'Moderate':
        return 'bg-[#C58A2A]/10 text-[#C58A2A] border-[#C58A2A]/30';
      case 'Low':
        return 'bg-[#2E6B4A]/10 text-[#2E6B4A] border-[#2E6B4A]/30';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#DCDCD6] p-4 flex flex-col h-full shadow-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DCDCD6] mb-3">
        <div>
          <h2 className="text-sm font-extrabold text-[#142C54] tracking-tight uppercase">
            Junction Risk Ranking
          </h2>
          <p className="text-[11px] text-[#5E625F]">Real-time risk evaluation across 12 Nagpur sectors</p>
        </div>
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FAF8F4] text-[#142C54] border border-[#DCDCD6]">
          {filteredJunctions.length} Junctions
        </span>
      </div>

      {/* Search & Filters */}
      <div className="space-y-2 mb-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#5E625F]" />
          <input
            id="junction-search-input"
            type="text"
            placeholder="Search junction, area, road..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-[#FAF8F4] border border-[#DCDCD6] focus:outline-none focus:ring-1 focus:ring-[#E56B2F] focus:border-[#E56B2F]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Zone filter */}
          <select
            id="junction-zone-filter"
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="flex-1 py-1 px-2 text-xs bg-[#FAF8F4] border border-[#DCDCD6] rounded-md text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#E56B2F]"
          >
            <option value="All">Zone: All</option>
            <option value="Central">Central</option>
            <option value="South">South</option>
            <option value="North">North</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>

          {/* Risk filter */}
          <select
            id="junction-risk-filter"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="flex-1 py-1 px-2 text-xs bg-[#FAF8F4] border border-[#DCDCD6] rounded-md text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#E56B2F]"
          >
            <option value="All">Risk: All</option>
            <option value="Critical">Critical (85+)</option>
            <option value="High">High (70-84)</option>
            <option value="Moderate">Moderate (45-69)</option>
            <option value="Low">Low (&lt;45)</option>
          </select>

          {/* Sort By */}
          <select
            id="junction-sort-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="py-1 px-2 text-xs bg-[#FAF8F4] border border-[#DCDCD6] rounded-md text-[#252525] focus:outline-none focus:ring-1 focus:ring-[#E56B2F]"
          >
            <option value="risk">Sort: Risk</option>
            <option value="coverageGap">Sort: Cover Gap</option>
            <option value="volume">Sort: Volume</option>
          </select>
        </div>
      </div>

      {/* Junction Ranking List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[420px]">
        {filteredJunctions.map((j, index) => {
          const isSelected = selectedJunctionId === j.id;
          const rankNumber = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
          const coverageGap = j.requiredOfficers - j.presentOfficers;

          return (
            <div
              key={j.id}
              id={`ranking-item-${j.id}`}
              onClick={() => setSelectedJunctionId(j.id)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#E56B2F]/5 border-[#E56B2F] shadow-xs'
                  : 'bg-white hover:bg-[#FAF8F4] border-[#DCDCD6]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`font-mono text-xs font-bold ${index < 3 ? 'text-[#E56B2F]' : 'text-[#5E625F]'}`}>
                    {rankNumber}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#142C54] block truncate">
                      {j.name}
                    </span>
                    <span className="text-[10px] text-[#5E625F] block truncate">
                      {j.zone} Zone • {j.marathiName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded border ${getRiskBadge(j.riskLevel)}`}>
                    {j.currentRisk}
                  </span>
                </div>
              </div>

              {/* Status Indicators Row */}
              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#DCDCD6]/50">
                <div className="flex items-center gap-2">
                  <span className="text-[#5E625F] flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#142C54]" />
                    <span>Coverage: </span>
                    <strong className={coverageGap > 0 ? 'text-[#B8332C]' : 'text-[#2E6B4A]'}>
                      {j.presentOfficers}/{j.requiredOfficers}
                    </strong>
                  </span>
                  {coverageGap > 0 && (
                    <span className="text-[10px] font-bold text-[#B8332C] bg-red-50 px-1 rounded">
                      -{coverageGap} Gap
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-medium text-[#5E625F]">
                  {j.trafficVolumeHourly} veh/hr
                </span>
              </div>
            </div>
          );
        })}

        {filteredJunctions.length === 0 && (
          <div className="text-center py-8 text-xs text-[#5E625F]">
            No junctions matched your filter query.
          </div>
        )}
      </div>
    </div>
  );
};
