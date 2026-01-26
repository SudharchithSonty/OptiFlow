## PLN-07, PLN-08, PLN-09, PLN-10: Events & Reschedule Workflow Guide

## Overview

Complete event management and reschedule wizard workflow with auto-saving draft impact reports:

1. **PLN-07: Events List** - View and manage production events per run
2. **PLN-08: Add Event Modal** - Form to create new events
3. **PLN-09: Create Reschedule Wizard** - 4-step wizard with draft auto-save
4. **PLN-10: Draft Impact Report** - AI-generated analysis with continue/discard options

---

## PLN-07: Events List Page

**Route:** `/app/runs/:runId/events`

### Features

#### Header Section
- **Back to Run** navigation
- **Production Events** title
- **Run ID** display (font-mono, blue)
- **Summary Statistics Panel:**
  - Total events count
  - Critical events (red)
  - High severity events (orange)

### Filters Bar

**Two Filter Controls:**

**1. Event Type Dropdown**
- Options: All Types + 4 event types
- Machine Breakdown (red icon)
- Rush Order (orange icon)
- Scheduled Maintenance (blue icon)
- Material Delay (purple icon)

**2. Severity Dropdown**
- Options: All Severities + 4 levels
- Low, Medium, High, Critical

**Add Event Button** (Blue, right side)
- Plus icon
- Navigates to add event modal

### Desktop Table View

**6 Columns:**
1. **Type** - Badge with icon and label
2. **Start Time** - Date + time
3. **Duration** - Clock icon + formatted time
4. **Severity** - Badge (Low/Medium/High/Critical)
5. **Affected** - Machine ID or Order ID (font-mono)
6. **Notes** - Truncated description

**Row Design:**
- Hover effect (bg-gray-50)
- All badges color-coded
- Icons for each event type

### Tablet/Mobile Card View

**Expandable Cards:**

**Card Header (Always Visible):**
- Event type badge + Severity badge
- Start time
- Duration + Affected ID
- Expand/collapse chevron

**Expanded Details:**
- Full notes text
- Created by user
- Created at timestamp
- Grid layout for metadata

### Event Types

**4 Types with Icons & Colors:**

**1. Machine Breakdown** (Red)
- Icon: AlertTriangle
- Requires: Machine ID
- Example: M03 hydraulic failure

**2. Rush Order** (Orange)
- Icon: Zap
- Requires: Order ID
- Example: Emergency customer order

**3. Scheduled Maintenance** (Blue)
- Icon: Wrench
- Requires: Machine ID
- Example: Monthly calibration

**4. Material Delay** (Purple)
- Icon: Package
- Requires: Order ID
- Example: Supplier delivery delay

### Severity Levels

**4 Levels:**
- Low - Gray
- Medium - Yellow
- High - Orange
- Critical - Red

### Mock Data

**4 Sample Events:**
1. M03 Breakdown (High, 30 min)
2. Rush Order ORD-RUSH-456 (Critical, 180 min)
3. M01 Maintenance (Medium, 45 min)
4. Material Delay ORD-1240 (High, 120 min)

---

## PLN-08: Add Event Modal

**Route:** `/app/runs/:runId/events/add`

### Features

#### Header Section
- **Back to Events** navigation
- **Add Production Event** title
- **Run ID** display

### Form Fields

**8 Required Fields:**

**1. Event Type** (Dropdown)
- Required (*)
- Options: All 4 event types
- Help text: "Select the type of production event"

**2. Start Time** (datetime-local)
- Required (*)
- HTML5 datetime picker
- Help text: "When did the event start?"

**3. Duration** (number input)
- Required (*)
- Placeholder: "e.g., 30"
- Min: 1
- Unit: minutes
- Help text: "Expected or actual duration of the event"

**4. Machine ID** (Dropdown, conditional)
- Required (*) if type = breakdown or maintenance
- Options: M01-M05
- M03 labeled as "Bottleneck"
- Help text: "Which machine is affected?"

**5. Order ID** (Text input, conditional)
- Required (*) if type = rush_order or material_delay
- Placeholder: "e.g., ORD-1234"
- Help text: "Which order is affected?"

**6. Severity** (Dropdown)
- Required (*)
- Options: Low, Medium, High, Critical
- Descriptions included
- Help text: "Impact level on production schedule"

**7. Notes** (Textarea)
- Required (*)
- 4 rows
- Placeholder: "Describe the event and any relevant details..."
- Help text: "Detailed description of the event"

### Conditional Logic

