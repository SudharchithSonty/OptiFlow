# PLN-05 & PLN-06: Schedule View & Compare Runs Guide

## Overview

Two essential production planning screens:

1. **PLN-05: Schedule View** - Detailed production schedule table with filters and highlights
2. **PLN-06: Compare Runs** - Parent vs Child run comparison with KPI deltas and change tracking

---

## PLN-05: Schedule View Page

**Route:** `/app/runs/:runId/schedule`

### Features

#### Header Section
- **Back to Run** navigation
- **Production Schedule** title
- **Run ID** display (font-mono, blue)
- **Summary Statistics Panel:**
  - Total Operations count
  - Late operations (red)
  - At Risk operations (orange)
  - Downtime occurrences (purple)

### Filters Bar

**Four Filter Controls:**

**1. Machine Filter (Dropdown)**
- Options: "All Machines" + individual machines
- Shows all 5 machines: M01-M05
- Bottleneck machine (M03) marked with ⚠️ emoji
- Real-time filtering

**2. Order Filter (Text Input)**
- Search by Order ID or Order Name
- Placeholder: "Search..."
- Case-insensitive matching
- Real-time filtering

**3. Show Setup Toggle**
- Eye/EyeOff icon
- Blue when active, gray when inactive
- Controls visibility of setup time info
- Shows "+15m setup" text in duration column

**4. Show Downtime Toggle**
- Eye/EyeOff icon
- Purple when active, gray when inactive
- Controls visibility of downtime blocks
- Shows downtime events in details

**Export Button:**
- Download icon
- Gray background
- Text: "Export" (hidden on mobile)

### Desktop Table View

**7 Columns:**

1. **Machine**
   - Font-mono Machine ID (M01-M05)
   - "Bottleneck" badge for M03 (orange)

2. **Order**
   - Order ID (font-mono)
   - Order Name (smaller, gray)

3. **Product**
   - Product ID (font-mono)

4. **Time Window**
   - Format: "08:00 - 10:30"

5. **Duration**
   - Formatted: "2h 30m" or "45m"
   - Setup time in blue: "(+15m setup)"

6. **Status**
   - Status chip with icon
   - On Time (green), At Risk (orange), Late (red)

7. **Details**
   - Downtime icon if applicable
   - Wrench icon + "Downtime" text (purple)

**Row Highlighting:**

**Late Orders:**
- Background: bg-red-50
- Makes entire row stand out
- High-priority visual indicator

**Bottleneck Machine (M03):**
- Left border: 4px orange (border-l-4 border-l-orange-500)
- Clear visual indicator
- All M03 operations marked

**Hover Effect:**
- Background changes to gray-50
- Smooth transition

### Tablet/Mobile Card View

**Expandable Card Design:**

**Card Header (Always Visible):**
- Order ID + Status chip
- Order Name
- Expand/collapse button (chevron)
- Machine ID + "Bottleneck" badge
- Time window
- Late orders: red border
- Bottleneck ops: orange left border

**Expanded Details:**
- Product ID
- Duration
- Setup Time (if enabled)
- **Downtime Block** (purple panel):
  - Wrench icon
  - Start/End times
  - Duration in minutes
  - Reason/description

**Downtime Block Example:**
```
[🔧] Downtime Event
Start: 11:30    End: 12:00
Duration: 30 minutes
Hydraulic pressure drop - maintenance required
```

### Legend Bar (Bottom)

**Three Visual Indicators:**
1. Red box - "Late Order"
2. Orange left border - "Bottleneck Machine (M03)"
3. Wrench icon - "Downtime Event"

Small, helpful reference for users

### Mock Data

**8 Operations Across 5 Machines:**

**M01 (CNC Mill 1):**
- OP001: Widget A Production (On Time)
- OP003: Bracket Assembly (On Time)

**M02 (Lathe 2):**
- OP004: Shaft Machining (At Risk)

**M03 (Press 3) - BOTTLENECK:**
- OP002: Widget A Production (Late) - **HAS DOWNTIME**
- OP006: Gear Pressing (Late)
- OP008: Shaft Machining (At Risk)

**M04 (Grinder 4):**
- OP007: Cover Grinding (On Time)

**M05 (Drill 5):**
- OP005: Housing Drill (On Time)

**Downtime Event:**
- Operation: OP002
- Machine: M03
- Start: 11:30
- End: 12:00
- Duration: 30 minutes
- Reason: "Hydraulic pressure drop - maintenance required"

