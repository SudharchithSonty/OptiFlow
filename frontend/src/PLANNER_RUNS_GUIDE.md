# Planner Runs Management - Complete Guide

## Overview

Three comprehensive screens for production run management with tablet-first (1024×768) design:

1. **PLN-01: Runs List** - View and manage all production runs grouped by date
2. **PLN-01B: Run Lineage** - Timeline view of parent→child run relationships
3. **PLN-02: Create Run** - Create new runs with CSV upload or synthetic data

---

## 🚀 Quick Access

### From Login:
1. Login with: `planner@company.com` / `planner123`
2. Enter OTP: `123456`
3. Click "Runs" in the sidebar (or bottom tab on tablet)

### Direct URLs (after auth):
- `/app/runs` - Runs List
- `/app/runs/create` - Create New Run
- `/app/runs/:runId/lineage` - View Run Lineage

---

## PLN-01: Runs List Page

**Route:** `/app/runs`

### Features

#### Grouping & Organization
- ✅ **Group by date** (Today, Yesterday, specific dates)
- ✅ **Shift rows** for A/B/C within each date
- ✅ **Sorted descending** (most recent first)
- ✅ **Collapsible sections** by date

#### Columns (Desktop View)
| Column | Description |
|--------|-------------|
| Status | Color-coded chip (Draft, Pending, Running, Completed, Failed) |
| Shift | A, B, or C badge |
| Run ID | Clickable link to detail page (e.g., RUN-2401) |
| Created | Timestamp when run was created |
| Created By | User who created the run |
| Trigger | Original or Reschedule badge |
| Parent | Parent run ID if reschedule (clickable) |
| Actions | View, Lineage, Reschedule, Delete buttons |

#### Actions Available

**View** (Eye icon)
- Available on all runs
- Navigates to run detail page

**View Lineage** (GitBranch icon)
- Only visible if run `hasChildren` 
- Shows parent→child timeline
- Navigates to lineage page

**Create Reschedule** (RotateCcw icon)
- Only enabled if status = `completed`
- Pre-fills create form with parent run data
- Orange color to indicate reschedule

**Delete** (Trash2 icon)
- Available on all runs
- Shows confirmation dialog (planned)

#### Filters

**Search Bar:**
- Search by Run ID
- Real-time filtering

**Filter Panel** (expandable):
- **Date Range** - Start/end date picker
- **Shift** - All, A, B, or C
- **Status** - All, Draft, Pending, Running, Completed, Failed
- **Trigger** - All, Original, Reschedule
- **Created By** - All users or specific user

**Active Filter Badge:**
- Shows count of active filters
- Blue highlight when filters active
- "Clear all filters" button

#### Primary CTA
- **"Create Run"** button (top-right)
- Blue background, prominent placement
- Always visible
- Navigates to create page

### Tablet/Mobile View

**Card Layout:**
- Each run as a tappable card
- 48px minimum touch targets
- Stacked information
- Large action buttons at bottom

**Card Contents:**
- Shift badge (large, 40×40px)
- Run ID (clickable)
- Status chip (top-right)
- Created time and user
- Trigger type
- Parent run (if applicable)
- Action buttons (full-width, stacked)

### Status Colors

```
Draft:     Gray   (#f3f4f6 bg, #374151 text)
Pending:   Blue   (#dbeafe bg, #1e40af text)
Running:   Green  (#d1fae5 bg, #065f46 text)
Completed: Gray   (#e5e7eb bg, #374151 text)
Failed:    Red    (#fee2e2 bg, #991b1b text)
```

### Demo Data

```
Today (2026-01-01):
  RUN-2401 - Shift A - Completed - Original
  RUN-2402 - Shift B - Running - Original
  RUN-2403 - Shift C - Pending - Original

Yesterday (2025-12-31):
  RUN-2304 - Shift A - Completed - Original (has child)
  RUN-2305 - Shift A - Completed - Reschedule (parent: RUN-2304)
  RUN-2306 - Shift B - Completed - Original
  RUN-2307 - Shift C - Completed - Original

2025-12-30:
  RUN-2208 - Shift A - Completed - Original
  RUN-2209 - Shift B - Failed - Original (has child)
  RUN-2210 - Shift B - Completed - Reschedule (parent: RUN-2209)
  RUN-2211 - Shift C - Completed - Original
```

---

## PLN-01B: Run Lineage Page

**Route:** `/app/runs/:runId/lineage`

### Features

#### Timeline View
- ✅ Vertical timeline with connecting line
- ✅ Dots for each version (color-coded by status)
- ✅ Arrow connectors between versions
- ✅ Latest version highlighted with ring

#### Each Node Shows:

**Header:**
- Run ID (font-mono)
- Version number (v1, v2, v3+)
- Status chip
- Trigger type (Original/Reschedule)
- "Latest" badge on newest version

**Metadata:**
- Created timestamp
- Created by user
- Reschedule reason (if applicable, orange box)

