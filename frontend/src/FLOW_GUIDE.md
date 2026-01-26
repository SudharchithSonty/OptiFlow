# Clickable Prototype Flows - Complete Navigation Guide

## Overview

Three complete user flows with realistic interactions and tablet-friendly navigation (min 44px tap targets, back navigation everywhere).

---

## Flow 1: Planner - Reschedule with Draft Impact Report

**Role:** Planner (Mike Rodriguez)  
**Device:** Tablet (1024×768)  
**Duration:** ~8 minutes

### Flow Steps

#### 1. Login (`/auth/login`)
- **Tap:** Email input → Enter "mike.rodriguez@example.com"
- **Tap:** Password input → Enter password
- **Tap:** "Sign In" button (blue, 44px height)
- **Navigate to:** Planner Dashboard (`/app`)

#### 2. Planner Dashboard (`/app`)
- **See:** Welcome card, Recent runs, Quick stats
- **Tap:** "Runs" tab in bottom nav (large tap target)
- **Navigate to:** Runs List (`/app/runs`)

#### 3. Runs List (`/app/runs`)
- **See:** List of runs with status badges
- **Find:** "RUN-2401" (completed parent run)
- **Tap:** Run card (entire card clickable, 60px height)
- **Navigate to:** Run Detail (`/app/runs/RUN-2401`)

#### 4. Run Detail - Parent Run (`/app/runs/RUN-2401`)
- **See:** Run overview, KPIs, Activity timeline
- **Notice:** "View Events" button (orange, prominent)
- **Tap:** "View Events" button
- **Navigate to:** Events List (`/app/runs/RUN-2401/events`)

#### 5. Events List (`/app/runs/RUN-2401/events`)
- **See:** Existing events (EVT-001, EVT-002, etc.)
- **Notice:** "Add Breakdown Event" button (red, top-right)
- **Tap:** "Add Breakdown Event" (48px height, large tap target)
- **Navigate to:** Reschedule Wizard Step 1 (`/app/runs/RUN-2401/reschedule-wizard?step=1&trigger=breakdown`)

#### 6. Wizard Step 1: Event Details
- **See:** Breakdown event form
- **Fill:**
  - Machine: M03 (dropdown)
  - Start Time: 11:30 (time picker)
  - Duration: 30 minutes (number input)
  - Severity: High (dropdown)
  - Notes: "Hydraulic pressure drop - maintenance required"
- **Tap:** "Next: Select Event" button (blue, bottom of screen)
- **Navigate to:** Step 2 (`?step=2`)

#### 7. Wizard Step 2: Select Event
- **See:** Event EVT-001 card selected (blue border)
- **See:** Impact preview: "3 orders affected, +45 min delay"
- **Auto-calculation:** Wizard runs impact analysis
- **Notice:** Yellow banner at top: "Auto-saving draft impact report..."
- **After 2 seconds:** Banner changes to "Draft saved ✓"
- **Tap:** "Next: Configure Reschedule" button
- **Navigate to:** Draft Impact Report opens (`/app/runs/RUN-2401/impact-report`)

#### 8. PLN-10 Draft Impact Report (`/app/runs/RUN-2401/impact-report`)
- **See:** Yellow "Draft" badge in header
- **See:** Auto-saved notice: "Auto-saved from Wizard Step 2"
- **See:** 3 impact sections:
  - Late Orders (2 orders)
  - OTD Degradation (-12.3%)
  - Bottleneck Impact (M03 queue +3 ops)
- **Tap:** "View Evidence" on OTD section
- **See:** Evidence drawer slides in from right
- **Review:** Evidence items (KPI delta, schedule row, event)
- **Tap:** Close drawer (X button, top-right)
- **Tap:** "Continue Wizard" button (blue, top-right)
- **Navigate back to:** Wizard Step 3 (`?step=3`)

#### 9. Wizard Step 3: Reschedule Options
- **See:** "Reschedule from now" radio button (DEFAULT SELECTED)
- **See:** "Reschedule from specific time" radio button
- **See:** Time preview: "Next available: 12:00 (30 min from now)"
- **Notice:** Green checkmark next to "from now" option
- **Tap:** "Next: Review & Create" button
- **Navigate to:** Step 4 (`?step=4`)

#### 10. Wizard Step 4: Review & Create Child Run
- **See:** Summary of changes:
  - Parent: RUN-2401
  - Child: RUN-2412 (preview)
  - Event: Breakdown (M03, 30 min)
  - Schedule start: 12:00
  - Affected operations: 12
