# OWN-01, OWN-03, ADM-01, ADM-02: Owner/Admin Screens Guide

## Overview

Four essential Owner/Admin screens for organization management:

1. **OWN-01: KPI Overview** - Org-level metrics with shift/machine drilldowns
2. **OWN-03: Runs Audit/History** - Searchable run list with lineage visualization
3. **ADM-01: Users & Roles** - User management with invite and role assignment
4. **ADM-02: Org Settings** - Shift templates, KPI thresholds, API keys

---

## OWN-01: KPI Overview

**Route:** `/app/metrics` (Owner role)

### Features

#### Header Section
- **BarChart3 icon** (blue circle)
- **Title:** "Organization KPI Overview"
- **Subtitle:** "Real-time performance metrics across all operations"

### Drilldown Filters

**Two Filter Selectors:**

**1. Filter by Shift** (dropdown with ChevronDown)
- Options: All Shifts, Shift A (Morning), Shift B (Afternoon), Shift C (Night)
- Selecting shift clears machine filter

**2. Filter by Machine** (dropdown with ChevronDown)
- Options: All Machines, M01, M02, M03 (Bottleneck), M04, M05
- Selecting machine clears shift filter

**Clear Filters Button:**
- Shows only when filters active
- Blue text, "Clear Filters"

### Active Filter Banner

**Blue-50 background (conditional):**
- Shows when drilldown active
- Text: "Viewing: Machine M03 (Bottleneck)" or "Viewing: Shift A"

### Organization-Level KPIs

**5 KPI Cards in responsive grid (5→2→1):**

**Each card shows:**
- Icon in colored circle (top-left)
- Trend arrow + percentage (top-right)
- KPI label
- Large value display
- "vs. last period" footer

**1. On-Time Delivery**
- TrendingUp icon, green
- Value: 91.5%
- Trend: +3.2% (green)

**2. Downtime Hours**
- AlertTriangle icon, orange
- Value: 12.4 hrs
- Trend: -15.3% (green, improvement)

**3. Avg Utilization**
- Activity icon, blue
- Value: 78.3%
- Trend: +2.1% (green)

**4. Setup Minutes**
- Clock icon, purple
- Value: 487 min
- Trend: -8.5% (green, improvement)

**5. OEE-Lite**
- BarChart3 icon, indigo
- Value: 72.8%
- Trend: +4.7% (green)

**Drilldown Behavior:**
- When shift/machine selected, card values update
- Shows filtered metrics (e.g., Shift A: OTD 94.2%)

### Breakdown by Shift (No filters)

**3 Clickable Shift Cards:**

**Each card:**
- Shift name header (Shift A, B, C)
- "View Details →" link (blue, right)
- 5 metrics in 2-column layout:
  - OTD, Downtime, Utilization, Setup Time, OEE-Lite
- Hover: Border changes to blue, shadow appears
- Click: Selects shift filter

**Example Shift A:**
- OTD: 94.2%
- Downtime: 3.2 hrs
- Utilization: 82.1%
- Setup: 142 min
- OEE: 76.5%

### Breakdown by Machine (No filters)

**Table with all machines:**

**Columns:**
1. Machine (with "Bottleneck" badge for M03)
2. OTD
3. Downtime
4. Utilization
5. Setup
6. OEE
7. Action (View Details button)

**M03 Row:**
- Orange-50 background (highlight)
- Orange badge: "Bottleneck"
- Lowest OTD: 85.4%
- Highest downtime: 5.2 hrs
- Highest utilization: 94.2%

### Info Panel

**Gray-50 background:**
- Title: "About KPIs:"
- 5 bullet points explaining each metric
- Example: "OTD: On-Time Delivery percentage"

---

## OWN-03: Runs Audit / History

**Route:** `/app/audit`

### Features

#### Header Section
- **GitBranch icon** (purple circle)
- **Title:** "Runs Audit & History"
- **Subtitle:** "Track run lineage, triggers, and draft reports"