**Machine Breakdown or Maintenance:**
- Shows Machine ID dropdown
- Hides Order ID field

**Rush Order or Material Delay:**
- Shows Order ID field
- Hides Machine ID dropdown

### Validation

**Form is valid when:**
- All required base fields filled
- Conditional fields filled (Machine ID OR Order ID)
- Duration > 0

**Submit button:**
- Disabled when invalid (gray)
- Blue when valid
- Shows loading spinner during save
- Text changes to "Saving..."

### Action Buttons

**Two CTAs:**
1. **Cancel** (Gray border)
   - Returns to events list
2. **Add Event** (Blue, primary)
   - Save icon
   - Disabled until valid
   - Loading state with spinner

### Info Box

**Dynamic based on event type:**
- Shows selected event type icon
- Explains requirements
- Notes about reschedule triggers

---

## PLN-09: Create Reschedule Wizard

**Route:** `/app/runs/:runId/reschedule-wizard`

### Features

#### Critical Auto-Save Mechanism

**Draft Impact Report Auto-Save:**
- **Triggers:** When Step 2 is completed and user moves to Step 3
- **Timing:** Auto-saves within 1 second of entering Step 3
- **Status Indicators:**
  - Yellow banner: "Generating draft impact report..." with spinner
  - "Save draft now" button for manual trigger
  - Green banner: "Draft saved ✓ at {timestamp}" when complete
- **Saved To:** Parent run
- **Visibility:** Shows in header once saved

#### Header Section
- **Back to Run** navigation
- **RotateCcw icon** + "Create Reschedule Run" title
- **Parent Run ID** display
- **Draft Saved Indicator** (green badge, top-right)
  - Shows timestamp when saved
  - Persists across all steps

#### Progress Steps Indicator

**4 Steps with Visual Timeline:**
1. Choose Trigger
2. Select Events
3. Reschedule Mode
4. Create Run

**Step States:**
- **Completed:** Green circle with checkmark
- **Active:** Blue circle with number
- **Pending:** Gray circle with number

**Connecting Lines:**
- Green when completed
- Gray when pending

### Step 1: Choose Trigger

**Three Trigger Options:**

**1. Rush Order** (Orange)
- Zap icon
- Description: "High-priority order needs immediate scheduling"
- Large card with icon, title, description

**2. Machine Breakdown** (Red)
- AlertTriangle icon
- Description: "Machine failure requires schedule adjustment"

**3. Manual Reschedule** (Blue)
- Hand icon
- Description: "Planner-initiated schedule optimization"

**Interaction:**
- Click to select
- Selected: Blue border, blue background
- Unselected: Gray border, white background
- Can only select one

**Validation:**
- Must select one trigger to proceed

### Step 2: Select Events

**Event Multi-Select List:**

**Event Card Design:**
- Event label (bold)
- Severity badge (Critical/High/Medium)
- Start time + Duration
- Machine ID or Order ID (font-mono)
- Checkbox (right side)

**States:**
- Selected: Blue border, blue background, blue checkbox
- Unselected: Gray border, white background

**Info Box:**
- Shows count: "Selected N event(s)"
- Explains: "These events will be factored into the reschedule calculation"

**Validation:**
- Must select at least one event to proceed

### Step 3: Reschedule Mode

**AUTO-SAVE TRIGGERED HERE ✨**

**Draft Save Status Panel:**

**Before Save (Yellow):**
- Loader icon (spinning)
- Text: "Generating draft impact report..."
- Link: "Save draft now" (manual trigger)

**After Save (Green):**
- CheckCircle icon
- Text: "Draft Impact Report saved ✓ at {timestamp}"
- Description: "A partial impact analysis has been saved to the parent run. You can review it later from the run detail page."

**Two Mode Options:**

**1. Reschedule from Now** (DEFAULT, preselected)
- Clock icon
- Blue "DEFAULT" badge
- Radio button selection
- **Three Key Points with Icons:**
  - ✓ **Completed operations:** Locked and preserved
  - ⚠️ **In-progress operations:** Flagged for review
  - 🕒 **Future operations:** Rescheduled based on events
- Descriptive copy explaining the mode

**2. Full Recompute** (OPTIONAL)
- RotateCcw icon
- Gray "OPTIONAL" badge
- Radio button selection
- Description: "Completely recompute the entire schedule from scratch"
- Use case: "Use when you want to optimize the full schedule without constraints from past decisions"

**Interaction:**
- Click card to select mode
- Selected: Blue border, blue background, filled radio button
- Can only select one