- **Tap:** "Create Child Run" button (green, large, 52px height)
- **See:** Loading spinner (2 seconds)
- **See:** Success toast: "Run RUN-2412 created"
- **Navigate to:** Child Run Detail (`/app/runs/RUN-2412`)

#### 11. Child Run Detail (`/app/runs/RUN-2412`)
- **See:** Run overview with parent link
- **See:** Banner: "Draft Impact Report Available" (green)
- **See:** KPIs with delta vs parent (OTD +2.3%, Setup -8.5%)
- **Tap:** "View Schedule" button (green)
- **Navigate to:** Schedule View (`/app/runs/RUN-2412/schedule`)

#### 12. Schedule View (`/app/runs/RUN-2412/schedule`)
- **See:** Gantt chart or timeline
- **See:** Operations resequenced after 12:00
- **See:** Highlight on changed operations (yellow)
- **Tap:** Back arrow
- **Navigate back to:** Run Detail

#### 13. Run Detail - View KPIs
- **See:** 4 KPI cards
- **Scroll down:** KPIs section visible
- **Tap:** "Compare Runs" button (purple, appears because has parent)
- **Navigate to:** Compare Runs (`/app/runs/compare?run1=RUN-2401&run2=RUN-2412`)

#### 14. Compare Runs (`/app/runs/compare`)
- **See:** Side-by-side comparison
- **See:** Delta highlights (green for improvements, red for regressions)
- **See:** 12 operations resequenced
- **Tap:** Back arrow
- **Navigate back to:** Child Run Detail

#### 15. Generate Shift-Start Brief
- **Tap:** "AI Brief" button (blue, top-right)
- **Navigate to:** Shift-Start Brief (`/app/runs/RUN-2412/brief`)

#### 16. AGT-01 Shift-Start Brief
- **See:** 🤖 AI icon, gradient background
- **See:** Summary card (2 late, 1 bottleneck, 2 actions, 1 risk)
- **See:** 4 sections: Late Orders, Bottleneck, Actions, Risks
- **Tap:** "View Evidence (2)" on Late Orders claim
- **See:** Evidence drawer slides in (blue header)
- **Review:** 2 evidence items with context
- **Tap:** Close drawer
- **Scroll through:** All 4 sections
- **Flow complete!**

---

## Flow 2: Supervisor - Shopfloor Operations

**Role:** Supervisor (Priya Patel)  
**Device:** Tablet (1024×768)  
**Duration:** ~6 minutes

### Flow Steps

#### 1. Login (`/auth/login`)
- **Tap:** Email input → Enter "priya.patel@example.com"
- **Tap:** Password input → Enter password
- **Tap:** "Sign In" button
- **Navigate to:** Today Dashboard (`/app` - Supervisor role)

#### 2. SUP-01 Today Dashboard (`/app`)
- **See:** Shift A header (current shift)
- **See:** Machine status grid (M01-M05)
- **See:** Today's orders list
- **Notice:** M03 card has red border (machine down)
- **Tap:** M03 card (large, 120px height)
- **Navigate to:** Machine Detail (`/app/machines/M03`)

#### 3. SUP-02 Machine Detail (`/app/machines/M03`)
- **See:** Machine header: "M03 - Press 3"
- **See:** Status badge: "Down" (red)
- **See:** Current operation: "ORD-1234 Op 2 (Paused)"
- **See:** Utilization: 94.2% (orange warning)
- **Notice:** "Log Breakdown" button (red, prominent)
- **Tap:** "Log Breakdown" button
- **See:** Modal opens

#### 4. Log Breakdown Modal
- **Fill:**
  - Type: Hydraulic failure (dropdown)
  - Start Time: 11:30 (auto-filled)
  - Duration: 30 min (number input)
  - Notes: "Pressure drop, needs maintenance"
- **Tap:** "Save & Notify Planner" button (red, large)
- **See:** Success toast: "Breakdown logged"
- **Modal closes**
- **Navigate back to:** Machine Detail (updated status)

#### 5. Navigate to Alerts
- **Tap:** "Alerts" tab in bottom nav
- **Navigate to:** Alerts List (`/app/alerts`)

#### 6. SUP-04 Alerts List (`/app/alerts`)
- **See:** Critical alert: "ORD-1234 at risk" (red card)
- **See:** Warning: "M03 bottleneck" (orange card)
- **See:** Info: "Shift handoff notes" (blue card)
- **Tap:** "ORD-1234 at risk" alert (entire card clickable)
- **Navigate to:** Order Detail (`/app/orders/ORD-1234`)

