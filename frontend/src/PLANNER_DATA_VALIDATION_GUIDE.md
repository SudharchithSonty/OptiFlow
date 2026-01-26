# PLN-03 & PLN-03B: Data Validation & Generation Guide

## Overview

Two comprehensive screens for input data management:

1. **PLN-03: Inputs / Data Validation** - Upload & validate CSV files
2. **PLN-03B: Generate Data Progress** - Synthetic data generation with timeline

---

## PLN-03: Inputs / Data Validation Page

**Route:** `/app/runs/:runId/inputs`

### Features

#### Header Section
- **Back to Run** navigation
- **Run ID** display (font-mono, blue)
- **Overall Status Badge:**
  - 🟢 Green "Ready" - All required files valid
  - 🟠 Orange "Issues Found" - Errors/missing files

#### Summary Stats Panel
Three key metrics displayed:
- ✅ **Valid** - Files passed validation (green)
- ❌ **Errors** - Files with validation errors (red)
- ⚠️ **Missing** - Required files not uploaded (orange)

### Required Files Section

**Checklist of Required Files:**
1. `demand.csv` - Product demand forecasts
2. `inventory.csv` - Current inventory levels
3. `bom.csv` - Bill of materials
4. `operations.csv` - Manufacturing operations
5. Additional files as needed

#### File Card States

**1. Missing State** (Orange)
- Status: "Missing"
- Orange warning icon
- Expected columns list
- **CTA:** Blue "Upload" button
- Click to select CSV file

**2. Validating State** (Blue)
- Status: "Validating..."
- Blue loading icon with animation
- Shows "Validating..." text
- Inputs disabled during validation

**3. Valid State** (Green)
- Status: "Valid"
- Green checkmark icon
- Row count displayed
- Upload timestamp
- **Expandable details:**
  - All expected columns (green chips)
  - Success message
  - Total rows validated
- **CTA:** Gray "Re-upload" button

**4. Error State** (Red)
- Status: "Has Errors"
- Red X icon
- Row count + error count
- **Missing columns** highlighted (red, strikethrough)
- **CTA:** Gray "Re-upload" button
- **Expandable details:**
  - Expected columns (gray = present, red strikethrough = missing)
  - Sample error rows (max 3 shown)
    - Row number
    - Column name (font-mono)
    - Invalid value (red chip)
    - Error description
  - "+ N more errors" if >3 errors

#### Expandable Details

**Collapse/Expand Toggle:**
- ChevronDown/ChevronUp icon button
- Only available for uploaded files
- Saves state per file

**Details Panel Contents:**
1. **Expected Columns**
   - Chip badges for each column
   - Gray = present
   - Red strikethrough = missing

2. **Sample Errors** (if any)
   - Red background panels
   - Row number + Column name
   - Invalid value in mono font
   - Descriptive error message
   - Shows first 3 errors
   - Count of additional errors

3. **Success Message** (if valid)
   - Green background panel
   - Checkmark icon
   - Total rows validated
   - Confirmation message

### Optional Files Section

**Features:**
- Gray "Optional" badge
- Simpler card layout
- Upload button if missing
- Info text: "Optional - improves scheduling accuracy"

**Example Optional Files:**
- `machines.csv` - Machine specifications
- `constraints.csv` - Additional constraints
- `preferences.csv` - Scheduling preferences

### Alternative Action Panel

**"Need help with data?" Card** (Blue background)
- Only shown when required files incomplete
- Wand icon
- Explanatory text
- **CTA:** "Generate Synthetic Data" button
- Navigates to `/app/runs/:runId/generate-data`

### Footer Actions

**Three CTAs (left to right):**

1. **"Save & Exit"** (Left)
   - Gray border button
   - Returns to run detail
   - Saves current state

2. **"Generate Synthetic"** (Middle)
   - Gray border button
   - Wand icon
   - Alternative to manual upload
   - Navigates to generate page

3. **"Continue to Schedule"** (Right, Primary)
   - Blue background
   - Right arrow icon
   - **Disabled** until all required files valid
   - Gray + cursor-not-allowed when disabled
   - Navigates to schedule page

### Validation Logic

**File Validation Checks:**
1. File format (must be .csv)
2. Required columns present
3. Row count > 0
4. Data type validation per column
5. Business rules (no negatives, required fields, etc.)

**Mock Validation Errors:**
```
Row 23, quantity: "-15"
  → Negative quantity not allowed

Row 47, product_id: ""
  → Required field is empty

Row 128, quantity: "abc"
  → Invalid number format
```

### Demo Data

**Required Files Status:**
- ✅ `demand.csv` - Valid (1,247 rows)
- ❌ `inventory.csv` - Has Errors (856 rows, 3 errors, missing 'unit' column)
- ✅ `bom.csv` - Valid (2,134 rows)
- ⚠️ `operations.csv` - Missing
- ⚠️ `machines.csv` - Missing (Optional)

**Overall:** Not ready (1 error file, 1 missing required)

---

## PLN-03B: Generate Data Progress Page

**Route:** `/app/runs/:runId/generate-data`

