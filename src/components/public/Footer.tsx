import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../Logo';
import { OFFICIAL_HELPLINES } from '../../data/nagpurData';
import { Phone, Shield, ExternalLink, Heart, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-[#142C54] text-white border-t border-[#DCDCD6]/20">
      {/* Top Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Civic Mission (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Logo variant="horizontal" size="md" showSubtitle={true} isWhite={true} />
            <p className="text-sm text-[#DCDCD6] leading-relaxed max-w-sm">
              MargRakshak is an AI-assisted traffic risk assessment and police deployment decision support system designed specifically for the road network and traffic conditions of Nagpur City.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#F4D8C7]">
              <Shield className="w-4 h-4 text-[#E56B2F]" />
              <span>Dedicated Decision Support for Nagpur Traffic Police</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4D8C7]">
              System Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#DCDCD6]">
              <li>
                <button
                  id="footer-nav-home-btn"
                  onClick={() => setActiveView('home')}
                  className="hover:text-white transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-about-btn"
                  onClick={() => setActiveView('about')}
                  className="hover:text-white transition-colors"
                >
                  About MargRakshak
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-how-it-works-btn"
                  onClick={() => setActiveView('how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  How the System Works
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-report-btn"
                  onClick={() => setActiveView('report-incident')}
                  className="text-[#E56B2F] font-bold hover:underline"
                >
                  Submit Incident Report
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-feedback-btn"
                  onClick={() => setActiveView('feedback')}
                  className="hover:text-white transition-colors"
                >
                  Citizen Feedback
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-emergency-btn"
                  onClick={() => setActiveView('emergency-help')}
                  className="hover:text-white transition-colors"
                >
                  Emergency Helplines
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Emergency Helplines (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4D8C7] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#E56B2F]" />
              <span>Nagpur Emergency Helplines</span>
            </h4>
            <p className="text-xs text-[#DCDCD6]">
              For immediate life-threatening situations, contact authorized emergency numbers:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                <span className="text-[#DCDCD6]">Traffic Police Control Room:</span>
                <span className="font-bold text-white font-mono">+91 712 2561222</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                <span className="text-[#DCDCD6]">National Emergency Response:</span>
                <span className="font-bold text-[#F4D8C7] font-mono">112</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                <span className="text-[#DCDCD6]">Ambulance / Medical Response:</span>
                <span className="font-bold text-[#2E6B4A] font-mono">108</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DCDCD6]">
          <p>© 2026 MargRakshak. Built for Nagpur City Traffic Management & Police Deployment Decision Support.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#DCDCD6]/80">Decision-Support Platform Prototype</span>
            <button
              id="footer-secure-access-btn"
              onClick={() => setActiveView('secure-access')}
              className="text-[#DCDCD6] hover:text-[#E56B2F] flex items-center gap-1 transition-colors text-[11px]"
            >
              <Lock className="w-3 h-3" />
              <span>Departmental Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