### Step 4: Create Run

**Before Creation:**

**Summary Panel:**
- Trigger selected
- Events count
- Mode selected
- Draft report timestamp

**Create Button:**
- Full width
- Blue background
- RotateCcw icon
- Text: "Create Reschedule Run"
- Loading state: Spinner + "Creating New Run..."

**After Creation (Success State):**

**Centered Success Display:**
- Large green circle with CheckCircle icon
- Heading: "Reschedule Run Created!"
- Description: "Your new run has been created successfully"
- **New Run ID Display:**
  - Blue background panel
  - Label: "New Run ID:"
  - Large font-mono ID (e.g., RUN-2456)
- **CTA:** "Go to New Run" button with right arrow

### Footer Navigation

**Two Buttons (Steps 1-3):**
1. **Back** (Left)
   - Gray border
   - Disabled on Step 1
2. **Next** (Right)
   - Blue background
   - Right arrow icon
   - Disabled when validation fails

**Step 4:**
- No footer (uses internal "Go to New Run" button)

---

## PLN-10: Draft Impact Report Page

**Route:** `/app/runs/:runId/impact-report`

### Features

#### Header Section
- **Back to Run** navigation
- **FileText icon** + "Draft Impact Report" title
- **"Partial Analysis" badge** (purple)
- **Parent Run ID** display
- **Generated timestamp** + "Auto-saved during reschedule wizard" text
- **AI-Generated Analysis badge** (purple, right side)
  - Cpu icon
  - Shows AI provenance

### Executive Summary Panel

**Gradient Background (Purple/Blue):**
- Title: "Executive Summary"
- **Summary Text:**
  - Explains impacted orders/machines
  - Notes primary concerns
  - Mentions specific issues (e.g., M03 bottleneck delays)
- **Three Stats Cards:**
  - Affected Orders: 5
  - Affected Machines: 2
  - High-Risk Items: 5 (red)

### Predicted Impacted Machines

**Section Title + Card List:**

**Each Machine Card:**
- Settings icon (blue)
- Machine ID (font-mono) + Name
- Severity badge (Low/Medium/High)
- Impact description

**Example:**
```
[⚙️] M03 - Press 3 (Bottleneck)  [High impact]
30-minute downtime will delay 3 operations
```

**2 Sample Machines:**
- M03: High impact
- M01: Medium impact

### Predicted Impacted Orders

**Section Title + Card List:**

**Each Order Card:**
- Clock icon (orange)
- Order ID (font-mono) + Name
- Severity badge
- Impact description

**Example:**
```
[🕒] ORD-1234 - Widget A Production  [High impact]
Moved to bottleneck machine - completion delayed by 2h
```

**3 Sample Orders:**
- ORD-1234: High (delayed 2h)
- ORD-RUSH-456: High (displaces 4 orders)
- ORD-1240: Medium (material delay)

### Predicted Risks

**Section Title + Card List:**

**Each Risk Card:**
- Icon based on category:
  - TrendingDown - OTD risks
  - AlertTriangle - M03 setup risks
  - Settings - Utilization risks
- Category name
- Likelihood badge (Low/Medium/High)
- Risk statement (bold)
- Detailed explanation

**3 Sample Risks:**

**1. On-Time Delivery** (High likelihood)
- 3 orders at risk of missing deadline
- Details: ORD-1234, ORD-1236, ORD-1238 may not complete by EOD

**2. Setup Switching on M03** (High likelihood)
- Increased setup time due to resequencing
- Details: 2 additional setup cycles (+35 min total)

**3. Resource Utilization** (Medium likelihood)
- M01 and M02 idle during M03 maintenance
- Details: ~20 min combined idle time

### Recommended Next Action Panel

**Blue Background Panel:**
- CheckCircle icon
- Title: "Recommended Next Action"
- **Recommendation Text:**
  - Suggests continuing with "Reschedule from Now" mode
  - Explains preservation strategy
  - Notes orders to flag for review
- **Two CTAs:**
  1. **"Continue to Create Reschedule Run"** (Blue, primary)
     - ArrowRight icon
     - Navigates to wizard (Step 3 with resumeDraft flag)
  2. **"Review Later"** (White with blue border)
     - Returns to run detail

### Discard Section

**Gray Background Panel:**
- Title: "Discard Draft"
- Warning text about permanent deletion
- **CTA:** "Discard Draft" button (Red border, red text)
  - Trash2 icon
  - Opens confirmation modal

### Discard Confirmation Modal

