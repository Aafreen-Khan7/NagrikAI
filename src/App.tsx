/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/public/Navbar';
import { HeroCarousel } from './components/public/HeroCarousel';
import { Footer } from './components/public/Footer';
import { IncidentReportForm } from './components/public/IncidentReportForm';
import { AboutPage } from './components/public/AboutPage';
import { HowItWorksPage } from './components/public/HowItWorksPage';
import { FeedbackPage } from './components/public/FeedbackPage';
import { EmergencyHelpPage } from './components/public/EmergencyHelpPage';
import { SecureAccessPage } from './components/public/SecureAccessPage';
import { NagpurCityMap } from './components/map/NagpurCityMap';

// Command Centre Components
import { CommandHeader } from './components/command/CommandHeader';
import { CommandSidebar } from './components/command/CommandSidebar';
import { KPICards } from './components/command/KPICards';
import { JunctionRiskRanking } from './components/command/JunctionRiskRanking';
import { AIProposalCard } from './components/command/AIProposalCard';
import { BaselineComparison } from './components/command/BaselineComparison';
import { CitizenReportsQueue } from './components/command/CitizenReportsQueue';
import { PoliceRosterTable } from './components/command/PoliceRosterTable';

// Officer Mobile Portal
import { OfficerPortal } from './components/officer/OfficerPortal';