### Search & Filters Bar

**3 Controls:**

**1. Search Input** (flex-1)
- Search icon (left)
- Placeholder: "Search by run ID, name, or creator..."
- Searches: ID, name, createdBy fields

**2. Status Filter** (dropdown)
- Options: All Statuses, Draft, Pending, Completed, Archived

**3. Trigger Filter** (dropdown)
- Options: All Triggers, Baseline, Reschedule, Event, Manual

### Split Layout (2 panels)

**Left Panel: Runs List**

**Top bar:**
- Gray-50 background
- Count: "5 runs found"

**Each run card:**
- **Selected state:** Purple-50 background, purple-600 left border
- **Name + Draft badge** (yellow if hasDraftReport)
- **Run ID** (font-mono, gray-600)
- **2 Badges:**
  - Trigger badge (blue/purple/orange/gray)
  - Status badge with icon (green/yellow/gray)
- **3 Info Lines:**
  - User icon + Creator name
  - Clock icon + Created timestamp
  - GitBranch icon + Parent run ID (if exists)
- **ChevronRight** (purple if selected, gray otherwise)

**Empty State:**
- AlertCircle icon (large, gray)
- "No runs match your filters"

**Right Panel: Lineage View**

**When run selected:**
- **Header:** "Run Lineage"
- **Lineage chain:** Vertical flow with arrows

**Each lineage node:**
- White card with border
- **Selected node:** Purple-600 border-2, shadow-md
- **Content:**
  - Name + "Selected" badge (purple, conditional)
  - Run ID (font-mono, small)
  - "View →" link (blue, top-right)
  - Trigger + Status badges
  - Draft Report badge (yellow with FileText icon, conditional)
  - User + timestamp
  - "View Draft Report" button (yellow, conditional)
- **Arrow between nodes:**
  - Vertical line + downward triangle
  - Gray-300 color

**Lineage Info Box:**
- White background
- Title: "Lineage Summary:"
- 4 bullet points:
  - Total runs in chain
  - Baseline run ID
  - Latest run ID
  - Draft reports count

**Empty State:**
- GitBranch icon (large, gray, centered)
- "Select a run to view lineage"

### Example Lineage Chain

```
Run v1 (Baseline)
  RUN-20260110-001
  ↓
Run v2 (Rush Order) [SELECTED] [DRAFT REPORT]
  RUN-20260110-002
  ↓
Run v3 (Breakdown Recovery)
  RUN-20260110-003
```

---

## ADM-01: Users & Roles

**Route:** `/app/users`

### Features

#### Header Section
- **Users icon** (blue circle)
- **Title:** "Users & Roles"
- **Subtitle:** "4 active • 1 pending invitation"
- **"Invite User" button** (blue, UserPlus icon)

### Users Table

**Columns:**
1. User (avatar + name + email)
2. Role (Owner/Planner/Supervisor badge)
3. Status (Active/Invited/Inactive badge with icon)
4. Joined (date)
5. Last Active (timestamp or "Pending"/"Never")
6. Actions (Edit + Delete buttons)

**Row Example (Active User):**
- Avatar: 👩‍💼
- Name: Sarah Chen
- Email: sarah.chen@example.com
- Role: Owner (purple badge)
- Status: Active (green badge, CheckCircle2 icon)
- Joined: Dec 1, 2025
- Last Active: Jan 10, 2026 3:30 PM
- Actions: Edit icon (blue) + Delete icon (red)

**Row Example (Invited User):**
- Avatar: 👤
- Name: Alex Thompson
- Email: alex.thompson@example.com
- Role: Supervisor (green badge)
- Status: Invited (yellow badge, Mail icon)
- Joined: Jan 9, 2026
- Last Active: Pending
- Actions: Edit + Delete

**Hover State:**
- Row background: gray-50

### Role Permissions Section

