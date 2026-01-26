# Digital Operations Assistant - SMU Production Scheduling

Complete tablet-friendly production scheduling application with AI agent integration, run versioning, and comprehensive user flows.

## 📱 Built For

- **Primary:** Tablet landscape (1024×768)
- **Secondary:** Desktop (1440×900)
- **Navigation:** Top bar + bottom tab navigation (thumb-reachable on tablet)
- **Touch targets:** Minimum 44×44px throughout

## 👥 Three User Roles

### 1. Owner (SMU Admin)
- **Dashboard:** Executive summary, high-level KPIs
- **Screens:** KPI Overview (OWN-01), Weekly Metrics (OWN-02), Runs Audit (OWN-03), Users & Roles (ADM-01), Org Settings (ADM-02)
- **Capabilities:** Org-level visibility, KPI drilldowns by shift/machine, audit logs, user management

### 2. Planner (Production Manager)
- **Dashboard:** Runs overview, schedule at-a-glance, quick actions
- **Screens:** 10 core screens (PLN-01 through PLN-10) including Runs List, Create Run, Inputs Validation, Schedule View, Events, Reschedule Wizard, Draft Impact Report, Compare Runs
- **Capabilities:** Create runs, manage schedules, validate inputs, handle events, generate AI briefs

### 3. Supervisor (Shopfloor)
- **Dashboard:** Today's schedule, machine status, current shift focus
- **Screens:** Today Dashboard (SUP-01), Machine Detail (SUP-02), Order Detail (SUP-03), Alerts (SUP-04), Log Setup Actuals (ACT-01), Log First-Piece Quality (ACT-02)
- **Capabilities:** View today's plan, acknowledge tasks, respond to alerts, log actuals, quality checks

## 🤖 AI Agent Integration

### Three Agent Screens (AGT-01, AGT-02, AGT-03)
- **AGT-01:** Shift-Start Brief (completed run analysis with evidence grounding)
- **AGT-02:** Draft Impact Report Assistant (auto-saved from wizard, resume workflow)
- **AGT-03:** Explain Chat (Q&A with evidence drawer, suggested questions)

**Key Features:**
- Evidence grounding for transparency
- "Why Late?" buttons from Order Detail → pre-filled chat
- Draft reports auto-save in Step 2 of Reschedule Wizard
- All claims backed by evidence (KPI deltas, schedule rows, events, operations)

## 📊 Key Metrics Tracked

- **OTD:** On-Time Delivery percentage
- **Downtime:** Unplanned machine downtime (hours/minutes)
- **Utilization:** Machine utilization % (bottleneck threshold: 85%)
- **Setup Time:** Changeover time between operations
- **OEE-Lite:** Simplified Overall Equipment Effectiveness
- **Rejects:** First-piece quality rejection rate

## 🔄 Run Versioning System

**Baseline Run (v1):**
- Created at shift start
- Original schedule

**Child Runs (v2, v3+):**
- Triggered by events (breakdown, rush order, material delay)
- Parent-child lineage tracking
- Draft Impact Reports auto-generated
- Compare parent vs child (PLN-08)

**Triggers:**
- Machine breakdown
- Rush order
- Material delay
- Scheduled maintenance
- Manual reschedule

## 🎯 Three Complete User Flows

### Flow 1: Planner Reschedule Workflow (8 min)
```
Login → Runs List → View Parent Run → Events → Add Breakdown →
Wizard Step 1 → Step 2 (auto-save draft) → PLN-10 Draft Report →
Continue → Step 3 (Reschedule from now DEFAULT) → Step 4 Create →
Child Run Detail → Schedule → Compare → AI Brief
```

**Key Interactions:**
- Auto-save draft report in Step 2
- "Reschedule from now" default in Step 3
- Evidence drawer in Draft Report
- Compare parent vs child side-by-side
- Generate AI brief for completed child run

### Flow 2: Supervisor Shopfloor Operations (6 min)
```
Login → Today Dashboard → Machine Detail → Log Breakdown →
Alerts → Order Detail → Explain Chat (pre-filled) →
Log Setup Actuals (Shift A/B/C) → Log First-Piece Quality
```

**Key Interactions:**
- Log breakdown from machine detail
- "Why Late?" button → pre-filled chat question
- Shift selector (A/B/C tabs) in Setup Actuals
- Pass/Fail radio + checkboxes in Quality Check
- Success toasts for all logged actions

### Flow 3: Owner Governance & Audit (5 min)
```
Login → KPI Overview → Drilldown by Machine → Weekly Metrics →
Runs Audit → Select Run with Draft → Lineage View →
Draft Report → Compare Parent vs Child
```

**Key Interactions:**
- Drilldown filters (Shift/Machine, mutually exclusive)
- Week selector with tabs (Overview/OTD/Downtime/Setup/Quality)
- Lineage chain visualization (parent→selected→child)
- Draft Report badge in audit list
- Evidence grounding throughout

