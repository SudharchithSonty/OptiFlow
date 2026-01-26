# SUP-01, SUP-02, SUP-03, SUP-04: Supervisor Screens Guide

## Overview

Tablet-first shopfloor screens for supervisors to consume today's plan, acknowledge tasks, and respond to alerts:

1. **SUP-01: Today Dashboard** - Overview of machines, setups, late orders, alerts with quick actions
2. **SUP-02: Alerts List** - Filtered list of production alerts with acknowledgement
3. **SUP-03: Order Detail** - Operations timeline, status, actions including AI "Why late?"
4. **SUP-04: Machine Detail** - Timeline visualization, queue, breakdown logging

---

## SUP-01: Today Dashboard

**Route:** `/app` (when logged in as Supervisor)

### Features

#### Header Section
- **Title:** "Today's Production"
- **Shift Info:** Shift A • Date • Current Time (blue)
- **Quick Stats Panel:**
  - Running machines (green)
  - Down machines (red)
  - Late orders (orange)

### Quick Actions Section

**Three Large Touch-Friendly Buttons:**

**1. Log Breakdown** (Red)
- AlertTriangle icon
- Primary action: "Log Breakdown"
- Subtitle: "Report machine issue"
- Opens logging modal

**2. Log Setup Actuals** (Blue)
- Wrench icon
- Primary action: "Log Setup Actuals"
- Subtitle: "Record setup time"
- Opens setup form

**3. Log First-Piece Check** (Green)
- ClipboardCheck icon
- Primary action: "Log First-Piece Check"
- Subtitle: "Quality verification"
- Opens quality form

### Two-Column Layout (Desktop) / Stacked (Tablet)

#### Left Column

**My Machines (3 assigned)**

Each machine card shows:
- Machine icon (Settings)
- Machine name + ID (font-mono)
- Status chip with icon:
  - Running (green, CheckCircle2)
  - Idle (gray, Clock)
  - Setup (blue, Wrench)
  - Down (red, XCircle)
- Current operation (if running/setup)
- Next setup info:
  - Setup description
  - Scheduled time (blue)
- Clickable → navigates to machine detail
- ChevronRight icon (right side)

**Sample Machines:**
1. **M01 (CNC Mill 1)** - Running, current op: ORD-1234 Op 2, next setup: Bracket tooling at 14:30
2. **M03 (Press 3)** - Down (no current op)
3. **M05 (Drill 5)** - Setup, current op: Changing bits

**Upcoming Setups (2 today)**

Each setup card shows:
- Wrench icon (blue circle)
- Machine name + ID
- From product → To product (with arrow)
- Scheduled time (top-right, blue)
- Estimated duration (below time)

**Sample Setups:**
1. M01: Widget A → Bracket B at 14:30 (15 min)
2. M04: Cover C → Shaft D at 15:00 (20 min)

#### Right Column

**Late Orders (2 items)**

Each late order card shows:
- Order ID (font-mono) + "Late" badge (red)
- Order name
- Due time
- Delayed by (minutes, red)
- Current status
- Clickable → navigates to order detail
- ChevronRight icon

**Sample Late Orders:**
1. ORD-1234: Due 16:00, delayed 45 min, In Progress
2. ORD-1238: Due 17:00, delayed 120 min, Not Started

**Top Alerts (3 shown, "View All" link)**

Each alert card shows:
- Bell icon (colored by severity)
- Alert title
- Time
- Background color:
  - High: Red-50
  - Medium: Orange-50
  - Low: Yellow-50
- Clickable → navigates to alerts list
- ChevronRight icon

**Sample Alerts:**
1. High: M03 Hydraulic failure at 11:30
2. High: ORD-1234 at risk of missing 16:00 deadline at 13:00
3. Medium: M01 requires 3rd setup today at 13:45

---

## SUP-02: Alerts List Page

**Route:** `/app/alerts`

### Features

#### Header Section
- **Back to Dashboard** navigation
- **Title:** "Production Alerts"
- **Description:** "Real-time notifications for your shift"
- **Summary Stats Panel:**
  - Total alerts
  - New (unacknowledged, orange)
  - High severity (red)

### Filters Bar

**Three Filter Controls:**

**1. Alert Type Dropdown**
- Options: All Types + 4 types
- Machine Downtime (red, AlertTriangle)
- At-Risk Order (orange, TrendingDown)
- Changeover Alert (purple, RotateCcw)
- Predicted Late (red, Clock)

