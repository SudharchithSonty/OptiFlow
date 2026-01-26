# Planner Screens - Complete Summary

## ✅ Implemented Screens (6 Total)

### PLN-01: Runs List
**Route:** `/app/runs`

**Features:**
- ✅ Group by date (Today, Yesterday, dates)
- ✅ Shift A/B/C rows for each day
- ✅ Columns: Status, Shift, Run ID, Created, Created By, Trigger, Parent, Actions
- ✅ Actions: View, Lineage, Reschedule (only if completed), Delete
- ✅ Filters: Date range, Shift, Status, Trigger, Created by
- ✅ Real-time search by Run ID
- ✅ Primary CTA: "Create Run" (blue button)
- ✅ Desktop table + Tablet/Mobile cards

---

### PLN-01B: Run Lineage
**Route:** `/app/runs/:runId/lineage`

**Features:**
- ✅ Vertical timeline parent→child
- ✅ Color-coded dots by status
- ✅ Each node: Run ID, version, status, trigger, timestamp, created by, reason
- ✅ Actions: View, Compare-to-parent, Draft Impact Report
- ✅ Latest version highlighted with ring
- ✅ Summary card with totals

---

### PLN-02: Create Run
**Route:** `/app/runs/create`

**Features:**
- ✅ Required: Date, Shift (A/B/C), Horizon days, Notes
- ✅ Input methods: Upload CSV Bundle OR Generate Synthetic
- ✅ Reschedule mode (pre-filled from parent)
- ✅ Real-time validation
- ✅ Disabled submit until valid
- ✅ Loading state with spinner
- ✅ Large touch targets (48px)

---

### PLN-03: Inputs / Data Validation
**Route:** `/app/runs/:runId/inputs`

**Features:**
- ✅ Required artifacts checklist (CSV bundle)
- ✅ Pass/fail per file with icons
- ✅ Row counts displayed
- ✅ Missing columns highlighted
- ✅ Sample error rows (max 3 per file)
- ✅ Expandable details per file
- ✅ CTAs: Upload again, Generate synthetic, Mark as ready
- ✅ "Continue to Schedule" disabled until all valid
- ✅ Summary stats (Valid/Errors/Missing counts)

**File States:**
- Missing (orange) → Upload button
- Validating (blue) → Loader animation
- Valid (green) → Success with row count
- Error (red) → Error list + re-upload

---

### PLN-03B: Generate Data Progress
**Route:** `/app/runs/:runId/generate-data`

**Features:**
- ✅ Status timeline: Created → Generating → Generated
- ✅ Vertical timeline with dots and connecting line
- ✅ Progress bar during generation (0-100%)
- ✅ Current step text updates
- ✅ Auto-progression (simulated ~10s total)
- ✅ Generated files list (collapsible)
- ✅ File details: name, rows, size, timestamp
- ✅ Download buttons per file
- ✅ CTAs: "View Generated Files", "Continue to Schedule"
- ✅ Summary stats when complete

**Timeline Steps:**
1. Created (1s)
2. Generating (with progress: 10% → 25% → 45% → 65% → 80% → 95% → 100%)
3. Generated (complete)

---

### PLN-04: Run Detail
**Route:** `/app/runs/:runId`

**Features:**
- ✅ **Header:**
  - Run title (date + Shift A/B/C)
  - Status chip (7 states: draft→completed)
  - Trigger badge (original/reschedule)
  - Parent run link (if exists) with lineage
  - Version badge (v1, v2, v3)
  - Notes display
- ✅ **Action Buttons:**
  - Schedule (enabled when status=generated)
  - Generate Brief (enabled when completed)
  - Create Reschedule (enabled when completed)
- ✅ **8 Tabs:**
  - Overview (implemented)
  - Inputs, Events, Schedule, KPIs, Agent, Artifacts, History (placeholders)
- ✅ **Overview Tab Contents:**
  - **4 KPI Cards:** OTD (94.2%), Setup Time (127min), Rejects (2.4%), OEE-Lite (78.3%)
  - Change indicators vs parent (trending up/down)
  - **"What Changed vs Parent?" Widget** (orange, only if parent exists)
    - Schedule changes: 12 operations resequenced
    - Material updates: 4 items substituted
    - Machine changes: 2 machines reassigned
    - "View Comparison" CTA
  - **"Draft Impact Report" Widget** (green, only if hasDraftReport)
    - AI-generated analysis description
    - "View Report" and "Dismiss" CTAs
  - **Recent Activity Timeline**
    - 5 activities with icons, timestamps, users
    - Hover effects
- ✅ **Responsive:** Desktop tabs horizontal, mobile horizontal scroll
- ✅ **Demo Data:** Two variants (RUN-2401 original, RUN-2412 reschedule)

---

## Navigation Map

```
/app/runs (PLN-01: Runs List)
  │
  ├─→ /app/runs/create (PLN-02: Create Run)
  │    └─→ /app/runs/:runId (created) → /app/runs/:runId/inputs
  │
  ├─→ /app/runs/:runId (Run Detail - existing)
  │
  ├─→ /app/runs/:runId/lineage (PLN-01B: Run Lineage)
  │    └─→ Back to /app/runs
  │
  ├─→ /app/runs/:runId/inputs (PLN-03: Inputs Validation)
  │    ├─→ Generate Synthetic → /app/runs/:runId/generate-data
  │    └─→ Continue to Schedule → /app/runs/:runId/schedule
  │
  └─→ /app/runs/:runId/generate-data (PLN-03B: Generate Data)
       └─→ Continue to Schedule → /app/runs/:runId/schedule
```

---

## Complete User Journey

