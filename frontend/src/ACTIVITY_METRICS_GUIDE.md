# ACT-01, ACT-02, OWN-02: Activity Logging & Weekly Metrics Guide

## Overview

Three essential screens for activity logging and owner metrics:

1. **ACT-01: Log Setup Actuals** - Supervisor form to record actual changeover times
2. **ACT-02: Log First-Piece Quality** - Supervisor form to record quality inspection results
3. **OWN-02: Weekly Metrics** - Owner dashboard showing week-over-week performance

---

## ACT-01: Log Setup Actuals (Supervisor)

**Route:** `/app/machines/:machineId/setup-actuals`

### Features

#### Header Section
- **Back to Dashboard** navigation
- **Wrench icon** (blue circle)
- **Title:** "Log Setup Actuals"
- **Description:** "Record actual changeover time and details"

### Form Fields

**8 Fields Total:**

**1. Date** (required)
- Type: date input
- Default: Today's date
- Format: YYYY-MM-DD

**2. Shift** (required)
- Type: dropdown
- Options: Shift A, Shift B, Shift C
- Default: Shift A

**3. Machine** (required)
- Type: dropdown
- Options: M01-M05
- M03 labeled as "(Press 3 - Bottleneck)"
- Help text: "Which machine was the setup performed on?"

**4. Product Family Transition** (required)
- Two dropdowns side-by-side
- **From Family:** Select previous product
- **To Family:** Select new product
- Arrow separator (→) between on desktop
- Options: Widget, Bracket, Shaft, Gear, Cover, Housing, Pin, Flange
- Help text: "What product families were involved in the changeover?"

**5. Setup Timing** (required)
- Two time inputs side-by-side
- **Start Time:** When setup began
- **End Time:** When setup completed
- HTML5 time picker

**6. Auto-Computed Duration** (calculated)
- Blue info panel
- Clock icon
- Shows: "Computed Duration: X minutes"
- Also shows: "Xh Ym" format
- Real-time calculation
- Validation: End must be after start

**7. Notes** (optional)
- Textarea, 4 rows
- Placeholder: "Add any relevant notes about the setup..."
- Help text: "Optional: Record any observations or issues during setup"

### Info Box

**Why log setup actuals?**
- Helps improve setup time estimates
- Identifies bottleneck machines needing attention
- Tracks changeover efficiency over time

### Validation

**Form is valid when:**
- Date filled
- Machine selected
- Both families selected (From & To)
- Both times filled
- Duration is positive (end > start)

### Action Buttons

**Two Buttons:**
1. **Cancel** (gray border)
   - Returns to dashboard
2. **Log Setup Actuals** (blue, primary)
   - Save icon
   - Disabled until valid
   - Loading state: Spinner + "Saving..."

### Auto-Computation Logic

```typescript
// Calculate duration whenever times change
if (startTime && endTime) {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMs = end - start;
  const diffMin = Math.round(diffMs / 60000);
  
  if (diffMin >= 0) {
    setSetupDuration(diffMin);
  } else {
    setSetupDuration(null); // Invalid
  }
}
```

### Example Data

**Sample Setup:**
- Date: 2026-01-01
- Shift: A
- Machine: M01
- From: Widget → To: Bracket
- Start: 10:30, End: 10:50
- **Duration: 20 minutes** (auto-computed)
- Notes: "Tooling change smooth, no issues"

---

## ACT-02: Log First-Piece Quality (Supervisor)

**Route:** `/app/machines/:machineId/first-piece-quality`

### Features

#### Header Section
- **Back to Dashboard** navigation
- **ClipboardCheck icon** (purple circle)
- **Title:** "Log First-Piece Quality Check"
- **Description:** "Record quality inspection results for first piece"

### Form Fields

**9 Fields Total:**

**1. Date** (required)
- Type: date input
- Default: Today's date
- Format: YYYY-MM-DD

**2. Shift** (required)
- Type: dropdown
- Options: Shift A, Shift B, Shift C
- Default: Shift A

**3. Order ID** (required)
- Type: text input
- Placeholder: "e.g., ORD-1234"
- Help text: "Which order is this first piece from?"

**4. Machine** (required)
- Type: dropdown
- Options: M01-M05
- No machine names, just IDs

**5. Inspection Time** (required)
- Type: time input
- Default: Current time
- HTML5 time picker

**6. Inspection Result** (required)
- Two large button cards
- **Pass Card:**
  - CheckCircle2 icon (green)
  - Title: "Pass"
  - Subtitle: "Meets specifications"
  - Green-600 border when selected, green-50 background
- **Fail Card:**
  - XCircle icon (red)
  - Title: "Fail"
  - Subtitle: "Has defects"
  - Red-600 border when selected, red-50 background

