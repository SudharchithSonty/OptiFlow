import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Send,
  Bot,
  User,
  Sparkles,
  FileText,
  Loader
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import { TabletLayout } from './TabletLayout';

interface ExplainChatTabletProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: { title: string; type: string }[];
}

export function ExplainChatTablet({ userRole = 'supervisor' }: ExplainChatTabletProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your Digital Operations Assistant. I can help you understand KPIs, explain schedule changes, look up procedures, and answer questions about runs, machines, and products. What would you like to know?',
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
    'What\'s the OTD for this week?',
    'Why was RUN-2402 rescheduled?',
    'How do I log setup actuals?',
    'What\'s the SOP for M03?',
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
      sources: [
        { title: 'SOP-12 Rev 3', type: 'SOP' },
        { title: 'Weekly Metrics Dashboard', type: 'Report' }
      ]
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const getSimulatedResponse = (question: string): string => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('otd') || lowerQ.includes('on time')) {
      return 'Based on the latest data, the On-Time Delivery (OTD) rate for this week is 94.2%, which is above our target of 90%. We completed 48 out of 51 orders on schedule. The 3 delayed orders were primarily due to unexpected machine downtime on M02.';
    }
    
    if (lowerQ.includes('reschedule') || lowerQ.includes('2402')) {
      return 'RUN-2402 was rescheduled because of an urgent priority order that came in yesterday. The planner moved some lower-priority jobs to create capacity. The impact analysis showed minimal effect on other deliveries, with only a 2-hour shift in the schedule.';
    }
    
    if (lowerQ.includes('setup actual') || lowerQ.includes('log')) {
      return 'To log setup actuals: 1) Navigate to the machine detail page, 2) Click "Log Setup Actuals", 3) Enter the actual start time, end time, and any notes about issues encountered, 4) Submit. The system will compare this against planned setup time and flag any significant variances.';
    }
    
    if (lowerQ.includes('sop') || lowerQ.includes('m03')) {
      return 'The primary SOP for M03 is SOP-12 Rev 3, which covers standard operating procedures for CNC Mill Gamma. This includes startup procedures, changeover protocols, quality checkpoints, and shutdown procedures. Would you like me to provide specific sections?';
    }
    
    return 'I understand your question. Based on the available data and documentation, I can help you with that. Could you provide a bit more context or specify which aspect you\'d like to know more about?';
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

  return (
    <TabletLayout userRole={userRole}>
      <div className="flex flex-col h-[calc(100vh-7rem)]">
        {/* Header */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Ask anything
            </h1>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Operations Q&A assistant
          </p>
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

                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.sources.map((source, idx) => (
                      <button
                        key={idx}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                          isDarkMode 
                            ? 'bg-gray-800 text-gray-400 border border-gray-700' 
                            : 'bg-white text-gray-600 border border-gray-300'
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        {source.title}
                      </button>
                    ))}
                  </div>
                )}

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
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
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
