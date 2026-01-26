export interface Run {
  id: string;
  shiftDate: string;
  shift: 'A' | 'B' | 'C';
  status: 'created' | 'generating' | 'generated' | 'scheduling' | 'scheduled' | 'completed' | 'failed';
  version: number;
  createdAt: string;
  createdBy: string;
  orders: Order[];
  machines: MachineAllocation[];
  aiBrief?: AIBrief;
  metrics?: RunMetrics;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  quantity: number;
  priority: 'rush' | 'high' | 'normal' | 'low';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  setupTime: number; // minutes
  runTime: number; // minutes
  assignedMachine?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
}

export interface MachineAllocation {
  machineId: string;
  machineName: string;
  orders: string[]; // order IDs
  utilization: number; // percentage
  downtime: number; // minutes
  status: 'operational' | 'maintenance' | 'breakdown';
}

export interface AIBrief {
  id: string;
  generatedAt: string;
  summary: string;
  keyInsights: string[];
  risks: Risk[];
  recommendations: string[];
  confidence: number;
}

export interface Risk {
  type: 'capacity' | 'delay' | 'quality' | 'resource';
  severity: 'high' | 'medium' | 'low';
  description: string;
  mitigation?: string;
}

export interface RunMetrics {
  oee: number;
  otd: number; // on-time delivery percentage
  setupTime: number;
  utilization: number;
  downtime: number;
  rejects: number;
  firstPieceRejects: number;
}