**7. Defect Category** (conditional, required if fail)
- Type: dropdown
- Only visible when result = Fail
- Options:
  - Dimensional - Oversized
  - Dimensional - Undersized
  - Surface Finish
  - Burr/Sharp Edge
  - Tool Mark
  - Material Defect
  - Incomplete Operation
  - Wrong Specification
  - Other
- Help text: "What type of defect was found?"

**8. Scrap Quantity** (conditional, optional)
- Type: number input
- Only visible when result = Fail
- Min: 0
- Placeholder: "e.g., 1"
- Help text: "How many pieces were scrapped due to this defect?"

**9. Notes** (conditional)
- Textarea, 4 rows
- **Required if Fail**, optional if Pass
- Placeholder changes based on result:
  - Pass: "Add any relevant notes about the inspection..."
  - Fail: "Describe the defect in detail..."
- Help text changes:
  - Pass: "Optional: Record any observations"
  - Fail: "Required: Provide details about the defect"

### Result Info Panel

**Dynamic panel based on result:**

**Pass (green-50 background):**
- Title: "Quality Check Passed"
- Message: "First piece meets quality standards. Production can proceed."

**Fail (red-50 background):**
- Title: "Quality Check Failed"
- Message: "First piece has defects. Review setup and correct before continuing production."

### Validation

**Form is valid when:**
- Date filled
- Order ID filled
- Machine selected
- Timestamp filled
- Result selected
- If Pass: All basic fields
- If Fail: Defect category must be selected

### Action Buttons

**Two Buttons:**
1. **Cancel** (gray border)
   - Returns to dashboard
2. **Log Quality Check** (purple, primary)
   - Save icon
   - Disabled until valid
   - Loading state: Spinner + "Saving..."

### Interaction Flow

**Pass Flow:**
1. Select "Pass" card
2. Green background/border applied
3. Defect fields hidden
4. Notes optional
5. Green info panel shows
6. Submit enabled when valid

**Fail Flow:**
1. Select "Fail" card
2. Red background/border applied
3. Defect category dropdown appears
4. Scrap quantity field appears
5. Notes become required
6. Red info panel shows
7. Submit enabled when valid (category + notes)

### Example Data

**Pass Example:**
- Date: 2026-01-01
- Shift: A
- Order: ORD-1234
- Machine: M01
- Time: 10:55
- Result: Pass
- Notes: "Good finish, within tolerance"

**Fail Example:**
- Date: 2026-01-01
- Shift: A
- Order: ORD-1236
- Machine: M03
- Time: 11:20
- Result: Fail
- Defect: Dimensional - Oversized
- Scrap Qty: 1
- Notes: "Part dimension +0.3mm over spec. Possible tool wear. Recommend re-check tooling before continuing."

---

## OWN-02: Weekly Metrics (Owner)

**Route:** `/app/metrics` (Owner role)

### Features

#### Header Section
- **BarChart3 icon** (blue)
- **Title:** "Weekly Production Metrics"
- **Week Range:** "Week of Jan 5 - Jan 11"

### Filters Bar

**6 Filter Controls:**

**1. Week Range** (2 inputs, takes 2 columns)
- Two date inputs side-by-side
- Start date and End date
- Defaults to current week (Sunday-Saturday)

**2. Shift**
- Dropdown
- Options: All Shifts, Shift A, Shift B, Shift C

**3. Machine**
- Dropdown
- Options: All Machines, M01-M05

**4. Product Family**
- Dropdown
- Options: All Families, Widget, Bracket, Shaft, Gear, Cover, Housing

**5. Event Type**
- Dropdown
- Options: All Events, Machine Breakdown, Rush Order, Scheduled Maintenance, Material Delay

### Week-over-Week Comparison Cards

**4 KPI Cards in Grid:**

**Card Structure:**
- Icon in colored circle (top-left)
- Change percentage with trend (top-right)
- KPI label
- This Week value (large)
- Last Week value (smaller)
- Improvement indicator at bottom

**1. Setup Minutes**
- Clock icon (green if improved)
- This Week: 487 min
- Last Week: 532 min
- Change: -8.5% (improvement)
- Trend: TrendingUp (green)
- Bottom: "→ Improved"

**2. On-Time Delivery**
- CheckCircle2 icon (green)
- This Week: 93.2%
- Last Week: 88.7%
- Change: +5.1% (improvement)
- Trend: TrendingUp (green)
- Bottom: "→ Improved"

**3. First-Piece Rejects**
- XCircle icon (green - improvement despite increase in value)
- This Week: 2.8%
- Last Week: 3.4%
- Change: -17.6% (improvement - lower is better)
- Trend: TrendingUp (green)
- Bottom: "→ Improved"

**4. OEE-Lite**
- TrendingUp icon (green)
- This Week: 76.4%
- Last Week: 73.1%
- Change: +4.5% (improvement)
- Trend: TrendingUp (green)
- Bottom: "→ Improved"

