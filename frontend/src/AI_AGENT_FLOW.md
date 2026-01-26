# AI Agent Node Flow Documentation

This document describes the AI agent system flow for production schedule briefing and Q&A.

## Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        TRIGGER EVENTS                            │
│  • Generate Brief (Planner)                                     │
│  • Ask "Why" Question (Supervisor)                              │
│  • Regenerate Brief                                             │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   LOAD RUN ARTIFACTS                             │
│  • Schedule (all versions)                                       │
│  • KPIs (current & deltas)                                      │
│  • Events log                                                   │
│  • Operations timeline                                          │
│  • Machine utilization                                          │
│  • Order statuses                                               │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EVIDENCE BUILDER                              │
│                                                                  │
│  1. Identify Deltas                                             │
│     • KPI changes between versions                              │
│     • Schedule modifications                                    │
│     • Setup time improvements                                   │
│                                                                  │
│  2. Detect Bottlenecks                                          │
│     • High utilization machines (>90%)                          │
│     • Critical path operations                                  │
│     • Resource conflicts                                        │
│                                                                  │
│  3. Track Late Orders                                           │
│     • Orders past deadline                                      │
│     • At-risk orders (buffer < 30 min)                         │
│     • Root cause events                                         │
│                                                                  │
│  4. Extract Schedule Changes                                    │
│     • Rush order insertions                                     │
│     • Machine reassignments                                     │
│     • Event-triggered reschedules                               │
│                                                                  │
│  Output: Structured Evidence Objects                            │
│  {                                                              │
│    id: string,                                                  │
│    type: 'kpi-delta' | 'bottleneck' | 'late-order' |          │
│          'schedule-change',                                     │
│    description: string,                                         │
│    source: string,                                             │
│    data: { ... }                                               │
│  }                                                              │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LLM PROCESSING                              │
│                                                                  │
│  Prompt Construction:                                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ System: You are a production scheduling analyst.          │ │
│  │ Use only the provided evidence. Do not hallucinate IDs.   │ │
│  │                                                            │ │
│  │ Context:                                                   │ │
│  │ - Run: {date} Shift {shift} v{version}                   │ │
│  │ - Evidence: {evidence_objects}                            │ │
│  │                                                            │ │
│  │ Task: {user_question OR generate_brief}                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  LLM Response → Structured Output                               │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                       VALIDATOR                                  │
│                                                                  │
│  1. No Hallucinated IDs                                         │
│     • Verify all order IDs exist in evidence                   │
│     • Verify all machine IDs exist                             │
│     • Reject if unknown entities mentioned                     │
│                                                                  │
│  2. Evidence Grounding                                          │
│     • Each claim must cite evidence ID                         │
│     • Check evidence supports claim                            │
│     • Flag unsupported assertions                              │
│                                                                  │
│  3. Completeness Check                                          │
│     • All required sections present (brief)                    │
│     • Answer addresses question (Q&A)                          │
│     • Evidence links provided                                  │
│                                                                  │
│  If Validation Fails → Fallback Response                        │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FALLBACK HANDLER                               │
│                                                                  │
│  Triggered when:                                                │
│  • Validation fails                                             │
│  • Evidence insufficient                                        │
│  • LLM error                                                   │
│                                                                  │
│  Fallback Response:                                             │
│  "I don't have enough evidence to answer confidently.          │
│   Available data shows:                                         │
│   - {available_evidence_summary}                               │
│   Please check the schedule/events directly for details."      │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PERSIST & DISPLAY                             │
│                                                                  │
│  1. Save to Database                                            │
│     • Brief text + sections                                    │
│     • Evidence links                                            │
│     • Trace log (for audit)                                    │
│     • Timestamp + version                                      │
│                                                                  │
│  2. Display to User                                             │
│     Brief Mode:                                                 │
│     ┌─────────────────────────────────────────────────────┐   │
│     │ Schedule Summary                                     │   │
│     │ Version 2 schedules 12 orders...                    │   │
│     │ [2 evidence links] ───►                             │   │
│     ├─────────────────────────────────────────────────────┤   │
│     │ Key Changes from v1                                 │   │
│     │ Rush order ORD-2402 inserted...                     │   │
│     │ [3 evidence links] ───►                             │   │
│     └─────────────────────────────────────────────────────┘   │
│                                                                  │
│     Q&A Mode:                                                   │
│     ┌─────────────────────────────────────────────────────┐   │
│     │ User: Why is ORD-2402 late?                         │   │
│     │ AI: Order at risk due to 3 factors:                │   │
│     │ 1. M-103 downtime (45 min) [evidence ───►]         │   │
│     │ 2. Rush insertion increased utilization [───►]     │   │
│     │ 3. Tight buffer (15 min) consumed [───►]           │   │
│     └─────────────────────────────────────────────────────┘   │
│                                                                  │
│  3. Feedback Collection                                         │
│     • [Useful] / [Not Useful] buttons                          │
│     • Store feedback for model improvement                     │
└─────────────────────────────────────────────────────────────────┘
```

## Node Details

### 1. Trigger Events
**Inputs**: User action (button click, question submission)
**Outputs**: Run ID, version, action type
**Error Handling**: None (user-initiated)

### 2. Load Run Artifacts
**Inputs**: Run ID, version
**Outputs**: Complete run data object
**Error Handling**: 
- Run not found → show error message
- Missing artifacts → use partial data + flag in evidence

### 3. Evidence Builder
**Algorithm**:
```typescript
function buildEvidence(run, schedule, kpis, events) {
  const evidence = [];
  
  // KPI Deltas
  if (run.version > 1) {
    const prevKPIs = loadKPIs(run.id, run.version - 1);
    for (const kpi of kpis) {
      const delta = kpi.value - prevKPIs[kpi.name].value;
      if (Math.abs(delta) > THRESHOLD) {
        evidence.push({
          type: 'kpi-delta',
          description: `${kpi.name}: ${delta}`,
          data: { kpiName: kpi.name, v1: prevKPIs[kpi.name].value, v2: kpi.value }
        });
      }
    }
  }
  
  // Bottlenecks
  const machines = groupByMachine(schedule);
  for (const [machineId, ops] of machines) {
    const utilization = calculateUtilization(ops);
    if (utilization > 90) {
      evidence.push({
        type: 'bottleneck',
        description: `${machineId} utilization: ${utilization}%`,
        data: { machineId, utilization, operations: ops.length }
      });
    }
  }
  
  // Late Orders
  const now = new Date();
  for (const op of schedule) {
    if (new Date(op.endTime) > orderDeadline(op.orderId)) {
      evidence.push({
        type: 'late-order',
        description: `${op.orderId} late by ${minutes} min`,
        data: { orderId: op.orderId, delay: minutes }
      });
    }
  }
  
  // Schedule Changes
  for (const event of events) {
    if (event.triggeredReschedule) {
      evidence.push({
        type: 'schedule-change',
        description: event.description,
        data: { eventId: event.id, type: event.type }
      });
    }
  }
  
  return evidence;
}
```

### 4. LLM Processing
**Model**: GPT-4 or equivalent
**Temperature**: 0.3 (deterministic)
**Max Tokens**: 1500
**Stop Sequences**: None

**System Prompt**:
```
You are a production scheduling analyst for a manufacturing plant.
Analyze the provided schedule data and evidence to answer questions.