export interface Alert {
  id: string;
  type: 'breakdown' | 'rush-order' | 'delay' | 'quality' | 'resource';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  machine?: string;
  order?: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface KPI {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number; // percentage change
  target?: number;
}

export interface AgentJob {
  id: string;
  jobType: 'shift_brief' | 'impact_report' | 'explain_chat' | 'validation' | 'schedule_generation';
  runId?: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  duration?: number; // seconds
  validationPass: boolean;
  fallbackUsed: boolean;
  errorMessage?: string;
}

export interface AgentStatus {
  status: 'healthy' | 'degraded' | 'down';
  lastHeartbeat: string;
  uptime: number; // hours
  todayJobsCount: number;
  failureRate: number; // percentage
  avgDuration: number; // seconds
}

export interface AgentAlert {
  id: string;
  type: 'high_fallback_rate' | 'validation_failure' | 'slow_jobs' | 'agent_down';
  severity: 'critical' | 'high' | 'medium';
  message: string;
  count?: number;
  timestamp: string;
}

// Mock Data
export const mockMachines = [
  { id: 'M1', name: 'CNC Mill #1', type: 'Milling', status: 'operational' as const },
  { id: 'M2', name: 'CNC Mill #2', type: 'Milling', status: 'operational' as const },
  { id: 'M3', name: 'Lathe #1', type: 'Turning', status: 'operational' as const },
  { id: 'M4', name: 'Lathe #2', type: 'Turning', status: 'maintenance' as const },
  { id: 'M5', name: 'Press #1', type: 'Forming', status: 'operational' as const },
];

export const mockOrders: Order[] = [
  {
    id: 'O001',
    orderNumber: 'PO-2024-001',
    customer: 'Acme Industries',
    product: 'Precision Shaft A-320',
    quantity: 150,
    priority: 'high',
    dueDate: '2026-01-05',
    status: 'in-progress',
    setupTime: 45,
    runTime: 320,
    assignedMachine: 'M1',
    scheduledStart: '2026-01-02T08:00:00',
    scheduledEnd: '2026-01-02T14:05:00',
  },
  {
    id: 'O002',
    orderNumber: 'PO-2024-002',
    customer: 'TechCorp Systems',
    product: 'Housing Unit B-150',
    quantity: 200,
    priority: 'rush',
    dueDate: '2026-01-03',
    status: 'pending',
    setupTime: 60,
    runTime: 420,
    assignedMachine: 'M2',
    scheduledStart: '2026-01-02T14:30:00',
    scheduledEnd: '2026-01-02T22:30:00',
  },
  {
    id: 'O003',
    orderNumber: 'PO-2024-003',
    customer: 'Global Manufacturing',
    product: 'Bracket Set C-890',
    quantity: 300,
    priority: 'normal',
    dueDate: '2026-01-08',
    status: 'pending',
    setupTime: 30,
    runTime: 280,
    assignedMachine: 'M3',
    scheduledStart: '2026-01-03T08:00:00',
    scheduledEnd: '2026-01-03T13:10:00',
  },
  {
    id: 'O004',
    orderNumber: 'PO-2024-004',
    customer: 'Precision Parts Ltd',
    product: 'Custom Flange D-440',
    quantity: 100,
    priority: 'high',
    dueDate: '2026-01-06',
    status: 'pending',
    setupTime: 50,
    runTime: 240,
    assignedMachine: 'M5',
    scheduledStart: '2026-01-02T08:00:00',
    scheduledEnd: '2026-01-02T12:50:00',
  },
  {
    id: 'O005',
    orderNumber: 'PO-2024-005',
    customer: 'Industrial Solutions',
    product: 'Valve Body E-220',
    quantity: 180,
    priority: 'normal',
    dueDate: '2026-01-10',
    status: 'pending',
    setupTime: 40,
    runTime: 360,
    assignedMachine: 'M1',
    scheduledStart: '2026-01-03T14:30:00',
    scheduledEnd: '2026-01-03T21:10:00',
  },
];

export const mockRuns: Run[] = [
  {
    id: 'RUN-20260102-A',
    shiftDate: '2026-01-02',
    shift: 'A',
    status: 'scheduled',
    version: 2,
    createdAt: '2026-01-01T14:30:00',
    createdBy: 'Ravi Rampaul',
    orders: [mockOrders[0], mockOrders[3]],
    machines: [
      {
        machineId: 'M1',
        machineName: 'CNC Mill #1',
        orders: ['O001'],
        utilization: 87,
        downtime: 15,
        status: 'operational',
      },
      {
        machineId: 'M5',
        machineName: 'Press #1',
        orders: ['O004'],
        utilization: 76,
        downtime: 0,
        status: 'operational',
      },
    ],
    aiBrief: {
      id: 'BRIEF-001',
      generatedAt: '2026-01-01T14:35:00',
      summary: 'Shift A has 2 orders scheduled across 2 machines with 82% average utilization. High priority order PO-2024-001 is on track for on-time delivery.',
      keyInsights: [
        'Machine M1 utilization at 87% - near optimal',
        'Setup time for O001 slightly higher than baseline (45min vs 40min avg)',
        'No resource conflicts detected',
        'Rush order O002 queued for Shift B',
      ],
      risks: [
        {
          type: 'capacity',
          severity: 'low',
          description: 'M1 running at high utilization; any delays will impact downstream orders',
          mitigation: 'Ensure preventive maintenance completed before shift start',
        },
      ],
      recommendations: [
        'Pre-stage tooling for O001 to reduce setup time',
        'Assign backup operator for M5 in case of complexity issues',
        'Monitor M1 closely for signs of wear',
      ],
      confidence: 0.89,
    },
    metrics: {
      oee: 84,
      otd: 95,
      setupTime: 47,
      utilization: 82,
      downtime: 8,
      rejects: 2,
      firstPieceRejects: 1,
    },
  },
  {
    id: 'RUN-20260102-A-v1',
    shiftDate: '2026-01-02',
    shift: 'A',
    status: 'completed',
    version: 1,
    createdAt: '2026-01-01T09:00:00',
    createdBy: 'Ravi Rampaul',
    orders: [mockOrders[0]],
    machines: [
      {
        machineId: 'M1',
        machineName: 'CNC Mill #1',
        orders: ['O001'],
        utilization: 65,
        downtime: 0,
        status: 'operational',
      },
    ],
    metrics: {
      oee: 82,
      otd: 92,
      setupTime: 45,
      utilization: 65,
      downtime: 0,
      rejects: 3,
      firstPieceRejects: 2,
    },
  },
  {
    id: 'RUN-20260102-B',
    shiftDate: '2026-01-02',
    shift: 'B',
    status: 'scheduled',
    version: 1,
    createdAt: '2026-01-01T15:00:00',
    createdBy: 'Ravi Rampaul',
    orders: [mockOrders[1]],
    machines: [
      {
        machineId: 'M2',
        machineName: 'CNC Mill #2',
        orders: ['O002'],
        utilization: 91,
        downtime: 0,
        status: 'operational',
      },
    ],
    aiBrief: {
      id: 'BRIEF-002',
      generatedAt: '2026-01-01T15:05:00',
      summary: 'Shift B prioritizes rush order PO-2024-002 with tight deadline. Single machine allocation for focused execution.',
      keyInsights: [
        'Rush order requires 7 hours total (1hr setup + 6hr run)',
        'M2 is optimal choice - recently serviced with low downtime history',
        'Shift handoff from A to B requires tooling changeover',
      ],
      risks: [
        {
          type: 'delay',
          severity: 'high',
          description: 'Rush order has minimal buffer; any setup delays will cause late delivery',
          mitigation: 'Pre-stage all materials and tooling; assign senior operator',
        },
        {
          type: 'quality',
          severity: 'medium',
          description: 'First piece inspection critical - customer has strict tolerances',
          mitigation: 'Conduct thorough FPI with quality lead present',
        },
      ],
      recommendations: [
        'Brief shift B supervisor on rush order criticality',
        'Prepare contingency plan if M2 encounters issues (M1 as backup)',
        'Monitor progress hourly and alert if falling behind',
      ],
      confidence: 0.92,
    },
    metrics: {
      oee: 89,
      otd: 98,
      setupTime: 60,
      utilization: 91,
      downtime: 0,
      rejects: 1,
      firstPieceRejects: 0,
    },
  },
  {
    id: 'RUN-20260103-A',
    shiftDate: '2026-01-03',
    shift: 'A',
    status: 'generating',
    version: 1,
    createdAt: '2026-01-01T16:00:00',
    createdBy: 'Ravi Rampaul',
    orders: [mockOrders[2], mockOrders[4]],
    machines: [
      {
        machineId: 'M3',
        machineName: 'Lathe #1',
        orders: ['O003'],
        utilization: 78,
        downtime: 0,
        status: 'operational',
      },
      {
        machineId: 'M1',
        machineName: 'CNC Mill #1',
        orders: ['O005'],
        utilization: 84,
        downtime: 0,
        status: 'operational',
      },
    ],
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    type: 'breakdown',
    severity: 'critical',
    title: 'Machine M4 Breakdown',
    description: 'Lathe #2 experienced spindle failure during operation. Maintenance team dispatched.',
    machine: 'M4',
    timestamp: '2026-01-01T10:45:00',
    acknowledged: false,
  },
  {
    id: 'ALT-002',
    type: 'rush-order',
    severity: 'high',
    title: 'New Rush Order Received',
    description: 'Customer TechCorp Systems submitted rush order PO-2024-002 requiring delivery by Jan 3.',
    order: 'O002',
    timestamp: '2026-01-01T13:20:00',
    acknowledged: true,
    acknowledgedBy: 'Ravi Rampaul',
    acknowledgedAt: '2026-01-01T13:25:00',
  },
  {
    id: 'ALT-003',
    type: 'quality',
    severity: 'medium',
    title: 'First Piece Reject - O001',
    description: 'First piece inspection failed for PO-2024-001. Dimensional variance detected. Operator notified.',
    order: 'O001',
    machine: 'M1',
    timestamp: '2026-01-01T08:15:00',
    acknowledged: true,
    acknowledgedBy: 'Priya Patel',
    acknowledgedAt: '2026-01-01T08:20:00',
  },
  {
    id: 'ALT-004',
    type: 'delay',
    severity: 'medium',
    title: 'Setup Time Overrun - M1',
    description: 'Setup for O001 exceeded planned time by 15 minutes. May impact downstream schedule.',
    machine: 'M1',
    order: 'O001',
    timestamp: '2026-01-01T09:00:00',
    acknowledged: true,
    acknowledgedBy: 'Priya Patel',
    acknowledgedAt: '2026-01-01T09:05:00',
  },
];

export const mockKPIs: KPI[] = [
  { name: 'OEE', value: 84.5, unit: '%', trend: 'up', change: 2.3, target: 85 },
  { name: 'On-Time Delivery', value: 94.2, unit: '%', trend: 'up', change: 1.8, target: 95 },
  { name: 'Avg Setup Time', value: 48, unit: 'min', trend: 'down', change: -5.2, target: 45 },
  { name: 'Utilization', value: 82.1, unit: '%', trend: 'stable', change: 0.5, target: 80 },
  { name: 'Downtime', value: 3.2, unit: 'hrs/week', trend: 'down', change: -12.5, target: 3 },
  { name: 'Reject Rate', value: 1.8, unit: '%', trend: 'down', change: -0.4, target: 2 },
];

export const weeklyTrendData = [
  { week: 'W1', oee: 81.2, otd: 92.5, utilization: 79.5, rejects: 2.1 },
  { week: 'W2', oee: 82.8, otd: 93.1, utilization: 80.2, rejects: 1.9 },
  { week: 'W3', oee: 83.5, otd: 93.8, utilization: 81.3, rejects: 1.7 },
  { week: 'W4', oee: 84.5, otd: 94.2, utilization: 82.1, rejects: 1.8 },
];

// Agent Mock Data
export const mockAgentStatus: AgentStatus = {
  status: 'healthy',
  lastHeartbeat: '2026-01-24T14:32:00',
  uptime: 168.5,
  todayJobsCount: 42,
  failureRate: 2.3,
  avgDuration: 8.4,
};

export const mockAgentJobs: AgentJob[] = [
  {
    id: 'JOB-2024-001',
    jobType: 'shift_brief',
    runId: 'RUN-20260124-A',
    status: 'completed',
    startedAt: '2026-01-24T14:15:00',
    completedAt: '2026-01-24T14:15:12',
    duration: 12.3,
    validationPass: true,
    fallbackUsed: false,
  },
  {
    id: 'JOB-2024-002',
    jobType: 'validation',
    runId: 'RUN-20260124-B',
    status: 'completed',
    startedAt: '2026-01-24T14:10:00',
    completedAt: '2026-01-24T14:10:06',
    duration: 6.1,
    validationPass: true,
    fallbackUsed: false,
  },
  {
    id: 'JOB-2024-003',
    jobType: 'impact_report',
    runId: 'RUN-20260124-A',
    status: 'completed',
    startedAt: '2026-01-24T14:05:00',
    completedAt: '2026-01-24T14:05:15',
    duration: 15.2,
    validationPass: true,
    fallbackUsed: false,
  },
  {
    id: 'JOB-2024-004',
    jobType: 'explain_chat',
    runId: 'RUN-20260124-A',
    status: 'completed',
    startedAt: '2026-01-24T13:58:00',
    completedAt: '2026-01-24T13:58:04',
    duration: 4.7,
    validationPass: true,
    fallbackUsed: false,
  },
  {
    id: 'JOB-2024-005',
    jobType: 'schedule_generation',
    runId: 'RUN-20260124-C',
    status: 'failed',
    startedAt: '2026-01-24T13:45:00',
    completedAt: '2026-01-24T13:45:18',
    duration: 18.5,
    validationPass: false,
    fallbackUsed: true,
    errorMessage: 'Timeout exceeded - fallback to rule-based scheduler',
  },
];

export const mockAgentAlerts: AgentAlert[] = [
  {
    id: 'AGTALERT-001',
    type: 'validation_failure',
    severity: 'medium',
    message: 'Validation failed for 3 jobs in the last hour',
    count: 3,
    timestamp: '2026-01-24T14:00:00',
  },
  {
    id: 'AGTALERT-002',
    type: 'high_fallback_rate',
    severity: 'high',
    message: 'Fallback rate at 8.5% (threshold: 5%)',
    count: 4,
    timestamp: '2026-01-24T13:30:00',
  },
];