## 📂 File Structure

```
/components/
  /auth/              # Login, OTP, Forgot Password (AUTH-01, 02, 03)
  /planner/           # 10 Planner screens (PLN-01 through PLN-10)
  /supervisor/        # 4 Supervisor screens + 2 Actuals (SUP-01-04, ACT-01-02)
  /owner/             # 3 Owner screens (OWN-01, 02, 03)
  /admin/             # 2 Admin screens (ADM-01, 02)
  /agent/             # 3 AI Agent screens (AGT-01, 02, 03)
  
  OwnerDashboard.tsx
  PlannerDashboard.tsx
  SupervisorDashboard.tsx

/styles/
  globals.css         # Tailwind v4 base styles

/GUIDES/
  AUTH_SCREENS_GUIDE.md
  PLANNER_GUIDE.md
  SUPERVISOR_GUIDE.md
  OWNER_ADMIN_GUIDE.md
  AGENT_GUIDE.md
  FLOW_GUIDE.md       # Complete clickable flows

App.tsx              # Main routing + role-based navigation
```

## 🎨 Design System

### Colors
```css
/* Primary Actions */
Blue-600:    Create, Save, Continue
Green-600:   Success, Complete, Quality Pass
Red-600:     Alerts, Breakdown, Delete
Orange-600:  Events, Warnings
Purple-600:  Reschedule, Compare

/* Status Badges */
Completed:   gray-200
Running:     green-100
Pending:     blue-100
Failed:      red-100

/* Evidence Types */
KPI:         blue-100
Schedule:    green-100
Event:       orange-100
Operation:   purple-100
```

### Typography
```css
/* Headers */
h1: Already styled in globals.css (don't override)
h2: Already styled in globals.css (don't override)
h3: Already styled in globals.css (don't override)

/* Use Tailwind classes only for overrides */
```

### Spacing
```css
/* Cards */
padding: 16-24px (p-4 to p-6)
gap: 12-16px (gap-3 to gap-4)

/* Sections */
margin-bottom: 24px (mb-6)

/* Touch Targets */
min-height: 44px (all buttons, inputs)
tab-bar: 64px total height
```

## 🔧 Key Features

### Auto-Computation
- **Setup Actuals:** Variance auto-calculated (actual - planned)
- **Quality Check:** Auto-validation (all checkboxes required for Pass)
- **Impact Analysis:** Auto-runs in Wizard Step 2
- **KPI Deltas:** Auto-calculated vs parent run

### Conditional UI
- **Buttons:** Show/hide based on run status (completed → AI Brief, has parent → Compare)
- **Badges:** Draft Report badge shows only if hasDraftReport = true
- **Filters:** Clear button shows only when filters active
- **Evidence:** "View Evidence" button shows only if evidenceIds.length > 0

### Tablet-First Patterns
- **Bottom Tab Nav:** Thumb-reachable on tablet
- **Large Tap Targets:** 44px+ throughout
- **Horizontal Scroll:** Tabs scroll on tablet (not wrap)
- **Drawer Slides:** 480px width on tablet, full-width on mobile
- **Modal Center:** Centered on tablet/desktop, full-screen on mobile

## 🚀 Getting Started

### Prerequisites
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Access Application
```
http://localhost:5173
```

### Demo Credentials

**Owner:**
- Email: sarah.chen@example.com
- Password: (any password works in demo)

**Planner:**
- Email: mike.rodriguez@example.com
- Password: (any password works in demo)

**Supervisor:**
- Email: priya.patel@example.com
- Password: (any password works in demo)

### Quick Navigation

**Flow 1 (Planner):**
1. Login as Mike
2. Go to /app/runs
3. Click RUN-2401
4. Click "View Events"
5. Click "Add Breakdown Event"
6. Follow wizard → Draft Report → Continue → Create Child Run
7. View Schedule, Compare, Generate AI Brief

**Flow 2 (Supervisor):**
1. Login as Priya
2. Today Dashboard shows
3. Click M03 machine
4. Log breakdown
5. Go to Alerts → Click Order
6. Click "Why Late?" → Explain Chat
7. Log Setup Actuals, First-Piece Quality

**Flow 3 (Owner):**
1. Login as Sarah
2. Go to Metrics (KPI Overview)
3. Drilldown by Machine M03
4. Go to Weekly Metrics → Review tabs
5. Go to Audit → Select RUN-2402
6. View Lineage → Click Draft Report
7. Go to Compare Runs

## 📖 Documentation

