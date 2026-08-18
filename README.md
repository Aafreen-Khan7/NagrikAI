# MargRakshak

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Status-Prototype-2E6B4A?style=for-the-badge" alt="Prototype" />
</p>

<p align="center">
  <strong>AI-assisted traffic risk intelligence and police deployment decision support for Nagpur City.</strong>
</p>

<p align="center">
  <img src="public/images/hero/hero.jpg" alt="MargRakshak preview" width="1200" />
</p>

## Overview

MargRakshak is a modern civic safety and traffic intelligence platform designed to help cities respond faster to congestion, unsafe junctions, citizen-reported incidents, and dynamic police deployment needs. It combines a public-facing reporting experience with a command-center dashboard built for operators, officers, and administrators.

The platform is tailored to Nagpur’s traffic network and local operational realities, blending live city intelligence, risk scoring, evidence validation, and AI-driven recommendations into one decision-support workflow.

## Why it matters

- Reduces response time during traffic incidents and hotspot surges
- Helps identify high-risk junctions before conditions escalate
- Gives citizens an easy reporting channel with evidence capture
- Supports decision-making through explainable AI recommendations
- Keeps human operators in the loop for final dispatch approval

## Key features

### Public citizen experience
- Incident reporting workflow with geolocation and evidence upload
- Emergency response guidance and citizen help pages
- Explainable public-facing safety information
- Traffic awareness and civic engagement interface

### Command center
- Nagpur city risk overview and sector-level monitoring
- Junction risk ranking and hotspot intelligence
- AI deployment recommendation queue
- Dynamic police deployment and redeployment tracking
- Citizen report intake and review workflow
- Personnel roster and operational status visibility

### Officer portal
- Mobile-first dispatch interface for field officers
- Operational status updates and route awareness
- Cleaner task-directed experience for real-world enforcement work

### Data and intelligence layer
- Firebase-ready report pipeline
- Cloudinary evidence upload support
- AI-assisted decision support
- Audit-oriented operational reporting flow

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Leaflet for map views
- Lucide icons
- Firebase-ready backend integration
- Cloudinary media handling

## Project structure

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
└── README.md
```

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Start the app locally

```bash
npm run dev
```

The app runs on port 3000 by default.

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Environment configuration

The project includes Firebase and Cloudinary integration support. To enable backend-backed incident reporting and evidence uploads, add the following environment variables:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_DATABASE_URL=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

For full backend setup details, see [MARGRAKSHAK_BACKEND_SETUP.md](MARGRAKSHAK_BACKEND_SETUP.md).

## How the workflow works

1. Citizens submit traffic reports with photo evidence and location data.
2. Reports are validated and enriched with metadata for operational review.
3. The command center evaluates risk, congestion patterns, and coverage gaps.
4. AI recommends tactical deployment actions with supporting reasoning.
5. Human operators review and approve or adjust the plan.
6. Officers receive the final dispatch guidance through the field portal.

## Screens and workflows

The application includes:
- citizen landing and information pages
- emergency help support area
- reporting form and evidence capture flow
- control room dashboard for live operations
- map-based traffic visualization
- deployment and redeployment tracking
- officer-facing operational workflow

## Roadmap

- Real Firebase authentication for secure operator access
- Full live backend synchronization for command-center queues
- Advanced AI recommendation tuning and scoring logic
- Expanded geospatial analytics for Nagpur corridors
- Stronger audit trails and reporting exports
- Real-time officer status updates and dispatch lifecycle tracking

## License

This project is currently intended for internal/demo use as part of a civic technology prototype.

## Credits

Built as a city safety and traffic intelligence initiative focused on Nagpur urban mobility and emergency response modernization.

---

<p align="center">
  <strong>MargRakshak</strong> — safer streets, smarter decisions, faster response.
</p>