**2. Severity Dropdown**
- Options: All Severities + 3 levels
- High, Medium, Low

**3. Show Acknowledged Checkbox**
- Unchecked by default
- Shows only new alerts when unchecked

### Desktop Table View

**7 Columns:**
1. **Status** - Ack'd (gray) or New (orange)
2. **Type** - Badge with icon
3. **Severity** - Badge (High/Medium/Low)
4. **Alert** - Title + description
5. **Related** - Machine ID or Order ID (font-mono)
6. **Time** - When alert was created
7. **Action** - "View" link

**Row Highlighting:**
- Unacknowledged alerts: Blue-50 background
- Hover effect: Gray-50

### Tablet/Mobile Card View

**Alert Cards:**

**Card Layout:**
- Type badge + Severity badge (top)
- "New" badge if unacknowledged (orange, top-right)
- Alert title (bold)
- Description text
- Bottom row: Related ID + Time + ChevronRight
- Background color based on severity + acknowledgement

**Interaction:**
- Tap card → Navigate to related machine/order

### Alert Types

**4 Types with Mock Data:**

**1. Machine Downtime** (Red)
- Example: M03 Hydraulic System Failure
- Severity: High
- Links to machine detail

**2. At-Risk Order** (Orange)
- Example: ORD-1236 Approaching Risk Threshold
- Severity: Medium
- Links to order detail

**3. Changeover Alert** (Purple)
- Example: M01 Repeated Changeover Switching
- Severity: Medium
- Links to machine detail

**4. Predicted Late** (Red)
- Example: ORD-1238 Confirmed Late
- Severity: High
- Links to order detail

### Empty State

- Bell icon (gray)
- Message: "No alerts found" or "All alerts acknowledged"
- Adjusts based on filter state

---

## SUP-03: Order Detail Page

**Route:** `/app/orders/:orderId`

### Features

#### Header Section
- **Back to Dashboard** navigation
- **Order name** title
- **"Acknowledged" badge** if ack'd (green, CheckCircle2)
- **Order metadata:**
  - Order ID (font-mono, blue)
  - Product ID (font-mono)
  - Quantity (units)
- **Status Panel (right side):**
  - Status chip with icon (On Time/At Risk/Late)
  - Priority badge (Normal/High/Critical)

#### Progress Bar
- Shows completion percentage (0-100%)
- Blue filled bar
- Percentage text on right

### Key Info Card

**Three Info Blocks:**
1. **Due Time** - Clock icon + large time
2. **Current Operation** - Settings icon + Op number
3. **Machine Assignment** - Settings icon + Machine ID (font-mono)

### Action Buttons Section

**Four Equal-Width Buttons (Grid):**

**1. Acknowledge** (Green)
- CheckCircle2 icon
- Disabled after acknowledged (gray)
- Opens confirmation modal
- Changes text to "Acknowledged"

**2. Start Setup** (Blue)
- PlayCircle icon
- Opens setup initiation form
- Always enabled

**3. Log First-Piece** (Purple)
- ClipboardCheck icon
- Opens first-piece check form
- Quality verification workflow

**4. Why Late?** (Orange)
- Cpu icon
- Opens AI agent interface
- Pre-filled question: "Why is order {orderId} running late?"
- Navigates to agent page with context

### Operations List

**Desktop Table (7 columns):**
1. **Op #** - Operation number
2. **Description** - Operation name
3. **Machine** - Machine ID + name
4. **Scheduled** - Start - End time
5. **Actual** - Actual times (or "-" if not started)
6. **Status** - Status chip

**Tablet/Mobile Cards:**
- Op number badge (left)
- Description + machine name
- Status chip (right)
- Scheduled vs Actual times grid
- In-progress ops highlighted (blue-50 bg)

**Operation Statuses:**
- **Completed:** Green, CheckCircle2
- **In Progress:** Blue, PlayCircle (row highlighted)
- **Pending:** Gray, Clock

**Sample Operations (4):**
1. Op 1: Initial Milling on M01 - Completed (08:05-10:35)
2. Op 2: Pressing on M03 - In Progress (started 11:15, ongoing)
3. Op 3: Grinding on M04 - Pending
4. Op 4: Final Inspection on M05 - Pending

### Additional Info (Conditional)

**Late Order Alert (if status = late):**
- Red-50 background panel
- AlertTriangle icon
- Warning text about missing deadline
- Link: "Ask AI agent why this order is late"

