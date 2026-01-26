# AGT-01, AGT-02, AGT-03: AI Agent Screens Guide

## Overview

AI-powered screens with evidence grounding for transparency and trust:

1. **AGT-01: Shift-Start Brief** - AI-generated brief for completed run with evidence
2. **AGT-02: Draft Impact Report Assistant** - Resume draft from wizard with evidence
3. **AGT-03: Explain Chat** - Q&A interface with suggested questions and evidence drawer

---

## AGT-01: Shift-Start Brief

**Route:** `/app/runs/:runId/brief`

### Features

#### Header Section
- **Back to Run Detail** navigation
- **🤖 AI icon** (gradient blue/purple background)
- **Title:** "AI Shift-Start Brief"
- **Subtitle:** "Run v2 (RUN-20260110-002) • Generated 07:55 • Shift A"

### Summary Card

**Gradient panel (blue-50 to purple-50):**
- **Title:** "Shift Summary"
- **Description paragraph:** High-level overview
- **4 Stat Cards:**
  - Late Orders: 2 (red)
  - Bottleneck: 1 (orange)
  - Actions: 2 (blue)
  - Risks: 1 (purple)

### Brief Sections (4 sections)

**Each section includes:**
- Colored header bar with icon and title
- Item count badge
- Numbered claims list
- "View Evidence" button per claim

**1. Top Late Orders** (Clock icon, red)
- Claim 1: ORD-1234 will miss 16:00 deadline by 45 minutes due to M03 setup delay
  - Evidence: Due time, Op 2 status
- Claim 2: ORD-1238 delayed 120 minutes, waiting for M03 after breakdown
  - Evidence: Breakdown event, queued operation

**2. Bottleneck: M03 Press** (Settings icon, orange)
- Claim 3: M03 running at 94.2% utilization (above 85% threshold)
  - Evidence: Utilization KPI
- Claim 4: M03 has longest queue (5 ops) due to hydraulic failure
  - Evidence: Breakdown event, queue depth

**3. Recommended Actions** (Lightbulb icon, blue)
- Claim 5: Prioritize M03 maintenance check before next shift
  - Evidence: Breakdown event
- Claim 6: Consider splitting small batches to alternative machines
  - Evidence: Queue depth, utilization

**4. Shift Risks** (ShieldAlert icon, purple)
- Claim 7: If M03 breaks down again, 3 additional orders will become late
  - Evidence: Utilization, queue depth

### Info Panel

**Gray background footer:**
- Title: "About this brief:"
- Description: Explains AI-generated analysis, grounding in evidence

### Evidence Drawer (Slide-out)

**Triggered by:** "View Evidence" button clicks

**Drawer Structure:**
- **Header (blue-600 background):**
  - FileText icon
  - Title: "Evidence"
  - Count: X items
  - Close button (X icon)