---

## PLN-06: Compare Runs Page

**Route:** `/app/runs/compare` (with query params `?a=parentId&b=childId`)

### Features

#### Header Section
- **Back to Runs** navigation
- **GitBranch icon** + "Compare Runs" title
- Description text
- **Quick Action Buttons:**
  - "Ask Agent Why" (purple)
  - "View Impact Report" (blue)

### Run Selectors

**Two Dropdowns Side-by-Side:**

**Parent Run (Baseline):**
- Label: "Parent Run (Baseline)"
- Dropdown with all runs
- Format: "RUN-ID - Date Shift X (vN) - status"
- Subtext: Date • Shift • Version

**Child Run (Comparison):**
- Label: "Child Run (Comparison)"
- Same format as parent
- Subtext: Date • Shift • Version

**Example:**
```
Parent: RUN-2401 - 2026-01-01 Shift A (v1) - completed
Child:  RUN-2412 - 2026-01-01 Shift A (v2) - completed
```

### Comparison Summary

**Three Stats Cards:**
1. **Total Changes** - Gray background
2. **Improvements** - Green background (positive changes)
3. **Degradations** - Red background (negative changes)

Large numbers (32px), centered, descriptive labels

### KPI Delta Cards

**Four KPI Comparison Cards:**

**Card Structure:**
- Icon in colored circle (top-left)
- Delta indicator with trend icon (top-right)
- KPI label
- Parent → Child flow display

**Four KPIs:**

**1. On-Time Delivery**
```
Icon: CheckCircle2 (green)
Parent: 91.9%
Child:  94.2%
Delta:  +2.3% (improvement)
Trend:  TrendingUp (green)
```

**2. Setup Time**
```
Icon: Clock (green - improvement)
Parent: 139 min
Child:  127 min
Delta:  -8.6% (improvement - less is better)
Trend:  TrendingUp (green)
```

**3. First-Piece Rejects**
```
Icon: XCircle (red)
Parent: 1.6%
Child:  2.4%
Delta:  +50.0% (worse)
Trend:  TrendingDown (red)
```

**4. OEE-Lite**
```
Icon: TrendingUp (green)
Parent: 75.2%
Child:  78.3%
Delta:  +4.1% (improvement)
Trend:  TrendingUp (green)
```

**Parent → Child Flow:**
```
Parent: 91.9%
    ↓
Child:  94.2% (green text if improved)
```

### Changed Orders & Operations List

**Three Change Types:**

**1. Machine Change (Blue)**
- Icon: Settings
- Shows: Parent machine → Child machine
- Example: "M02 (Lathe 2)" → "M03 (Press 3)"

**2. Timing Shift (Purple)**
- Icon: Clock
- Shows: Parent time → Child time
- Example: "08:00 - 09:30" → "10:45 - 12:00"

**3. Lateness Change (Orange)**
- Icon: TrendingUp
- Shows: Parent status → Child status
- Example: "On Time" → "At Risk"

**Change Card Layout:**

**Impact Indicator (Left):**
- Circle with icon
- Positive: Green TrendingUp
- Negative: Red TrendingDown
- Neutral: Gray ArrowRight

**Content:**
- Order ID + Change Type badge
- Order Name
- Parent → Child comparison panel (gray background)
- Details text explaining the change

**Impact-Based Borders:**
- Positive: Green border
- Negative: Red border
- Neutral: Gray border

**8 Sample Changes:**
1. Widget A (Machine Change) - Negative: Moved to bottleneck M03
2. Bracket Assembly (Timing) - Neutral: Shifted 2h 45m
3. Shaft Machining (Lateness) - Negative: Status degraded to At Risk
4. Housing Drill (Machine) - Positive: Moved away from bottleneck
5. Gear Pressing (Timing) - Positive: Reduced setup time
6. Cover Grinding (Lateness) - Positive: Improved to On Time
7. Flange Milling (Machine) - Positive: Moved to faster machine
8. Pin Threading (Timing) - Neutral: Minor +15m adjustment

### AI Insights Section

**Purple/Blue Gradient Panel:**
- Cpu icon
- Title: "Need AI Insights?"
- Descriptive text about agent capabilities
- **Two CTA Buttons:**
  1. "Ask Agent Why Changes Were Made" (purple, primary)
  2. "View Draft Impact Report" (white with purple border)

