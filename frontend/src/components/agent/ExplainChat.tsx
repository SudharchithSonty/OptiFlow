import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Send, 
  X, 
  ExternalLink, 
  Calendar, 
  Activity, 
  Settings, 
  TrendingUp,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  FileText,
  GitCompare,
  BarChart3,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface ExplainChatProps {
  userRole: 'owner' | 'planner' | 'supervisor';
  runId?: string;
}

type EvidenceTab = 'schedule' | 'events' | 'constraints' | 'kpis';

interface EvidenceItem {
  type: string;
  reference: string;
  description: string;
  timestamp?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'error' | 'fallback' | 'not-found' | 'no-evidence';
  content: string;
  question?: string;
  evidence?: {
    schedule: EvidenceItem[];
    events: EvidenceItem[];
    constraints: EvidenceItem[];
    kpis: EvidenceItem[];
  };
  timestamp: string;
  errorReason?: string;
  jobId?: string;
}

export function ExplainChat({ userRole, runId = 'RUN-2402' }: ExplainChatProps) {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [selectedMessageEvidence, setSelectedMessageEvidence] = useState<ChatMessage['evidence'] | null>(null);
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<EvidenceTab>('schedule');
  const [isMobileEvidenceExpanded, setIsMobileEvidenceExpanded] = useState(false);

  // Check permissions
  const canAccessCompare = userRole === 'planner';
  const canAccessDraft = userRole === 'planner';

  // Suggested questions
  const suggestedQuestions = [
    "Why is O-112 late?",
    "Why is M03 overloaded?",
    "What changed vs parent run?",
    "What caused OTD risk to increase?"
  ];

  // Mock knowledge base for validation
  const knownOrderIds = ['O-112', 'O-121', 'O-133', 'O-089', 'O-098'];
  const knownMachineIds = ['M03', 'M04', 'M05', 'M07'];
  const knownMetrics = ['OTD', 'utilization', 'downtime', 'setup time'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const extractReferences = (question: string): { orders: string[], machines: string[], metrics: string[] } => {
    const orders = knownOrderIds.filter(id => question.includes(id));
    const machines = knownMachineIds.filter(id => question.includes(id));
    const metrics = knownMetrics.filter(metric => question.toLowerCase().includes(metric.toLowerCase()));
    return { orders, machines, metrics };
  };

  const validateQuestion = (question: string): { valid: boolean; unknownIds: string[] } => {
    // Extract potential IDs from question
    const orderMatches = question.match(/O-\d+/g) || [];
    const machineMatches = question.match(/M\d+/g) || [];
    
    const unknownOrders = orderMatches.filter(id => !knownOrderIds.includes(id));
    const unknownMachines = machineMatches.filter(id => !knownMachineIds.includes(id));
    
    const unknownIds = [...unknownOrders, ...unknownMachines];
    
    return {
      valid: unknownIds.length === 0,
      unknownIds
    };
  };

  const generateMockResponse = (question: string): ChatMessage => {
    const timestamp = new Date().toISOString();
    const validation = validateQuestion(question);

    // Check for unknown IDs
    if (!validation.valid) {
      return {
        id: `msg-${Date.now()}`,
        type: 'not-found',
        content: `ID not found in this run: ${validation.unknownIds.join(', ')}. Please verify the ID or select from the schedule.`,
        question,
        timestamp,
      };
    }

    // Simulate different response types
    const lowerQuestion = question.toLowerCase();

    // O-112 late question
    if (lowerQuestion.includes('o-112') && lowerQuestion.includes('late')) {
      // Simulate no evidence scenario (10% chance)
      if (Math.random() < 0.1) {
        return {
          id: `msg-${Date.now()}`,
          type: 'no-evidence',
          content: 'Evidence not available; cannot answer safely',
          question,
          timestamp,
        };
      }

      return {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        question,
        content: 'O-112 is late because operation OP-234 on M03 started 30 minutes behind schedule due to an unexpected setup delay. M03 was already running at high utilization (94%), and a hydraulic failure at 11:30 caused additional downstream delays. The cumulative impact results in a predicted 45-minute lateness against the 16:00 deadline.',
        evidence: {
          schedule: [
            { type: 'Operation', reference: 'OP-234', description: 'O-112 on M03, started 30min late' },
            { type: 'Order', reference: 'O-112', description: 'Due: 16:00, Predicted completion: 16:45' },
          ],
          events: [
            { type: 'Setup Delay', reference: 'EVT-123', description: 'M03 setup exceeded estimate by 15m', timestamp: '2026-01-24 09:30' },
            { type: 'Breakdown', reference: 'EVT-145', description: 'M03 hydraulic failure, 30min downtime', timestamp: '2026-01-24 11:30' },
          ],
          constraints: [
            { type: 'Precedence', reference: 'CONS-045', description: 'O-112 depends on O-098 completion' },
          ],
          kpis: [
            { type: 'Utilization', reference: 'KPI-M03', description: 'M03 utilization: 94.2% (threshold: 85%)' },
            { type: 'Setup Time', reference: 'KPI-ST-M03', description: 'M03 avg setup: 45min (target: 30min)' },
          ],
        },
        timestamp,
      };
    }

    // M03 overloaded question
    if (lowerQuestion.includes('m03') && (lowerQuestion.includes('overload') || lowerQuestion.includes('bottleneck'))) {
      return {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        question,
        content: 'M03 is overloaded because 8 operations totaling 11.4 hours are scheduled in an 8-hour shift (142% utilization). The machine experienced a 30-minute breakdown at 11:30, which compressed the remaining available time. Additionally, only 2 of 3 required T-450 tooling sets are available, causing setup times to increase as operations wait for tool changeover.',
        evidence: {
          schedule: [
            { type: 'Operation', reference: 'OP-234', description: 'O-112 on M03, 2h duration' },
            { type: 'Operation', reference: 'OP-456', description: 'O-121 on M03, 1.5h duration' },
            { type: 'Operation', reference: 'OP-567', description: 'O-089 on M03, 1h duration' },
            { type: 'Machine', reference: 'M03', description: '8 operations scheduled, 11.4h total' },
          ],
          events: [
            { type: 'Breakdown', reference: 'EVT-145', description: 'M03 hydraulic failure, 30min downtime', timestamp: '2026-01-24 11:30' },
          ],
          constraints: [
            { type: 'Capacity', reference: 'CONS-067', description: 'M03 max capacity: 8h per shift' },
            { type: 'Tooling', reference: 'CONS-089', description: 'T-450 tools: 2 available, 3 optimal' },
          ],
          kpis: [
            { type: 'Utilization', reference: 'KPI-M03', description: 'M03: 142% (11.4h / 8h)' },
            { type: 'Queue Depth', reference: 'KPI-Q-M03', description: 'M03 queue: 5 operations (highest)' },
          ],
        },
        timestamp,
      };
    }

    // Parent run comparison
    if (lowerQuestion.includes('parent') || lowerQuestion.includes('changed')) {
      // Planner only
      if (userRole !== 'planner') {
        return {
          id: `msg-${Date.now()}`,
          type: 'error',
          content: 'Run comparison is only available to Planner role.',
          question,
          timestamp,
        };
      }

      return {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        question,
        content: 'Compared to parent run RUN-2401, the current run added 2 new orders (O-121, O-133) and rescheduled 3 operations from M04 to M03 due to M04 maintenance. The scheduler also adjusted setup sequences to minimize tool changes, but the M03 bottleneck worsened from 98% to 142% utilization.',
        evidence: {
          schedule: [
            { type: 'Order', reference: 'O-121', description: 'New in v2 (not in parent)' },
            { type: 'Order', reference: 'O-133', description: 'New in v2 (not in parent)' },
            { type: 'Operation', reference: 'OP-456', description: 'Moved M04 → M03 in v2' },
          ],
          events: [
            { type: 'Maintenance', reference: 'EVT-167', description: 'M04 scheduled maintenance in v2', timestamp: '2026-01-24 13:00' },
          ],
          constraints: [],
          kpis: [
            { type: 'Utilization Delta', reference: 'KPI-M03-DELTA', description: 'M03: v1 98% → v2 142% (+44%)' },
            { type: 'Order Count', reference: 'KPI-ORDERS', description: 'Orders: v1 12 → v2 14 (+2)' },
          ],
        },
        timestamp,
      };
    }

    // OTD risk increase
    if (lowerQuestion.includes('otd')) {
      return {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        question,
        content: 'OTD risk increased from 15% (parent run) to 35% (current run) because of three late orders added in this version. The M03 bottleneck at 142% utilization is the primary driver, combined with 30 minutes of unplanned downtime. The risk model projects a 65% OTD rate vs the 85% target.',
        evidence: {
          schedule: [
            { type: 'Order', reference: 'O-112', description: 'Predicted 45min late' },
            { type: 'Order', reference: 'O-121', description: 'Predicted 45min late' },
            { type: 'Order', reference: 'O-133', description: 'Predicted 1h 30min late' },
          ],
          events: [
            { type: 'Breakdown', reference: 'EVT-145', description: 'M03 hydraulic failure, 30min downtime', timestamp: '2026-01-24 11:30' },
          ],
          constraints: [],
          kpis: [
            { type: 'OTD Risk', reference: 'KPI-OTD-RISK', description: 'Parent: 15% → Current: 35% (+20%)' },
            { type: 'OTD Prediction', reference: 'KPI-OTD', description: 'Predicted OTD: 65% (target: 85%)' },
            { type: 'Late Orders', reference: 'KPI-LATE', description: '3 of 14 orders at risk (21%)' },
          ],
        },
        timestamp,
      };
    }

    // Simulate model unavailable (5% chance)
    if (Math.random() < 0.05) {
      return {
        id: `msg-${Date.now()}`,
        type: 'fallback',
        content: 'AI model temporarily unavailable. Here\'s a rules-based response: Please check the schedule for details on this item. You may also want to review recent events and machine utilization in the metrics dashboard.',
        question,
        timestamp,
      };
    }

    // Simulate validation failure (3% chance)
    if (Math.random() < 0.03) {
      return {
        id: `msg-${Date.now()}`,
        type: 'error',
        content: 'Evidence validation failed: Cross-reference check between schedule and events did not pass integrity test.',
        question,
        errorReason: 'EVIDENCE_INTEGRITY_FAILURE',
        jobId: `JOB-${Date.now()}`,
        timestamp,
      };
    }

    // Default response
    return {
      id: `msg-${Date.now()}`,
      type: 'assistant',
      question,
      content: 'I can help explain schedule decisions, bottlenecks, late orders, and run comparisons. Please ask a specific question about orders, machines, or metrics in this run.',
      evidence: {
        schedule: [],
        events: [],
        constraints: [],
        kpis: [],
      },
      timestamp,
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const response = generateMockResponse(inputValue);
    setMessages(prev => [...prev, response]);
    setIsLoading(false);

    // Auto-open evidence drawer for successful responses
    if (response.type === 'assistant' && response.evidence) {
      setSelectedMessageEvidence(response.evidence);
      setEvidenceDrawerOpen(true);
      setActiveEvidenceTab('schedule');
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const handleOpenEvidence = (evidence: ChatMessage['evidence']) => {
    setSelectedMessageEvidence(evidence);
    setEvidenceDrawerOpen(true);
    setActiveEvidenceTab('schedule');
  };

  const handleJumpToSchedule = (reference: string) => {
    console.log('Jump to schedule with reference:', reference);
    navigate('/app/schedule', { state: { highlightId: reference } });
  };

  const handleRetry = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const totalEvidenceCount = selectedMessageEvidence 
    ? (selectedMessageEvidence.schedule?.length || 0) +
      (selectedMessageEvidence.events?.length || 0) +
      (selectedMessageEvidence.constraints?.length || 0) +
      (selectedMessageEvidence.kpis?.length || 0)
    : 0;

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header with Back Button */}
        <div className={`px-4 sm:px-6 py-3 border-b ${
          isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
        }`}>
          <button
            onClick={() => navigate('/app/agent/home')}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Agent Home</span>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <Activity className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Ask About This Run
              </h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Get evidence-based explanations for schedules, delays, bottlenecks, and run changes.
              </p>

              {/* Suggested Questions */}
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {question}
                  </button>
                ))}
              </div>

              {/* Role-specific CTAs */}
              {canAccessCompare && (
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => navigate('/app/runs/compare')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDarkMode
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    <GitCompare className="w-4 h-4" />
                    Compare Runs
                  </button>
                  <button
                    onClick={() => navigate(`/app/runs/${runId}/draft-assistant`)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDarkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Draft Impact Report
                  </button>
                </div>
              )}
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] lg:max-w-[70%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {/* User Message */}
                {message.type === 'user' && (
                  <div className={`px-4 py-3 rounded-2xl ${
                    isDarkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                )}

                {/* Assistant Message */}
                {message.type === 'assistant' && (
                  <div className={`space-y-3 px-4 py-3 rounded-2xl ${
                    isDarkMode
                      ? 'bg-gray-800 border border-gray-700'
                      : 'bg-white border border-gray-200'
                  }`}>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {message.content}
                    </p>

                    {/* Evidence List */}
                    {message.evidence && (
                      <div className={`pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-xs font-semibold uppercase tracking-wide ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Evidence Used
                          </p>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {(message.evidence.schedule?.length || 0) +
                             (message.evidence.events?.length || 0) +
                             (message.evidence.constraints?.length || 0) +
                             (message.evidence.kpis?.length || 0)} items
                          </span>
                        </div>
                        
                        <div className="space-y-1.5">
                          {/* Schedule evidence */}
                          {message.evidence.schedule?.slice(0, 3).map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleJumpToSchedule(item.reference)}
                              className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                                isDarkMode
                                  ? 'hover:bg-gray-700/50'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <Calendar className={`w-3.5 h-3.5 flex-shrink-0 ${
                                isDarkMode ? 'text-green-400' : 'text-green-600'
                              }`} />
                              <span className={`text-xs flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {item.reference}: {item.description}
                              </span>
                              <ExternalLink className={`w-3 h-3 flex-shrink-0 ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                              }`} />
                            </button>
                          ))}

                          {/* Events evidence */}
                          {message.evidence.events?.slice(0, 2).map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleJumpToSchedule(item.reference)}
                              className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                                isDarkMode
                                  ? 'hover:bg-gray-700/50'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <Activity className={`w-3.5 h-3.5 flex-shrink-0 ${
                                isDarkMode ? 'text-orange-400' : 'text-orange-600'
                              }`} />
                              <span className={`text-xs flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {item.reference}: {item.description}
                              </span>
                              <ExternalLink className={`w-3 h-3 flex-shrink-0 ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                              }`} />
                            </button>
                          ))}

                          {/* KPIs evidence */}
                          {message.evidence.kpis?.slice(0, 1).map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleJumpToSchedule(item.reference)}
                              className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                                isDarkMode
                                  ? 'hover:bg-gray-700/50'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <TrendingUp className={`w-3.5 h-3.5 flex-shrink-0 ${
                                isDarkMode ? 'text-blue-400' : 'text-blue-600'
                              }`} />
                              <span className={`text-xs flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {item.reference}: {item.description}
                              </span>
                              <ExternalLink className={`w-3 h-3 flex-shrink-0 ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                              }`} />
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handleOpenEvidence(message.evidence!)}
                          className={`w-full mt-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isDarkMode
                              ? 'text-blue-400 hover:bg-blue-500/10'
                              : 'text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View All Evidence
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Not Found Message */}
                {message.type === 'not-found' && (
                  <div className={`space-y-3 px-4 py-3 rounded-2xl border-2 ${
                    isDarkMode
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-yellow-50 border-yellow-300'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 mt-0.5 ${
                        isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium mb-1 ${
                          isDarkMode ? 'text-yellow-300' : 'text-yellow-900'
                        }`}>
                          ID Not Found
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/app/schedule')}
                      className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDarkMode
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-yellow-600 text-white hover:bg-yellow-700'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      Open Schedule
                    </button>
                  </div>
                )}

                {/* No Evidence Message */}
                {message.type === 'no-evidence' && (
                  <div className={`space-y-3 px-4 py-3 rounded-2xl border-2 ${
                    isDarkMode
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-orange-50 border-orange-300'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        isDarkMode ? 'text-orange-400' : 'text-orange-600'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium mb-1 ${
                          isDarkMode ? 'text-orange-300' : 'text-orange-900'
                        }`}>
                          Evidence Not Available
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/app/schedule')}
                      className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDarkMode
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-orange-600 text-white hover:bg-orange-700'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      Open Schedule
                    </button>
                  </div>
                )}

                {/* Fallback Message */}
                {message.type === 'fallback' && (
                  <div className={`space-y-3 px-4 py-3 rounded-2xl border-2 ${
                    isDarkMode
                      ? 'bg-gray-700/50 border-gray-600'
                      : 'bg-gray-100 border-gray-300'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Info className={`w-5 h-5 mt-0.5 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium mb-1 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                          Fallback Response (AI Model Unavailable)
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => message.question && handleRetry(message.question)}
                      className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDarkMode
                          ? 'bg-gray-600 text-white hover:bg-gray-500'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry
                    </button>
                  </div>
                )}

                {/* Error Message */}
                {message.type === 'error' && (
                  <div className={`space-y-3 px-4 py-3 rounded-2xl border-2 ${
                    isDarkMode
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-red-50 border-red-300'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 mt-0.5 ${
                        isDarkMode ? 'text-red-400' : 'text-red-600'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-semibold mb-1 ${
                          isDarkMode ? 'text-red-300' : 'text-red-900'
                        }`}>
                          Validation Failed
                        </p>
                        <p className={`text-sm mb-2 ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                          {message.content}
                        </p>
                        {message.errorReason && (
                          <p className={`text-xs font-mono ${
                            isDarkMode ? 'text-red-400' : 'text-red-700'
                          }`}>
                            Reason: {message.errorReason}
                          </p>
                        )}
                      </div>
                    </div>
                    {message.jobId && (
                      <button
                        onClick={() => navigate(`/app/agent/jobs/${message.jobId}`)}
                        className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isDarkMode
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Job Details ({message.jobId})
                      </button>
                    )}
                  </div>
                )}

                {/* Timestamp */}
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                } ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className={`px-4 py-3 rounded-2xl ${
                isDarkMode
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      isDarkMode ? 'bg-gray-400' : 'bg-gray-600'
                    }`} style={{ animationDelay: '0ms' }} />
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      isDarkMode ? 'bg-gray-400' : 'bg-gray-600'
                    }`} style={{ animationDelay: '150ms' }} />
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      isDarkMode ? 'bg-gray-400' : 'bg-gray-600'
                    }`} style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Analyzing evidence...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions (show when no messages) */}
        {messages.length > 0 && (
          <div className={`px-4 sm:px-6 py-3 border-t ${
            isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={`px-4 sm:px-6 py-4 border-t ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about this run..."
              className={`flex-1 px-4 py-2.5 rounded-lg border outline-none transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              }`}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                !inputValue.trim() || isLoading
                  ? isDarkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Drawer - Desktop (Right Panel) */}
      {evidenceDrawerOpen && selectedMessageEvidence && (
        <div className="hidden lg:block w-[400px] border-l h-full overflow-hidden flex flex-col bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          {/* Drawer Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Evidence ({totalEvidenceCount})
            </h3>
            <button
              onClick={() => setEvidenceDrawerOpen(false)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>

          {/* Tabs */}
          <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {[
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'events', label: 'Events', icon: Activity },
              { id: 'constraints', label: 'Constraints', icon: Settings },
              { id: 'kpis', label: 'KPIs', icon: TrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              const count = selectedMessageEvidence[tab.id as EvidenceTab]?.length || 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveEvidenceTab(tab.id as EvidenceTab)}
                  className={`flex-1 flex flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                    activeEvidenceTab === tab.id
                      ? isDarkMode
                        ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                        : 'border-blue-600 text-blue-600 bg-blue-50'
                      : isDarkMode
                      ? 'border-transparent text-gray-400 hover:text-gray-300'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedMessageEvidence[activeEvidenceTab]?.length === 0 ? (
              <div className="text-center py-12">
                <Info className={`w-10 h-10 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No {activeEvidenceTab} evidence
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedMessageEvidence[activeEvidenceTab]?.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    } transition-colors`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {item.type}
                          </span>
                          <span className={`font-mono text-sm font-semibold ${
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {item.reference}
                          </span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.description}
                        </p>
                        {item.timestamp && (
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {item.timestamp}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleJumpToSchedule(item.reference)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                          isDarkMode
                            ? 'text-blue-400 hover:bg-blue-500/20'
                            : 'text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        Jump
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Evidence Drawer - Mobile/Tablet (Bottom Sheet) */}
      {evidenceDrawerOpen && selectedMessageEvidence && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50">
          <div
            className={`${
              isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            } border-t rounded-t-2xl shadow-2xl transition-all duration-300 ${
              isMobileEvidenceExpanded ? 'h-[70vh]' : 'h-[200px]'
            }`}
          >
            {/* Handle */}
            <button
              onClick={() => setIsMobileEvidenceExpanded(!isMobileEvidenceExpanded)}
              className="w-full py-3 flex flex-col items-center gap-2"
            >
              <div className={`w-12 h-1 rounded-full ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`} />
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Evidence ({totalEvidenceCount})
                </span>
                {isMobileEvidenceExpanded ? (
                  <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                ) : (
                  <ChevronUp className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                )}
              </div>
            </button>

            {/* Tabs */}
            <div className={`flex border-t border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} px-4`}>
              {[
                { id: 'schedule', label: 'Schedule', icon: Calendar },
                { id: 'events', label: 'Events', icon: Activity },
                { id: 'constraints', label: 'Constraints', icon: Settings },
                { id: 'kpis', label: 'KPIs', icon: TrendingUp },
              ].map((tab) => {
                const Icon = tab.icon;
                const count = selectedMessageEvidence[tab.id as EvidenceTab]?.length || 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEvidenceTab(tab.id as EvidenceTab)}
                    className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium transition-colors border-b-2 ${
                      activeEvidenceTab === tab.id
                        ? isDarkMode
                          ? 'border-blue-500 text-blue-400'
                          : 'border-blue-600 text-blue-600'
                        : isDarkMode
                        ? 'border-transparent text-gray-400'
                        : 'border-transparent text-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-4" style={{ height: isMobileEvidenceExpanded ? 'calc(70vh - 120px)' : '80px' }}>
              {selectedMessageEvidence[activeEvidenceTab]?.length === 0 ? (
                <div className="text-center py-6">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No {activeEvidenceTab} evidence
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedMessageEvidence[activeEvidenceTab]?.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                              isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {item.type}
                            </span>
                            <span className={`font-mono text-xs font-semibold ${
                              isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                              {item.reference}
                            </span>
                          </div>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleJumpToSchedule(item.reference)}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            isDarkMode
                              ? 'text-blue-400 hover:bg-blue-500/20'
                              : 'text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          Jump
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setEvidenceDrawerOpen(false)}
              className={`absolute top-3 right-3 p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}