- **Content area:**
  - Scrollable evidence cards
  - Each card shows:
    - Type badge (KPI/Schedule/Event/Operation)
    - Card number (#1, #2, etc.)
    - Label (e.g., "ORD-1234 Due Time")
    - Value (large, e.g., "16:00")
    - Context (gray text, additional details)
- **Footer (gray-50 background):**
  - Close button (full-width, gray)

**Evidence Types:**
- **KPI:** Blue badge (e.g., "M03 Utilization: 94.2%")
- **Schedule:** Green badge (e.g., "ORD-1234 Op 2 Schedule")
- **Event:** Orange badge (e.g., "M03 Breakdown")
- **Operation:** Purple badge (e.g., "ORD-1234 Op 2 on M03")

**7 Sample Evidence Items:**
1. ORD-1234 Due Time: 16:00 (context: projected 16:45)
2. ORD-1234 Op 2 Schedule: Started 11:15 (context: 30 min late)
3. M03 Breakdown: 11:30 - Hydraulic failure (context: 30 min downtime)
4. ORD-1234 Op 2 on M03: In Progress (context: 65% complete)
5. M03 Utilization: 94.2% (context: above 85% threshold)
6. M03 Queue Depth: 5 operations (context: highest on shopfloor)
7. ORD-9998 inserted: 09:30 (context: increased M03 load)

---

## AGT-02: Draft Impact Report Assistant

**Route:** `/app/runs/:runId/draft-assistant`

### Features

#### Header Section
- **Back to Run Detail** navigation
- **🤖 AI icon** (gradient purple/pink background)
- **Title:** "Draft Impact Report"
- **"Draft" badge** (yellow)
- **Subtitle:** "Auto-saved from Wizard Step 2 • Event: Rush Order (ORD-9999)"

**Action Buttons (right side):**
1. **Discard Draft** (red border, Trash2 icon)
2. **Continue Wizard** (blue, Play icon) → Step 3

### Alert Banner

**Yellow-50 background:**
- Clock icon
- **Title:** "Partial draft auto-saved"
- **Description:** Explains auto-save from Step 2, can continue or discard

### Event Context Card

**White background, grid layout:**
- Event Type: Rush Order
- Order ID: ORD-9999 (font-mono)
- Insertion Time: 2026-01-10 14:00
- Parent Run: Run v2 (RUN-20260110-002)

### Impact Analysis Section

**3 Impact Items:**

**Each item shows:**
- Icon in colored circle (left)
- Category title + severity badge
- Description paragraph
- "View Evidence" button

**1. Late Orders** (High Impact, red)
- AlertTriangle icon
- Description: 4 orders will become late, pushed 45-90 minutes
- Evidence: Rush order event, affected orders list

**2. OTD Degradation** (High Impact, red)
- AlertTriangle icon
- Description: OTD will drop by 12.3% (93.2% → 80.9%)
- Evidence: OTD KPI delta, affected orders

**3. Bottleneck Impact** (Medium Impact, orange)
- TrendingDown icon
- Description: M03 queue will increase by 3 ops, +135 min wait
- Evidence: M03 queue increase

**Severity Badges:**
- High Impact: bg-red-100, text-red-700
- Medium Impact: bg-orange-100, text-orange-700
- Low Impact: bg-yellow-100, text-yellow-700

### Overall Impact Summary

**Gradient panel (red-50 to orange-50):**
- **Title:** "Overall Impact Summary"
- **Description:** Explains significant impact, OTD drop, late orders, bottleneck pressure
- **Alert row:** AlertTriangle icon + "High-impact event requiring immediate attention"

### Next Steps Panel

**White background:**
- **Title:** "Next Steps"
- **2 numbered steps:**
  1. Click "Continue Wizard" to proceed to Step 3
  2. Or click "Discard Draft" to abandon reschedule

### Evidence Drawer

**Same structure as AGT-01, but purple-600 header:**
- Title: "Evidence References"
- **4 Sample Evidence Items:**
  1. Rush Order Event: ORD-9999 added at 14:00 (context: high priority)
  2. OTD Impact: -12.3% (context: expected drop)
  3. Affected Orders: 4 orders (context: ORD-1240, 1241, 1242, 1243)
  4. M03 Queue Increase: +3 operations (context: queue extended 135 min)

### Discard Confirmation Modal

**Triggered by:** "Discard Draft" button

**Modal content:**
- Trash2 icon (red circle)
- **Title:** "Discard Draft Report?"
- **Warning:** Explains permanent deletion, need to start over
- **Two buttons:**
  - Cancel (gray border)
  - Discard (red, confirms action)

---

## AGT-03: Explain Chat

**Route:** `/app/agent/chat`

### Features

#### Header Section
- **Back** navigation (goes to previous page)
- **🤖 AI icon** (gradient green/blue background)
- **Title:** "Ask AI Agent"
- **Subtitle:** "Get explanations grounded in production data"

### Welcome Screen (No messages yet)

**Gradient panel (blue-50 to green-50):**
- Lightbulb icon
- **Title:** "How can I help?"
- **Description:** Explains AI answers are grounded in data with evidence

**Suggested Questions (4 cards in 2×2 grid):**
1. ⏰ "Why is ORD-1234 running late?"
2. ⚙️ "Why is M03 overloaded?"
3. 📉 "What caused the OTD drop this week?"
4. ⚠️ "Which orders are at risk today?"

**Interaction:** Click card → fills input field

### Chat Messages

**User Messages (right-aligned):**
- Blue-600 background
- White text
- Timestamp (bottom, blue-100 text)

**AI Messages (left-aligned):**
- White background with border
- 🤖 icon + "AI Agent" label (top)
- Gray-900 text
- Multi-line content (whitespace-pre-line)
- "View Evidence" button (if evidence available)
- Timestamp (bottom, gray-500 text)

**Example Question & Answer:**

**Q:** "Why is ORD-1234 running late?"

**A:** 
```
ORD-1234 (Widget A Production) is running late due to a combination of factors:

1. **Setup Delay**: Op 2 started 30 minutes late (11:15 instead of 10:45) because the previous changeover on M03 took longer than planned.

2. **M03 Breakdown**: At 11:30, M03 experienced a hydraulic system failure causing 30 minutes of downtime. This directly impacted Op 2 which was in progress.

3. **Current Status**: Op 2 is now 65% complete and expected to finish at 13:30. The order is projected to complete at 16:45, missing the 16:00 deadline by 45 minutes.

The primary root cause is the M03 bottleneck combined with the unexpected breakdown event.
```

**Evidence:** 4 items (due time, schedule, event, operation)

### Fallback Message (No matching data)

**When question not recognized:**
```
I don't have enough information to answer that question with confidence. This could be because:

1. The data for this specific query hasn't been processed yet
2. The question is outside my current knowledge scope
3. More context is needed to provide an accurate answer

Please try rephrasing your question or ask about specific orders, machines, or events that I have data for.
```

**No evidence button shown**

### Loading Indicator

**While processing:**
- White bubble on left
- 3 pulsing dots (blue-600)
- "Analyzing..." text

### Input Area (Fixed bottom)

**White background, full-width:**
- Text input field (flex-1)
- Placeholder: "Ask a question about production..."
- Send button (blue-600, Send icon)
- Disabled states: Gray when empty or loading

### Evidence Drawer

**Same structure as previous screens, but green-600 header:**
- Title: "Evidence References"
- Content: Scrollable evidence cards
- **4 Evidence Types:**
  - KPI Delta (blue)
  - Schedule Row (green)
  - Event (orange)
  - Operation (purple)

**Empty State:**
- AlertCircle icon (gray, large)
- Title: "No Evidence Available"
- Message: "Evidence data is missing for this response..."

---

## User Workflows

### Workflow 1: View Shift Brief

```
1. Navigate to Run Detail for completed Run v2
2. Click "AI Brief" button (in header or actions)
3. Navigate to AGT-01 (Shift-Start Brief)
4. Review summary card: 2 late, 1 bottleneck
5. Scroll through 4 sections
6. Click "View Evidence" on Late Orders claim
7. Evidence drawer slides in from right
8. Review 2 evidence items with context
9. Close drawer
10. Review all sections, note recommendations
```

### Workflow 2: Resume Draft Impact Report

```
1. Navigate to Run Detail (parent run)
2. See yellow banner: "Draft report available"
3. Click "View Draft" button
4. Navigate to AGT-02 (Draft Impact Report Assistant)
5. See yellow alert: "Partial draft auto-saved"
6. Review Event Context: Rush order ORD-9999
7. Review 3 impact items: Late orders, OTD, Bottleneck
8. Click "View Evidence" on OTD item
9. Drawer opens, shows OTD delta: -12.3%
10. Close drawer
11. Click "Continue Wizard" (blue button)
12. Navigate to PLN-09 Step 3 (Review & Generate)
```

### Workflow 3: Ask "Why Late?" from Order Detail

```
1. Navigate to Order Detail for ORD-1234
2. See order is late (red status)
3. Click "Why Late?" button (orange, Cpu icon)
4. Navigate to AGT-03 with pre-filled question
5. Input shows: "Why is order ORD-1234 running late?"
6. Click Send
7. Loading indicator appears
8. AI response appears with 3 factors
9. Click "View Evidence (4)"
10. Drawer opens with evidence cards
11. Review: Due time, schedule, event, operation
12. Close drawer
13. Ask follow-up: "How to prevent this?"
```

### Workflow 4: Explore Suggested Questions

```
1. Navigate to AGT-03 (from dashboard link or menu)
2. See welcome screen with 4 suggested questions
3. Click "Why is M03 overloaded?" card
4. Input field fills with question
5. Click Send
6. AI explains: High utilization, long queue, recent events
7. View evidence: Utilization KPI, queue depth, rush order
8. Try another question: "Which orders are at risk today?"
9. Get response or fallback message
```

### Workflow 5: Discard Draft Report

```
1. From AGT-02 (Draft Impact Report Assistant)
2. Decide not to continue with reschedule
3. Click "Discard Draft" (red border button)
4. Modal appears: "Discard Draft Report?"
5. Read warning about permanent deletion
6. Click "Discard" (red button)
7. Draft deleted, navigate back to Run Detail
8. Yellow banner removed, no draft available
```

---

## Testing Checklist

### Shift-Start Brief (AGT-01)

**Header:**
- [ ] Back button navigates
- [ ] 🤖 icon with gradient
- [ ] Title displays
- [ ] Run info accurate

**Summary Card:**
- [ ] Gradient background
- [ ] Summary text shows
- [ ] 4 stat cards render
- [ ] Numbers colored correctly

**Brief Sections:**
- [ ] 4 sections render
- [ ] Headers colored (red/orange/blue/purple)
- [ ] Icons appropriate
- [ ] Item counts accurate
- [ ] Claims numbered
- [ ] "View Evidence" buttons work

**Evidence Drawer:**
- [ ] Opens on button click
- [ ] Slides in from right
- [ ] Blue header with title
- [ ] Close button works
- [ ] Evidence cards render
- [ ] Type badges colored
- [ ] Context text shows
- [ ] Scrolls if needed
- [ ] Overlay closes drawer

### Draft Impact Report Assistant (AGT-02)

**Header:**
- [ ] Back button works
- [ ] "Draft" badge shows (yellow)
- [ ] Two action buttons visible
- [ ] "Continue Wizard" navigates
- [ ] "Discard Draft" opens modal

**Alert Banner:**
- [ ] Yellow background
- [ ] Clock icon shows
- [ ] Text explains auto-save

**Event Context:**
- [ ] 4 fields display
- [ ] Order ID font-mono

**Impact Analysis:**
- [ ] 3 items render
- [ ] Icons colored
- [ ] Severity badges correct
- [ ] Evidence buttons work

**Summary Panel:**
- [ ] Gradient background
- [ ] AlertTriangle shows
- [ ] Text clear

**Discard Modal:**
- [ ] Opens on button click
- [ ] Warning clear
- [ ] Cancel works
- [ ] Discard confirms + navigates

**Evidence Drawer:**
- [ ] Purple header
- [ ] 4 evidence items
- [ ] Types correct
- [ ] Close works

### Explain Chat (AGT-03)

**Header:**
- [ ] Back button works
- [ ] 🤖 icon gradient
- [ ] Title shows

**Welcome Screen:**
- [ ] Gradient panel renders
- [ ] Lightbulb icon shows
- [ ] 4 suggested questions
- [ ] Click fills input

**Chat Interaction:**
- [ ] Input field works
- [ ] Send button enables/disables
- [ ] Loading indicator shows
- [ ] User message right-aligned
- [ ] User message blue
- [ ] AI message left-aligned
- [ ] AI message white background
- [ ] 🤖 label shows
- [ ] Multi-line formatting works
- [ ] Timestamps display

**Responses:**
- [ ] Matching question gets response
- [ ] Non-matching gets fallback
- [ ] Evidence button conditional
- [ ] Evidence count accurate

**Evidence Drawer:**
- [ ] Green header
- [ ] Evidence cards render
- [ ] Empty state shows if no evidence
- [ ] AlertCircle icon for empty
- [ ] Close button works

**Scrolling:**
- [ ] Messages auto-scroll to bottom
- [ ] Chat area scrollable
- [ ] Evidence drawer scrollable

---

## Design Tokens

### AI Agent Colors

```css
Brief Icon:       gradient blue-100 to purple-100
Draft Icon:       gradient purple-100 to pink-100
Chat Icon:        gradient green-100 to blue-100
```

### Evidence Drawer Headers

```css
Brief:   bg-blue-600
Draft:   bg-purple-600
Chat:    bg-green-600
```

### Evidence Type Badges

```css
KPI Delta:        bg-blue-100, text-blue-700
Schedule Row:     bg-green-100, text-green-700
Event:            bg-orange-100, text-orange-700
Operation:        bg-purple-100, text-purple-700
```

### Severity Colors

```css
High Impact:      bg-red-100, text-red-700
Medium Impact:    bg-orange-100, text-orange-700
Low Impact:       bg-yellow-100, text-yellow-700
```

### Chat Messages

```css
User Message:     bg-blue-600, text-white
AI Message:       bg-white, border-gray-200, text-gray-900
Loading Dots:     bg-blue-600, animate-pulse
```

---

## API Integration Points

**Shift Brief:**
```typescript
GET /api/agent/brief/:runId
Response: { summary, sections: ClaimSection[], evidence: Evidence[] }
```

**Draft Report:**
```typescript
GET /api/agent/draft-report/:runId
POST /api/agent/draft-report/:runId/discard
Response: { event, impacts: ImpactItem[], evidence: Evidence[] }
```

**Explain Chat:**
```typescript
POST /api/agent/chat
Body: { query: string, context?: { runId, orderId, machineId } }
Response: { answer: string, evidenceIds: string[], evidence: Evidence[] }
```

---

**Complete AI agent integration with evidence grounding for transparency and trust!** 🤖
