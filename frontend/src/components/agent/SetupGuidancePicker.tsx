import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search,
  ChevronDown,
  AlertCircle,
  Wrench,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Package,
  Settings
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

interface SetupGuidancePickerProps {
  userRole: 'owner' | 'planner' | 'supervisor';
}

interface Run {
  runId: string;
  version: string;
  status: 'Draft' | 'Completed' | 'Active' | 'Archived';
  date: string;
}

interface Machine {
  id: string;
  name: string;
  type: string;
}

interface ProductFamily {
  id: string;
  name: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  familyId: string;
}

export function SetupGuidancePicker({ userRole }: SetupGuidancePickerProps) {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [selectedRun, setSelectedRun] = useState<Run | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [selectedFromFamily, setSelectedFromFamily] = useState<ProductFamily | null>(null);
  const [selectedToFamily, setSelectedToFamily] = useState<ProductFamily | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [runSearchOpen, setRunSearchOpen] = useState(false);
  const [machineSearchOpen, setMachineSearchOpen] = useState(false);
  const [fromFamilySearchOpen, setFromFamilySearchOpen] = useState(false);
  const [toFamilySearchOpen, setToFamilySearchOpen] = useState(false);
  const [productSearchOpen, setProductSearchOpen] = useState(false);

  // Mock data
  const runs: Run[] = [
    { runId: 'RUN-2402', version: 'v3', status: 'Completed', date: '2026-01-24' },
    { runId: 'RUN-2401', version: 'v1', status: 'Completed', date: '2026-01-23' },
    { runId: 'RUN-2403', version: 'v1', status: 'Active', date: '2026-01-25' },
    { runId: 'RUN-2398', version: 'v2', status: 'Completed', date: '2026-01-22' },
    { runId: 'RUN-2404', version: 'v1', status: 'Draft', date: '2026-01-25' },
  ];

  const machines: Machine[] = [
    { id: 'M03', name: 'Press M03', type: 'Hydraulic Press' },
    { id: 'M04', name: 'Press M04', type: 'Hydraulic Press' },
    { id: 'M05', name: 'Lathe M05', type: 'CNC Lathe' },
    { id: 'M07', name: 'Mill M07', type: 'CNC Mill' },
  ];

  const productFamilies: ProductFamily[] = [
    { id: 'FAM-001', name: 'Widget A', description: 'Standard widgets' },
    { id: 'FAM-002', name: 'Gear B', description: 'Precision gears' },
    { id: 'FAM-003', name: 'Bracket C', description: 'Mounting brackets' },
    { id: 'FAM-004', name: 'Shaft D', description: 'Drive shafts' },
  ];

  const products: Product[] = [
    { id: 'PROD-101', name: 'Widget A-100', familyId: 'FAM-001' },
    { id: 'PROD-102', name: 'Widget A-200', familyId: 'FAM-001' },
    { id: 'PROD-201', name: 'Gear B-50', familyId: 'FAM-002' },
    { id: 'PROD-202', name: 'Gear B-75', familyId: 'FAM-002' },
    { id: 'PROD-301', name: 'Bracket C-10', familyId: 'FAM-003' },
    { id: 'PROD-401', name: 'Shaft D-20', familyId: 'FAM-004' },
  ];

  const isRunCompleted = selectedRun?.status === 'Completed';
  const canGenerate = selectedRun && selectedMachine && selectedFromFamily && selectedToFamily && selectedProduct && isRunCompleted;

  const getStatusColor = (status: Run['status']) => {
    switch (status) {
      case 'Completed':
        return isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
      case 'Active':
        return isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
      case 'Draft':
        return isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700';
      case 'Archived':
        return isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: Run['status']) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'Active':
        return <Calendar className="w-4 h-4" />;
      case 'Draft':
        return <AlertCircle className="w-4 h-4" />;
      case 'Archived':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    
    const params = new URLSearchParams({
      runId: selectedRun.runId,
      machineId: selectedMachine.id,
      fromFamily: selectedFromFamily.id,
      toFamily: selectedToFamily.id,
      productId: selectedProduct.id,
    });
    
    navigate(`/app/agent/setup-checklist?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/app/agent/home')}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors mb-6 ${
          isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Agent Home</span>
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
            <Wrench className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Setup Guidance
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Generate auditable setup checklists with sourced parameters
            </p>
          </div>
        </div>
      </div>

      <div className={`rounded-xl border p-6 mb-6 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="space-y-6">
          {/* Run Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Select Run <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setRunSearchOpen(!runSearchOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white hover:border-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                }`}
              >
                <span className={selectedRun ? '' : 'text-gray-500'}>
                  {selectedRun ? (
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{selectedRun.runId} {selectedRun.version}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(selectedRun.status)}`}>
                        {getStatusIcon(selectedRun.status)}
                        {selectedRun.status}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedRun.date}
                      </span>
                    </div>
                  ) : (
                    'Select a run...'
                  )}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${runSearchOpen ? 'rotate-180' : ''}`} />
              </button>

              {runSearchOpen && (
                <div className={`absolute z-10 w-full mt-2 rounded-lg border shadow-xl ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {runs.map((run) => (
                      <button
                        key={run.runId}
                        onClick={() => {
                          setSelectedRun(run);
                          setRunSearchOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                          selectedRun?.runId === run.runId
                            ? isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700'
                            : isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{run.runId} {run.version}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(run.status)}`}>
                            {getStatusIcon(run.status)}
                            {run.status}
                          </span>
                        </div>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {run.date}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {selectedRun && !isRunCompleted && (
              <div className={`mt-2 flex items-start gap-2 p-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-yellow-500/10 border-yellow-500/30' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <p className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                  Only completed runs can be used for setup guidance. Please select a completed run.
                </p>
              </div>
            )}
          </div>

          {/* Machine Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Machine <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setMachineSearchOpen(!machineSearchOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white hover:border-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                }`}
              >
                <span className={selectedMachine ? '' : 'text-gray-500'}>
                  {selectedMachine ? (
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4" />
                      <span className="font-medium">{selectedMachine.id}</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {selectedMachine.name}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        ({selectedMachine.type})
                      </span>
                    </div>
                  ) : (
                    'Select a machine...'
                  )}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${machineSearchOpen ? 'rotate-180' : ''}`} />
              </button>

              {machineSearchOpen && (
                <div className={`absolute z-10 w-full mt-2 rounded-lg border shadow-xl ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="p-2">
                    {machines.map((machine) => (
                      <button
                        key={machine.id}
                        onClick={() => {
                          setSelectedMachine(machine);
                          setMachineSearchOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          selectedMachine?.id === machine.id
                            ? isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700'
                            : isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-900'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{machine.id} - {machine.name}</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {machine.type}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* From Family Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              From Product Family <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setFromFamilySearchOpen(!fromFamilySearchOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white hover:border-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                }`}
              >
                <span className={selectedFromFamily ? '' : 'text-gray-500'}>
                  {selectedFromFamily ? (
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4" />
                      <span className="font-medium">{selectedFromFamily.name}</span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedFromFamily.description}
                      </span>
                    </div>
                  ) : (
                    'Select starting product family...'
                  )}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${fromFamilySearchOpen ? 'rotate-180' : ''}`} />
              </button>

              {fromFamilySearchOpen && (
                <div className={`absolute z-10 w-full mt-2 rounded-lg border shadow-xl ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="p-2">
                    {productFamilies.map((family) => (
                      <button
                        key={family.id}
                        onClick={() => {
                          setSelectedFromFamily(family);
                          setFromFamilySearchOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          selectedFromFamily?.id === family.id
                            ? isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700'
                            : isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-900'
                        }`}
                      >
                        <Package className="w-4 h-4" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{family.name}</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {family.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* To Family Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              To Product Family <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setToFamilySearchOpen(!toFamilySearchOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white hover:border-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                }`}
              >
                <span className={selectedToFamily ? '' : 'text-gray-500'}>
                  {selectedToFamily ? (
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4" />
                      <span className="font-medium">{selectedToFamily.name}</span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedToFamily.description}
                      </span>
                    </div>
                  ) : (
                    'Select target product family...'
                  )}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${toFamilySearchOpen ? 'rotate-180' : ''}`} />
              </button>

              {toFamilySearchOpen && (
                <div className={`absolute z-10 w-full mt-2 rounded-lg border shadow-xl ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="p-2">
                    {productFamilies.map((family) => (
                      <button
                        key={family.id}
                        onClick={() => {
                          setSelectedToFamily(family);
                          setToFamilySearchOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          selectedToFamily?.id === family.id
                            ? isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700'
                            : isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-900'
                        }`}
                      >
                        <Package className="w-4 h-4" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{family.name}</div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {family.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Specific Product <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setProductSearchOpen(!productSearchOpen)}
                disabled={!selectedToFamily}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                  !selectedToFamily
                    ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                    : isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white hover:border-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                }`}
              >
                <span className={selectedProduct ? '' : 'text-gray-500'}>
                  {selectedProduct ? (
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4" />
                      <span className="font-medium">{selectedProduct.name}</span>
                    </div>
                  ) : (
                    'Select specific product...'
                  )}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${productSearchOpen ? 'rotate-180' : ''}`} />
              </button>

              {productSearchOpen && selectedToFamily && (
                <div className={`absolute z-10 w-full mt-2 rounded-lg border shadow-xl ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="p-2">
                    {products
                      .filter(p => p.familyId === selectedToFamily.id)
                      .map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            setSelectedProduct(product);
                            setProductSearchOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            selectedProduct?.id === product.id
                              ? isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700'
                              : isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-900'
                          }`}
                        >
                          <Package className="w-4 h-4" />
                          <span className="font-medium">{product.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
            {!selectedToFamily && (
              <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Select "To Product Family" first
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Card (when all selected) */}
      {selectedRun && selectedMachine && selectedFromFamily && selectedToFamily && selectedProduct && (
        <div className={`rounded-xl border p-6 mb-6 ${
          isDarkMode 
            ? 'bg-blue-500/10 border-blue-500/30' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
            Setup Summary
          </h3>
          <div className="flex items-center justify-center gap-2 text-lg font-medium">
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {selectedMachine.id}
            </span>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>—</span>
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              Changeover
            </span>
            <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
              {selectedFromFamily.name}
            </span>
            <ArrowRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
              {selectedToFamily.name}
            </span>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>—</span>
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {selectedRun.runId}
            </span>
          </div>
          <div className="text-center mt-2">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Target product: {selectedProduct.name}
            </span>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={`w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
          canGenerate
            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        <Wrench className="w-6 h-6" />
        Generate Checklist
        <ArrowRight className="w-6 h-6" />
      </button>

      {!canGenerate && (
        <p className={`text-center mt-3 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          {!isRunCompleted && selectedRun
            ? 'Please select a completed run to generate checklist'
            : 'Fill in all required fields to generate checklist'}
        </p>
      )}
    </div>
  );
}