**White panel below table:**
- Title: "Role Permissions"

**3 Role Cards:**

**1. Owner** (purple badge + Shield icon)
- Full system access
- Can view all KPIs, manage users, configure org settings, access audit logs

**2. Planner** (blue badge)
- Production management
- Can create runs, manage schedules, validate inputs, handle events, generate AI briefs

**3. Supervisor** (green badge)
- Shopfloor operations
- Can view schedule, acknowledge tasks, respond to alerts, log actuals, check quality

### Invite User Modal

**Triggered by:** "Invite User" button

**Modal content:**
- **Header:**
  - UserPlus icon (blue circle)
  - Title: "Invite User"
  - Close button (X)
- **3 Form Fields:**
  1. Name (text input, required, placeholder: "John Smith")
  2. Email (email input, required, placeholder: "john.smith@example.com")
  3. Role (dropdown, required, default: Supervisor, options: Supervisor/Planner/Owner)
- **Info Panel (blue-50):**
  - "An invitation email will be sent to {email} with instructions to set up their account."
- **2 Buttons:**
  - Cancel (gray border)
  - Send Invitation (blue, disabled if name/email empty)

### Edit User Modal

**Triggered by:** Edit icon click

**Modal content:**
- **Header:**
  - Title: "Edit User"
  - Close button
- **3 Form Fields:**
  1. Name (editable)
  2. Role (dropdown: Supervisor/Planner/Owner)
  3. Status (dropdown: Active/Invited/Inactive)
- **2 Buttons:**
  - Cancel
  - Save Changes (blue)

### Delete Confirmation Modal

**Triggered by:** Delete icon click

**Modal content:**
- **Header:**
  - Trash2 icon (red circle)
  - Title: "Remove User?"
  - Warning text: "Are you sure you want to remove {name}? This will revoke their access to the system."
- **2 Buttons:**
  - Cancel
  - Remove (red)

---

## ADM-02: Org Settings

**Route:** `/app/settings`

### Features

#### Header Section
- **Settings icon** (indigo circle)
- **Title:** "Organization Settings"
- **Subtitle:** "Configure shifts, thresholds, and integrations"
- **"Save Changes" button** (indigo, Save icon)
  - Loading state: Spinner + "Saving..."

### Shift Templates Section

**Clock icon + "Shift Templates" title**

**3 Shift Cards (A/B/C):**

**Each card (border, padding):**
- **Shift Name** (editable text input)
- **Start Time** (time picker, 2-column grid)
- **End Time** (time picker, 2-column grid)
- **Days of Week** (button toggles)
  - 7 day buttons: Mon-Sun
  - Selected: indigo-600 background, white text
  - Unselected: gray-100 background, gray-700 text
  - Click to toggle

**Example Shift A:**
- Name: "Shift A (Morning)"
- Start: 06:00
- End: 14:00
- Days: Mon, Tue, Wed, Thu, Fri (selected)

### Working Hours Info Panel

**Blue-50 background:**
- Title: "Working Hours Summary:"
- Text: "Total coverage: 24 hours/day, 5 days/week. Shifts configured for Mon-Fri operations."

### KPI Thresholds Section

**AlertTriangle icon + "KPI Thresholds" title**

**5 Threshold Rows (3-column grid):**

**Each row:**
1. Label (text)
2. Number input (editable, with min/max)
3. Help text (gray-600, small)

**1. OTD Target (%)**
- Input: 95
- Min: 0, Max: 100
- Help: "Orders below this target trigger alerts"

**2. Utilization Warning (%)**
- Input: 85
- Min: 0, Max: 100
- Help: "Machines above this are considered bottlenecks"

**3. Downtime Alert (minutes)**
- Input: 30
- Min: 0
- Help: "Downtime exceeding this triggers alerts"

**4. Setup Time Warning (minutes)**
- Input: 120
- Min: 0
- Help: "Setups exceeding this duration require review"