### Acknowledge Modal

**Modal Content:**
- CheckCircle2 icon (green circle)
- Title: "Acknowledge Order"
- Description: Confirm awareness of status
- **Two Buttons:**
  - Cancel (gray)
  - Acknowledge (green)

---

## SUP-04: Machine Detail Page

**Route:** `/app/machines/:machineId`

### Features

#### Header Section
- **Back to Dashboard** navigation
- **Machine name** title
- **"Bottleneck" badge** if applicable (orange)
- **Machine metadata:**
  - Machine ID (font-mono, blue)
  - Current order (if assigned)
- **Status Chip (large, right side):**
  - Running/Idle/Setup/Down with icon

### Log Breakdown Button

**Full-Width on Mobile, Auto-Width on Desktop:**
- Red background
- AlertTriangle icon
- Text: "Log Breakdown / Unavailability"
- Opens logging modal

### Timeline Section

**Title:** "Timeline (Today)"

**Timeline Visualization (5 blocks):**

Each block shows:
- Start time (left) and End time (right) above block
- Color-coded bar (height: 64px)
- Block type label + Order ID (if applicable)
- Description text
- Duration (right side of bar)
- Clickable if has Order ID

**Block Types & Colors:**
1. **Operation** - Green-500, border-green-600
2. **Setup** - Blue-500, border-blue-600
3. **Downtime** - Red-500, border-red-600
4. **Idle** - Gray-300, border-gray-400

**Sample Timeline (M03):**
1. 08:00-10:30: Operation - ORD-1235 Pressing (150 min)
2. 10:30-10:50: Setup - Changeover Bracket→Widget (20 min)
3. 10:50-11:30: Operation - ORD-1234 Pressing in progress (40 min)
4. 11:30-12:00: Downtime - Hydraulic failure (30 min)
5. 12:00-13:00: Idle - Waiting for maintenance (60 min)

**Legend (Below Timeline):**
- Four colored squares with labels
- Shows what each color represents

### Two-Column Layout (Desktop) / Stacked (Tablet)

#### Left Column: Operation Queue

**Queue Cards:**
- Order ID (font-mono) + Priority badge
- Order name
- Package icon (right)
- Scheduled start time
- Estimated duration
- Clickable → navigates to order detail

**Sample Queue (2 items):**
1. ORD-1238 (High): Gear Pressing at 13:00 (135 min)
2. ORD-1236 (Normal): Shaft Machining at 15:30 (90 min)

**Empty State:**
- Package icon (gray)
- "No operations queued"

#### Right Column: Next Setup Transition

**Setup Card (if scheduled):**
- Wrench icon (blue circle)
- Title: "Changeover Required"
- Scheduled time
- Duration badge (blue)
- From product name
- Arrow separator (→)
- To product name
- **Info Panel (blue-50):**
  - Reminder to prepare tooling

**Empty State:**
- Wrench icon (gray)
- "No setup transitions scheduled"

### Machine Status Alerts (Conditional)

**Down Alert (if status = down):**
- Red-50 background
- AlertTriangle icon
- Message about unavailability
- Current downtime description

**Bottleneck Alert (if isBottleneck = true):**
- Orange-50 background
- Settings icon
- Warning about bottleneck impact
- Prioritization message

### Log Breakdown Modal

**Modal Content:**
- AlertTriangle icon (red circle)
- Title: "Log Machine Breakdown"
- Description: Report unavailability for machine
- **Reason Field:**
  - Label: "Reason *"
  - Textarea (4 rows)
  - Placeholder: "Describe the issue..."
- **Two Buttons:**
  - Cancel (gray)
  - Log Breakdown (red, disabled until reason filled)

---

## User Workflows

### Workflow 1: Morning Shift Start

```
1. Login as Supervisor (Priya Patel)
2. See Today Dashboard (SUP-01)
3. Review quick stats: 1 running, 1 down, 2 late
4. Check "My Machines" section
5. See M03 is down (red status)
6. Click M03 → Navigate to machine detail
7. Review timeline - see hydraulic failure at 11:30
8. Check "Next Setup" - Gear changeover at 13:00
9. Note tooling requirement
10. Return to dashboard
```

### Workflow 2: Respond to Alert

