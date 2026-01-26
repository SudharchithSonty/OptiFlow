# Digital Operations Assistant - SMU Production Scheduling

A comprehensive tablet-first (1024×768 landscape) and desktop-responsive (1440×900) web application for Small-Medium Manufacturing Units (SMU) with role-based access control and AI-powered production planning.

## Features

### Three User Roles

1. **Owner (SMU Admin)**
   - KPI visibility and governance
   - Manufacturing metrics dashboard (OEE, OTD, Setup Time, Utilization, Downtime, Rejects)
   - Weekly performance trends
   - User management
   - Production summary and reject analysis

2. **Planner (Production Manager)**
   - Create and manage production runs
   - Upload/generate inputs and schedules
   - Run versioning system (v1, v2, v3+)
   - AI brief generation with insights, risks, and recommendations
   - Compare run versions
   - Schedule visualization (timeline and list views)
   - Metrics tracking

3. **Supervisor (Shopfloor)**
   - View today's production plan
   - Track active and pending orders
   - Acknowledge alerts and respond to events
   - "Ask Why" AI Q&A for explanations
   - Real-time shift progress tracking

### Core Functionality

- **Production Runs**: Shift-based planning (A/B/C shifts) with statuses: created, generating, generated, scheduling, scheduled, completed, failed
- **Run Versioning**: Complete audit trail with version comparison (v1 vs v2, etc.)
- **AI Agent Integration**: 
  - Automated brief generation with key insights, risks, and recommendations
  - "Explain Why" Q&A with evidence grounding
  - Confidence scoring
- **Alert System**: Critical alerts for breakdowns, rush orders, delays, quality issues, and resource constraints
- **Key Metrics**: OTD, Setup Time, Utilization, Downtime, Rejects, First-Piece Rejects, OEE
- **Responsive Design**: Bottom tab navigation on tablet (thumb-reachable), sidebar on desktop

## Tech Stack

- **React** with TypeScript
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons
- **Tailwind CSS** for styling

## Getting Started

The application includes:
- Complete mock data for realistic scenarios
- Role switching for demo purposes (top bar dropdown)
- Responsive layouts for tablet and desktop
- Touch-optimized UI components

## Navigation

### Tablet (< 1200px)
- Bottom tab bar with 4 main navigation items
- Large touch targets (minimum 48×48px)
- Optimized for 1024×768 landscape orientation

### Desktop (≥ 1200px)
- Left sidebar navigation
- Full feature access
- Optimized for 1440×900 resolution

## Mock Data Included

- 5 production runs with multiple versions
- 5 orders with priorities (rush, high, normal, low)
- 5 machines with different statuses
- 4 alerts (breakdown, rush-order, quality, delay)
- Weekly trend data for metrics
- Complete user profiles for all three roles

## Key Pages

1. **Dashboard** (role-specific)
   - Owner: KPI overview with trends
   - Planner: Production runs and alerts
   - Supervisor: Today's plan and active orders

2. **Runs Page** (Planner)
   - List all production runs
   - Version history
   - Create new runs

3. **Run Detail Page** (Planner)
   - Complete run information
   - AI brief with insights and recommendations
   - Orders and machine allocation
   - Version comparison
   - Ask AI dialog

4. **Schedule Page**
   - Timeline view with machine allocation
   - List view with order details
   - Shift selection (A/B/C)
   - Date navigation

5. **Alerts Page** (Supervisor/Planner)
   - Critical alerts with severity levels
   - Acknowledgement system
   - "Ask Why" AI explanations

6. **Metrics Page** (Owner/Planner)
   - Weekly performance trends
   - Setup time by machine
   - Downtime analysis
   - Reject analysis
   - Machine performance summary

7. **Users Page** (Owner)
   - User management
   - Role assignment
   - Status tracking

## Design System

- **Colors**: Blue (primary), Green (success), Red (critical), Orange (warning), Purple (AI features)
- **Typography**: System defaults with custom weights
- **Spacing**: Consistent 4px grid
- **Touch Targets**: Minimum 48×48px on tablet
- **Cards**: Rounded corners (10px radius) with subtle shadows

## AI Features

### Brief Generation
- Automated analysis of production runs
- Key insights highlighting optimization opportunities
- Risk identification with severity levels (high/medium/low)
- Actionable recommendations
- Confidence scoring (0-1 scale)

### Ask AI / Explain Why
- Context-aware Q&A system
- Evidence-based explanations
- Scheduling decision rationale
- Risk mitigation suggestions

## Manufacturing Metrics

- **OEE (Overall Equipment Effectiveness)**: Combined measure of availability, performance, and quality
- **OTD (On-Time Delivery)**: Percentage of orders delivered on or before due date
- **Setup Time**: Average time to prepare machines for production
- **Utilization**: Percentage of available time machines are actively producing
- **Downtime**: Total hours of unplanned machine stoppage
- **Reject Rate**: Percentage of parts that fail quality inspection
- **First-Piece Rejects**: Number of first pieces rejected (indicates setup issues)

## Responsive Breakpoints

- Mobile/Tablet: < 1200px (bottom tabs)
- Desktop: ≥ 1200px (sidebar)
- Optimized for: 1024×768 (tablet), 1440×900 (desktop)

## Demo Features

- Role switcher in top bar (Owner/Planner/Supervisor)
- Realistic manufacturing scenarios
- Complete workflows for all user types
- Interactive UI components with hover states
- Modal dialogs for AI interactions and comparisons

---

Built for course demonstration of IA + user flows + AI node flow + wireframes as a complete Figma-ready prototype.