**5. OEE-Lite Target (%)**
- Input: 75
- Min: 0, Max: 100
- Help: "Overall equipment effectiveness goal"

### API Keys & Integrations Section

**Key icon + "API Keys & Integrations" title**

**2 API Key Cards:**

**Each card:**
- **Top row:**
  - Name (left)
  - Eye/EyeOff toggle (right)
- **Key Input:**
  - Type: password (hidden) or text (visible)
  - ReadOnly, font-mono
  - Gray-50 background
  - Example: "sk_live_abc123xyz789..."
- **Metadata:**
  - Last used: Never
  - Created: 2026-01-01

**Example Keys:**
1. "AI Agent API Key"
2. "External Scheduler Integration"

**Security Warning Panel (yellow-50):**
- Title: "⚠️ Security Warning:"
- Text: "API keys are placeholder values for demonstration. In production, store keys securely and never expose them in client-side code."

### Additional Settings Section

**Title: "Additional Settings"**

**3 Toggle Switches:**

**Each toggle:**
- Label + description (left)
- Toggle switch (right)
  - Indigo-600 when on
  - Gray-200 when off

**1. Enable Email Notifications**
- Description: "Send alerts via email"
- Default: On

**2. Auto-generate Shift Briefs**
- Description: "AI brief at start of each shift"
- Default: On

**3. Maintenance Mode**
- Description: "Restrict system access"
- Default: Off

### Info Panel

**Gray-50 background:**
- Title: "Settings Help:"
- 4 bullet points:
  - Shift templates define when each shift operates
  - KPI thresholds determine when alerts are triggered
  - API keys enable external integrations (handle securely)
  - Changes take effect immediately after saving

---

## User Workflows

### Workflow 1: Drill Down by Shift

```
1. Owner logs in → Navigate to Metrics
2. See org-level KPIs
3. Review "Breakdown by Shift" cards
4. Notice Shift C has lower OTD (89.1%)
5. Click on Shift C card
6. Filter activates: "Viewing: Shift C"
7. All 5 KPI cards update with Shift C data
8. Review performance
9. Click "Clear Filters" to return to org view
```

### Workflow 2: Investigate Bottleneck Machine

```
1. From KPI Overview
2. Scroll to "Breakdown by Machine" table
3. See M03 highlighted (orange background)
4. Note: 85.4% OTD, 94.2% utilization, 5.2 hrs downtime
5. Click "View Details" on M03 row
6. Machine filter activates
7. All KPIs show M03-specific metrics
8. Identify need for maintenance
9. Navigate to Settings → Adjust thresholds if needed
```

### Workflow 3: Audit Run Lineage

```
1. Navigate to /app/audit (Runs Audit & History)
2. See list of 5 runs
3. Click on "Run v2 (Rush Order)" with Draft badge
4. Right panel shows lineage:
   - Run v1 (Baseline - parent)
   - Run v2 (Rush Order - SELECTED, has draft)
   - Run v3 (Breakdown Recovery - child)
5. Click "View Draft Report" yellow button
6. Navigate to AGT-02 (Draft Impact Report Assistant)
7. Review impact analysis
8. Click "Continue Wizard" to resume
```

### Workflow 4: Search for Specific Run

```
1. From Runs Audit page
2. Type "breakdown" in search bar
3. List filters to: Run v3 (Breakdown Recovery)
4. Select run to view lineage
5. Clear search to see all runs
6. Filter by Status: Completed
7. Filter by Trigger: Event
8. See only event-triggered completed runs
```

### Workflow 5: Invite New User

```
1. Navigate to /app/users (Users & Roles)
2. See header: "4 active • 1 pending invitation"
3. Click "Invite User" button
4. Modal opens
5. Fill form:
   - Name: "John Smith"
   - Email: "john.smith@example.com"
   - Role: Supervisor
6. See info panel: "An invitation email will be sent..."
7. Click "Send Invitation"
8. Modal closes
9. Table updates: New user with "Invited" status
10. Header updates: "4 active • 2 pending invitation"
```