#### 7. SUP-03 Order Detail (`/app/orders/ORD-1234`)
- **See:** Order header: "ORD-1234 - Widget A Production"
- **See:** Status: "Behind Schedule" (red)
- **See:** Progress: 65% (Op 2/3 in progress)
- **See:** Alert banner: "Order will miss 16:00 deadline by 45 min"
- **Notice:** "Why Late?" button (orange with Cpu icon)
- **Tap:** "Why Late?" button
- **Navigate to:** Explain Chat (pre-filled question) (`/app/agent/chat?q=Why+is+ORD-1234+late`)

#### 8. AGT-03 Explain Chat
- **See:** Welcome screen (first time)
- **See:** Input field PRE-FILLED: "Why is order ORD-1234 running late?"
- **Tap:** Send button (blue, right side)
- **See:** Loading indicator (3 pulsing dots + "Analyzing...")
- **After 2 seconds:** AI response appears
- **See:** Multi-line answer:
  ```
  ORD-1234 is late due to:
  1. **Setup Delay**: 30 min late start
  2. **M03 Breakdown**: Hydraulic failure at 11:30
  3. **Current Status**: 65% complete
  Root cause: M03 bottleneck + breakdown
  ```
- **See:** "View Evidence (4)" button
- **Tap:** "View Evidence" button
- **See:** Evidence drawer slides in (green header)
- **Review:** 4 evidence items (due time, schedule, event, operation)
- **Tap:** Close drawer
- **Tap:** Back arrow
- **Navigate back to:** Order Detail

#### 9. Navigate to Setup Actuals
- **Tap:** Back arrow from Order Detail
- **Navigate to:** Machine Detail (`/app/machines/M03`)
- **Notice:** "Log Setup Actuals" button in quick actions
- **Tap:** "Log Setup Actuals" button
- **Navigate to:** Log Setup Actuals (`/app/machines/M03/setup-actuals`)

#### 10. ACT-01 Log Setup Actuals
- **See:** Form header: "Log Setup Actuals - M03"
- **See:** Shift selector (A/B/C tabs)
- **Notice:** Shift A selected (blue highlight)
- **Fill:**
  - Previous Operation: ORD-1233 (dropdown)
  - Current Operation: ORD-1234 (dropdown)
  - Planned Setup Time: 45 min (auto-filled)
  - Actual Setup Time: 60 min (number input)
  - Variance: Auto-calculated (+15 min, red)
  - Reason: Tool change delay (dropdown)
  - Notes: "Replacement tool needed"
- **Tap:** "Save Setup Actuals" button (green, bottom)
- **See:** Success toast: "Setup actuals logged"
- **Navigate back to:** Machine Detail

#### 11. Navigate to First-Piece Quality
- **Tap:** "Log First-Piece Check" button
- **Navigate to:** Log First-Piece Quality (`/app/machines/M03/first-piece-quality`)

#### 12. ACT-02 Log First-Piece Quality
- **See:** Form header: "Log First-Piece Quality Check - M03"
- **Fill:**
  - Operation: ORD-1234 Op 2 (dropdown)
  - Check Time: 12:15 (auto-filled)
  - Quality Result: Pass (radio button selected)
  - Inspector: Priya Patel (auto-filled)
  - Dimensions OK: ✓ (checkbox)
  - Finish OK: ✓ (checkbox)
  - Tolerances OK: ✓ (checkbox)
  - Notes: "All specs met, ready for production"
- **Tap:** "Save Quality Check" button (green, large)
- **See:** Success toast: "Quality check logged"
- **Navigate back to:** Machine Detail
- **Flow complete!**

---

## Flow 3: Owner - Governance & Audit

**Role:** Owner (Sarah Chen)  
**Device:** Tablet (1024×768)  
**Duration:** ~5 minutes

### Flow Steps

#### 1. Login (`/auth/login`)
- **Tap:** Email input → Enter "sarah.chen@example.com"
- **Tap:** Password input → Enter password
- **Tap:** "Sign In" button
- **Navigate to:** Owner Dashboard (`/app`)

#### 2. Owner Dashboard (`/app`)
- **See:** Executive summary cards
- **See:** High-level KPIs (OTD, Utilization, OEE)
- **See:** Recent activity feed
- **Tap:** "Metrics" tab in bottom nav
- **Navigate to:** KPI Overview (`/app/metrics`)

#### 3. OWN-01 KPI Overview (`/app/metrics`)
- **See:** BarChart3 icon header
- **See:** Drilldown filters (Shift: All, Machine: All)
- **See:** 5 KPI cards:
  - OTD: 91.5% (+3.2% trend)
  - Downtime: 12.4 hrs (-15.3% trend, green)
  - Utilization: 78.3% (+2.1%)
  - Setup Minutes: 487 min (-8.5%, green)
  - OEE-Lite: 72.8% (+4.7%)