**Actions:**
- **View** - Navigate to run detail
- **Compare to v{N}** - Compare with parent version
- **Draft Impact Report** - View AI-generated report (if exists)

#### Lineage Summary Card
- Total versions count
- Number of reschedules
- Latest status
- Blue background, info panel

### Example Lineages

**Simple (2 versions):**
```
RUN-2304 (v1) - Original - Completed
   ↓
RUN-2305 (v2) - Reschedule - Completed
Reason: "Quality issue detected in batch #4521"
```

**Complex (3+ versions):**
```
RUN-2401 (v1) - Original - Completed
   ↓
RUN-2412 (v2) - Reschedule - Completed
Reason: "Material shortage - supplier delayed delivery"
   ↓
RUN-2423 (v3) - Reschedule - Running (Latest)
Reason: "Equipment breakdown on Line 3"
```

### Visual Design

**Timeline Dot Colors:**
- Match status colors
- 20px diameter
- 4px white border
- Latest has ring effect

**Cards:**
- White background
- Gray border
- Hover shadow effect
- Responsive padding

---

## PLN-02: Create Run Page

**Route:** `/app/runs/create`

### Features

#### Run Configuration

**Required Fields:**

1. **Production Date** *
   - Date picker
   - Calendar icon
   - Default: today

2. **Shift** *
   - 3 large toggle buttons (A, B, C)
   - Blue when selected
   - 48px touch target

3. **Planning Horizon (days)** *
   - Number input
   - Range: 1-30 days
   - Clock icon
   - Help text: "Forecast period: 1-30 days"

**Optional Fields:**

4. **Notes**
   - Multi-line textarea (3 rows)
   - Pre-filled for reschedules
   - Placeholder text

#### Input Method

**Two options:**

**1. Upload CSV Bundle**
- Upload icon
- Drag & drop zone
- File input (accepts .csv, .zip)
- Shows uploaded filename with checkmark
- "Change File" button after upload
- Validation: must be CSV format

**2. Generate Synthetic**
- Wand icon
- Auto-generate demo data
- Info panel explains:
  - Based on historical patterns
  - Uses current inventory levels
  - Configured by horizon days

#### Reschedule Mode

When creating from reschedule action:
- Orange banner shows parent run info
- Pre-filled notes: "Rescheduled from {parentId}"
- Shows original date and shift
- "Reschedule" badge in header

#### Validation

**Real-time checks:**
- Date required
- Shift required
- Horizon 1-30 days
- File uploaded (if upload method)

**Error Display:**
- Red banner at top
- List of specific errors
- Clears when fixed

#### Actions

**Cancel:**
- Gray button
- Confirmation dialog: "Discard this draft run?"
- Returns to runs list

**Create Run:**
- Blue button (primary)
- Disabled until form valid
- Shows loading spinner during creation
- Text: "Creating Run..." when loading
- Navigates to new run detail on success

#### Help Section

**"What happens next?" panel:**
1. Run created in "draft" status
2. Input data validated and processed
3. AI agent generates initial brief
4. Review, modify, and publish

### Form Validation States

**Valid:**
- All required fields filled
- Horizon in range
- File uploaded (if upload method)
- Blue Create button enabled

**Invalid:**
- Red error banner
- Specific error messages
- Gray Create button disabled

**Loading:**
- Spinner animation
- "Creating Run..." text
- All inputs disabled
- Cancel disabled

### Mock Flow

```
1. Click "Create Run" from list
2. Fill in:
   - Date: 2026-01-02
   - Shift: B
   - Horizon: 7 days
   - Method: Synthetic
3. Click "Create Run"
4. Loading for 2 seconds
5. Navigate to RUN-{random}
6. Show success state
```

---

## Responsive Design

### Desktop (1440×900)
- Full table view
- All columns visible
- Hover effects on rows
- Comfortable spacing

### Tablet (1024×768)
- Table view on larger tablets
- Card view on smaller tablets
- Bottom tab navigation
- 48px touch targets
- Thumb-reachable primary actions

### Mobile (< 640px)
- Card layout only
- Stacked information
- Full-width buttons
- Vertical scroll
- Simplified filters

---

## User Workflows

### Workflow 1: Create Original Run
```
1. Navigate to Runs (/app/runs)
2. Click "Create Run"
3. Select date, shift, horizon
4. Choose "Generate Synthetic"
5. Click "Create Run"
6. → View new run detail
```

### Workflow 2: Create Reschedule Run
```
1. Find completed run in list
2. Click Reschedule button (orange icon)
3. Form pre-filled with parent info
4. Modify date/shift if needed
5. Add reschedule reason in notes
6. Click "Create Run"
7. → View new rescheduled run
```

### Workflow 3: View Run Lineage
```
1. Find run with lineage icon
2. Click "View Lineage" (GitBranch icon)
3. See timeline of all versions
4. Click "Compare" to see differences
5. Click "Draft Impact Report" if available
```