### Workflow 6: Edit User Role

```
1. From Users & Roles page
2. Find "Priya Patel" (Supervisor)
3. Click Edit icon
4. Modal opens with current values
5. Change Role: Supervisor → Planner
6. Keep Status: Active
7. Click "Save Changes"
8. Modal closes
9. Table updates: Priya now has blue "Planner" badge
```

### Workflow 7: Configure Shift Templates

```
1. Navigate to /app/settings
2. Scroll to "Shift Templates" section
3. Find Shift A card
4. Edit Start Time: 06:00 → 07:00
5. Click Saturday button to add weekend coverage
6. See Saturday button turn indigo
7. Scroll to Additional Settings
8. Toggle "Maintenance Mode" to ON
9. Scroll to top
10. Click "Save Changes" (indigo button)
11. See loading state: "Saving..."
12. Settings saved successfully
```

### Workflow 8: Adjust KPI Thresholds

```
1. From Org Settings page
2. Scroll to "KPI Thresholds" section
3. Review current thresholds
4. Notice M03 often exceeds 85% utilization
5. Change Utilization Warning: 85 → 90
6. Rationale: M03 is expected bottleneck, reduce noise
7. Also adjust Downtime Alert: 30 → 45 min
8. Scroll to top
9. Click "Save Changes"
10. New thresholds take effect immediately
```

---

## Testing Checklist

### KPI Overview (OWN-01)

**Header & Filters:**
- [ ] Title and icon display
- [ ] Shift filter dropdown works
- [ ] Machine filter dropdown works
- [ ] Filters are mutually exclusive
- [ ] Clear Filters button appears when needed
- [ ] Clear Filters resets both

**KPI Cards:**
- [ ] 5 cards render
- [ ] Icons colored correctly
- [ ] Trend arrows correct (up/down)
- [ ] Trend percentages display
- [ ] Values show org-wide by default

**Drilldown:**
- [ ] Active filter banner shows
- [ ] Card values update when filtered
- [ ] Shift drilldown shows shift-specific data
- [ ] Machine drilldown shows machine-specific data

**Shift Breakdown:**
- [ ] 3 shift cards render
- [ ] Cards show 5 metrics each
- [ ] Hover effect works
- [ ] Click sets shift filter

**Machine Breakdown:**
- [ ] Table renders all machines
- [ ] M03 highlighted (orange background)
- [ ] M03 has "Bottleneck" badge
- [ ] View Details sets machine filter

### Runs Audit (OWN-03)

**Search & Filters:**
- [ ] Search input works
- [ ] Searches ID, name, creator
- [ ] Status filter works
- [ ] Trigger filter works
- [ ] Filters combine correctly

**Runs List:**
- [ ] All runs render
- [ ] Count displays correctly
- [ ] Draft badge shows conditionally
- [ ] Status icons correct
- [ ] Click selects run
- [ ] Selected state styles apply

**Lineage View:**
- [ ] Shows when run selected
- [ ] Empty state when none selected
- [ ] Lineage chain builds correctly
- [ ] Parent → Child arrows display
- [ ] Selected node highlighted
- [ ] "View →" links work
- [ ] "View Draft Report" button conditional
- [ ] Lineage summary accurate

### Users & Roles (ADM-01)

**Users Table:**
- [ ] All users render
- [ ] Avatars display
- [ ] Role badges colored correctly
- [ ] Status badges show icons
- [ ] Last Active displays correctly
- [ ] Edit button opens modal
- [ ] Delete button opens modal
- [ ] Hover effect works

**Invite Modal:**
- [ ] Opens on button click
- [ ] Form fields work
- [ ] Role dropdown populates
- [ ] Validation works (required fields)
- [ ] Info panel shows email
- [ ] Send Invitation adds user
- [ ] Close button works

