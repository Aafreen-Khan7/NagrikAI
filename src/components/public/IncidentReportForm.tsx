import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NAGPUR_JUNCTIONS } from '../../data/nagpurData';
import { isCloudinaryConfigured, uploadEvidenceToCloudinary } from '../../services/margRakshakBackend';
import { 
  AlertCircle, 
  Upload, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  FileText,
  Info,
  Clock
} from 'lucide-react';

export const IncidentReportForm: React.FC = () => {
  const { submitCitizenReport, setActiveView } = useApp();

  const [incidentType, setIncidentType] = useState<string>('Accident');
  const [selectedJunctionId, setSelectedJunctionId] = useState<string>(NAGPUR_JUNCTIONS[0].id);
  const [customLocation, setCustomLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterPhone, setReporterPhone] = useState<string>('');
  const [optInWhatsapp, setOptInWhatsapp] = useState<boolean>(true);

  // Upload state
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploadingEvidence, setUploadingEvidence] = useState<boolean>(false);

  // Submission result state
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);
  const [certifiedAccurate, setCertifiedAccurate] = useState<boolean>(false);

  const incidentOptions = [
    { label: 'Accident / Vehicle Crash', value: 'Accident', icon: '🚨' },
    { label: 'Heavy Traffic Congestion', value: 'Heavy congestion', icon: '🚗' },
    { label: 'Road Obstruction / Fallen Tree', value: 'Road obstruction', icon: '🚧' },
    { label: 'Illegal / Choke Parking', value: 'Illegal parking', icon: '⛔' },
    { label: 'Traffic Signal Malfunction', value: 'Traffic signal issue', icon: '🚦' },
    { label: 'Monsoon Waterlogging', value: 'Waterlogging', icon: '🌧️' },
    { label: 'Other Hazard', value: 'Other', icon: '⚠️' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEvidencePreview(url);
      setEvidenceFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) return;
    if (!reporterName.trim() || !reporterPhone.trim()) {
      alert('Citizen contact details are required before submitting the incident report.');
      return;
    }

    let cloudEvidenceUrl = evidencePreview || undefined;
    if (evidenceFile && isCloudinaryConfigured()) {
      try {
        setUploadingEvidence(true);
        const uploaded = await uploadEvidenceToCloudinary(evidenceFile);
        cloudEvidenceUrl = uploaded.secure_url;
      } catch (error) {
        console.warn('Cloudinary upload failed. Falling back to local preview URL.', error);
        cloudEvidenceUrl = evidencePreview || undefined;
      } finally {
        setUploadingEvidence(false);
      }
    }

    const chosenJunction = NAGPUR_JUNCTIONS.find(j => j.id === selectedJunctionId);
    const locationName = customLocation.trim()
      ? `${customLocation.trim()} (${chosenJunction?.name || 'Nagpur'})`
      : chosenJunction?.name || 'Nagpur City Location';

    const coordinates = chosenJunction ? { lat: chosenJunction.coordinates.lat, lng: chosenJunction.coordinates.lng } : { lat: 21.1458, lng: 79.0882 };

    const refId = submitCitizenReport({
      type: incidentType,
      locationId: selectedJunctionId,
      locationName,
      coordinates,
      description,
      evidenceUrl: cloudEvidenceUrl,
      evidenceType: cloudEvidenceUrl ? 'image' : 'none',
      reporterName: reporterName.trim() || undefined,
      reporterContact: reporterPhone.trim() || undefined,
    });

    setSubmittedRefId(refId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      {/* Confirmation Success Screen (PRD Section 14) */}
      {submittedRefId ? (
        <div className="bg-white rounded-2xl border border-[#DCDCD6] p-8 shadow-sm text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#2E6B4A]/10 text-[#2E6B4A] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E6B4A] block">
              Report Successfully Logged
            </span>
            <h2 className="text-2xl font-extrabold text-[#142C54] mt-1">
              Thank You for Assisting Nagpur Traffic Safety
            </h2>
            <p className="text-sm text-[#5E625F] max-w-md mx-auto mt-2">
              Your report has been queued for verification at the Nagpur Police Traffic Control Room.
            </p>
          </div>

          {/* Reference ID Pill */}
          <div className="bg-[#FAF8F4] p-4 rounded-xl border border-[#DCDCD6] max-w-sm mx-auto">
            <span className="text-xs text-[#5E625F] uppercase font-bold block">Official Incident Reference ID</span>
            <span className="text-lg font-mono font-extrabold text-[#142C54] block mt-1">
              {submittedRefId}
            </span>
            <span className="text-[11px] text-[#5E625F] mt-1 block">
              Estimated Review & Dispatch Time: <strong>&lt; 3 Minutes</strong>
            </span>
          </div>

          {/* Emergency Note */}
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-xs text-[#B8332C] max-w-md mx-auto text-left">
            <span className="font-bold block mb-1">For Immediate Medical or Life-Threatening Emergencies:</span>
            <p>Do not wait for form processing. Call <strong>112 (National Emergency)</strong> or <strong>108 (Ambulance)</strong> immediately.</p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="report-another-btn"
              onClick={() => {
                setSubmittedRefId(null);
                setDescription('');
                setEvidencePreview(null);
                setEvidenceFile(null);
              }}
              className="px-5 py-2.5 rounded-lg bg-[#FAF8F4] hover:bg-[#DCDCD6]/50 text-[#142C54] text-xs font-bold border border-[#DCDCD6] transition-colors"
            >
              Submit Another Report
            </button>

            <button
              id="return-home-btn"
              onClick={() => setActiveView('home')}
              className="px-6 py-2.5 rounded-lg bg-[#142C54] hover:bg-[#1f3f72] text-white text-xs font-bold transition-colors"
            >
              Return to City Overview
            </button>
          </div>
        </div>
      ) : (
        /* Report Form Card */
        <div className="bg-white rounded-2xl border border-[#DCDCD6] p-6 lg:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="border-b border-[#DCDCD6] pb-4">
            <div className="flex items-center gap-2 text-[#E56B2F] mb-1">
              <AlertCircle className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Citizen Traffic Watch</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#142C54]">
              Report a Traffic Incident in Nagpur
            </h1>
            <p className="text-xs text-[#5E625F] mt-1">
              Submit verified ground observations with photo evidence to assist traffic controllers in prioritizing police deployment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Step 1: Incident Type Picker (PRD Section 9) */}
            <div className="space-y-2">
              <label className="font-bold text-[#142C54] text-xs block">
                1. Select Incident Type: <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {incidentOptions.map((opt) => {
                  const isSelected = incidentType === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setIncidentType(opt.value)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-[#E56B2F]/10 border-[#E56B2F] text-[#142C54] font-bold shadow-xs'
                          : 'bg-[#FAF8F4] hover:bg-[#DCDCD6]/40 border-[#DCDCD6] text-[#252525]'
                      }`}
                    >
                      <span className="text-lg block mb-1">{opt.icon}</span>
                      <span className="text-xs block leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Location Selector (PRD Section 10) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#142C54] block">
                  2. Nearest Nagpur Junction / Sector: <span className="text-red-500">*</span>
                </label>
                <select
                  id="report-junction-select"
                  value={selectedJunctionId}
                  onChange={(e) => setSelectedJunctionId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] font-semibold text-[#142C54] focus:ring-1 focus:ring-[#E56B2F] focus:outline-none"
                >
                  {NAGPUR_JUNCTIONS.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name} ({j.zone} Zone • {j.marathiName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#142C54] block">
                  Specific Landmark / Street Note (Optional):
                </label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="E.g. Near Metro Pillar 42, In front of Haldiram's"
                  className="w-full p-2.5 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] focus:ring-1 focus:ring-[#E56B2F] focus:outline-none"
                />
              </div>
            </div>

            {/* Step 3: Description Narrative (PRD Section 11) */}
            <div className="space-y-1">
              <label className="font-bold text-[#142C54] block">
                3. Incident Description & Traffic Impact: <span className="text-red-500">*</span>
              </label>
              <textarea
                id="report-description-textarea"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened: vehicles involved, blocked lanes, severity, emergency needs..."
                className="w-full p-3 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] text-xs focus:ring-1 focus:ring-[#E56B2F] focus:outline-none leading-relaxed"
              />
            </div>

            {/* Step 4: Photo / Video Evidence Upload with AI Analysis (PRD Section 12, 16) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#142C54] block">
                  4. Attach Visual Photo Evidence (Optional but recommended):
                </label>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-[#DCDCD6] rounded-xl p-4 bg-[#FAF8F4] text-center">
                <input
                  type="file"
                  id="evidence-file-input"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <label
                  htmlFor="evidence-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 py-2"
                >
                  <Upload className="w-6 h-6 text-[#E56B2F]" />
                  <span className="font-semibold text-xs text-[#142C54]">
                    Click to browse or take photo with device camera
                  </span>
                  <span className="text-[10px] text-[#5E625F]">PNG, JPG, JPEG up to 10MB</span>
                </label>

              </div>

              {evidencePreview && (
                <div className="rounded-lg border border-[#DCDCD6] bg-white px-3 py-2 text-[11px] text-[#5E625F]">
                  Visual evidence attached and ready for upload.
                </div>
              )}
            </div>

            {/* Step 5: Reporter Information (Mandatory) */}
            <div className="bg-[#FAF8F4] p-4 rounded-xl border border-[#DCDCD6] space-y-3">
              <span className="font-bold text-[#142C54] block">
                5. Citizen Contact Details: <span className="text-red-500">*</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="p-2 rounded-lg bg-white border border-[#DCDCD6] text-xs"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number for SMS / WhatsApp updates"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  className="p-2 rounded-lg bg-white border border-[#DCDCD6] text-xs"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#5E625F]">
                <input
                  type="checkbox"
                  checked={optInWhatsapp}
                  onChange={(e) => setOptInWhatsapp(e.target.checked)}
                  className="rounded text-[#E56B2F] focus:ring-[#E56B2F]"
                />
                <span>Send me WhatsApp / SMS notification once this incident is verified and resolved</span>
              </label>
            </div>

            {/* Legal Accuracy Certification Checkbox & Statutory Penalty Disclaimer */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="certify-accuracy-checkbox"
                  required
                  checked={certifiedAccurate}
                  onChange={(e) => setCertifiedAccurate(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-amber-300 text-[#E56B2F] focus:ring-[#E56B2F] shrink-0"
                />
                <span className="text-xs text-[#252525] font-medium leading-relaxed">
                  I certify that, to the best of my knowledge, the information provided in the above report is accurate and correct. I understand that failure to provide information or false information is a criminal offense and may result in legal action against me.
                </span>
              </label>

              {/* Statutory Legal Warning Disclaimer */}
              <div className="pt-2 border-t border-amber-200/60 flex items-start gap-2 text-[11px] text-[#8C4A00]">
                <AlertCircle className="w-4 h-4 text-[#B8332C] shrink-0 mt-0.5" />
                <p className="leading-snug font-medium">
                  <strong>Disclaimer:</strong> If a citizen provide wrong information regarding traffic/accidents to police it will result in penalty under section 179(2) and may result in legal action against the individual.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="submit-incident-form-btn"
                type="submit"
                disabled={!certifiedAccurate || uploadingEvidence}
                className={`w-full py-3 px-6 rounded-xl font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                  certifiedAccurate && !uploadingEvidence
                    ? 'bg-[#E56B2F] hover:bg-[#B94A1F] text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                }`}
              >
                <span>{uploadingEvidence ? 'Uploading Evidence...' : 'Submit Incident to Nagpur Traffic Police'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
