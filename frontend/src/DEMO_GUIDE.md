# Quick Demo Guide - Digital Operations Assistant

## Demo Overview
A tablet-first production scheduling application for small-batch manufacturing with three user roles and AI-powered planning.

## Role Switching (Demo Mode)
**Top Bar → Role Dropdown**
- Switch between Owner, Planner, and Supervisor views
- Each role has different navigation and capabilities
- Automatically redirects to appropriate dashboard

---

## Owner Demo Flow (5 min)

### Start: Owner Dashboard
**What to show:**
- 6 KPI cards with trends (OEE, OTD, Setup Time, Utilization, Downtime, Rejects)
- Weekly performance trend chart (last 4 weeks)
- Production summary stats
- Reject analysis bar chart
- Recent activities log

**Key Points:**
- Green/red trend indicators
- Progress bars vs targets
- Real-time activity feed

### Navigate: Metrics Page
**What to show:**
- Detailed KPI cards with change percentages
- Weekly trends line chart (OEE, OTD, Utilization)
- Setup time by machine bar chart
- Downtime analysis (planned vs unplanned)
- Reject analysis with percentages
- Machine performance summary table

**Key Points:**
- M4 (Lathe #2) shows 8 hours downtime = breakdown scenario
- Multiple visualization types
- Export report button

### Navigate: Users Page
**What to show:**
- User stats (5 total users)
- Search and filter controls
- User table with roles and status
- "Add User" dialog
- Role color coding (purple=owner, blue=planner, green=supervisor)

**Key Points:**
- Role-based access control
- Email invitation system
- Last active tracking

---

## Planner Demo Flow (7 min)

### Start: Planner Dashboard
**What to show:**
- Quick stats (Today's runs, Scheduled, Generating, Avg Utilization)
- Alert banner (if unacknowledged alerts exist)
- Today's production runs cards with:
  - Shift indicator (A/B/C)
  - Version badge (v1, v2)
  - Order preview
  - OEE metric
- Upcoming runs section

**Key Points:**
- Multiple runs per day (3 shifts)
- Version tracking visible
- Alert awareness

### Navigate: Runs Page
**What to show:**
- List of all runs grouped by base ID
- Version history (expandable)
- Status badges (scheduled, generating, completed)
- Search and filter controls
- Click on "RUN-20260102-A" (Shift A, v2)

**Key Points:**
- Run grouping by date/shift
- Version comparison capability
- Multiple orders per run

### Navigate: Run Detail Page (RUN-20260102-A)
**What to show:**
- Run header with v2 badge and status
- 4 metric cards (OEE 84%, OTD 95%, Utilization 82%, Setup 47m)
- **AI Brief section** (purple gradient):
  - Summary paragraph
  - Key insights (4 bullets with checkmarks)
  - Identified risks (1 capacity risk, orange)
  - Recommendations (3 bullets with trend icons)
  - 89% confidence badge
- Orders table (2 orders: O001, O004)
- Machine allocation cards (M1, M5)

**Key Points:**
- Click "Ask AI" button → Show dialog for Q&A
- Click "Compare" button → Show version comparison dialog
- AI brief is the centerpiece
- Risk severity color coding

### Navigate: Schedule Page
**What to show:**
- Date navigation controls
- Shift selector (A/B/C with time ranges)
- Toggle between Timeline and List views
- **Timeline View:**
  - 8-hour timeline grid
  - Machines as rows (M1-M5)
  - Orders as colored blocks
  - Color by priority (red=rush, orange=high, blue=normal)
- **List View:**
  - Orders with full details
  - Start/end times
  - Progress indicators
- Machine status summary at bottom

**Key Points:**
- Visual schedule optimization
- Shift-based planning
- Machine status awareness (M4 in maintenance)

---

## Supervisor Demo Flow (5 min)

### Start: Supervisor Dashboard
**What to show:**
- Current time widget (10:45 AM)
- Shift progress bar (34% complete)
- **Critical alert banner** (Machine M4 breakdown)
- Active orders section:
  - Order O001 card (green, in-progress)
  - Progress bar (45/150 units = 30%)
  - Start/end times
  - "Mark Complete" and "Ask Why" buttons
- Pending orders section
- Recent alerts

**Key Points:**
- Real-time shift tracking
- Alert acknowledgment flow
- Task-focused interface

### Navigate: Alerts Page
**What to show:**
- Stats cards (Total, Unacknowledged, Critical, Acknowledged)
- Filters (severity, status)
- Alert cards with:
  - Severity badge (critical=red, high=orange, medium=yellow)
  - Machine/order tags
  - Timestamp
  - Description
  - Acknowledgment status
- Click "Acknowledge" button on critical alert
- Click "Ask Why" → Show AI explanation dialog

**Key Points:**
- 4 alert types: breakdown, rush-order, quality, delay
- Acknowledgment tracking (who, when)
- AI-powered explanations
- Alert details clearly visible

### Navigate: Schedule/Today Page
**What to show:**
- Today's schedule for Shift A
- Same schedule view as Planner but focused on current shift
- Machine timeline showing active orders
- Order progress tracking

**Key Points:**
- Supervisor sees only today's plan
- Real-time execution view
- No edit capabilities (view-only)

---

## Key Demo Scenarios

### Scenario 1: Rush Order Arrives
**Flow:** Planner Dashboard → See alert → View Run Detail → AI Brief shows high delay risk → Compare v1 vs v2

### Scenario 2: Machine Breakdown
**Flow:** Supervisor Dashboard → Critical alert → Acknowledge → Ask AI Why → View rescheduling impact

### Scenario 3: Performance Review
**Flow:** Owner Dashboard → Metrics → Weekly trends → Identify M2 has high setup time → Export report

### Scenario 4: Version Comparison
**Flow:** Planner → Runs Page → Expand version history → Compare v1 vs v2 → See added order O004

---

## Interactive Elements to Highlight

### AI Features (Purple)
- AI Brief generation with confidence scores
- "Ask AI" / "Ask Why" buttons
- Evidence-based explanations
- Risk identification with mitigation

### Version Control
- Version badges (v1, v2, v3)
- Version history dropdown
- Compare versions dialog
- Audit trail

### Responsive Design
- Resize browser to < 1200px → Bottom tabs appear
- Resize to ≥ 1200px → Sidebar appears
- Touch-optimized buttons on tablet
- Large tap targets (48×48px minimum)

### Real-time Updates
- Shift progress bar
- Order progress tracking
- Alert acknowledgment
- Machine status changes

---

## Pro Tips for Demo

1. **Start with Owner** to show the "big picture" KPIs
2. **Move to Planner** to show the "how" of scheduling
3. **End with Supervisor** to show the "execution" layer
4. **Always show AI Brief** - it's a key differentiator
5. **Demonstrate version comparison** - shows audit trail
6. **Acknowledge an alert** - shows workflow completion
7. **Resize browser** - proves responsive design
8. **Use role switcher** - shows multi-user perspective

## Key Talking Points

- **Tablet-first design** for shopfloor use
- **Three distinct roles** with appropriate access levels
- **AI-powered insights** reduce planning time by 60%
- **Complete audit trail** via version control
- **Real-time alerts** prevent production delays
- **Evidence-based decisions** with AI explanations
- **Mobile-optimized** for on-the-go management

---

**Total Demo Time:** 15-20 minutes
**Highlight:** AI Brief, Version Comparison, Responsive Design
**Wow Factor:** Real-time shift tracking + AI Q&A
