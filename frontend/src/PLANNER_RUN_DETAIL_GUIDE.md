# PLN-04: Run Detail Page - Complete Guide

## Overview

Comprehensive run detail page with 8 tabs and rich overview dashboard for production run management.

**Route:** `/app/runs/:runId`

---

## Header Section

### Run Title & Metadata

**Title Format:**
```
{Weekday, Month Day, Year} - Shift {A/B/C}
Example: Wed, Jan 1, 2026 - Shift A
```

**Status & Badges:**
- **Status Chip** - Color-coded (Draft, Pending, Generated, Scheduled, Running, Completed, Failed)
- **Trigger Badge** - Original (gray) or Reschedule (orange)
- **Version Badge** - Shows v1, v2, v3, etc. (gray chip)

**Run ID:**
- Font-mono, blue color
- Clickable for copy (planned)
- Example: `RUN-2401`

**Parent Run Link** (only if exists):
- GitBranch icon
- "Parent run: {parent-id}" text
- Clickable parent ID (navigates to parent)
- "View lineage" link with icon (navigates to lineage page)

**Notes:**
- Italic text, gray color
- Displays run creation notes if provided

### Action Buttons

**Three Primary Actions (right side):**

**1. Schedule** (Blue)
- Icon: Calendar
- Enabled when: `status === 'generated'`
- Disabled state: Gray background, cursor-not-allowed
- Action: Navigate to `/app/runs/:runId/schedule`

**2. Generate Brief** (Purple)
- Icon: FileText
- Enabled when: `status === 'completed'`
- Disabled state: Gray background, cursor-not-allowed
- Action: Navigate to `/app/runs/:runId/brief`
- Full text: "Generate shift-start brief"

**3. Create Reschedule** (Orange)
- Icon: RotateCcw
- Enabled when: `status === 'completed'`
- Disabled state: Gray background, cursor-not-allowed
- Action: Navigate to create page with parent run data
- Full text: "Create reschedule run"

**Responsive:**
- Desktop: Full text visible
- Mobile/Tablet: Icon only, text hidden

---

## Tab Navigation

### 8 Tabs Available:

1. **Overview** - Dashboard with KPIs and activity
2. **Inputs** - Data files and validation status
3. **Events** - Alerts and notifications
4. **Schedule** - Production schedule view
5. **KPIs** - Detailed performance metrics
6. **Agent** - AI agent interactions and briefs
7. **Artifacts** - Generated files and reports
8. **History** - Complete audit trail

**Desktop View:**
- Horizontal tab bar below header
- All tabs visible
- 2px blue bottom border on active tab
- Hover effects on inactive tabs

**Mobile/Tablet View:**
- Horizontal scroll
- Minimum width to prevent wrapping
- Touch-friendly targets (48px height)
- Same active indicator

**Tab Structure:**
- Icon + Label for each tab
- Blue color when active
- Gray when inactive
- Smooth transitions

---

## Overview Tab (Detailed Implementation)

### 1. Key Performance Indicators (KPIs)

**Grid Layout:**
- Desktop: 4 columns (1 per KPI)
- Tablet: 2 columns
- Mobile: 1 column

**Four KPI Cards:**

#### A. On-Time Delivery
```
Icon: CheckCircle2 (green)
Value: 94.2%
Change: +2.3% vs parent (green, trending up)
Color: Green theme
```

#### B. Setup Time
```
Icon: Clock (blue)
Value: 127 min
Change: -8.5% vs parent (green, trending up - less is better)
Color: Blue theme
```

#### C. First-Piece Rejects
```
Icon: XCircle (red)
Value: 2.4%
Change: +0.8% vs parent (red, trending down - less is better)
Color: Red theme
```

#### D. OEE-Lite
```
Icon: BarChart3 (purple)
Value: 78.3%
Change: +3.1% vs parent (green, trending up)
Color: Purple theme
```

**Card Design:**
- White background
- Gray border
- 24px padding
- Icon in colored circle (top-left)
- Change indicator (top-right) - only if parent exists
- Label (small, gray)
- Value (large, 32px, bold)
- Change label (tiny, gray) - "vs parent"

**Change Indicators:**
- Green with TrendingUp icon: Improvement
- Red with TrendingDown icon: Decline
- Logic accounts for "less is better" metrics (Setup Time, Rejects)

