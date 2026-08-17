import { UserRole } from '../types';

export type StaffCredential = {
  role: UserRole;
  serviceId: string;
  password: string;
  label: string;
  officerId?: string;
};

export const STAFF_AUTH_DOMAIN = 'margrakshak.local';

export const STAFF_CREDENTIALS: StaffCredential[] = [
  {
    role: 'control_room_operator',
    serviceId: 'NTP-CTL-401',
    password: 'MargRakshak@Ctl401',
    label: 'Command Centre Duty Operator',
  },
  {
    role: 'police_officer',
    serviceId: 'MR-104',
    password: 'MargRakshak@MR104',
    label: 'Field Traffic Officer',
    officerId: 'off-104',
  },
  {
    role: 'admin',
    serviceId: 'NTP-ADMIN-01',
    password: 'MargRakshak@Admin01',
    label: 'Senior Administrator',
  },
];

export const authenticateStaffCredential = (serviceId: string, password: string, role: UserRole) => {
  const normalizedServiceId = serviceId.trim().toUpperCase();
  const normalizedPassword = password.trim();

  return STAFF_CREDENTIALS.find(
    (credential) =>
      credential.role === role &&
      credential.serviceId.toUpperCase() === normalizedServiceId &&
      credential.password === normalizedPassword,
  ) || null;
};

export const getStaffAuthEmail = (serviceId: string) => {
  const normalizedServiceId = serviceId.trim().toLowerCase();
  return `${normalizedServiceId}@${STAFF_AUTH_DOMAIN}`;
};

export const findStaffCredentialByServiceId = (serviceId: string) => {
  const normalizedServiceId = serviceId.trim().toUpperCase();
  return STAFF_CREDENTIALS.find(
    (credential) => credential.serviceId.toUpperCase() === normalizedServiceId,
  ) || null;
};
