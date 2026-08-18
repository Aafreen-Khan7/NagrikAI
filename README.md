# MargRakshak

<p align="center">
  <img src="https://img.shields.io/badge/MargRakshak-Urban%20Traffic%20Command-142C54?style=for-the-badge&logo=shield&logoColor=F7F4F0" alt="MargRakshak" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
</p>

<p align="center">
  <strong>AI-powered civic safety intelligence for faster traffic response, better risk visibility, and smarter police deployment.</strong>
</p>

<p align="center">
  <img src="https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=1400&q=80" alt="Nagpur city traffic overview" width="1200" />
</p>

## Mission

MargRakshak is a modern civic safety and traffic intelligence platform built for cities that need faster, more informed decisions at high-risk intersections. It brings together citizen reporting, geospatial risk analysis, and AI-assisted dispatch recommendations into a single operational view for control room teams and field officers.

Designed for Nagpur’s roads and mobility demands, the platform helps authorities move from reactive response to proactive urban traffic management.

## Why it matters

- Detects congestion choke points and high-risk junctions earlier
- Reduces time between citizen incident reports and dispatch action
- Makes AI recommendations explainable and operator-controlled
- Improves visibility across city sectors, deployments, and field readiness
- Creates a trust-based, human-in-the-loop safety system for public services

## Product snapshot

### Public-facing civic layer
- Incident reporting workflow with evidence capture
- Emergency help and public safety guidance
- Community-first journey for reporting real-world traffic problems

### Control room intelligence layer
- Citywide traffic monitoring dashboard
- Junction risk ranking and hotspot analysis
- AI deployment recommendation queue
- Dynamic redeployment tracking and active dispatch visibility

### Officer operations layer
- Mobile-first operational interface for officers
- Dispatch status updates and route awareness
- Cleaner command flow for field execution and reporting

## Core capabilities

- Real-time Nagpur city traffic intelligence
- AI-assisted deployment recommendation engine
- Risk score driven by road conditions, junction severity, and coverage gaps
- Citizen reports integrated into the command workflow
- Evidence-aware report handling with media support
- Human oversight and approval before dispatch actions are finalized

## Tech stack

| Layer | Stack |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS |
| Mapping | Leaflet |
| Icons | Lucide React |
| Backend-ready integration | Firebase, Cloudinary |
| Intelligence layer | AI-assisted recommendations and operational analytics |

## Repository structure

```text
.
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── command/
│   │   ├── map/
│   │   ├── officer/
│   │   └── public/
│   ├── context/
│   ├── data/
│   ├── services/
│   └── types/
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── metadata.json
├── MARGRAKSHAK_BACKEND_SETUP.md
├── AUTH_CREDENTIALS.md
├── README.md
└── .gitignore
```

## Getting started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app runs on port 3000 by default.

### Production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Environment variables

To enable the Firebase and Cloudinary-backed workflow, add the following environment variables:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_DATABASE_URL=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

For backend setup guidance, see [MARGRAKSHAK_BACKEND_SETUP.md](MARGRAKSHAK_BACKEND_SETUP.md).

## Workflow

1. A citizen reports an incident with evidence and location details.
2. The system validates and enriches the report for command-center review.
3. Traffic and risk signals are aggregated against city hotspots and route coverage.
4. AI recommends optimal deployment actions with clear reasoning.
5. Human operators review, adjust, or approve the final response plan.
6. Officers receive updated dispatch guidance in the field portal.

## Roadmap

- Real Firebase authentication for operator access
- Live synchronization of incident and dispatch state
- Improved AI scoring models for Nagpur-specific patterns
- Stronger geospatial analytics and corridor intelligence
- Enhanced audit logging and reporting exports
- Real-time officer status tracking across deployments

## License

This project is currently intended for prototype, internal demo, and civic innovation use.

---

<p align="center">
  <strong>MargRakshak</strong> — safer streets, smarter decisions, faster response.
</p>
