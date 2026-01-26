import { useNavigate } from 'react-router';
import { 
  AlertTriangle,
  XCircle,
  RefreshCw,
  ArrowLeft,
  FileText,
  Database
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import { TabletLayout } from './TabletLayout';

interface SetupChecklistUnsourcedTabletProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function SetupChecklistUnsourcedTablet({ userRole = 'supervisor' }: SetupChecklistUnsourcedTabletProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const handleRetry = () => {
    navigate('/app/agent/setup-checklist');
  };

  const handleViewKB = () => {
    console.log('Navigate to knowledge base');
  };

  return (
    <TabletLayout userRole={userRole}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Setup checklist generation
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Run: </span>
              <span className="font-medium">RUN-2402</span>
            </span>
            <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="font-medium">M03</span>
            </span>
          </div>
        </div>

        {/* Error Banner */}
        <div className={`rounded-lg border p-4 ${
          isDarkMode 
            ? 'bg-red-900/20 border-red-700' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            <XCircle className={`w-6 h-6 flex-shrink-0 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                Cannot generate checklist
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                The AI generated a checklist, but some parameters could not be verified with source documents. For safety and compliance, we cannot proceed without proper sourcing.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Explanation */}
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Source citation policy
            </h3>
          </div>
          <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            All setup parameters must be traceable to approved sources:
          </p>
          <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Standard Operating Procedures (SOPs)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Approved knowledge base articles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Machine program files</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Historical setup logs</span>
            </li>
          </ul>
        </div>

        {/* Missing Sources */}
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Missing source documents
          </h3>
          <div className="space-y-2">
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <FileText className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  SOP-12 Rev 3
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Standard setup procedure for Gear B
              </p>
            </div>
            
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Database className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  KB Article: Gear B Setup Guide
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Detailed setup parameters and best practices
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className={`p-4 rounded-lg border ${
          isDarkMode 
            ? 'bg-blue-900/10 border-blue-800' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-blue-300' : 'text-blue-900'
          }`}>
            What to do next
          </h3>
          <ol className={`space-y-2 text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Check if the missing documents exist in the knowledge base</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>If they exist, verify they're properly tagged and indexed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>If they don't exist, upload them to the knowledge base</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Retry checklist generation once documents are available</span>
            </li>
          </ol>
        </div>

        {/* What Was Attempted */}
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            What the AI attempted
          </h3>
          <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            The assistant searched for:
          </p>
          <ul className={`space-y-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <li>• SOPs for M03 machine changeovers</li>
            <li>• Knowledge base articles about Gear B setup</li>
            <li>• Historical setup logs for Widget A → Gear B</li>
            <li>• Machine program files (PRG-GEARB-*.nc)</li>
          </ul>
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Found: 2 of 4 required sources
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleViewKB}
            className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 active:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            }`}
          >
            <Database className="w-5 h-5" />
            Check knowledge base
          </button>

          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-medium bg-blue-600 text-white active:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Retry generation
          </button>

          <button
            onClick={() => navigate('/app/agent/setup-guidance')}
            className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 active:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to setup guidance
          </button>
        </div>

        {/* Support Info */}
        <div className={`p-3 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Need help? Contact your Planner or administrator to ensure all required documents are properly uploaded and indexed.
          </p>
        </div>
      </div>
    </TabletLayout>
  );
}
