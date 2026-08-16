import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PlayCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Users, 
  TrendingUp,
  X
} from 'lucide-react';

interface DemoScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoScenarioModal: React.FC<DemoScenarioModalProps> = ({ isOpen, onClose }) => {
  const { 
    activeDemoStep, 
    runDemoNextStep, 
    setDemoStep, 
    triggerSimulatedEvent, 
    acceptAIProposal, 
    aiProposals,
    resetDemoData,
    loginAs,
    setActiveView 
  } = useApp();

  if (!isOpen) return null;

  const steps = [
    {
      step: 0,
      title: '1. Baseline Operating State',
      description: 'Nagpur Central & South corridors operate at nominal evening baseline. Sitabuldi is at moderate risk (68/100) with 2/3 officers present.',
      actionLabel: 'Trigger Accident Incident at Sitabuldi',
      onExecute: () => {
        triggerSimulatedEvent('accident_sitabuldi');
        setDemoStep(1);
      },
    },
    {
      step: 1,
      title: '2. Citizen Report & AI Vision Authenticity Scan',
      description: 'A citizen reports a collision under Metro pillar 42. AI analyzes EXIF & pixels: 88% confidence (Likely Authentic). Report queues into Command Center.',
      actionLabel: 'Inspect & Verify Citizen Report',
      onExecute: () => {
        setDemoStep(2);
      },
    },
    {
      step: 2,
      title: '3. Real-Time Risk Score Escalation (68 → 91)',
      description: 'The Risk Engine recalculates: Collision (+25), congestion (+25), coverage deficit (+10). Sitabuldi enters Critical state (91/100).',
      actionLabel: 'Trigger AI Deployment Engine',
      onExecute: () => {
        setDemoStep(3);
      },
    },
    {
      step: 3,
      title: '4. AI Proposes Strategic Redeployment',
      description: 'AI identifies available reserve: Head Constable Manoj Deshmukh (MR-118) at Manish Nagar (1.8km away). Proposes dispatch with full explainable reasoning.',
      actionLabel: 'Operator Reviews & Accepts Proposal',
      onExecute: () => {
        if (aiProposals[0]) {
          acceptAIProposal(aiProposals[0].id, 'Demo scenario: Approved rapid dispatch.');
        }
        setDemoStep(4);
      },
    },
    {
      step: 4,
      title: '5. Officer Field Notification & Coverage Surge (61% → 86%)',
      description: 'Officer 118 receives high-priority mobile alert on his portal. Field status shifts to En Route. Citywide priority coverage jumps to 86%!',
      actionLabel: 'Open Officer 118 Field View',
      onExecute: () => {
        loginAs('police_officer', 'off-118');
        onClose();
      },
    },
  ];

  const current = steps[activeDemoStep] || steps[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-[#DCDCD6] shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#DCDCD6] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#142C54] text-white">
              <PlayCircle className="w-5 h-5 text-[#E56B2F]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#142C54]">
                MargRakshak 1-Click Demo Scenario
              </h2>
              <p className="text-xs text-[#5E625F]">
                Controlled Hackathon Presentation Walkthrough (PRD Section 62)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Pills */}
        <div className="grid grid-cols-5 gap-1.5">
          {steps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setDemoStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === activeDemoStep
                  ? 'bg-[#E56B2F]'
                  : idx < activeDemoStep
                  ? 'bg-[#2E6B4A]'
                  : 'bg-[#DCDCD6]'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Active Step Content */}
        <div className="bg-[#FAF8F4] p-4 rounded-xl border border-[#DCDCD6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#E56B2F] uppercase tracking-wider">
              Step {activeDemoStep + 1} of 5
            </span>
            <span className="text-[10px] font-bold text-[#2E6B4A] bg-[#2E6B4A]/10 px-2 py-0.5 rounded">
              Interactive Simulation
            </span>
          </div>

          <h3 className="text-sm font-extrabold text-[#142C54]">
            {current.title}
          </h3>

          <p className="text-xs text-[#252525] leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Step CTA Execution */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              resetDemoData();
              setDemoStep(0);
            }}
            className="px-3 py-1.5 text-xs text-[#5E625F] hover:text-[#252525] font-semibold"
          >
            Restart Flow
          </button>

          <div className="flex items-center gap-2">
            <button
              id="demo-action-btn"
              onClick={current.onExecute}
              className="px-5 py-2 text-xs font-bold bg-[#E56B2F] hover:bg-[#B94A1F] text-white rounded-md transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>{current.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