```
1. From dashboard → Click "View All" on alerts
2. Navigate to Alerts List (SUP-02)
3. See 3 unacknowledged alerts
4. Filter by "High" severity
5. See M03 breakdown and ORD-1234 late
6. Click ORD-1234 late alert
7. Navigate to Order Detail (SUP-03)
8. See 65% complete, currently on Op 2 (M03)
9. Click "Why Late?" button
10. AI agent opens with pre-filled question
```

### Workflow 3: Acknowledge Order

```
1. Navigate to Order Detail for ORD-1234
2. Review operations list
3. See Op 2 in progress on M03
4. Note due time: 16:00, currently late
5. Click "Acknowledge" button
6. Modal opens: "Confirm awareness"
7. Click "Acknowledge" (green)
8. Modal closes
9. Green "Acknowledged" badge appears in header
10. Button disabled (gray)
```

### Workflow 4: Log Machine Breakdown

```
1. Navigate to Machine Detail for M05
2. See machine currently running
3. Notice drill bit issue developing
4. Click "Log Breakdown / Unavailability" (red)
5. Modal opens
6. Fill reason: "Drill bit wear detected - requires replacement"
7. Click "Log Breakdown" (red)
8. Modal closes
9. Breakdown logged to system
10. Alert generated for planner
```

### Workflow 5: Review Setup Schedule

```
1. From dashboard, see "Upcoming Setups" section
2. Two setups scheduled: M01 at 14:30, M04 at 15:00
3. Click M01 setup card (implied navigation)
4. Navigate to Machine Detail for M01
5. Review "Next Setup Transition" section
6. See: Widget A → Bracket B at 14:30 (15 min)
7. Note blue info panel: Ensure Bracket B tooling ready
8. Check current time vs scheduled time
9. Ensure tooling is prepared
10. Return to dashboard
```

### Workflow 6: Log First-Piece Check

```
1. From Order Detail page
2. See operation in progress
3. First piece produced
4. Click "Log First-Piece" button (purple)
5. Form opens (modal or page)
6. Record inspection results
7. Submit check
8. Quality data logged
9. Return to order detail
```

---

## Testing Checklist

### Today Dashboard (SUP-01)

**Header:**
- [ ] Title displays
- [ ] Shift info shows
- [ ] Current time updates
- [ ] Quick stats accurate

**Quick Actions:**
- [ ] 3 buttons visible
- [ ] Red: Log Breakdown
- [ ] Blue: Log Setup Actuals
- [ ] Green: Log First-Piece
- [ ] Touch-friendly (48px height)
- [ ] Click handlers work

**My Machines:**
- [ ] 3 machines shown
- [ ] Status chips color-coded
- [ ] Current op displays
- [ ] Next setup shows
- [ ] Clickable navigation
- [ ] Hover effects work

**Upcoming Setups:**
- [ ] 2 setups listed
- [ ] From→To clear
- [ ] Time + duration shown
- [ ] Machine names display

**Late Orders:**
- [ ] 2 orders shown
- [ ] Red "Late" badges
- [ ] Delay minutes red
- [ ] Due times visible
- [ ] Clickable navigation

**Top Alerts:**
- [ ] 3 alerts shown
- [ ] "View All" link works
- [ ] Severity colors correct
- [ ] Clickable navigation

### Alerts List (SUP-02)

**Header:**
- [ ] Back button navigates
- [ ] Summary stats accurate
- [ ] Total/New/High counts

**Filters:**
- [ ] Type dropdown works
- [ ] Severity dropdown works
- [ ] "Show Acknowledged" toggles
- [ ] Filters combine correctly

**Desktop Table:**
- [ ] 7 columns render
- [ ] Status badges show
- [ ] Type icons correct
- [ ] Descriptions visible
- [ ] Related IDs link
- [ ] View links work

**Mobile Cards:**
- [ ] All cards render
- [ ] "New" badge shows
- [ ] Colors match severity
- [ ] Clickable navigation
- [ ] ChevronRight shows

**Empty State:**
- [ ] Shows when filtered to 0
- [ ] Message appropriate

### Order Detail (SUP-03)

