import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Send,
  Bot,
  User,
  Sparkles,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import { TabletLayout } from './TabletLayout';

interface DraftImpactReportAssistantTabletProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

export function DraftImpactReportAssistantTablet({ userRole = 'planner' }: DraftImpactReportAssistantTabletProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'I can help you understand the impact of schedule changes between run versions. I have access to RUN-2402 (child) and RUN-2401 (parent). What would you like to know?',
      timestamp: new Date(),
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    'What changed in OTD?',
    'Which orders are affected?',
    'Show me utilization impact',
    'Why did setup time increase?',
  ];

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getSimulatedResponse(inputValue),
      timestamp: new Date(),
      data: getResponseData(inputValue),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const getSimulatedResponse = (question: string): string => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('otd') || lowerQ.includes('on time')) {
      return 'The On-Time Delivery rate improved from 91.2% (RUN-2401) to 94.2% (RUN-2402), a positive change of +3.0%. This improvement came from better sequencing of orders and reduced changeover times.';
    }
    
    if (lowerQ.includes('order') || lowerQ.includes('affect')) {
      return '12 orders were affected by the schedule changes. Of these, 8 orders improved their delivery dates by an average of 4.2 hours, while 4 orders were delayed by an average of 2.1 hours. Overall net impact is positive.';
    }
    
    if (lowerQ.includes('utilization')) {
      return 'Machine utilization increased across all machines. M03 saw the biggest improvement (+4.2%), going from 87.3% to 91.5%. This was achieved by optimizing the changeover sequence and reducing idle time between jobs.';
    }
    
    if (lowerQ.includes('setup') || lowerQ.includes('increase')) {
      return 'Total setup time increased from 6.2 hours to 6.8 hours (+0.6 hours). This is due to adding one additional changeover on M03, but it enables better order sequencing that improves overall OTD. The trade-off is worthwhile.';
    }
    
    return 'I can analyze the differences between RUN-2401 and RUN-2402. The key changes include improved OTD (+3.0%), slightly higher setup time (+0.6 hrs), and better machine utilization. Would you like details on a specific metric?';
  };

  const getResponseData = (question: string) => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('otd')) {
      return {
        type: 'metric',
        metrics: [
          { label: 'Parent (RUN-2401)', value: '91.2%', isBaseline: true },
          { label: 'Child (RUN-2402)', value: '94.2%', isBaseline: false },
          { label: 'Change', value: '+3.0%', isPositive: true },
        ]
      };
    }
    
    if (lowerQ.includes('utilization')) {
      return {
        type: 'machines',
        machines: [
          { id: 'M01', parent: '89.1%', child: '91.8%', change: '+2.7%' },
          { id: 'M02', parent: '85.4%', child: '88.2%', change: '+2.8%' },
          { id: 'M03', parent: '87.3%', child: '91.5%', change: '+4.2%' },
          { id: 'M04', parent: '88.7%', child: '90.1%', change: '+1.4%' },
        ]
      };
    }
    
    return null;
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageData = (data: any) => {
    if (!data) return null;

    if (data.type === 'metric') {
      return (
        <div className={`mt-3 p-3 rounded-lg border ${
          isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="space-y-2">
            {data.metrics.map((metric: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <span className={`text-sm ${
                  metric.isBaseline 
                    ? isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    : isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {metric.label}
                </span>
                <span className={`text-sm font-semibold ${
                  metric.isPositive 
                    ? 'text-green-600' 
                    : metric.isBaseline
                      ? isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      : isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.type === 'machines') {
      return (
        <div className={`mt-3 p-3 rounded-lg border ${
          isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="space-y-2">
            {data.machines.map((machine: any) => (
              <div key={machine.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {machine.id}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    {machine.change}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                    {machine.parent} → {machine.child}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <TabletLayout userRole={userRole}>
      <div className="flex flex-col h-[calc(100vh-7rem)]">
        {/* Header */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Impact analysis assistant
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comparing:
            </span>
            <button
              onClick={() => navigate('/app/runs/RUN-2402')}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              RUN-2402
            </button>
            <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>vs</span>
            <button
              onClick={() => navigate('/app/runs/RUN-2401')}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              RUN-2401
            </button>
          </div>
        </div>

        {/* Summary Banner */}
        <div className={`p-3 border-b ${
          isDarkMode 
            ? 'bg-green-900/10 border-gray-700' 
            : 'bg-green-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`text-xs font-medium ${
              isDarkMode ? 'text-green-300' : 'text-green-800'
            }`}>
              Overall impact: Positive • OTD +3.0% • Utilization +2.8% avg
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'assistant'
                  ? isDarkMode ? 'bg-blue-600' : 'bg-blue-600'
                  : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}>
                {message.role === 'assistant' ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex-1 max-w-[75%]`}>
                <div className={`p-3 rounded-lg ${
                  message.role === 'assistant'
                    ? isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    : 'bg-blue-600 text-white'
                }`}>
                  <p className={`text-sm leading-relaxed ${
                    message.role === 'assistant'
                      ? isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      : 'text-white'
                  }`}>
                    {message.content}
                  </p>
                </div>

                {/* Data Visualization */}
                {renderMessageData(message.data)}

                {/* Timestamp */}
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDarkMode ? 'bg-blue-600' : 'bg-blue-600'
              }`}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex gap-1">
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                  }`} style={{ animationDelay: '0ms' }} />
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                  }`} style={{ animationDelay: '150ms' }} />
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                  }`} style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && !isTyping && (
          <div className="px-4 pb-3">
            <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Quick questions:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(question)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-gray-300 active:bg-gray-700' 
                      : 'bg-white border-gray-200 text-gray-700 active:bg-gray-50'
                  }`}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => navigate('/app/runs/compare/draft-impact-report')}
              className={`text-xs px-3 py-1.5 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              View full report
            </button>
          </div>
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the impact..."
              rows={1}
              className={`flex-1 px-4 py-3 rounded-lg border outline-none resize-none ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }`}
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`px-4 rounded-lg flex items-center justify-center transition-colors ${
                !inputValue.trim() || isTyping
                  ? isDarkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white active:bg-blue-700'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </TabletLayout>
  );
}