**Actions:**
- Ask Agent → Navigate to agent page with pre-filled question
- View Report → Navigate to impact report page

---

## User Workflows

### Workflow 1: Review Schedule (Desktop)

```
1. Navigate to /app/runs/:runId
2. Click "Schedule" button (if status = generated)
3. See full schedule table
4. Review summary stats (8 total, 2 late, 2 at-risk, 1 downtime)
5. Notice M03 rows have orange left border
6. Notice late rows have red background
7. Filter by machine: M03
8. See only bottleneck operations
9. Toggle "Show Downtime" to see event details
10. Export schedule
```

### Workflow 2: Review Schedule (Mobile)

```
1. Navigate to schedule page
2. See card view
3. Scroll through operations
4. See OP002 expanded by default (has downtime)
5. Review downtime event details:
   - Purple panel
   - 11:30-12:00 (30 min)
   - Reason shown
6. Tap chevron on OP006 to expand
7. See late order details
8. Notice orange left border (M03)
9. Filter by "late" orders
10. Toggle "Show Setup" on/off
```

### Workflow 3: Compare Two Runs

```
1. From run detail → Click "View Comparison" in widget
   OR navigate to /app/runs/compare?a=RUN-2401&b=RUN-2412
2. See comparison summary (8 changes, 4 improvements, 3 degradations)
3. Review KPI deltas:
   - OTD improved +2.3%
   - Setup reduced -8.6%
   - Rejects increased +50%
   - OEE improved +4.1%
4. Scroll to changes list
5. See machine changes (positive/negative)
6. See timing shifts (neutral)
7. See lateness changes (positive/negative)
8. Click "Ask Agent Why"
9. Navigate to agent with question pre-filled
```

### Workflow 4: Analyze Bottleneck Impact

```
1. Open schedule page
2. Filter by Machine: M03
3. See 3 operations on bottleneck
4. Notice 2 are late, 1 at-risk
5. Notice 1 has downtime event
6. Toggle to compare view
7. Select parent/child runs
8. Find M03-related changes
9. See "moved to bottleneck" changes (negative)
10. See "moved away from bottleneck" changes (positive)
11. Click "View Impact Report"
12. Review AI analysis
```

### Workflow 5: Investigate Downtime

```
1. Open schedule with downtime
2. Notice purple "1" in downtime stat
3. Look for wrench icons in details column
4. Find OP002 on M03
5. Click expand (mobile) or see details (desktop)
6. Review downtime panel:
   - Start/End times
   - 30 minute duration
   - Hydraulic issue description
7. Note impact on late status
8. Check if other operations affected
9. Toggle "Show Downtime" off to hide
```

---

## Responsive Design

### Desktop (1440×900)
- **Schedule:** Full table (7 columns)
- **Compare:** 2-column selectors, 4-column KPI grid
- Wide content area
- All text visible

### Tablet (1024×768)
- **Schedule:** Card view with expandable rows
- **Compare:** Stacked selectors, 2-column KPI grid
- Horizontal scrolling for filters
- Touch-friendly (48px targets)

### Mobile (< 640px)
- **Schedule:** Single column cards
- **Compare:** Single column layout
- Stacked everything
- Hide button text (icons only)
- Full-width panels

---

## Testing Checklist

### Schedule View Page

**Header & Stats:**
- [ ] Back button navigates to run
- [ ] Run ID displays correctly
- [ ] Summary stats accurate (8, 2, 2, 1)
- [ ] Stats update when filtering

**Filters:**
- [ ] Machine dropdown works
- [ ] Order search filters real-time
- [ ] Show Setup toggle works
- [ ] Show Downtime toggle works
- [ ] Export button present
- [ ] Filters combine correctly

**Desktop Table:**
- [ ] 7 columns render
- [ ] All 8 operations shown
- [ ] Late rows have red background
- [ ] M03 rows have orange left border
- [ ] Status chips color-coded
- [ ] Setup time shows when enabled
- [ ] Downtime icon shows when enabled
- [ ] Hover effect works

**Mobile Cards:**
- [ ] All cards render
- [ ] Expand/collapse works
- [ ] OP002 expanded by default
- [ ] Downtime panel shows (purple)
- [ ] Status chips visible
- [ ] Bottleneck badge shows
- [ ] Late orders red border

**Legend:**
- [ ] Three indicators shown
- [ ] Icons match usage
- [ ] Text clear