**Modal Design:**
- Red AlertTriangle icon
- Title: "Discard Draft Impact Report?"
- Warning: Explains data loss
- **Two Buttons:**
  1. Cancel (Gray)
  2. Discard Draft (Red, destructive)

---

## Resume Draft Entry Points

### From Run Detail Page (PLN-04)

**Draft Impact Report Widget:**
- Green background
- FileText icon
- Title: "Draft Impact Report Available"
- Description
- **Two CTAs:**
  - "View Report" → `/app/runs/:runId/impact-report`
  - "Dismiss"

**Widget Visibility:**
- Only shows when `run.hasDraftReport === true`
- Set to true after Step 2 of wizard completes

### From Run Lineage Page (PLN-01B)

**Per-Run Actions:**
- "Draft Impact Report" button (purple)
- Only appears for runs with draft reports
- FileText icon
- Navigates to report page

---

## Complete User Workflows

### Workflow 1: View Events

```
1. Navigate to /app/runs/RUN-2401
2. Click "Events" tab
3. See 4 events listed
4. Filter by "Critical" severity
5. See 1 rush order event
6. Click expand on breakdown event
7. Review full notes and metadata
8. Filter by "Machine Breakdown" type
9. See M03 event
```

### Workflow 2: Add New Event

```
1. From events list → Click "Add Event"
2. Navigate to /app/runs/RUN-2401/events/add
3. Select "Machine Breakdown"
4. See Machine ID field appear
5. Fill start time: 2026-01-01 15:30
6. Fill duration: 45
7. Select Machine: M03
8. Select Severity: High
9. Fill notes: "Coolant leak - requires immediate repair"
10. Click "Add Event"
11. Return to events list
12. See new event in list
```

### Workflow 3: Create Reschedule with Auto-Save

```
1. From run detail → Click "Create Reschedule"
2. Navigate to wizard Step 1
3. Select "Machine Breakdown" trigger
4. Click "Next"
5. Step 2: Select 2 events (M03 breakdown, material delay)
6. Click "Next"
7. Step 3: See yellow "Generating draft..." banner
8. After 1 second → Green "Draft saved ✓" banner
9. Review "Reschedule from Now" mode (preselected)
10. Click "Next"
11. Step 4: Review summary
12. Click "Create Reschedule Run"
13. See "Creating..." loader
14. Success: New run RUN-2456 created
15. Click "Go to New Run"
```

### Workflow 4: Review Draft Impact Report

```
1. From run detail → See green "Draft Report Available" widget
2. Click "View Report"
3. Navigate to /app/runs/RUN-2401/impact-report
4. Review executive summary (5 orders, 2 machines)
5. Scroll to impacted machines section
6. See M03 with 30-min downtime impact
7. Scroll to impacted orders
8. See ORD-1234 delayed 2h
9. Scroll to risks
10. Review 3 high/medium likelihood risks
11. Click "Continue to Create Reschedule Run"
12. Navigate to wizard Step 3 (resume mode)
```

### Workflow 5: Discard Draft

```
1. From run detail → Click "View Report"
2. Scroll to bottom
3. Click "Discard Draft"
4. Confirmation modal appears
5. Review warning text
6. Click "Discard Draft" (red)
7. Navigate back to run detail
8. Draft report widget removed
```

---

## Testing Checklist

### Events List (PLN-07)

**Header & Stats:**
- [ ] Back button navigates
- [ ] Run ID displays
- [ ] Summary stats accurate (4, 1, 2)
- [ ] Stats update with filters

**Filters:**
- [ ] Type dropdown works
- [ ] Severity dropdown works
- [ ] Filters combine correctly
- [ ] Add Event button navigates

**Desktop Table:**
- [ ] 6 columns render
- [ ] All 4 events shown
- [ ] Badges color-coded
- [ ] Icons correct
- [ ] Hover effect works

**Mobile Cards:**
- [ ] All cards render
- [ ] Expand/collapse works
- [ ] Details panel shows
- [ ] Metadata displays

### Add Event (PLN-08)

**Form Fields:**
- [ ] All 7 fields present
- [ ] Required fields marked
- [ ] Datetime picker works
- [ ] Duration number validation
- [ ] Conditional fields toggle
- [ ] Machine dropdown populated
- [ ] Severity descriptions clear
- [ ] Notes textarea multiline

**Conditional Logic:**
- [ ] Breakdown shows Machine ID
- [ ] Rush Order shows Order ID
- [ ] Maintenance shows Machine ID
- [ ] Material Delay shows Order ID