### Features

#### Header Section
- **Back to Run** navigation
- **Run ID** display
- **Status Badge:**
  - 🔵 Blue "In Progress" - Currently generating
  - 🟢 Green "Complete" - Generation finished

#### Status Timeline

**Three Stages:**

**1. Created** (Starting point)
```
Status: Created
Description: Generation request initialized
Timestamp: When request started
Icon: Checkmark (when complete)
```

**2. Generating** (Active stage)
```
Status: Generating
Description: Creating synthetic data files
Progress Bar: 0-100%
Current Step: Dynamic text
Icon: Spinning loader
```

**3. Generated** (Final stage)
```
Status: Generated
Description: All files ready for review
Timestamp: When completed
Icon: Green checkmark
```

#### Timeline Visual Design

**Vertical Timeline:**
- Left-aligned dots (6px, color-coded)
- Connecting vertical line (1px, gray)
- Progress fill (blue) shows completion
- Active step has ring effect (4px blue ring)
- Cards expand on active/complete steps

**Timeline Dot Colors:**
- Gray: Pending
- Blue: Active/Complete
- Green: Final complete checkmark

**Card States:**

**Active Card (Generating):**
- Blue border (2px)
- Blue background (bg-blue-50)
- Spinning loader icon
- Progress bar below
- Current step text
- Percentage display

**Complete Card:**
- Gray border
- White background
- Green checkmark icon
- Timestamp displayed

**Pending Card:**
- Gray border
- Gray background (bg-gray-50)
- No icon

#### Progress Bar (During Generation)

**Features:**
- Shows current step text
- Percentage (0-100%)
- Blue progress bar with smooth animation
- Updates every 1.5 seconds

**Generation Steps (simulated):**
1. 10% - Analyzing run configuration...
2. 25% - Generating demand patterns...
3. 45% - Creating inventory snapshots...
4. 65% - Building bill of materials...
5. 80% - Generating operation sequences...
6. 95% - Finalizing machine assignments...
7. 100% - Complete!

### Generated Files Section

**Appears when:** Status = 'generated'

#### Summary Card (Green)
- Green background (bg-green-50)
- Green border
- Checkmark icon
- Success message
- **Statistics Grid:**
  - Total Rows: Sum of all files
  - Total Size: Combined file size
  - Format: CSV
  - Validation: All passed

**Example Stats:**
- Total Rows: 4,748
- Total Size: 334 KB
- Format: CSV
- Validation: All passed

#### File List (Collapsible)

**Toggle:** "View All Files" / "Hide Files" button (blue text)

**Each File Card:**
- Blue file icon
- File name (font-mono)
- Row count (formatted with commas)
- File size (KB)
- Generated timestamp
- **Download button** (gray, with icon)

**File Card Layout:**
```
┌─────────────────────────────────────┐
│ [📄] demand.csv                     │
│ 1,247 rows • 85 KB • 14:28:42    [⬇]│
└─────────────────────────────────────┘
```

#### Info Panel (Blue)

**Content:**
- Blue alert icon
- Title: "Data Generation Complete"
- Message: Explains files are validated and ready
- Next steps guidance

### Footer Actions

**Two CTAs (when complete):**

1. **"View Generated Files"** (Left)
   - Gray border button
   - File icon
   - Toggles file list

2. **"Continue to Schedule"** (Right, Primary)
   - Blue background
   - Right arrow icon
   - Navigates to schedule page

### Error State

**If Generation Fails:**
- Red background panel
- Red alert icon
- Error title: "Generation Failed"
- Error message
- **CTA:** Red "Try Again" button
- Reloads page to restart

### Timing & Animation

**Timeline:**
- Created: Immediate
- Start generation: +1 second
- Each step: +1.5 seconds
- Total duration: ~10.5 seconds

**Animations:**
- Progress bar: Smooth 300ms transition
- Loader icon: Continuous spin
- Timeline progress line: 500ms transition
- Ring effect: Pulse animation

---

## User Workflows

### Workflow 1: Upload & Validate Files

```
1. Navigate to /app/runs/:runId/inputs
2. See required files checklist
3. Click "Upload" on missing file
4. Select CSV from computer
5. File uploads → status changes to "Validating..."
6. After 2 seconds → shows "Valid" or "Has Errors"
7. If errors → expand to see details
8. Click "Re-upload" to fix
9. Repeat until all required files valid
10. "Continue to Schedule" button enables
11. Click to proceed
```

### Workflow 2: Generate Synthetic Data

```
1. From validation page → Click "Generate Synthetic Data"
   OR from create run → select synthetic option
2. Navigate to /app/runs/:runId/generate-data
3. Timeline shows "Created" (1 second)
4. Status changes to "Generating"
5. Progress bar shows steps (1.5s each):
   - Analyzing configuration (10%)
   - Generating demand (25%)
   - Creating inventory (45%)
   - Building BOM (65%)
   - Generating operations (80%)
   - Finalizing machines (95%)
   - Complete (100%)
6. Status changes to "Generated"
7. Green summary card appears
8. Click "View Generated Files" to see list
9. Optionally download files
10. Click "Continue to Schedule"
```