### Weekly Trend Charts (Placeholders)

**4 Chart Placeholders in 2×2 Grid:**

**Each Chart:**
- White background
- Border
- Icon in header (right side)
- Gray-50 dashed border placeholder area
- BarChart3 icon (large, centered)
- "Chart Placeholder" text
- Descriptive subtitle

**1. Setup Time Trend**
- Clock icon in header
- Subtitle: "Weekly setup minutes by machine"

**2. On-Time Delivery Trend**
- CheckCircle2 icon in header
- Subtitle: "Weekly OTD percentage"

**3. First-Piece Rejects Trend**
- XCircle icon in header
- Subtitle: "Weekly reject rate by product family"

**4. OEE-Lite Trend**
- TrendingUp icon in header
- Subtitle: "Weekly OEE by shift"

### Key Insights Section

**Gradient panel (blue-50 to purple-50):**
- Title: "Key Insights"
- 4 bullet points with icons:
  - ✓ (green): Setup time reduced by 8.5% - Shift A leading with 15% improvement
  - ✓ (green): On-Time Delivery improved to 93.2% - Best performance in 4 weeks
  - ! (orange): First-piece rejects still at 2.8% - Focus on M03 Press setup quality
  - ✓ (green): OEE-Lite trending up - Maintenance optimization paying off

### Filter Summary Panel

**Active filters display:**
- Shows chips for each active filter
- Example: "Shift A", "Machine M03", "Widget"
- If no filters: "No filters applied - showing all data"

---

## User Workflows

### Workflow 1: Log Setup After Changeover

```
1. Complete changeover on M01
2. From dashboard → Click "Log Setup Actuals"
3. Navigate to ACT-01 form
4. Date/Shift pre-filled (today, Shift A)
5. Select Machine: M01
6. Select From Family: Widget
7. Select To Family: Bracket
8. Enter Start Time: 10:30
9. Enter End Time: 10:50
10. See auto-computed duration: 20 minutes
11. Add notes: "Smooth transition, no issues"
12. Click "Log Setup Actuals"
13. Return to dashboard
```

### Workflow 2: Log Failed First-Piece

```
1. Complete first piece inspection
2. From dashboard → Click "Log First-Piece Check"
3. Navigate to ACT-02 form
4. Date/Shift pre-filled
5. Enter Order ID: ORD-1236
6. Select Machine: M03
7. Time pre-filled (current)
8. Click "Fail" card (red)
9. Defect category dropdown appears
10. Select: Dimensional - Oversized
11. Enter Scrap Qty: 1
12. Notes field now required
13. Enter: "Part +0.3mm over spec. Check tooling."
14. Red info panel: "Review setup before continuing"
15. Click "Log Quality Check"
16. Return to dashboard
```

### Workflow 3: Review Weekly Performance (Owner)

```
1. Login as Owner (Sarah Chen)
2. Navigate to Metrics (sidebar)
3. See current week range (Jan 5-11)
4. Review 4 KPI cards:
   - Setup: -8.5% (improved)
   - OTD: +5.1% (improved)
   - Rejects: -17.6% (improved)
   - OEE: +4.5% (improved)
5. Note all metrics trending positive
6. Scroll to Key Insights
7. See orange alert: Focus on M03 setup quality
8. Filter by Machine: M03
9. Filter by Event Type: Machine Breakdown
10. Review filtered metrics
```

### Workflow 4: Investigate Setup Time Improvement

```
1. From Weekly Metrics
2. See Setup Minutes: 487 → 532 (-8.5%)
3. Click Shift filter → Shift A
4. See improvement better in Shift A
5. Click Machine filter → M03 (bottleneck)
6. See M03 setup times reduced
7. Review Key Insights
8. Confirm maintenance optimization working
9. Clear filters
10. Review OEE trend chart (when implemented)
```

### Workflow 5: Log Pass Quality Check

```
1. Complete inspection, piece looks good
2. Click "Log First-Piece Check"
3. Fill Order ID, Machine, Time
4. Click "Pass" card (green)
5. Green panel: "Production can proceed"
6. Defect fields hidden
7. Add optional note: "Good finish"
8. Submit
9. Production continues
```

---

## Testing Checklist

### Log Setup Actuals (ACT-01)

**Header:**
- [ ] Back button navigates
- [ ] Wrench icon displays (blue)
- [ ] Title and description show

**Form Fields:**
- [ ] Date defaults to today
- [ ] Shift defaults to A
- [ ] Machine dropdown populated
- [ ] From/To family dropdowns work
- [ ] Arrow separator shows (desktop)
- [ ] Time pickers functional
- [ ] Duration auto-computes
- [ ] Duration updates real-time
- [ ] Negative duration validation
- [ ] Notes textarea works