### Compare Runs Page

**Header:**
- [ ] GitBranch icon displays
- [ ] Quick actions present
- [ ] Ask Agent button works
- [ ] View Report button works

**Selectors:**
- [ ] Both dropdowns work
- [ ] Pre-filled from URL params
- [ ] Subtext displays correctly
- [ ] Changes reflect immediately

**Summary:**
- [ ] Three stat cards
- [ ] Numbers correct (8, 4, 3)
- [ ] Color-coded properly

**KPI Deltas:**
- [ ] 4 cards render
- [ ] Icons appropriate
- [ ] Delta calculations correct
- [ ] Trend icons correct
- [ ] Parent → Child flow clear
- [ ] Colors match improvement/degradation
- [ ] Responsive grid (4→2→1)

**Changes List:**
- [ ] 8 changes shown
- [ ] Three change types
- [ ] Impact indicators correct
- [ ] Parent → Child comparison clear
- [ ] Details text helpful
- [ ] Border colors match impact

**AI Insights:**
- [ ] Gradient background
- [ ] Cpu icon displays
- [ ] Two buttons work
- [ ] Navigation correct

---

## Design Tokens

### Schedule View Colors

**Status:**
```css
On Time:  bg-green-100, text-green-700
At Risk:  bg-orange-100, text-orange-700
Late:     bg-red-100, text-red-700
```

**Highlights:**
```css
Late Row:      bg-red-50
Bottleneck:    border-l-orange-500
Downtime Icon: text-purple-600
Downtime Panel: bg-purple-50, border-purple-200
```

**Filters:**
```css
Setup Active:    bg-blue-100, text-blue-700
Downtime Active: bg-purple-100, text-purple-700
Inactive:        bg-gray-100, text-gray-600
```

### Compare Runs Colors

**Impact:**
```css
Positive:  bg-green-50, border-green-200, text-green-600
Negative:  bg-red-50, border-red-200, text-red-600
Neutral:   bg-gray-50, border-gray-200, text-gray-600
```

**Change Types:**
```css
Machine:   bg-blue-100, text-blue-600
Timing:    bg-purple-100, text-purple-600
Lateness:  bg-orange-100, text-orange-600
```

**KPI Deltas:**
```css
Improvement:   bg-green-100, text-green-600
Degradation:   bg-red-100, text-red-600
```

### Spacing

```css
Table padding:     16px (cells), 12px (header)
Card padding:      16px (header), 16px (details)
Filter gap:        12px
Stat gap:          16px
Legend gap:        16px
Change card gap:   12px
```

### Typography

```css
Table header:   text-xs, uppercase, tracking-wider
Cell text:      text-sm
Order ID:       font-mono, text-sm
Status:         text-xs
Delta:          text-sm
```

---

## Accessibility

**ARIA Labels:**
- Filter controls
- Expand/collapse buttons
- Status indicators
- Impact indicators

**Keyboard Navigation:**
- Tab through all controls
- Enter to toggle/select
- Space to expand cards
- Escape to close expanded

**Screen Reader:**
- Status announced
- Delta values spoken
- Change types described
- Impact communicated

**Visual:**
- High contrast
- Color + icon for status
- Clear focus states
- 48px touch targets

---

## API Integration Points

**Schedule Data:**
```typescript
GET /api/runs/:runId/schedule
Response: { operations: ScheduleOperation[] }
```

**Compare Runs:**
```typescript
GET /api/runs/compare?parent=:parentId&child=:childId
Response: { 
  kpiDeltas: KPIDelta[], 
  changes: ChangeItem[],
  summary: { total, positive, negative }
}
```

**Export Schedule:**
```typescript
GET /api/runs/:runId/schedule/export?format=csv
Response: CSV file download
```

---

## Future Enhancements

**Schedule View:**
- [ ] Gantt chart visualization
- [ ] Drag-and-drop rescheduling
- [ ] Real-time updates
- [ ] Multiple shift view
- [ ] Capacity heatmap
- [ ] Critical path highlighting

**Compare View:**
- [ ] Side-by-side schedule comparison
- [ ] Diff highlighting
- [ ] Multi-run comparison (>2)
- [ ] Historical trend analysis
- [ ] Export comparison report
- [ ] Share comparison link

---

**Complete schedule management and run comparison with bottleneck tracking, downtime visualization, and KPI analysis!** 📊