### Workflow 3: Fix Validation Errors

```
1. See file with "Has Errors" status
2. Click chevron to expand details
3. Review missing columns (red strikethrough)
4. Review sample error rows
5. Download original file (if needed)
6. Fix errors in spreadsheet
7. Click "Re-upload"
8. Select corrected file
9. Wait for validation
10. Confirm "Valid" status
11. Continue when all valid
```

### Workflow 4: Optional Files

```
1. Scroll to "Optional Files" section
2. See gray "Optional" badge
3. Read description
4. Decide if needed for better accuracy
5. Click "Upload" if desired
6. Follow same validation flow
7. Optional files don't block "Continue"
```

---

## Responsive Design

### Desktop (1440×900)
- Wide content area (max-width: 1280px)
- Two-column stats grid
- Expanded file cards
- Comfortable spacing

### Tablet (1024×768)
- Single column layout
- Stacked action buttons
- Full-width file cards
- 48px touch targets

### Mobile (< 640px)
- Vertical stack
- Bottom CTA bar (sticky)
- Collapsible sections by default
- Simplified stats display

---

## Testing Checklist

### Inputs Validation Page

**Header & Stats:**
- [ ] Back button navigates correctly
- [ ] Run ID displays
- [ ] Status badge shows correct state
- [ ] Summary stats update dynamically

**Required Files:**
- [ ] All required files listed
- [ ] Missing state shows upload button
- [ ] Upload triggers validation
- [ ] Validating state shows loader
- [ ] Valid state shows green checkmark
- [ ] Error state shows red X
- [ ] Row counts display correctly
- [ ] Timestamps show

**File Expansion:**
- [ ] Chevron toggle works
- [ ] Expected columns display
- [ ] Missing columns highlighted red
- [ ] Sample errors show (max 3)
- [ ] Error details formatted correctly
- [ ] Valid message appears for good files

**Optional Files:**
- [ ] Optional badge displays
- [ ] Simpler card layout
- [ ] Upload works same as required

**CTAs:**
- [ ] Save & Exit returns to run
- [ ] Generate Synthetic navigates
- [ ] Continue disabled when invalid
- [ ] Continue enabled when all valid
- [ ] Continue navigates to schedule

### Generate Data Page

**Timeline:**
- [ ] Created step shows immediately
- [ ] Generating starts after 1s
- [ ] Progress bar animates smoothly
- [ ] Current step text updates
- [ ] Percentage increases
- [ ] Generated completes after ~10s
- [ ] Timestamps display correctly

**Visual States:**
- [ ] Dots color-coded correctly
- [ ] Active step has ring effect
- [ ] Progress line fills
- [ ] Cards have correct borders
- [ ] Icons show (loader, checkmark)

**Generated Files:**
- [ ] Summary card appears when done
- [ ] Stats calculated correctly
- [ ] File list toggles
- [ ] All files listed
- [ ] Download buttons work
- [ ] File details correct

**Actions:**
- [ ] View Files toggles list
- [ ] Continue navigates to schedule
- [ ] Back button works

**Error State:**
- [ ] Error displays if failed
- [ ] Try Again reloads page

---

## Design Tokens

### Colors

**Status Colors:**
```css
Valid:      --green-100 / --green-600
Error:      --red-100 / --red-600
Warning:    --orange-100 / --orange-600
Validating: --blue-100 / --blue-600
```

**Timeline:**
```css
Pending:    --gray-300
Active:     --blue-600
Complete:   --blue-600
Ring:       --blue-200 (opacity 30%)
```

### Spacing

```css
File Cards:     padding: 16px (mobile), 24px (desktop)
Timeline Dots:  width: 24px, left offset: 48px
Progress Bar:   height: 8px, rounded-full
Touch Targets:  min-height: 48px
```

### Typography

```css
File Names:     font-mono, 16px
Row Counts:     14px, text-gray-600
Error Text:     14px, text-red-700
Step Text:      14px, text-blue-700
```

---

## API Integration Points

**File Upload:**
```typescript
POST /api/runs/:runId/files
Content-Type: multipart/form-data
Body: { file: File, fileName: string }
Response: { status, rowCount, errors }
```

**Generate Synthetic:**
```typescript
POST /api/runs/:runId/generate
Body: { horizonDays: number }
Response: { jobId: string }

GET /api/runs/:runId/generate/:jobId/status
Response: { status, progress, currentStep, files }
```

**Validation:**
```typescript
GET /api/runs/:runId/validation
Response: { files: FileValidation[], overallValid: boolean }
```

---

## Accessibility

**ARIA Labels:**
- File upload buttons
- Status indicators
- Progress bars
- Toggle buttons

**Keyboard Navigation:**
- Tab through all interactive elements
- Enter to upload/expand
- Escape to collapse

**Screen Reader:**
- Status announcements
- Progress updates
- Error messages
- File completion

---

**Complete data validation and generation flow with comprehensive error handling and progress tracking!**