- **Scroll down:** See "Breakdown by Shift" (3 cards)
- **Scroll down:** See "Breakdown by Machine" (table)
- **Notice:** M03 row highlighted (orange-50 background)
- **See:** M03 "Bottleneck" badge (orange)
- **Tap:** Machine filter dropdown
- **Select:** M03
- **See:** Active filter banner: "Viewing: Machine M03 (Bottleneck)"
- **See:** All KPI cards update with M03 data
- **Notice:** OTD 85.4% (lower), Utilization 94.2% (higher)
- **Tap:** "Clear Filters" button
- **Back to:** Org-wide view

#### 4. Navigate to Weekly Metrics
- **Tap:** Back arrow → Dashboard
- **Tap:** "Weekly Metrics" card or link
- **Navigate to:** Weekly Metrics (`/app/metrics/weekly`)

#### 5. OWN-02 Weekly Metrics
- **See:** Week selector (Week of Jan 6-12, 2026)
- **See:** 5 tabs (Overview, OTD, Downtime, Setup, Quality)
- **See:** Overview tab selected
- **See:** Trend chart (line graph, 7 days)
- **See:** Day-by-day breakdown table
- **Tap:** OTD tab
- **See:** OTD-specific chart (target line at 95%)
- **See:** Monday below target (red dot)
- **Scroll through tabs**
- **Tap:** Back arrow
- **Navigate to:** Dashboard

#### 6. Navigate to Runs Audit
- **Tap:** "Audit" or "Runs" link
- **Navigate to:** Runs Audit (`/app/audit`)

#### 7. OWN-03 Runs Audit / History
- **See:** GitBranch icon header
- **See:** Search bar (left panel)
- **See:** Status filter (All/Draft/Pending/Completed/Archived)
- **See:** Trigger filter (All/Baseline/Reschedule/Event/Manual)
- **See:** 5 runs in left panel list
- **Notice:** RUN-2402 (Run v2) has yellow "Draft Report" badge
- **Tap:** RUN-2402 card (entire card, 100px height)
- **See:** Left panel: Card highlighted (purple-50 background, left border)
- **See:** Right panel: Lineage view appears

#### 8. Lineage View (Right Panel)
- **See:** 3-run chain:
  ```
  RUN-2401 (Run v1 - Baseline)
     ↓
  RUN-2402 (Run v2 - Rush Order) [SELECTED] [DRAFT REPORT]
     ↓
  RUN-2403 (Run v3 - Breakdown Recovery)
  ```
- **See:** Selected run (RUN-2402) has purple-600 border-2
- **See:** "Draft Report" badge (yellow with FileText icon)
- **See:** "View Draft Report" button (yellow, full-width)
- **Tap:** "View Draft Report" button
- **Navigate to:** Draft Impact Report Assistant (`/app/runs/RUN-2402/draft-assistant`)

#### 9. AGT-02 Draft Impact Report Assistant
- **See:** 🤖 icon (purple/pink gradient)
- **See:** "Draft" badge (yellow) in header
- **See:** Auto-saved banner: "Partial draft auto-saved"
- **See:** Event Context card (Rush Order ORD-9999)
- **See:** 3 Impact Analysis items:
  1. Late Orders (High, red): 4 orders 45-90 min late
  2. OTD Degradation (High, red): -12.3% drop
  3. Bottleneck Impact (Medium, orange): M03 queue +3 ops
- **Tap:** "View Evidence (2)" on Late Orders
- **See:** Evidence drawer (purple header)
- **Review:** 2 evidence items
- **Tap:** Close drawer
- **See:** Overall Impact Summary (gradient red/orange panel)
- **Notice:** Two buttons: "Discard Draft" (red border), "Continue Wizard" (blue)
- **Tap:** Back arrow (not continuing wizard for this flow)
- **Navigate back to:** Runs Audit

#### 10. Open Compare Runs
- **From Audit:** Click "View →" link on RUN-2402
- **Navigate to:** Run Detail (`/app/runs/RUN-2402`)
- **See:** Parent link: RUN-2401
- **Tap:** "Compare Runs" button (purple)
- **Navigate to:** Compare Runs (`/app/runs/compare?run1=RUN-2401&run2=RUN-2402`)

