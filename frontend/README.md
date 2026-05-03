# EchoHire Frontend Guide

This guide helps team members quickly find files and know where to edit features.

## Run Project

From `frontend/`:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Icons

## Folder Map (Important)

- `app/` -> all routes/pages
- `components/` -> reusable UI components
- `app/globals.css` -> global styles

## Main Pages

- Home: `app/page.tsx`
- Pricing: `app/pricing/page.tsx`
- Auth (sign in / sign up): `app/auth/page.tsx`
- Dashboard: `app/dashboard/page.tsx`
- AI Interview: `app/ai-interview/page.tsx`
- Resume Analyzer: `app/resume-analyzer/page.tsx`
- LinkedIn Optimizer: `app/linkedin-optimizer/page.tsx`
- Profile: `app/profile/page.tsx`
- Settings: `app/settings/page.tsx`
- Support: `app/support/page.tsx`
- About EchoHire: `app/about-echohire/page.tsx`

## Shared Components (High Impact)

- Navbar: `components/Navbar.tsx`
- Dashboard Sidebar: `components/DashboardSidebar.tsx`
- Hero section: `components/Hero.tsx`
- Footer: `components/Footer.tsx`

## "Where to change what"

### Login flow / redirect

- File: `app/auth/page.tsx`
- Login button currently goes to:
  - `/dashboard?completeProfile=1`

### "Complete profile" alert after login

- File: `app/dashboard/page.tsx`
- Reads `completeProfile=1` from URL and shows a prompt card.

### Logout button location

- Desktop + mobile navbar logout:
  - `components/Navbar.tsx`
- Sidebar logout menu item:
  - `components/DashboardSidebar.tsx`

### Profile details form (user data)

- File: `app/profile/page.tsx`
- Stores profile data in localStorage key:
  - `echohire-profile`

### Profile avatar / name in navbar

- File: `components/Navbar.tsx`
- Reads profile info from localStorage key:
  - `echohire-profile`

### Sidebar menu links and active states

- File: `components/DashboardSidebar.tsx`

### Mobile navbar drawer

- File: `components/Navbar.tsx`

### Mobile sidebar drawer

- File: `components/DashboardSidebar.tsx`

### Logo tap behavior (custom)

- File: `components/Navbar.tsx`
- Logo click alternates route in session:
  - first tap -> `/`
  - second tap -> `/about-echohire`

## Add a New Page

1. Create route: `app/<new-page>/page.tsx`
2. Add link in sidebar or navbar:
   - sidebar -> `components/DashboardSidebar.tsx`
   - navbar -> `components/Navbar.tsx`
3. Add quick access from home if needed:
   - `app/page.tsx`

## Design Consistency Rules

- Primary dark background: `#050b18`
- Card background: `#0d162a`
- Border color: `#243253`
- Primary accent gradient: `from-[#2a7df7] to-[#372e8f]`

## Notes for Partners

- Frontend is currently UI-focused (no backend auth yet).
- Most personalization is localStorage-based for now.
- Before pushing changes, run:

```bash
npm run lint
```
## Project Roadmap

```mermaid
gantt
    title EchoHire Detailed Feature Roadmap
    dateFormat  YYYY-MM-DD
    
    section Candidate Platform
    Profile & Identity Setup       :done,    c1, 2026-04-01, 2026-04-10
    Resume Upload & Parsing        :active,  c2, 2026-04-15, 2026-05-01
    AI Mock Interview (Coding)     :active,  c3, 2026-04-20, 2026-05-15
    AI Mock Interview (Behavioral) :         c4, 2026-05-10, 2026-05-30
    LinkedIn Profile Audit         :         c5, 2026-05-20, 2026-06-10
    Job Application Tracking       :         c6, 2026-06-05, 2026-06-25

    section Recruiter Portal
    Job Creation Wizard            :done,    r1, 2026-04-10, 2026-04-25
    Candidate Pipeline (ATS)       :active,  r2, 2026-05-01, 2026-05-20
    AI Assessment Review           :         r3, 2026-05-15, 2026-06-05
    Interview Scheduling System    :         r4, 2026-06-01, 2026-06-15
    Analytics & Hiring Metrics     :         r5, 2026-06-10, 2026-06-30

    section Admin Operations
    User Access Control (RBAC)     :active,  a1, 2026-05-03, 2026-05-12
    Recruiter Verification Flow    :active,  a2, 2026-05-04, 2026-05-10
    System Performance Monitor     :         a3, 2026-05-20, 2026-06-10
    Content & Blog Management      :         a4, 2026-06-15, 2026-07-05

    section Infrastructure & AI
    Express/MongoDB API Core       :done,    i1, 2026-04-05, 2026-04-20
    JWT Secure Auth (Candidate)    :done,    i2, 2026-04-15, 2026-04-25
    JWT Secure Auth (Recruiter)    :active,  i3, 2026-05-01, 2026-05-10
    OpenAI/Gemini Integration      :active,  i4, 2026-04-25, 2026-05-20
    Real-time Notification Socket  :         i5, 2026-06-01, 2026-06-15
    Cloud Binary Storage (Avatars) :         i6, 2026-05-10, 2026-05-25
```