// Icons for Home view
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Radio, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Send,
  Shuffle
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    currentRole, 
    aiProposals, 
    junctions, 
    deployments,
    deploymentChanges 
  } = useApp();

  const [commandTab, setCommandTab] = useState<string>('dashboard');

  // If in officer mode, render Officer Mobile Portal
  if (currentRole === 'police_officer' || activeView === 'officer-portal') {
    return <OfficerPortal />;
  }

  // If in Command Centre mode
  if (
    currentRole === 'control_room_operator' || 
    currentRole === 'admin' || 
    activeView.startsWith('command-')
  ) {
    // Map activeView to command tab if needed
    const effectiveTab = activeView.startsWith('command-') 
      ? activeView.replace('command-', '') 
      : commandTab;

    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col h-screen overflow-hidden">
        <CommandHeader />
        
        <div className="flex-1 flex overflow-hidden">
          <CommandSidebar 
            currentTab={effectiveTab} 
            onSelectTab={(tab) => {
              setCommandTab(tab);
              setActiveView(`command-${tab}` as any);
            }} 
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5">
            {/* TAB: DASHBOARD */}
            {effectiveTab === 'dashboard' && (
              <div className="space-y-5">
                <KPICards />

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                  {/* Left Column: Interactive Nagpur City Map (7 cols) */}
                  <div className="xl:col-span-7 h-[600px]">
                    <NagpurCityMap heightClass="h-full" />
                  </div>

                  {/* Right Column: Junction Rankings (5 cols) */}
                  <div className="xl:col-span-5 h-[600px] flex flex-col">
                    <JunctionRiskRanking />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MAP & HOTSPOTS */}
            {effectiveTab === 'map' && (
              <div className="h-[calc(100vh-120px)]">
                <NagpurCityMap heightClass="h-full" />
              </div>
            )}

            {/* TAB: POLICE ROSTER */}
            {effectiveTab === 'roster' && (
              <div className="h-[calc(100vh-120px)]">
                <PoliceRosterTable />
              </div>
            )}

            {/* TAB: CITIZEN REPORTS */}
            {effectiveTab === 'reports' && (
              <div className="h-[calc(100vh-120px)]">
                <CitizenReportsQueue />
              </div>
            )}

            {/* TAB: AI PROPOSALS */}
            {effectiveTab === 'ai-proposals' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-[#DCDCD6]">
                  <div>
                    <h2 className="text-base font-extrabold text-[#142C54] tracking-tight uppercase">
                      AI Deployment Recommendations Queue
                    </h2>
                    <p className="text-xs text-[#5E625F]">
                      Algorithmically balanced proposals based on risk spikes and minimum sector safety thresholds
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {aiProposals.map((proposal) => (
                    <AIProposalCard key={proposal.id} proposal={proposal} />
                  ))}
                </div>

                <BaselineComparison />
              </div>
            )}

            {/* TAB: ACTIVE DEPLOYMENTS */}
            {effectiveTab === 'deployments' && (
              <div className="bg-white rounded-xl border border-[#DCDCD6] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#DCDCD6] pb-3">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#142C54] uppercase tracking-tight">
                      Active Tactical Police Deployments
                    </h2>
                    <p className="text-xs text-[#5E625F]">
                      Field personnel currently operating across Nagpur key choke points
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#2E6B4A]/10 text-[#2E6B4A]">
                    {deployments.length} Active Dispatches
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deployments.map((dep) => (
                    <div key={dep.id} className="p-4 rounded-xl bg-[#FAF8F4] border border-[#DCDCD6] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-[#142C54]">{dep.destinationName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#B8332C] text-white">
                          {dep.priority}
                        </span>
                      </div>
                      <p className="text-xs text-[#5E625F]">{dep.reason}</p>
                      <div className="text-xs text-[#142C54] pt-2 border-t border-[#DCDCD6]/60 flex items-center justify-between">
                        <span>Officer: <strong>{dep.officerName}</strong></span>
                        <span className="text-[#2E6B4A] font-bold">{dep.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: DYNAMIC REDEPLOYMENTS */}
            {effectiveTab === 'redeployments' && (
              <div className="bg-white rounded-xl border border-[#DCDCD6] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#DCDCD6] pb-3">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#142C54] uppercase tracking-tight">
                      Dynamic Sector Redeployments & Tactical Movements
                    </h2>
                    <p className="text-xs text-[#5E625F]">
                      Live movement tracking of patrol units transitioning across sectors
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {deploymentChanges.map((chg) => (
                    <div key={chg.id} className="p-3.5 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2 font-bold text-[#142C54]">
                          <Shuffle className="w-4 h-4 text-[#E56B2F]" />
                          <span>{chg.officerName}</span>
                          <span className="text-[#5E625F]">({chg.previousLocation} → <strong className="text-[#E56B2F]">{chg.newLocation}</strong>)</span>
                        </div>
                        <p className="text-[11px] text-[#5E625F] mt-1">{chg.reason}</p>
                      </div>
                      <span className="text-[11px] font-mono text-[#5E625F]">{chg.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  // PUBLIC CITIZEN & CIVIC INTERFACE
  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* PUBLIC HOME OVERVIEW */}
        {activeView === 'home' && (
          <div className="space-y-12 pb-12">
            {/* Hero Carousel */}
            <HeroCarousel />

            {/* Citizen Incident Reporting Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#142C54] text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                <div className="space-y-2 max-w-xl text-center md:text-left">
                  <h3 className="text-2xl font-extrabold text-white">
                    Spotted a Traffic Accident, Hazard, or Choke Point?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#DCDCD6] leading-relaxed">
                    Upload photo evidence and location details. Our AI authenticity filter and Nagpur Police Control Room will review and dispatch response units in minutes.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    id="home-report-cta-btn"
                    onClick={() => setActiveView('report-incident')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#E56B2F] hover:bg-[#B94A1F] text-white text-xs font-extrabold transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Submit Incident Report</span>
                  </button>

                  <button
                    id="home-emergency-cta-btn"
                    onClick={() => setActiveView('emergency-help')}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors"
                  >
                    Emergency Helplines (112)
                  </button>
                </div>
              </div>
            </section>

            {/* About MargRakshak Section on Home Page */}
            <section id="about-section">
              <AboutPage />
            </section>

            {/* How It Works Section on Home Page */}
            <section id="how-it-works-section">
              <HowItWorksPage />
            </section>
          </div>
        )}

        {/* PUBLIC ABOUT PAGE */}
        {activeView === 'about' && (
          <div id="about-page">
            <AboutPage />
          </div>
        )}

        {/* PUBLIC HOW IT WORKS PAGE */}
        {activeView === 'how-it-works' && (
          <div id="how-it-works-page">
            <HowItWorksPage />
          </div>
        )}

        {/* PUBLIC REPORT INCIDENT FORM */}
        {activeView === 'report-incident' && <IncidentReportForm />}

        {/* PUBLIC FEEDBACK PAGE */}
        {activeView === 'feedback' && <FeedbackPage />}

        {/* PUBLIC EMERGENCY HELPLINES */}
        {activeView === 'emergency-help' && <EmergencyHelpPage />}

        {/* AUTHORIZED SECURE ACCESS LOGIN */}
        {activeView === 'secure-access' && <SecureAccessPage />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