**Header:**
- [ ] Order name displays
- [ ] Metadata correct
- [ ] Status chip shows
- [ ] Priority badge displays
- [ ] Acknowledged badge (if ack'd)

**Progress Bar:**
- [ ] Percentage correct
- [ ] Bar fills properly
- [ ] Responsive width

**Key Info Card:**
- [ ] Due time displays
- [ ] Current op number
- [ ] Machine ID shows
- [ ] Icons appropriate

**Action Buttons:**
- [ ] 4 buttons visible
- [ ] Grid layout responsive
- [ ] Acknowledge works
- [ ] Disabled after ack
- [ ] Start Setup opens form
- [ ] Log First-Piece works
- [ ] Why Late navigates

**Operations List:**
- [ ] All ops display
- [ ] Desktop table (7 cols)
- [ ] Mobile cards work
- [ ] In-progress highlighted
- [ ] Status chips correct
- [ ] Actual times show

**Late Alert:**
- [ ] Shows if late
- [ ] Red background
- [ ] Link to AI works

**Acknowledge Modal:**
- [ ] Opens on click
- [ ] Description clear
- [ ] Cancel works
- [ ] Acknowledge works
- [ ] Badge updates

### Machine Detail (SUP-04)

**Header:**
- [ ] Machine name displays
- [ ] Bottleneck badge (if applicable)
- [ ] Machine ID shows
- [ ] Current order displays
- [ ] Status chip large + correct

**Log Breakdown Button:**
- [ ] Red, prominent
- [ ] Opens modal
- [ ] Full-width on mobile

**Timeline:**
- [ ] 5 blocks render
- [ ] Colors correct per type
- [ ] Times show above
- [ ] Durations show
- [ ] Descriptions clear
- [ ] Clickable if has order
- [ ] Legend shows

**Operation Queue:**
- [ ] Cards render
- [ ] Priority badges
- [ ] Times + durations
- [ ] Clickable navigation
- [ ] Empty state works

**Next Setup:**
- [ ] Card shows if scheduled
- [ ] From→To clear
- [ ] Duration badge
- [ ] Info panel shows
- [ ] Empty state works

**Status Alerts:**
- [ ] Down alert (if down)
- [ ] Bottleneck alert (if applicable)
- [ ] Colors correct
- [ ] Messages helpful

**Log Breakdown Modal:**
- [ ] Opens on click
- [ ] Reason field works
- [ ] Submit disabled until filled
- [ ] Cancel works
- [ ] Logs successfully

---

## Design Tokens

### Colors

**Status:**
```css
Running:  bg-green-100, text-green-700
Idle:     bg-gray-100, text-gray-700
Setup:    bg-blue-100, text-blue-700
Down:     bg-red-100, text-red-700
```

**Order Status:**
```css
On Time:  bg-green-100, text-green-700
At Risk:  bg-orange-100, text-orange-700
Late:     bg-red-100, text-red-700
```

**Priority:**
```css
Normal:   bg-gray-100, text-gray-700
High:     bg-orange-100, text-orange-700
Critical: bg-red-100, text-red-700
```

**Quick Actions:**
```css
Breakdown:    bg-red-600 (button)
Setup:        bg-blue-600
First-Piece:  bg-green-600
```

**Alert Severity:**
```css
High:    bg-red-50, border-red-200
Medium:  bg-orange-50, border-orange-200
Low:     bg-yellow-50, border-yellow-200
```

**Timeline Blocks:**
```css
Operation:  bg-green-500, border-green-600
Setup:      bg-blue-500, border-blue-600
Downtime:   bg-red-500, border-red-600
Idle:       bg-gray-300, border-gray-400
```

### Touch Targets

```css
Quick action buttons:  48px height (min)
Machine cards:         Touch-friendly padding
Alert cards:           Tap-optimized
Action buttons:        48px height
Modal buttons:         44px height (min)
```

### Typography

```css
Headers:       text-gray-900, default size
Machine IDs:   font-mono, text-blue-600
Order IDs:     font-mono, text-gray-900
Times:         text-blue-600 (scheduled), text-gray-900 (actual)
Status text:   text-sm
```

---

## API Integration Points

**Dashboard:**
```typescript
GET /api/supervisor/today
Response: { machines, setups, lateOrders, topAlerts }
```

**Alerts:**
```typescript
GET /api/alerts?type=&severity=&acknowledged=
Response: { alerts: Alert[] }
```

**Order Detail:**
```typescript
GET /api/orders/:orderId
POST /api/orders/:orderId/acknowledge
POST /api/orders/:orderId/setup/start
POST /api/orders/:orderId/first-piece
```

**Machine Detail:**
```typescript
GET /api/machines/:machineId
POST /api/machines/:machineId/breakdown
Response: { machine, timeline, queue, nextSetup }
```

---

**Complete shopfloor supervisor experience with tablet-first design and action-oriented workflows!** 👷‍♀️
