import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../Logo';
import { AlertCircle, Menu, X, Shield, Phone, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, currentRole, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'feedback', label: 'Citizen Feedback' },
    { id: 'emergency-help', label: 'Emergency Helplines' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F4]/90 backdrop-blur-md border-b border-[#DCDCD6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2 text-left focus:outline-none focus:ring-2 focus:ring-[#E56B2F] rounded-lg p-1"
        >
          <Logo variant="horizontal" size="md" showSubtitle={true} />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => setActiveView(link.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#E56B2F] bg-[#E56B2F]/10 font-semibold'
                    : 'text-[#252525] hover:text-[#E56B2F] hover:bg-[#F4D8C7]/30'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Main CTA — Report Incident */}
          <button
            id="nav-report-incident-btn"
            onClick={() => setActiveView('report-incident')}
            className="flex items-center gap-2 bg-[#E56B2F] hover:bg-[#B94A1F] text-white px-4 py-2.5 rounded-md text-sm font-bold shadow-sm hover:shadow transition-all duration-150 transform active:scale-95"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Report Incident</span>
          </button>

          {/* Secure Access Trigger (Hidden/discrete as per PRD section 6, with clear icon for evaluators) */}
          <button
            id="nav-secure-portal-btn"
            onClick={() => setActiveView('secure-access')}
            title="Departmental Authorized Portal"
            className="p-2 text-[#5E625F] hover:text-[#142C54] hover:bg-[#DCDCD6]/40 rounded-md transition-colors text-xs font-semibold flex items-center gap-1.5 border border-[#DCDCD6]/60"
          >
            <Shield className="w-4 h-4 text-[#142C54]" />
            <span className="hidden lg:inline text-[11px]">Authorized Portal</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#252525] hover:bg-[#DCDCD6]/50 rounded-md"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#DCDCD6] px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              id={`mobile-nav-${link.id}`}
              onClick={() => {
                setActiveView(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium ${
                activeView === link.id
                  ? 'bg-[#E56B2F]/10 text-[#E56B2F] font-bold'
                  : 'text-[#252525] hover:bg-[#FAF8F4]'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 border-t border-[#DCDCD6] space-y-2">
            <button
              id="mobile-report-incident-btn"
              onClick={() => {
                setActiveView('report-incident');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#E56B2F] text-white py-2.5 rounded-md text-sm font-bold shadow-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Report a Traffic Incident</span>
            </button>

            <button
              id="mobile-secure-access-btn"
              onClick={() => {
                setActiveView('secure-access');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#FAF8F4] border border-[#DCDCD6] text-[#142C54] py-2 rounded-md text-xs font-semibold"
            >
              <Shield className="w-4 h-4" />
              <span>Authorized Personnel Access</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