**Edit Modal:**
- [ ] Opens with user data
- [ ] Fields editable
- [ ] Save updates user
- [ ] Cancel closes without changes

**Delete Modal:**
- [ ] Opens with user name
- [ ] Warning displays
- [ ] Remove deletes user
- [ ] Cancel closes

**Role Permissions:**
- [ ] 3 role cards render
- [ ] Descriptions accurate
- [ ] Shield icon for Owner

### Org Settings (ADM-02)

**Shift Templates:**
- [ ] 3 shift cards render
- [ ] Name input editable
- [ ] Time pickers work
- [ ] Day toggles functional
- [ ] Selected days highlighted

**KPI Thresholds:**
- [ ] 5 threshold rows render
- [ ] Number inputs editable
- [ ] Min/max validation works
- [ ] Help text displays

**API Keys:**
- [ ] 2 key cards render
- [ ] Keys hidden by default
- [ ] Eye icon toggles visibility
- [ ] Keys show when visible
- [ ] ReadOnly enforced
- [ ] Font-mono styling

**Additional Settings:**
- [ ] 3 toggles render
- [ ] Toggle switches work
- [ ] Default states correct
- [ ] Visual feedback on toggle

**Save Button:**
- [ ] Button enabled
- [ ] Click shows loading state
- [ ] Spinner animates
- [ ] "Saving..." text shows
- [ ] Success state (in console for demo)

---

## Design Tokens

### Colors

```css
/* OWN-01 KPI Overview */
KPI Icon Colors:
  OTD:          text-green-700, bg-green-100
  Downtime:     text-orange-700, bg-orange-100
  Utilization:  text-blue-700, bg-blue-100
  Setup:        text-purple-700, bg-purple-100
  OEE:          text-indigo-700, bg-indigo-100

Bottleneck:     bg-orange-50, border-orange-200

/* OWN-03 Runs Audit */
Selected Run:   bg-purple-50, border-l-purple-600
Lineage Border: border-purple-600 (selected), border-gray-200

Trigger Badges:
  Baseline:     bg-blue-100, text-blue-700
  Reschedule:   bg-purple-100, text-purple-700
  Event:        bg-orange-100, text-orange-700
  Manual:       bg-gray-100, text-gray-700

Status Badges:
  Completed:    bg-green-100, text-green-700
  Pending:      bg-yellow-100, text-yellow-700
  Archived:     bg-gray-100, text-gray-700

/* ADM-01 Users */
Role Badges:
  Owner:        bg-purple-100, text-purple-700
  Planner:      bg-blue-100, text-blue-700
  Supervisor:   bg-green-100, text-green-700

Status Badges:
  Active:       bg-green-100, text-green-700
  Invited:      bg-yellow-100, text-yellow-700
  Inactive:     bg-gray-100, text-gray-700

/* ADM-02 Settings */
Primary Color:  indigo-600
Day Toggle On:  indigo-600
Day Toggle Off: gray-100
```

---

## API Integration Points

**KPI Overview:**
```typescript
GET /api/metrics/overview?shift={A|B|C|all}&machine={M01|...|all}
Response: { kpis: KPIData[], shiftData, machineData }
```

**Runs Audit:**
```typescript
GET /api/runs/audit?search=&status=&trigger=
Response: { runs: RunRecord[] }

GET /api/runs/:runId/lineage
Response: { lineage: RunRecord[] }
```

**Users & Roles:**
```typescript
GET /api/users
POST /api/users/invite { name, email, role }
PUT /api/users/:userId { name, role, status }
DELETE /api/users/:userId
```

**Org Settings:**
```typescript
GET /api/settings/org
PUT /api/settings/org { shifts, thresholds, additionalSettings }

GET /api/settings/api-keys (masked)
PUT /api/settings/api-keys/:keyId/toggle-visibility
```

---

**Complete Owner/Admin dashboard with governance, audit, and configuration capabilities!** 🎯
