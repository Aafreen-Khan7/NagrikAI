# MargRakshak Backend Setup

This project now supports a Firebase-backed report pipeline and Cloudinary evidence uploads.

## What the backend does

- Stores citizen incident reports in Firebase Realtime Database.
- Seeds the database with the current demo reports if the database is empty.
- Keeps the command center "Citizen Incident Reports Queue" in sync with the database.
- Uploads incident evidence images to Cloudinary and saves the returned URL with the report.
- Provides Firebase Auth REST helpers for future secure login wiring.

## What you need to provide

1. A Firebase project with Realtime Database enabled.
2. Firebase Web app credentials:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_DATABASE_URL`
3. A Cloudinary account with an unsigned upload preset:
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`

## Recommended Firebase database structure

```text
/citizenReports
  /rep-001
  /rep-002
  /rep-003
```

Each report is stored as a full `CitizenReport` object.

## Firebase rules

For development, you can start with permissive rules, then tighten them later.

Example:

```json
{
  "rules": {
    "citizenReports": {
      ".read": true,
      ".write": true
    }
  }
}
```

If you want real authentication before writes, we can wire role-based Firebase Auth next and lock the write rule down to authenticated users only.

## Cloudinary notes

- Use an unsigned upload preset for browser-side uploads.
- The current form uploads only image evidence.
- If Cloudinary is not configured, the app falls back to the local preview URL, but that is not durable storage.

## Current limitation

- The command center still uses the existing role-based portal flow in the UI.
- Firebase Auth REST helpers are now in place, but the login screen has not yet been bound to them.

If you want, the next step should be wiring the Secure Access page to real Firebase Authentication and storing operator profiles in the database too.
