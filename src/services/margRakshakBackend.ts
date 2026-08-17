import { CitizenReport } from '../types';

type FirebaseEnv = {
  apiKey?: string;
  databaseUrl?: string;
  projectId?: string;
  authDomain?: string;
};

type CloudinaryEnv = {
  cloudName?: string;
  uploadPreset?: string;
};

type BackendReportRecord = CitizenReport;

const readFirebaseEnv = (): FirebaseEnv => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  databaseUrl: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
});

const readCloudinaryEnv = (): CloudinaryEnv => ({
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
});

const toAbsoluteDatabaseUrl = (databaseUrl: string) => {
  const trimmed = databaseUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('.json') ? trimmed : `${trimmed}.json`;
};

const buildHeaders = () => ({
  'Content-Type': 'application/json',
});

const safeJson = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  return (text ? JSON.parse(text) : null) as T;
};

export const isFirebaseConfigured = () => {
  const { apiKey, databaseUrl, projectId } = readFirebaseEnv();
  return Boolean(apiKey && databaseUrl && projectId);
};

export const isCloudinaryConfigured = () => {
  const { cloudName, uploadPreset } = readCloudinaryEnv();
  return Boolean(cloudName && uploadPreset);
};

export const loadCitizenReports = async (): Promise<BackendReportRecord[]> => {
  const { databaseUrl } = readFirebaseEnv();
  if (!databaseUrl) return [];

  const response = await fetch(toAbsoluteDatabaseUrl(`${databaseUrl.replace(/\/+$/, '')}/citizenReports`), {
    method: 'GET',
    headers: buildHeaders(),
  });

  const payload = await safeJson<Record<string, BackendReportRecord> | null>(response);
  if (!payload) return [];

  return Object.values(payload).sort((a, b) => {
    const aTime = new Date(a.submittedAt).getTime();
    const bTime = new Date(b.submittedAt).getTime();
    return Number.isNaN(bTime - aTime) ? 0 : bTime - aTime;
  });
};

export const seedCitizenReports = async (reports: BackendReportRecord[]) => {
  const { databaseUrl } = readFirebaseEnv();
  if (!databaseUrl || reports.length === 0) return;

  const existing = await loadCitizenReports().catch(() => []);
  if (existing.length > 0) return;

  await Promise.all(
    reports.map((report) =>
      fetch(
        toAbsoluteDatabaseUrl(`${databaseUrl.replace(/\/+$/, '')}/citizenReports/${report.id}`),
        {
          method: 'PUT',
          headers: buildHeaders(),
          body: JSON.stringify(report),
        },
      ).then((response) => safeJson(response)),
    ),
  );
};

export const saveCitizenReport = async (report: BackendReportRecord) => {
  const { databaseUrl } = readFirebaseEnv();
  if (!databaseUrl) return;

  const response = await fetch(
    toAbsoluteDatabaseUrl(`${databaseUrl.replace(/\/+$/, '')}/citizenReports/${report.id}`),
    {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(report),
    },
  );

  await safeJson(response);
};

export const updateCitizenReportsBatch = async (reports: BackendReportRecord[]) => {
  const { databaseUrl } = readFirebaseEnv();
  if (!databaseUrl) return;

  await Promise.all(reports.map((report) => saveCitizenReport(report)));
};

export const uploadEvidenceToCloudinary = async (file: File) => {
  const { cloudName, uploadPreset } = readCloudinaryEnv();
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('resource_type', 'auto');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });

  const payload = await safeJson<{ secure_url: string; public_id: string; resource_type: string }>(response);
  return payload;
};