#### 11. PLN-08 Compare Runs
- **See:** Side-by-side panels (Parent | Child)
- **See:** Run headers with badges
- **See:** KPI deltas (colored based on improvement/regression)
- **See:** Schedule changes section:
  - 12 operations resequenced
  - 4 materials substituted
  - 2 machines reassigned
- **See:** Timeline comparison (Gantt chart)
- **See:** Highlights on changed operations (yellow)
- **Tap:** Export button (CSV icon)
- **See:** Download toast: "Comparison exported to CSV"
- **Flow complete!**

---

## Tablet-Friendly Design Checklist

### Touch Targets (Min 44px)
- ✅ All buttons: 44px height minimum (most are 48-52px)
- ✅ Tab nav items: 60px height (bottom bar)
- ✅ List items: 60px+ height
- ✅ Input fields: 44px height
- ✅ Dropdowns: 44px height
- ✅ Icon buttons: 44×44px minimum

### Back Navigation
- ✅ Every detail page has "Back to X" button (top-left)
- ✅ Arrow icon + text label
- ✅ Gray-600 color, hover:gray-900
- ✅ Consistent 20px margin from top

### Spacing & Layout
- ✅ Bottom nav: 16px padding, 64px total height
- ✅ Cards: 16-24px padding
- ✅ Forms: 16px gap between fields
- ✅ Buttons: 8-12px gap between multiple buttons
- ✅ Sections: 24px gap

### Responsive Behavior
- ✅ Grid → Stack on narrow screens
- ✅ Horizontal scroll for tabs (tablet)
- ✅ Drawer slides from right (480px width on tablet)
- ✅ Modal full-screen on mobile, centered on tablet/desktop

---

## Auto-Save & Real-Time Feedback

### Wizard Auto-Save (Step 2)
```typescript
// When impact analysis completes
showBanner({
  type: 'info',
  message: 'Auto-saving draft impact report...',
  icon: 'clock'
});

setTimeout(() => {
  saveDraft(); // API call
  showBanner({
    type: 'success',
    message: 'Draft saved ✓',
    icon: 'check'
  });
}, 2000);
```

### Success Toasts
- Position: Top-right
- Duration: 3 seconds
- Types: Success (green), Error (red), Info (blue)
- Examples:
  - "Run RUN-2412 created"
  - "Setup actuals logged"
  - "Breakdown logged"
  - "Quality check saved"

### Loading States
- Buttons: Spinner + "Saving..." / "Creating..."
- Wizard: Progress bar (Step 1/4)
- Chat: 3 pulsing dots + "Analyzing..."
- Evidence drawer: Skeleton cards while loading

---

## Navigation Flows Summary

**Flow 1 Navigation:**
```
Login → Dashboard → Runs List → Run Detail → Events →
Wizard Step 1 → Step 2 (auto-save) → Draft Report →
Step 3 → Step 4 → Child Run Detail → Schedule →
Back → Compare → Back → AI Brief
```

**Flow 2 Navigation:**
```
Login → Today Dashboard → Machine Detail → Log Breakdown →
Alerts → Order Detail → Explain Chat → Back →
Setup Actuals → Back → First-Piece Quality
```

**Flow 3 Navigation:**
```
Login → Dashboard → KPI Overview (drilldown) → Dashboard →
Weekly Metrics (tabs) → Dashboard → Runs Audit →
Select Run → Draft Report → Back → Run Detail → Compare
```

---

## Key Interaction Patterns

### Drawers (Evidence, Filters)
- **Trigger:** Button click (e.g., "View Evidence")
- **Animation:** Slide from right (300ms ease-out)
- **Width:** 480px (full-width on mobile)
- **Header:** Colored (blue/purple/green based on context)
- **Close:** X button (top-right) + overlay click + back nav

### Modals (Add Event, Confirm Delete)
- **Trigger:** Button click
- **Animation:** Fade in + scale (200ms)
- **Backdrop:** Black 50% opacity
- **Position:** Center screen
- **Max-width:** 500px (full-width on mobile)
- **Buttons:** Bottom, right-aligned

### Tabs (Week, KPIs, Run Detail)
- **Desktop:** Horizontal inline tabs with border-bottom
- **Tablet:** Horizontal scroll (arrows on edges)
- **Active:** Blue underline + blue text
- **Hover:** Gray background
- **Tap:** Entire tab area clickable (60px height)

### Filters (Runs, Events, Metrics)
- **Position:** Below header, sticky on scroll
- **Layout:** Horizontal flex, wrap on narrow
- **Dropdowns:** Custom styled, 44px height
- **Clear:** "Clear Filters" button appears when active

---

**All flows are fully clickable and production-ready!** 🎯