### Journey 1: Create New Run (Upload CSV)
```
1. /app/runs → Click "Create Run"
2. /app/runs/create → Fill form, select "Upload CSV"
3. Click "Create Run" → Navigate to inputs
4. /app/runs/:runId/inputs → Upload CSV files
5. Validate each file → Fix errors if any
6. All valid → Click "Continue to Schedule"
7. /app/runs/:runId/schedule (next screen)
```

### Journey 2: Create New Run (Synthetic)
```
1. /app/runs → Click "Create Run"
2. /app/runs/create → Fill form, select "Generate Synthetic"
3. Click "Create Run" → Navigate to generate
4. /app/runs/:runId/generate-data → Watch progress
5. Generation complete → Click "Continue to Schedule"
6. /app/runs/:runId/schedule (next screen)
```

### Journey 3: Create Reschedule Run
```
1. /app/runs → Find completed run
2. Click "Reschedule" (orange icon)
3. /app/runs/create (pre-filled) → Modify if needed
4. Click "Create Run" → Follow upload or synthetic flow
5. Complete data setup → Continue to schedule
```

### Journey 4: View Run Lineage
```
1. /app/runs → Find run with lineage icon
2. Click "View Lineage" (GitBranch icon)
3. /app/runs/:runId/lineage → See all versions
4. Click "Compare to v{N}" → Compare versions
5. Click "View" on any version → See details
6. Back to list
```

### Journey 5: Fix Validation Errors
```
1. /app/runs/:runId/inputs → See error file
2. Click expand (chevron) → Review errors
3. Click "Re-upload" → Select fixed file
4. Wait for validation → Confirm valid
5. Repeat for all files → All green
6. Click "Continue to Schedule"
```

---

## Quick Access from Auth

**Login Flow:**
```
1. /auth/login (default entry)
2. Enter: planner@company.com / planner123
3. /auth/otp → Enter: 123456
4. /app (Planner Dashboard)
5. Click "Runs" in sidebar
6. /app/runs (Runs List)
```

**Direct URLs (after auth):**
- Runs List: `/app/runs`
- Create: `/app/runs/create`
- Validation: `/app/runs/RUN-2401/inputs`
- Generate: `/app/runs/RUN-2401/generate-data`
- Lineage: `/app/runs/RUN-2401/lineage`

---

## Design Consistency

**All screens follow:**
- ✅ Tablet-first design (1024×768)
- ✅ Desktop responsive (1440×900)
- ✅ 48px minimum touch targets
- ✅ Back button in header
- ✅ Run ID display (font-mono, blue)
- ✅ Status badges (color-coded)
- ✅ Sticky footer with primary CTAs
- ✅ Gray "Save & Exit" or "Cancel"
- ✅ Blue primary action (right side)
- ✅ Loading states with spinners
- ✅ Disabled states (gray + cursor-not-allowed)
- ✅ Expandable/collapsible sections
- ✅ Mock data for testing

---

## Testing Quick Start

### Test PLN-03 (Validation):
```
1. Login as planner
2. Navigate to /app/runs
3. Click any run
4. Manually navigate to /app/runs/RUN-2401/inputs
5. See:
   - ✅ demand.csv (valid, 1,247 rows)
   - ❌ inventory.csv (errors, expand to see)
   - ✅ bom.csv (valid, 2,134 rows)
   - ⚠️ operations.csv (missing)
6. Click expand on inventory.csv
7. See missing columns + sample errors
8. Click "Generate Synthetic Data"
```

### Test PLN-03B (Generate):
```
1. From validation page → Click "Generate Synthetic"
2. Watch timeline animation:
   - Created (immediate)
   - Generating (starts after 1s)
   - Progress bar fills
   - Steps update every 1.5s
   - Generated (after ~10s)
3. Click "View Generated Files"
4. See 5 files with details
5. Click "Continue to Schedule"
```

---

## Files Created

1. `/components/planner/RunsListPage.tsx` - PLN-01
2. `/components/planner/RunLineagePage.tsx` - PLN-01B
3. `/components/planner/CreateRunPage.tsx` - PLN-02
4. `/components/planner/InputsValidationPage.tsx` - PLN-03
5. `/components/planner/GenerateDataPage.tsx` - PLN-03B
6. `/components/planner/RunDetailPage.tsx` - PLN-04

**Documentation:**
- `/PLANNER_RUNS_GUIDE.md` - PLN-01, PLN-01B, PLN-02
- `/PLANNER_DATA_VALIDATION_GUIDE.md` - PLN-03, PLN-03B
- `/PLANNER_SCREENS_SUMMARY.md` - This file
- `/HOW_TO_TEST_AUTH.md` - Auth flow testing

**Routes Added to App.tsx:**
```tsx
<Route path="/runs" element={<RunsListPage />} />
<Route path="/runs/create" element={<CreateRunPage />} />
<Route path="/runs/:runId/lineage" element={<RunLineagePage />} />
<Route path="/runs/:runId/inputs" element={<InputsValidationPage />} />
<Route path="/runs/:runId/generate-data" element={<GenerateDataPage />} />
<Route path="/runs/:runId" element={<RunDetailPage />} />
```

---

## What's Next?

**Future Screens (Not Yet Implemented):**
- PLN-05: AI Brief Generation
- PLN-06: Run Comparison
- PLN-07: Impact Report

**Integration Points:**
- Real file upload (multipart/form-data)
- Backend validation API
- Synthetic data generation service
- WebSocket for progress updates
- File download endpoints

---

**All 6 Planner screens implemented with comprehensive run management, validation, KPI tracking, and responsive design!** 🎉