STRICT RULES:
1. Use ONLY the evidence provided. Do not make up order IDs, machine IDs, or events.
2. Every claim must reference an evidence ID.
3. If evidence is insufficient, say "I don't have enough data" rather than speculate.
4. Format evidence references as [evidence ID].

Evidence format:
{
  id: "ev-001",
  type: "kpi-delta" | "bottleneck" | "late-order" | "schedule-change",
  description: "...",
  data: { ... }
}
```

### 5. Validator
**Validation Checks**:

```typescript
function validate(response, evidence) {
  const errors = [];
  
  // Extract mentioned entities
  const mentionedOrders = extractOrderIds(response.content);
  const mentionedMachines = extractMachineIds(response.content);
  const mentionedEvidence = extractEvidenceRefs(response.content);
  
  // Check all orders exist
  for (const orderId of mentionedOrders) {
    if (!evidence.some(e => e.data.orderId === orderId)) {
      errors.push(`Unknown order: ${orderId}`);
    }
  }
  
  // Check all machines exist
  for (const machineId of mentionedMachines) {
    if (!evidence.some(e => e.data.machineId === machineId)) {
      errors.push(`Unknown machine: ${machineId}`);
    }
  }
  
  // Check evidence citations
  for (const evidenceId of mentionedEvidence) {
    if (!evidence.some(e => e.id === evidenceId)) {
      errors.push(`Invalid evidence reference: ${evidenceId}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}
```

### 6. Fallback Handler
**Fallback Types**:

1. **Insufficient Evidence**:
   ```
   "I can only see limited data for this run. Available:
   - 3 KPI metrics
   - 12 schedule operations
   Please check the full schedule view for complete details."
   ```

2. **Validation Failed**:
   ```
   "I found a potential answer but couldn't verify all details 
   against the schedule. Please review the schedule/events tabs 
   directly for accurate information."
   ```

3. **LLM Error**:
   ```
   "The analysis service is temporarily unavailable. 
   You can still view all data in the Schedule, KPIs, 
   and Events tabs."
   ```

### 7. Persist & Display
**Database Schema**:
```sql
CREATE TABLE agent_briefs (
  id UUID PRIMARY KEY,
  run_id UUID REFERENCES runs(id),
  version INT,
  generated_at TIMESTAMP,
  sections JSONB,  -- [{title, content, evidenceIds}]
  evidence_links JSONB,  -- [{id, type, description, source, data}]
  feedback VARCHAR,  -- 'useful' | 'not-useful'
  trace_log JSONB  -- Full execution log for debugging
);
```

**UI Components**:
- Brief sections with collapsible evidence
- Evidence drawer (slide-out panel)
- Feedback buttons
- Regenerate option

## Key Design Decisions

### Why Evidence-Based?
- **Hallucination Prevention**: Manufacturing requires 100% accuracy on IDs/dates
- **Audit Trail**: Every claim traceable to source data
- **User Trust**: Transparency in AI reasoning

### Why Fallback Responses?
- **Safety**: Better to say "I don't know" than give wrong answer
- **User Experience**: Graceful degradation maintains trust
- **System Reliability**: Handles edge cases without breaking

### Why Version Tracking?
- **Reproducibility**: Can regenerate any brief from stored artifacts
- **Comparison**: Users can see how AI analysis changed with each reschedule
- **Debugging**: Trace logs help improve prompts

## Example Flow: "Why is ORD-2402 late?"

1. **Trigger**: Supervisor clicks "Explain why late?" on order detail
2. **Load**: Fetch run-001, schedule, events, KPIs
3. **Evidence**: 
   - `ev-001`: M-103 downtime event (45 min)
   - `ev-002`: Rush order insertion at 08:30
   - `ev-003`: ORD-2402 buffer only 15 min
4. **LLM**: Generate explanation citing ev-001, ev-002, ev-003
5. **Validate**: All order IDs (ORD-2402) exist, all evidence IDs valid ✓
6. **Display**: Show answer with 3 clickable evidence links
7. **Feedback**: User clicks "Useful" → log positive feedback

## Monitoring & Metrics

Track:
- Evidence retrieval time
- LLM response time
- Validation pass rate
- Fallback trigger rate
- User feedback (useful %)
- Evidence click-through rate

Alerts:
- Validation failure > 10%
- Fallback rate > 20%
- Useful feedback < 70%