### 2. What Changed vs Parent Widget

**Only shown when:** `run.parentRunId` exists

**Design:**
- Orange theme (bg-orange-50, border-orange-200)
- GitBranch icon (orange-600)
- Header with comparison text
- "View Comparison" button (orange, top-right)
- Three metric cards in grid

**Header:**
```
What changed vs parent run?
Comparing RUN-2412 (v2) with RUN-2401 (v1)
```

**Three Change Metrics:**

1. **Schedule Changes**
   - Value: 12 operations
   - Label: resequenced
   - White card with orange border

2. **Material Updates**
   - Value: 4 items
   - Label: substituted
   - White card with orange border

3. **Machine Changes**
   - Value: 2 machines
   - Label: reassigned
   - White card with orange border

**CTA Button:**
- "View Comparison"
- Navigates to: `/app/runs/compare?a={parentId}&b={currentId}`
- Orange background

### 3. Draft Impact Report Widget

**Only shown when:** `run.hasDraftReport === true`

**Design:**
- Green theme (bg-green-50, border-green-200)
- FileText icon (green-600)
- Prominent call-to-action

**Content:**
```
Title: Draft Impact Report Available

Description:
AI-generated analysis of schedule changes and predicted 
impacts on production metrics. Review before finalizing 
the schedule.
```

**Two CTAs:**
1. **View Report** (Green, primary)
   - Icon: FileText
   - Action: Navigate to `/app/runs/:runId/impact-report`

2. **Dismiss** (White, secondary)
   - Border: green-300
   - Text: green-700
   - Action: Hide widget

### 4. Recent Activity Timeline

**Design:**
- White card with gray border
- Divided rows (gray dividers)
- Hover effect on each row

**Activity Item Structure:**
- Icon in gray circle (left)
- Action text (bold, gray-900)
- Timestamp (top-right, small, gray-500)
- Details text (gray-600)
- "by {user}" text (tiny, gray-500)

**Five Sample Activities:**

```
1. Marked run as completed
   All production tasks finished successfully
   by Mike Rodriguez
   2026-01-01 16:45

2. Generated shift-end report
   Summary created with OEE metrics
   by AI Agent
   2026-01-01 14:30

3. Acknowledged setup delay
   Machine #3 setup took 15 minutes longer
   by Priya Patel
   2026-01-01 10:15

4. Updated schedule
   Adjusted for material availability
   by Sarah Chen
   2026-01-01 08:30

5. Created run
   Initial setup for Shift A production
   by Mike Rodriguez
   2026-01-01 06:00
```

**Icons Used:**
- CheckCircle2 - Completion
- Cpu - AI actions
- AlertTriangle - Issues/delays
- Calendar - Schedule changes
- Play - Creation

---

## Other Tabs (Placeholder State)

**Current Implementation:**
- Centered empty state
- Tab icon in gray circle
- Tab name as heading
- Descriptive text

**Example:**
```
[Icon in gray circle]
Inputs Tab
This section will display inputs information for the run.
```

**Future Implementation Planned:**
- Inputs: File list with validation status
- Events: Alert feed with filters
- Schedule: Gantt chart or timeline
- KPIs: Detailed metrics dashboard
- Agent: AI chat interface and briefs
- Artifacts: Downloadable files list
- History: Complete audit log

---

## Demo Data

### Two Run Variants

**1. RUN-2401 (Original)**
```typescript
{
  id: 'RUN-2401',
  date: '2026-01-01',
  shift: 'A',
  status: 'completed',
  trigger: 'original',
  parentRunId: undefined,
  version: 1,
  notes: 'Regular production run for Shift A',
  hasSchedule: true,
  hasDraftReport: false,
}
```

**2. RUN-2412 (Reschedule)**
```typescript
{
  id: 'RUN-2412',
  date: '2026-01-01',
  shift: 'A',
  status: 'completed',
  trigger: 'reschedule',
  parentRunId: 'RUN-2401',
  version: 2,
  notes: 'Rescheduled from RUN-2401 - Material shortage',
  hasSchedule: true,
  hasDraftReport: true,
}
```

**Testing:**
- Navigate to `/app/runs/RUN-2401` - Shows original (no parent widgets)
- Navigate to `/app/runs/RUN-2412` - Shows reschedule (with parent comparison and draft report)