**Duration Calculation:**
- [ ] Computes correctly
- [ ] Shows minutes format
- [ ] Shows hours+minutes format
- [ ] Blue panel displays
- [ ] Clock icon shows
- [ ] Updates on time change
- [ ] Validates end > start

**Validation:**
- [ ] Submit disabled when invalid
- [ ] Submit enabled when valid
- [ ] All required fields enforced

**Actions:**
- [ ] Cancel returns to dashboard
- [ ] Submit shows loading
- [ ] Submit saves data
- [ ] Navigates on success

### Log First-Piece Quality (ACT-02)

**Header:**
- [ ] ClipboardCheck icon (purple)
- [ ] Title displays
- [ ] Description shows

**Form Fields:**
- [ ] Date defaults correctly
- [ ] Order ID text input works
- [ ] Machine dropdown works
- [ ] Time defaults to now
- [ ] Pass/Fail cards render

**Pass Flow:**
- [ ] Pass card clickable
- [ ] Green border/bg on select
- [ ] Defect fields hidden
- [ ] Notes optional
- [ ] Green info panel
- [ ] Submit enabled

**Fail Flow:**
- [ ] Fail card clickable
- [ ] Red border/bg on select
- [ ] Defect dropdown appears
- [ ] 9 defect categories listed
- [ ] Scrap qty field appears
- [ ] Notes become required
- [ ] Red info panel
- [ ] Submit disabled without category

**Validation:**
- [ ] Basic fields required
- [ ] Fail requires defect category
- [ ] Fail requires notes
- [ ] Pass doesn't require category
- [ ] Pass allows optional notes

**Actions:**
- [ ] Cancel works
- [ ] Submit validates
- [ ] Loading state shows
- [ ] Success navigates

### Weekly Metrics (OWN-02)

**Header:**
- [ ] BarChart3 icon displays
- [ ] Title shows
- [ ] Week range displays
- [ ] Dates format correctly

**Filters:**
- [ ] 6 filters render
- [ ] Week range 2-column layout
- [ ] All dropdowns work
- [ ] Date pickers functional
- [ ] Filters update in real-time

**KPI Cards:**
- [ ] 4 cards render
- [ ] Icons appropriate
- [ ] This Week values show
- [ ] Last Week values show
- [ ] Change percentages correct
- [ ] Trend icons correct
- [ ] Colors match improvement
- [ ] Grid responsive (4→2→1)

**Chart Placeholders:**
- [ ] 4 placeholders render
- [ ] Dashed borders show
- [ ] BarChart3 icons center
- [ ] Subtitles display
- [ ] 2×2 grid on desktop
- [ ] Stack on mobile

**Key Insights:**
- [ ] Gradient background
- [ ] 4 insights listed
- [ ] Icons correct (✓ green, ! orange)
- [ ] Text informative

**Filter Summary:**
- [ ] Active filters show as chips
- [ ] Chips color-coded (blue)
- [ ] Empty state message
- [ ] Updates with filters

---

## Design Tokens

### ACT-01 Colors

```css
Form:           bg-white, border-gray-200
Primary Button: bg-blue-600, hover:bg-blue-700
Duration Panel: bg-blue-50, border-blue-200
Icon Circle:    bg-blue-100, text-blue-600
```

### ACT-02 Colors

```css
Icon Circle:      bg-purple-100, text-purple-600
Primary Button:   bg-purple-600, hover:bg-purple-700

Pass Card:
  Selected:       border-green-600, bg-green-50
  Icon BG:        bg-green-100, text-green-600
  Info Panel:     bg-green-50, border-green-200

Fail Card:
  Selected:       border-red-600, bg-red-50
  Icon BG:        bg-red-100, text-red-600
  Info Panel:     bg-red-50, border-red-200
```

### OWN-02 Colors

```css
Header Icon:     text-blue-600
KPI Improved:    text-green-600, bg-green-100
KPI Degraded:    text-red-600, bg-red-100
Insights Panel:  gradient blue-50 to purple-50
Filter Chips:    bg-blue-100, text-blue-700
```

---

## API Integration Points

**Log Setup:**
```typescript
POST /api/activity/setup-actuals
Body: {
  date, shift, machineId, fromFamily, toFamily,
  setupStartTime, setupEndTime, setupDuration, notes
}
```

**Log Quality:**
```typescript
POST /api/activity/first-piece-quality
Body: {
  date, shift, orderId, machineId, timestamp,
  result, defectCategory?, scrapQty?, notes
}
```

**Weekly Metrics:**
```typescript
GET /api/metrics/weekly?weekStart=&weekEnd=&shift=&machine=&family=&eventType=
Response: {
  metrics: WeeklyMetric[],
  insights: string[],
  chartData: { ... }
}
```

---

**Complete activity logging and weekly metrics with auto-computation and dynamic validation!** 📊
