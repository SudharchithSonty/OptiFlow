import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Package,
  Wrench,
  TrendingUp,
  Star,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import { TabletLayout } from './TabletLayout';

interface ShiftStartBriefTabletProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function ShiftStartBriefTablet({ userRole = 'supervisor' }: ShiftStartBriefTabletProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingNote, setRatingNote] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('priorities');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSubmitRating = () => {
    console.log('Rating submitted:', rating, ratingNote);
    setShowRating(false);
  };

  return (
    <TabletLayout userRole={userRole}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Shift B Brief — Jan 25
          </h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Run: </span>
              <button
                onClick={() => navigate('/app/runs/RUN-2402')}
                className="font-medium text-blue-600 hover:underline"
              >
                RUN-2402
              </button>
            </span>
            <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Generated at 6:45 AM
            </span>
          </div>
        </div>

        {/* Summary Card */}
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Summary
          </h3>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Today's shift focuses on completing Order #45678 (Gear B, 150 units) and starting Order #45679 (Widget C, 200 units). One machine changeover planned on M03 at 2:00 PM. Watch for tooling setup on M03—historical data shows 15% longer setup times on this product change.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Package className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Orders
              </span>
            </div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              2 active
            </div>
          </div>
          
          <div className={`p-3 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Wrench className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Changeovers
              </span>
            </div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              1 planned
            </div>
          </div>
        </div>

        {/* Priorities Section */}
        <div className={`rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={() => toggleSection('priorities')}
            className="w-full p-3 flex items-center justify-between"
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🎯 Top priorities
            </h3>
            {expandedSection === 'priorities' ? (
              <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            ) : (
              <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            )}
          </button>
          {expandedSection === 'priorities' && (
            <div className="px-3 pb-3 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Complete Order #45678 by 2:00 PM (on track: 75% done)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  M03 changeover at 2:00 PM—allow extra 15 min for setup
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Start Order #45679 by 3:00 PM
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Schedule Section */}
        <div className={`rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={() => toggleSection('schedule')}
            className="w-full p-3 flex items-center justify-between"
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              📅 Schedule highlights
            </h3>
            {expandedSection === 'schedule' ? (
              <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            ) : (
              <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            )}
          </button>
          {expandedSection === 'schedule' && (
            <div className="px-3 pb-3 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    7:00 AM - 2:00 PM
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Continue Order #45678 on M01, M02, M03
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    2:00 PM - 2:45 PM
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  M03 changeover (Gear B → Widget C)
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    3:00 PM - 11:00 PM
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Start Order #45679 on all machines
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Risks Section */}
        <div className={`rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={() => toggleSection('risks')}
            className="w-full p-3 flex items-center justify-between"
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ⚠️ Watch for
            </h3>
            {expandedSection === 'risks' ? (
              <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            ) : (
              <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            )}
          </button>
          {expandedSection === 'risks' && (
            <div className="px-3 pb-3 space-y-2">
              <div className={`p-2.5 rounded-lg ${
                isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'
              }`}>
                <p className={`text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-orange-300' : 'text-orange-900'
                }`}>
                  M03 setup time risk
                </p>
                <p className={`text-xs ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-700'
                }`}>
                  Historical avg: 45 min (plan shows 30 min). Add buffer time.
                </p>
              </div>
              <div className={`p-2.5 rounded-lg ${
                isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
              }`}>
                <p className={`text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-900'
                }`}>
                  Quality checkpoint
                </p>
                <p className={`text-xs ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  Widget C first-piece inspection required before production start.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Team Section */}
        <div className={`rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={() => toggleSection('team')}
            className="w-full p-3 flex items-center justify-between"
          >
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              👥 Team & resources
            </h3>
            {expandedSection === 'team' ? (
              <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            ) : (
              <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            )}
          </button>
          {expandedSection === 'team' && (
            <div className="px-3 pb-3 space-y-2">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Supervisor:</strong> Priya Patel
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Operators:</strong> 4 assigned
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Support:</strong> Maintenance on-call, Quality inspector available
              </p>
            </div>
          )}
        </div>

        {/* Rating */}
        {showRating ? (
          <div className={`rounded-lg border p-4 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Rate this brief
            </h3>
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-95"
                >
                  <Star
                    className={`w-9 h-9 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : isDarkMode
                          ? 'text-gray-600'
                          : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={ratingNote}
              onChange={(e) => setRatingNote(e.target.value)}
              placeholder="Optional: What was helpful or could be improved?"
              className={`w-full px-3 py-2.5 rounded-lg border outline-none transition-colors resize-none ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              }`}
              rows={3}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSubmitRating}
                disabled={rating === 0}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  rating > 0
                    ? 'bg-blue-600 text-white active:bg-blue-700'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit rating
              </button>
              <button
                onClick={() => setShowRating(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 active:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowRating(true)}
            className={`w-full p-3 rounded-lg border transition-colors ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 active:bg-gray-700' 
                : 'bg-white border-gray-200 active:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Star className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Rate this brief
              </span>
            </div>
          </button>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => window.print()}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 active:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 active:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            }`}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>
    </TabletLayout>
  );
}