---

## Status States

### Status Colors & Labels

```typescript
draft:     Gray   - "Draft"
pending:   Blue   - "Pending"
generated: Purple - "Generated"
scheduled: Indigo - "Scheduled"
running:   Green  - "Running"
completed: Gray   - "Completed"
failed:    Red    - "Failed"
```

### Button Enable Logic

**Schedule Button:**
```typescript
enabled: status === 'generated'
purpose: Finalize and publish the schedule
```

**Generate Brief Button:**
```typescript
enabled: status === 'completed'
purpose: Create shift-start summary for supervisors
```

**Create Reschedule Button:**
```typescript
enabled: status === 'completed'
purpose: Create new run based on this one
```

---

## Responsive Design

### Desktop (1440×900)
- Full header with all text
- 4-column KPI grid
- 3-column change metrics
- Wide content area (max-width: 1280px)
- Sidebar navigation
- Horizontal tab bar

### Tablet (1024×768)
- Condensed header
- Icon-only buttons (text hidden)
- 2-column KPI grid
- 2-column change metrics
- Horizontal scrolling tabs
- Bottom navigation bar

### Mobile (< 640px)
- Stacked layout
- 1-column KPI grid
- Stacked change metrics
- Horizontal scrolling tabs
- Reduced padding
- Bottom navigation bar

---

## Navigation Flows

### From Runs List
```
/app/runs → Click run ID → /app/runs/:runId
```

### From Overview to Other Sections
```
/app/runs/:runId (overview)
  ├─→ Click "Schedule" button → /app/runs/:runId/schedule
  ├─→ Click "Generate Brief" → /app/runs/:runId/brief
  ├─→ Click "Reschedule" → /app/runs/create (with state)
  ├─→ Click parent run ID → /app/runs/{parentId}
  ├─→ Click "View lineage" → /app/runs/:runId/lineage
  ├─→ Click "View Comparison" → /app/runs/compare?a=X&b=Y
  └─→ Click "View Report" → /app/runs/:runId/impact-report
```

### Between Tabs
```
/app/runs/:runId → Click any tab → Same URL (tab state in component)
```

---

## User Workflows

### Workflow 1: Review Completed Run
```
1. Navigate to /app/runs/:runId
2. See completed status
3. Review KPIs on overview tab
4. Check recent activity
5. Generate shift-start brief for next shift
```

### Workflow 2: Compare with Parent Run
```
1. Open reschedule run (e.g., RUN-2412)
2. See orange "What changed vs parent?" widget
3. Review quick metrics (12 operations, 4 items, 2 machines)
4. Click "View Comparison"
5. See detailed diff view
```

### Workflow 3: Review Draft Impact Report
```
1. Open reschedule run with draft report
2. See green "Draft Impact Report Available" widget
3. Read description
4. Click "View Report"
5. Review AI-generated analysis
6. Decide to proceed or modify
```

### Workflow 4: Create Reschedule from Completed Run
```
1. Open completed run
2. See "Create Reschedule" button enabled (orange)
3. Click button
4. Navigate to create page (pre-filled)
5. Modify as needed
6. Create new run
```

### Workflow 5: Schedule Generated Run
```
1. Open run with "generated" status
2. See "Schedule" button enabled (blue)
3. Review data inputs (switch to Inputs tab)
4. Review generated schedule (switch to Schedule tab)
5. Click "Schedule" to finalize
6. Navigate to schedule page
```

---

## Testing Checklist

### Header
- [ ] Run title formats correctly
- [ ] Status chip shows right color
- [ ] Trigger badge (original/reschedule)
- [ ] Version badge displays
- [ ] Run ID shows in mono font
- [ ] Parent run link (only if exists)
- [ ] View lineage link works
- [ ] Notes display in italic
- [ ] Back button navigates to list

### Action Buttons
- [ ] Schedule enabled only when generated
- [ ] Generate Brief enabled when completed
- [ ] Reschedule enabled when completed
- [ ] Disabled state shows gray
- [ ] Button text hides on mobile
- [ ] Icons always visible
- [ ] Navigation works correctly