### Workflow 4: Filter Runs
```
1. Click "Filters" button
2. Select desired filters:
   - Shift: B
   - Status: Completed
   - Trigger: Reschedule
3. See filtered results
4. Click "Clear all filters" to reset
```

### Workflow 5: Search Run
```
1. Type in search box: "RUN-2401"
2. See real-time filtered results
3. Click run ID to view details
```

---

## Testing Checklist

### Runs List
- [ ] Date grouping works
- [ ] Shifts displayed correctly (A/B/C)
- [ ] Status chips show right colors
- [ ] Trigger badges (Original/Reschedule)
- [ ] Parent run links work
- [ ] View action navigates correctly
- [ ] Lineage icon only on runs with children
- [ ] Reschedule only enabled for completed
- [ ] Search filters in real-time
- [ ] Filter panel expands/collapses
- [ ] Active filter count updates
- [ ] Clear filters works
- [ ] Desktop table view renders
- [ ] Tablet card view renders
- [ ] Mobile layout responsive

### Run Lineage
- [ ] Timeline displays vertically
- [ ] Dots color-coded by status
- [ ] Arrows between versions
- [ ] Latest version highlighted
- [ ] Version numbers correct (v1, v2, v3)
- [ ] Reschedule reasons show
- [ ] View button works
- [ ] Compare button shows parent version
- [ ] Draft report button (when exists)
- [ ] Summary card shows totals
- [ ] Back button returns to list
- [ ] Responsive on tablet

### Create Run
- [ ] Date picker works
- [ ] Shift selection (A/B/C)
- [ ] Horizon validation (1-30)
- [ ] Notes textarea
- [ ] Upload/Synthetic toggle
- [ ] File upload validates CSV
- [ ] Uploaded filename shows
- [ ] Synthetic info panel
- [ ] Reschedule mode shows parent
- [ ] Validation errors display
- [ ] Create button disabled when invalid
- [ ] Create button enabled when valid
- [ ] Loading state shows spinner
- [ ] Cancel confirmation dialog
- [ ] Navigation after create
- [ ] Responsive layout

---

## Navigation Map

```
/app/runs (Runs List)
  ├─→ /app/runs/create (Create Run)
  ├─→ /app/runs/:runId (Run Detail)
  │    └─→ Back to list
  └─→ /app/runs/:runId/lineage (Lineage)
       ├─→ /app/runs/:runId (View specific version)
       ├─→ /app/runs/compare?a=X&b=Y (Compare)
       └─→ Back to list
```

---

## Design Tokens

### Colors
```css
/* Primary Actions */
--blue-600: #2563eb  (Create button, links)
--blue-700: #1d4ed8  (Hover states)
--blue-50:  #eff6ff  (Active nav)

/* Secondary Actions */
--gray-100: #f3f4f6  (View button bg)
--gray-600: #4b5563  (Icons)

/* Reschedule */
--orange-600: #ea580c  (Reschedule icon)
--orange-50:  #fff7ed  (Reschedule button bg)

/* Status Colors */
Draft:     --gray-100 / --gray-700
Pending:   --blue-100 / --blue-700  
Running:   --green-100 / --green-700
Completed: --gray-200 / --gray-700
Failed:    --red-100 / --red-700
```

### Spacing
```css
/* Touch Targets */
min-height: 48px  (buttons, cards)
min-width: 48px   (icon buttons)

/* Card Padding */
padding: 16px     (mobile)
padding: 24px     (tablet/desktop)

/* Gaps */
gap: 8px   (tight - filter chips)
gap: 12px  (medium - form fields)
gap: 16px  (comfortable - cards)
gap: 32px  (section spacing)
```

### Typography
```css
/* Headers */
h1: text-2xl (24px)
h2: text-xl (20px)
h3: text-lg (18px)

/* Body */
Base: 16px
Small: 14px (text-sm)
Tiny: 12px (text-xs)

/* Mono (Run IDs) */
font-family: monospace
```

---

## Keyboard Shortcuts (Planned)

```
Runs List:
  /     - Focus search
  f     - Toggle filters
  c     - Create new run
  
Lineage:
  ↑/↓   - Navigate versions
  Esc   - Back to list

Create Run:
  Cmd+Enter - Submit form
  Esc       - Cancel
```

---

## Accessibility

### ARIA Labels
- Buttons have descriptive labels
- Icons have text alternatives
- Status chips have full text

### Keyboard Navigation
- Tab through all interactive elements
- Enter to activate buttons
- Escape to close modals/panels

### Screen Reader
- Table has proper headers
- Cards have semantic structure
- Form fields have labels
- Error messages announced

### Visual
- Minimum contrast ratios met (WCAG AA)
- Focus indicators visible
- Color not sole indicator (text + icon)
- Touch targets ≥48px

---

## Performance

- Virtualized lists for 100+ runs
- Lazy load lineage data
- Debounced search (300ms)
- Optimistic UI updates
- Local filter state

---

**Complete implementation with tablet-first design, comprehensive filtering, and seamless run management!**
