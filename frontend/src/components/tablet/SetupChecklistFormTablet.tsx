import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Zap,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import { TabletLayout } from './TabletLayout';

interface SetupChecklistFormTabletProps {
  userRole?: 'owner' | 'planner' | 'supervisor';
}

export function SetupChecklistFormTablet({ userRole = 'supervisor' }: SetupChecklistFormTabletProps) {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [formData, setFormData] = useState({
    runId: 'RUN-2402',
    machineId: 'M03',
    fromProduct: 'Widget A',
    toProduct: 'Gear B',
    shift: 'B',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    navigate('/app/agent/setup-checklist/output');
  };

  const isFormValid = formData.runId && formData.machineId && formData.fromProduct && formData.toProduct;

  return (
    <TabletLayout userRole={userRole}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Generate setup checklist
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            AI-powered guidance for machine changeovers
          </p>
        </div>

        {/* Info Banner */}
        <div className={`p-3 rounded-lg border ${
          isDarkMode 
            ? 'bg-blue-900/10 border-blue-800' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-2">
            <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              The assistant will generate a step-by-step checklist based on SOPs, knowledge base articles, and historical setup data.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Run ID */}
          <div>
            <label className={`text-sm font-medium mb-2 block ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Run ID <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.runId}
              onChange={(e) => setFormData({ ...formData, runId: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="RUN-2402">RUN-2402 (Active)</option>
              <option value="RUN-2401">RUN-2401</option>
              <option value="RUN-2400">RUN-2400</option>
            </select>
          </div>

          {/* Machine ID */}
          <div>
            <label className={`text-sm font-medium mb-2 block ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Machine <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.machineId}
              onChange={(e) => setFormData({ ...formData, machineId: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="M01">M01 - CNC Mill Alpha</option>
              <option value="M02">M02 - CNC Mill Beta</option>
              <option value="M03">M03 - CNC Mill Gamma</option>
              <option value="M04">M04 - CNC Mill Delta</option>
            </select>
          </div>

          {/* Product Change */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-sm font-medium mb-2 block ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                From product <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.fromProduct}
                onChange={(e) => setFormData({ ...formData, fromProduct: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="Widget A">Widget A</option>
                <option value="Gear B">Gear B</option>
                <option value="Widget C">Widget C</option>
                <option value="Shaft D">Shaft D</option>
              </select>
            </div>
            
            <div>
              <label className={`text-sm font-medium mb-2 block ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                To product <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.toProduct}
                onChange={(e) => setFormData({ ...formData, toProduct: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="Gear B">Gear B</option>
                <option value="Widget A">Widget A</option>
                <option value="Widget C">Widget C</option>
                <option value="Shaft D">Shaft D</option>
              </select>
            </div>
          </div>

          {/* Shift */}
          <div>
            <label className={`text-sm font-medium mb-2 block ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Shift
            </label>
            <select
              value={formData.shift}
              onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="A">Shift A (7 AM - 3 PM)</option>
              <option value="B">Shift B (3 PM - 11 PM)</option>
              <option value="C">Shift C (11 PM - 7 AM)</option>
            </select>
          </div>
        </div>

        {/* Context Info */}
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            What we'll check
          </h3>
          <ul className={`space-y-1.5 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <li>• SOPs for {formData.machineId} changeovers</li>
            <li>• Knowledge base articles on {formData.toProduct} setup</li>
            <li>• Historical setup data for this product change</li>
            <li>• Safety protocols and tooling requirements</li>
            <li>• First-piece inspection criteria</li>
          </ul>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!isFormValid || isGenerating}
          className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-medium transition-colors ${
            !isFormValid || isGenerating
              ? isDarkMode
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white active:bg-blue-700'
          }`}
        >
          <Zap className="w-5 h-5" />
          {isGenerating ? 'Generating checklist...' : 'Generate setup checklist'}
        </button>

        {/* Historical Data Preview */}
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Historical data for this change
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Avg setup time
              </div>
              <div className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                45 min
              </div>
            </div>
            <div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Success rate
              </div>
              <div className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                92%
              </div>
            </div>
            <div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Last performed
              </div>
              <div className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Jan 18
              </div>
            </div>
            <div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Times done
              </div>
              <div className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                24x
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabletLayout>
  );
}