### Tabs
- [ ] All 8 tabs render
- [ ] Active tab highlighted
- [ ] Tab switching works
- [ ] Desktop horizontal layout
- [ ] Mobile horizontal scroll
- [ ] Icons display correctly

### KPI Cards
- [ ] 4 cards render
- [ ] Icons color-coded
- [ ] Values display correctly
- [ ] Change indicators show (if parent)
- [ ] Trending up/down logic correct
- [ ] Responsive grid (4→2→1 columns)

### What Changed Widget
- [ ] Only shows if parent exists
- [ ] Orange theme consistent
- [ ] Comparison text correct
- [ ] 3 metric cards display
- [ ] View Comparison button works

### Draft Report Widget
- [ ] Only shows if hasDraftReport
- [ ] Green theme consistent
- [ ] Description clear
- [ ] View Report button works
- [ ] Dismiss button functions

### Activity Timeline
- [ ] All activities listed
- [ ] Icons appropriate
- [ ] Timestamps formatted
- [ ] User names display
- [ ] Hover effect works
- [ ] Dividers between items

### Responsive
- [ ] Desktop layout (4 cols)
- [ ] Tablet layout (2 cols)
- [ ] Mobile layout (1 col)
- [ ] Tab scrolling on mobile
- [ ] Button text hiding
- [ ] Appropriate padding

---

## Design Tokens

### Colors

**Status Badges:**
```css
Draft:     bg-gray-100, text-gray-700
Pending:   bg-blue-100, text-blue-700
Generated: bg-purple-100, text-purple-700
Scheduled: bg-indigo-100, text-indigo-700
Running:   bg-green-100, text-green-700
Completed: bg-gray-200, text-gray-700
Failed:    bg-red-100, text-red-700
```

**Trigger Badges:**
```css
Original:   bg-gray-100, text-gray-700
Reschedule: bg-orange-100, text-orange-700
```

**Action Buttons:**
```css
Schedule:   bg-blue-600 (enabled), bg-gray-200 (disabled)
Brief:      bg-purple-600 (enabled), bg-gray-200 (disabled)
Reschedule: bg-orange-600 (enabled), bg-gray-200 (disabled)
```

**Widgets:**
```css
Parent:     bg-orange-50, border-orange-200
Draft:      bg-green-50, border-green-200
```

### Spacing

```css
Header padding:    16px (mobile), 24px (desktop)
Card padding:      24px
KPI grid gap:      16px
Widget gap:        24px
Section spacing:   32px
Tab height:        48px
Button height:     40px
Icon size:         20px (small), 24px (medium)
```

### Typography

```css
Page Title:     text-2xl (24px)
Section Title:  text-xl (20px)
Card Label:     text-sm (14px), text-gray-600
KPI Value:      text-2xl (24px), text-gray-900
Change Value:   text-sm (14px)
Activity Text:  text-sm (14px)
Notes:          text-sm (14px), italic
```

---

## Accessibility

**ARIA Labels:**
- Tabs have role="tab"
- Tab panel has role="tabpanel"
- Buttons have descriptive labels
- Status communicated via text + color

**Keyboard Navigation:**
- Tab through all interactive elements
- Arrow keys to switch tabs
- Enter/Space to activate buttons
- Escape to close modals (future)

**Screen Reader:**
- Status announcements
- Tab change announcements
- Button state (enabled/disabled)
- Icon alternatives

**Visual:**
- High contrast for text
- Focus indicators visible
- Color not sole indicator
- Minimum 48px touch targets

---

## Future Enhancements

### Planned Features

**Overview Tab:**
- [ ] Inline KPI trend charts
- [ ] Expandable activity items
- [ ] Quick actions menu
- [ ] Real-time status updates

**Other Tabs:**
- [ ] Inputs: File manager with preview
- [ ] Events: Live alert feed
- [ ] Schedule: Interactive Gantt chart
- [ ] KPIs: Detailed dashboards with filters
- [ ] Agent: Chat interface with history
- [ ] Artifacts: Download manager
- [ ] History: Complete audit log with diffs

**Interactions:**
- [ ] Inline editing of notes
- [ ] Status transition workflows
- [ ] Bulk actions
- [ ] Export capabilities
- [ ] Share/collaborate features

---

**Complete run detail implementation with comprehensive overview dashboard, KPI tracking, and parent comparison!** 🎯
