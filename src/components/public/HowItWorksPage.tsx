import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  Activity, 
  ArrowRight,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setActiveView } = useApp();

  const workflowSteps = [
    {
      step: '01',
      title: 'Multimodal Data Ingestion',
      subtitle: 'Sensors + Cameras + Citizen Reports + Weather',
      description: 'Continuous telemetry streams from 12 key Nagpur junction loops, traffic cameras, weather radar, and geotagged citizen reports.',
      icon: Radio,
      badge: 'Real-time Ingestion',
    },
    {
      step: '02',
      title: 'AI Vision & Authenticity Filter',
      subtitle: 'Pixel forensics & EXIF validation',
      description: 'Citizen-submitted photos are evaluated for synthetic artifacts, EXIF time/GPS matching, and compression anomalies to prevent false alarms.',
      icon: FileText,
      badge: 'Evidence Integrity',
    },
    {
      step: '03',
      title: 'Dynamic Risk Engine (0-100 Scoring)',
      subtitle: 'Corridor choke & congestion modelling',
      description: 'Multi-factor algorithm weighs traffic velocity, historical accident rate, weather hazards, and current police coverage deficits.',
      icon: Cpu,
      badge: 'Risk Quantification',
    },
    {
      step: '04',
      title: 'AI Deployment Proposal Generation',
      subtitle: 'Proximity matching & sector baseline defense',
      description: 'Identifies the nearest available officers with lowest transit latency while ensuring no source sector drops below its safety threshold.',
      icon: Sparkles,
      badge: 'Optimization',
    },
    {
      step: '05',
      title: 'Human Operator Authorization',
      subtitle: 'Accept, modify, or reject with reason',
      description: 'The Control Room Duty Controller reviews the plan, verifies ground intelligence, and executes dispatch with full audit logging.',
      icon: ShieldCheck,
      badge: 'Human Governance',
    },
    {
      step: '06',
      title: 'Mobile Officer Dispatch & Field Sync',
      subtitle: 'Instant alerts & status acknowledgment',
      description: 'Field officers receive priority route directions, mark En Route and On Site, updating citywide coverage metrics immediately.',
      icon: Send,
      badge: 'Closed-Loop Execution',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 lg:py-16 space-y-12 select-none">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B4A] bg-[#2E6B4A]/10 px-3 py-1 rounded-full border border-[#2E6B4A]/20">
          Architecture & Operations
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142C54] tracking-tight">
          How MargRakshak Works
        </h1>
        <p className="text-sm sm:text-base text-[#5E625F] leading-relaxed">
          A step-by-step overview of how raw traffic data and citizen inputs are transformed into rapid, auditable police deployment decisions.
        </p>
      </div>

      {/* 6 Step Interactive Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflowSteps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.step}
              className="bg-white rounded-2xl border border-[#DCDCD6] p-6 space-y-3 relative overflow-hidden shadow-xs hover:border-[#E56B2F] transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-extrabold text-[#E56B2F]">
                  {step.step}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F4] text-[#142C54] border border-[#DCDCD6]">
                  {step.badge}
                </span>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#142C54] text-white flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#E56B2F]" />
              </div>

              <h2 className="text-base font-extrabold text-[#142C54] leading-tight">
                {step.title}
              </h2>
              <span className="text-[11px] font-semibold text-[#E56B2F] block">
                {step.subtitle}
              </span>
              <p className="text-xs text-[#5E625F] leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Interactive Trigger CTA */}
      <div className="bg-[#142C54] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-extrabold text-[#F4D8C7]">
            Want to see this workflow in action?
          </h2>
          <p className="text-xs text-[#DCDCD6]">
            Try our 1-click hackathon simulation demonstrating live incident injection and rapid police redeployment.
          </p>
        </div>

        <button
          id="how-it-works-demo-btn"
          onClick={() => setActiveView('command-dashboard')}
          className="px-6 py-3 rounded-xl bg-[#E56B2F] hover:bg-[#B94A1F] text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-2 shadow-md"
        >
          <span>Open Command Center Demo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
