import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Logo } from '../Logo';
import {
  authenticateStaffCredential,
  findStaffCredentialByServiceId,
  getStaffAuthEmail,
} from '../../data/staffCredentials';
import {
  isFirebaseAuthConfigured,
  signInOrCreateWithEmailAndPassword,
} from '../../services/firebaseAuthRest';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Key, 
  ArrowRight, 
  Radio,
  Sliders
} from 'lucide-react';

export const SecureAccessPage: React.FC = () => {
  const { loginAs, setActiveView } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('control_room_operator');
  const [serviceId, setServiceId] = useState<string>('NTP-CTL-401');
  const [accessCode, setAccessCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'control_room_operator') {
      setServiceId('NTP-CTL-401');
    } else if (role === 'police_officer') {
      setServiceId('MR-104');
    } else {
      setServiceId('NTP-ADMIN-01');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const credential = authenticateStaffCredential(serviceId, accessCode, selectedRole);
    if (!credential) {
      setErrorMessage('Invalid service ID, role, or password. Please check the credential doc and try again.');
      return;
    }

    if (!isFirebaseAuthConfigured()) {
      loginAs(credential.role, credential.officerId);
      return;
    }

    try {
      setIsSubmitting(true);
      const email = getStaffAuthEmail(credential.serviceId);
      await signInOrCreateWithEmailAndPassword(email, credential.password);
      loginAs(credential.role, credential.officerId);
    } catch (error) {
      const fallbackCredential = findStaffCredentialByServiceId(serviceId);
      if (fallbackCredential && fallbackCredential.password === accessCode) {
        loginAs(fallbackCredential.role, fallbackCredential.officerId);
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Firebase authentication failed. Please verify your project configuration and credentials.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 lg:py-16 select-none">
      <div className="bg-white rounded-2xl border border-[#DCDCD6] p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header with Logo */}
        <div className="text-center space-y-3 border-b border-[#DCDCD6] pb-6">
          <div className="flex justify-center">
            <Logo variant="vertical" size="md" showSubtitle={false} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#142C54]">
              Authorized Departmental Access
            </h1>
            <p className="text-xs text-[#5E625F] mt-1">
              Nagpur City Police Traffic Intelligence & Deployment Support System
            </p>
          </div>
        </div>

        {/* Role Selector Tabs (PRD Section 17) */}
        <div className="space-y-2">
          <label className="font-bold text-[#142C54] text-xs block">
            Select Operational Duty Role:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              id="role-btn-controller"
              onClick={() => handleRoleChange('control_room_operator')}
              className={`p-2.5 rounded-lg border text-center transition-all text-xs ${
                selectedRole === 'control_room_operator'
                  ? 'bg-[#142C54] text-white font-bold shadow-xs'
                  : 'bg-[#FAF8F4] text-[#252525] border-[#DCDCD6] hover:bg-[#DCDCD6]/40'
              }`}
            >
              <Radio className="w-4 h-4 mx-auto mb-1 text-[#E56B2F]" />
              <span className="block leading-tight">Control Room Controller</span>
            </button>

            <button
              type="button"
              id="role-btn-officer"
              onClick={() => handleRoleChange('police_officer')}
              className={`p-2.5 rounded-lg border text-center transition-all text-xs ${
                selectedRole === 'police_officer'
                  ? 'bg-[#142C54] text-white font-bold shadow-xs'
                  : 'bg-[#FAF8F4] text-[#252525] border-[#DCDCD6] hover:bg-[#DCDCD6]/40'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#E56B2F]" />
              <span className="block leading-tight">Field Traffic Officer</span>
            </button>

            <button
              type="button"
              id="role-btn-admin"
              onClick={() => handleRoleChange('admin')}
              className={`p-2.5 rounded-lg border text-center transition-all text-xs ${
                selectedRole === 'admin'
                  ? 'bg-[#142C54] text-white font-bold shadow-xs'
                  : 'bg-[#FAF8F4] text-[#252525] border-[#DCDCD6] hover:bg-[#DCDCD6]/40'
              }`}
            >
              <Sliders className="w-4 h-4 mx-auto mb-1 text-[#E56B2F]" />
              <span className="block leading-tight">Senior Administrator</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#142C54] block">
              Official Police Service ID / Badge No:
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#5E625F]" />
              <input
                type="text"
                required
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] font-mono text-xs focus:ring-1 focus:ring-[#E56B2F] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#142C54] block">
              Department Secure Passcode / Token:
            </label>
            <div className="relative">
              <Key className="w-3.5 h-3.5 absolute left-3 top-3 text-[#5E625F]" />
              <input
                type="password"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] text-xs focus:ring-1 focus:ring-[#E56B2F] focus:outline-none"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-[11px] font-medium">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            id="department-login-submit-btn"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#E56B2F] hover:bg-[#B94A1F] text-white font-extrabold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Authenticating...' : 'Authenticate & Access Operational Portal'}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setActiveView('home')}
            className="text-xs text-[#5E625F] hover:text-[#142C54] transition-colors"
          >
            ← Return to Public Home Overview
          </button>
        </div>
      </div>
    </div>
  );
};