**Validation:**
- [ ] Submit disabled when invalid
- [ ] Submit enabled when valid
- [ ] Loading state during save
- [ ] Success navigation

### Reschedule Wizard (PLN-09)

**Progress Indicator:**
- [ ] 4 steps shown
- [ ] Active step highlighted
- [ ] Completed steps green
- [ ] Lines connect properly

**Step 1:**
- [ ] 3 trigger options
- [ ] Cards clickable
- [ ] Selection visual feedback
- [ ] Can't proceed without selection

**Step 2:**
- [ ] 4 events listed
- [ ] Multi-select works
- [ ] Selected count updates
- [ ] Can't proceed without selection

**Step 3 - CRITICAL:**
- [ ] Yellow banner on entry
- [ ] Auto-save after 1 second
- [ ] Green "Saved ✓" appears
- [ ] Timestamp displays
- [ ] "Save draft now" works
- [ ] Two mode cards shown
- [ ] "From Now" preselected
- [ ] Mode selection works
- [ ] Three bullet points visible

**Step 4:**
- [ ] Summary shows all selections
- [ ] Create button works
- [ ] Loading state displays
- [ ] Success state shows
- [ ] New Run ID generated
- [ ] "Go to New Run" navigates

**Footer:**
- [ ] Back button works
- [ ] Back disabled on Step 1
- [ ] Next button works
- [ ] Next disabled when invalid
- [ ] No footer on Step 4

### Draft Impact Report (PLN-10)

**Header:**
- [ ] AI badge displays
- [ ] Partial Analysis badge
- [ ] Generated timestamp
- [ ] Run ID shows

**Executive Summary:**
- [ ] Gradient background
- [ ] Summary text clear
- [ ] 3 stats cards
- [ ] Numbers accurate

**Impacted Machines:**
- [ ] 2 machines listed
- [ ] Icons appropriate
- [ ] Severity badges
- [ ] Impact text clear

**Impacted Orders:**
- [ ] 3 orders listed
- [ ] Order IDs font-mono
- [ ] Severity badges
- [ ] Descriptions detailed

**Risks:**
- [ ] 3 risks listed
- [ ] Category + likelihood
- [ ] Icons match category
- [ ] Details comprehensive

**Recommended Action:**
- [ ] Blue panel
- [ ] Recommendation clear
- [ ] Two CTAs visible
- [ ] Continue navigates
- [ ] Review Later returns

**Discard:**
- [ ] Section visible
- [ ] Button shows
- [ ] Modal confirms
- [ ] Cancel works
- [ ] Discard returns to run

---

## Design Tokens

### Events List Colors

**Event Types:**
```css
Breakdown:   bg-red-100, text-red-700
Rush Order:  bg-orange-100, text-orange-700
Maintenance: bg-blue-100, text-blue-700
Material:    bg-purple-100, text-purple-700
```

**Severity:**
```css
Low:      bg-gray-100, text-gray-700
Medium:   bg-yellow-100, text-yellow-700
High:     bg-orange-100, text-orange-700
Critical: bg-red-100, text-red-700
```

### Wizard Colors

**Triggers:**
```css
Rush Order:  bg-orange-100 (icon circle)
Breakdown:   bg-red-100
Manual:      bg-blue-100
```

**Steps:**
```css
Completed:   bg-green-600, border-green-600
Active:      bg-blue-600, border-blue-600
Pending:     bg-white, border-gray-300
```

**Draft Status:**
```css
Generating:  bg-yellow-50, border-yellow-200
Saved:       bg-green-50, border-green-200
```

### Impact Report Colors

**Panels:**
```css
Executive:     gradient purple-50 to blue-50
Recommended:   bg-blue-50, border-blue-200
Discard:       bg-gray-50, border-gray-200
```

**Risk Icons:**
```css
All risks:     bg-red-100, text-red-600
```

---

## API Integration Points

**Events:**
```typescript
GET /api/runs/:runId/events
POST /api/runs/:runId/events
```

**Reschedule:**
```typescript
POST /api/runs/:runId/reschedule/wizard/init
POST /api/runs/:runId/reschedule/draft-report/save
GET /api/runs/:runId/reschedule/draft-report
POST /api/runs/:runId/reschedule/create
```

**Draft Report:**
```typescript
GET /api/runs/:runId/impact-report
DELETE /api/runs/:runId/impact-report
```

---

**Complete event workflow with auto-saving draft impact reports and comprehensive reschedule wizard!** 🎯