- **[FLOW_GUIDE.md](/FLOW_GUIDE.md)** - Complete clickable prototype flows with navigation paths
- **[PLANNER_GUIDE.md](/PLANNER_GUIDE.md)** - All 10 Planner screens (PLN-01 through PLN-10)
- **[SUPERVISOR_GUIDE.md](/SUPERVISOR_GUIDE.md)** - Supervisor screens + Actuals logging
- **[OWNER_ADMIN_GUIDE.md](/OWNER_ADMIN_GUIDE.md)** - Owner KPIs, Audit, Admin screens
- **[AGENT_GUIDE.md](/AGENT_GUIDE.md)** - AI Agent screens with evidence grounding
- **[AUTH_SCREENS_GUIDE.md](/AUTH_SCREENS_GUIDE.md)** - Login, OTP, Forgot Password

## 🎓 Course Deliverables Met

✅ **Information Architecture:** Three-role hierarchy (Owner/Planner/Supervisor) with clear navigation  
✅ **User Flows:** Three complete flows documented in FLOW_GUIDE.md  
✅ **AI Node Flow:** Agent screens with evidence grounding and Q&A  
✅ **Wireframes:** All screens implemented as high-fidelity React components  
✅ **Responsive Design:** Tablet-first (1024×768) with desktop support (1440×900)  
✅ **Navigation Patterns:** Top bar + bottom tabs for tablet ergonomics  
✅ **Version Control:** Complete run versioning with parent-child lineage  
✅ **Metrics Tracking:** OTD, downtime, utilization, setup time, rejects, OEE  

## 🔑 Key Differentiators

1. **Tablet-First:** Bottom tab nav, large touch targets, thumb-reachable
2. **AI Evidence Grounding:** Every AI claim backed by production data references
3. **Auto-Save Draft Reports:** Wizard Step 2 auto-saves impact analysis
4. **Run Versioning:** Complete parent→child lineage with compare functionality
5. **Role-Based Dashboards:** Each role sees relevant data (Owner: KPIs, Planner: Runs, Supervisor: Today)
6. **Conditional UI:** Buttons, badges, filters show/hide based on context
7. **Pre-Filled Navigation:** "Why Late?" button pre-fills chat question
8. **Real-Time Feedback:** Success toasts, loading states, auto-calculation

## 🧪 Testing Flows

### Planner Flow Test
1. Start at /auth/login
2. Login as mike.rodriguez@example.com
3. Navigate to /app/runs
4. Click RUN-2401 → Events → "Add Breakdown Event"
5. Verify wizard flow, auto-save draft, create child run
6. Verify Schedule, Compare, AI Brief navigation

### Supervisor Flow Test
1. Start at /auth/login
2. Login as priya.patel@example.com
3. Navigate to /app (Today Dashboard)
4. Click M03 → Log breakdown → Success toast
5. Go to Alerts → Click Order → "Why Late?" → Chat pre-filled
6. Log Setup Actuals with Shift selector
7. Log First-Piece Quality → Pass validation

### Owner Flow Test
1. Start at /auth/login
2. Login as sarah.chen@example.com
3. Navigate to /app/metrics (KPI Overview)
4. Test drilldowns: Machine M03 → Values update
5. Go to /app/metrics/weekly → Tab navigation
6. Go to /app/audit → Select run → Lineage → Draft Report

## 📱 Responsive Breakpoints

```css
/* Tablet */
1024×768 (primary target)
- Bottom tab navigation
- 2-column grids
- Horizontal scroll tabs

/* Desktop */
1440×900+
- Sidebar navigation (Desktop only)
- 4-column grids
- Inline tabs

/* Mobile */
<1024
- Full-width single column
- Bottom nav
- Drawer full-screen
```

## 🎯 Production Ready

- ✅ Complete routing (React Router v6)
- ✅ TypeScript interfaces for all data structures
- ✅ Lucide React icons throughout
- ✅ Tailwind CSS v4 styling
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Back navigation on all detail pages
- ✅ Loading states (spinners, skeletons)
- ✅ Success/error toasts
- ✅ Modal overlays with backdrop
- ✅ Evidence drawers (slide-in)
- ✅ Auto-save indicators
- ✅ Empty states
- ✅ Fallback messages

## 🚢 Next Steps for Production

1. **Backend Integration:**
   - Connect to real API endpoints
   - Replace mock data with live data
   - Implement authentication (JWT tokens)

2. **Real-Time Updates:**
   - WebSocket for live machine status
   - Push notifications for alerts
   - Auto-refresh dashboards

3. **Data Persistence:**
   - Connect to Supabase/PostgreSQL
   - Implement run versioning in DB
   - Store evidence references

4. **AI Agent Training:**
   - Train model on production data
   - Implement RAG for evidence retrieval
   - Fine-tune for manufacturing domain

---

**Built with React + TypeScript + Tailwind CSS v4 + Lucide Icons**

Course: Digital Operations Assistant for SMU Production Scheduling  
Focus: IA + User Flows + AI Integration + Responsive Tablet-First Design
