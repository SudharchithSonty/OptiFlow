import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Settings,
  Clock,
  AlertTriangle,
  Key,
  Save,
  Eye,
  EyeOff,
  Shield,
  ExternalLink,
  Map,
  GitBranch,
  ArrowRight,
  FileText,
} from "lucide-react";
import { useDarkMode } from "../DarkModeContext";

interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
}

interface KPIThresholds {
  otdTarget: number;
  utilizationWarning: number;
  downtimeAlert: number;
  setupTimeWarning: number;
  oeeTarget: number;
}

interface APIKeyConfig {
  id: string;
  name: string;
  key: string;
  isVisible: boolean;
}

export function OrgSettingsPage() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<ShiftTemplate[]>([
    {
      id: "A",
      name: "Shift A (Morning)",
      startTime: "06:00",
      endTime: "14:00",
      daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    {
      id: "B",
      name: "Shift B (Afternoon)",
      startTime: "14:00",
      endTime: "22:00",
      daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    {
      id: "C",
      name: "Shift C (Night)",
      startTime: "22:00",
      endTime: "06:00",
      daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  ]);

  const [thresholds, setThresholds] = useState<KPIThresholds>({
    otdTarget: 95,
    utilizationWarning: 85,
    downtimeAlert: 30,
    setupTimeWarning: 120,
    oeeTarget: 75,
  });

  const [apiKeys, setApiKeys] = useState<APIKeyConfig[]>([
    {
      id: "1",
      name: "AI Agent API Key",
      key: "sk_live_abc123xyz789...",
      isVisible: false,
    },
    {
      id: "2",
      name: "External Scheduler Integration",
      key: "api_key_def456uvw012...",
      isVisible: false,
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const handleShiftUpdate = (
    shiftId: string,
    field: string,
    value: any,
  ) => {
    setShifts(
      shifts.map((s) =>
        s.id === shiftId ? { ...s, [field]: value } : s,
      ),
    );
  };

  const handleThresholdUpdate = (
    field: keyof KPIThresholds,
    value: number,
  ) => {
    setThresholds({ ...thresholds, [field]: value });
  };

  const toggleAPIKeyVisibility = (keyId: string) => {
    setApiKeys(
      apiKeys.map((k) =>
        k.id === keyId ? { ...k, isVisible: !k.isVisible } : k,
      ),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Settings saved:", { shifts, thresholds });
    setIsSaving(false);
  };

  return (
    <div
      className={`h-full flex flex-col ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div
        className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Settings className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1
                className={
                  isDarkMode ? "text-white" : "text-gray-900"
                }
              >
                Organization Settings
              </h1>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Configure shifts, thresholds, and integrations
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isSaving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* RBAC Permissions Link */}
          <button
            onClick={() => navigate("/app/permissions")}
            className={`w-full border rounded-xl p-4 transition-all duration-200 ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
                : "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:border-purple-300 hover:shadow-lg"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${isDarkMode ? "bg-purple-500/30" : "bg-purple-100"}`}
                >
                  <Shield
                    className={`w-6 h-6 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
                  />
                </div>
                <div className="text-left">
                  <h3
                    className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Role Permissions & AI Boundaries
                  </h3>
                  <p
                    className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    View governance documentation and RBAC
                    matrix
                  </p>
                </div>
              </div>
              <ExternalLink
                className={`w-5 h-5 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
              />
            </div>
          </button>

          {/* Shift Templates */}
          <div
            className={`border rounded-lg p-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock
                className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              />
              <h2
                className={
                  isDarkMode ? "text-white" : "text-gray-900"
                }
              >
                Shift Templates
              </h2>
            </div>

            <div className="space-y-6">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className={`border rounded-lg p-4 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <div className="mb-4">
                    <label
                      className={`block text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Shift Name
                    </label>
                    <input
                      type="text"
                      value={shift.name}
                      onChange={(e) =>
                        handleShiftUpdate(
                          shift.id,
                          "name",
                          e.target.value,
                        )
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        className={`block text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={shift.startTime}
                        onChange={(e) =>
                          handleShiftUpdate(
                            shift.id,
                            "startTime",
                            e.target.value,
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        End Time
                      </label>
                      <input
                        type="time"
                        value={shift.endTime}
                        onChange={(e) =>
                          handleShiftUpdate(
                            shift.id,
                            "endTime",
                            e.target.value,
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Days of Week
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun",
                      ].map((day) => (
                        <button
                          key={day}
                          onClick={() => {
                            const newDays =
                              shift.daysOfWeek.includes(day)
                                ? shift.daysOfWeek.filter(
                                    (d) => d !== day,
                                  )
                                : [...shift.daysOfWeek, day];
                            handleShiftUpdate(
                              shift.id,
                              "daysOfWeek",
                              newDays,
                            );
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            shift.daysOfWeek.includes(day)
                              ? "bg-indigo-600 text-white"
                              : isDarkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Working Hours Info */}
          <div
            className={`border rounded-lg p-4 ${isDarkMode ? "bg-blue-900/30 border-blue-800" : "bg-blue-50 border-blue-200"}`}
          >
            <p
              className={`text-sm mb-1 ${isDarkMode ? "text-blue-200" : "text-blue-900"}`}
            >
              <span className="font-medium">
                Working Hours Summary:
              </span>
            </p>
            <p
              className={`text-sm ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}
            >
              Total coverage: 24 hours/day, 5 days/week. Shifts
              configured for Mon-Fri operations.
            </p>
          </div>

          {/* KPI Thresholds */}
          <div
            className={`border rounded-lg p-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle
                className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              />
              <h2
                className={
                  isDarkMode ? "text-white" : "text-gray-900"
                }
              >
                KPI Thresholds
              </h2>
            </div>

            <div className="space-y-4">
              {/* OTD Target */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label
                  className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  On-Time Delivery Target (%)
                </label>
                <input
                  type="number"
                  value={thresholds.otdTarget}
                  onChange={(e) =>
                    handleThresholdUpdate(
                      "otdTarget",
                      parseFloat(e.target.value),
                    )
                  }
                  min="0"
                  max="100"
                  className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                />
                <p
                  className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
                >
                  Orders below this target trigger alerts
                </p>
              </div>

              {/* Utilization Warning */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label
                  className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Utilization Warning Threshold (%)
                </label>
                <input
                  type="number"
                  value={thresholds.utilizationWarning}
                  onChange={(e) =>
                    handleThresholdUpdate(
                      "utilizationWarning",
                      parseFloat(e.target.value),
                    )
                  }
                  min="0"
                  max="100"
                  className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                />
                <p
                  className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
                >
                  Machines above this are considered bottlenecks
                </p>
              </div>

              {/* Downtime Alert */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label
                  className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Downtime Alert (minutes)
                </label>
                <input
                  type="number"
                  value={thresholds.downtimeAlert}
                  onChange={(e) =>
                    handleThresholdUpdate(
                      "downtimeAlert",
                      parseFloat(e.target.value),
                    )
                  }
                  min="0"
                  className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                />
                <p
                  className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
                >
                  Downtime exceeding this triggers alerts
                </p>
              </div>

              {/* Setup Time Warning */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label
                  className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Setup Time Warning (minutes)
                </label>
                <input
                  type="number"
                  value={thresholds.setupTimeWarning}
                  onChange={(e) =>
                    handleThresholdUpdate(
                      "setupTimeWarning",
                      parseFloat(e.target.value),
                    )
                  }
                  min="0"
                  className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                />
                <p
                  className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
                >
                  Setups exceeding this duration require review
                </p>
              </div>

              {/* OEE Target */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label
                  className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  OEE-Lite Target (%)
                </label>
                <input
                  type="number"
                  value={thresholds.oeeTarget}
                  onChange={(e) =>
                    handleThresholdUpdate(
                      "oeeTarget",
                      parseFloat(e.target.value),
                    )
                  }
                  min="0"
                  max="100"
                  className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                />
                <p
                  className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
                >
                  Overall equipment effectiveness goal
                </p>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div
            className={`border rounded-lg p-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Key
                className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              />
              <h2
                className={
                  isDarkMode ? "text-white" : "text-gray-900"
                }
              >
                API Keys & Integrations
              </h2>
            </div>

            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className={`border rounded-lg p-4 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <p
                        className={`text-sm mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {key.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type={
                            key.isVisible ? "text" : "password"
                          }
                          value={key.key}
                          readOnly
                          className={`flex-1 px-3 py-1.5 border rounded text-sm font-mono ${isDarkMode ? "bg-gray-900 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-300 text-gray-900"}`}
                        />
                        <button
                          onClick={() =>
                            toggleAPIKeyVisibility(key.id)
                          }
                          className={`p-2 rounded transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                          title={
                            key.isVisible ? "Hide" : "Show"
                          }
                        >
                          {key.isVisible ? (
                            <EyeOff
                              className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                            />
                          ) : (
                            <Eye
                              className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p
                    className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Last used: Never • Created: 2026-01-01
                  </p>
                </div>
              ))}
            </div>

            <div
              className={`mt-4 border rounded-lg p-4 ${isDarkMode ? "bg-yellow-900/30 border-yellow-800" : "bg-yellow-50 border-yellow-200"}`}
            >
              <p
                className={`text-sm mb-1 ${isDarkMode ? "text-yellow-200" : "text-yellow-900"}`}
              >
                <span className="font-medium">
                  ⚠️ Security Warning:
                </span>
              </p>
              <p
                className={`text-sm ${isDarkMode ? "text-yellow-300" : "text-yellow-800"}`}
              >
                API keys are placeholder values for
                demonstration. In production, store keys
                securely and never expose them in client-side
                code.
              </p>
            </div>
          </div>

          {/* Documentation & Diagrams */}
          <div
            className={`border rounded-lg p-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText
                className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              />
              <h2
                className={
                  isDarkMode ? "text-white" : "text-gray-900"
                }
              >
                Documentation & Diagrams
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Information Architecture Diagram */}
              <button
                onClick={() =>
                  navigate("demo/opti-flow-ia-diagram")
                }
                className={`text-left rounded-lg border-2 p-4 transition-all duration-300 group ${
                  isDarkMode
                    ? "bg-purple-900/20 border-purple-700 hover:border-purple-600 hover:shadow-lg hover:shadow-purple-500/20"
                    : "bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 hover:border-purple-300 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 ${
                      isDarkMode
                        ? "bg-purple-900/40"
                        : "bg-purple-100"
                    }`}
                  >
                    <Map
                      className={`w-6 h-6 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
                    />
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 ${isDarkMode ? "text-purple-400" : "text-purple-600"} group-hover:translate-x-1 transition-transform duration-300`}
                  />
                </div>
                <h3
                  className={`font-semibold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  Information Architecture
                </h3>
                <p
                  className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Complete application structure with all user
                  roles, screens, and navigation flows
                </p>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span
                    className={`px-2 py-1 rounded ${isDarkMode ? "bg-purple-900/40 text-purple-400" : "bg-purple-100 text-purple-700"}`}
                  >
                    3 User Roles
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${isDarkMode ? "bg-purple-900/40 text-purple-400" : "bg-purple-100 text-purple-700"}`}
                  >
                    48 Screens
                  </span>
                </div>
              </button>

              {/* AI Agent Flow Diagram */}
              <button
                onClick={() =>
                  navigate("demo/ai-agent-flow-diagram")
                }
                className={`text-left rounded-lg border-2 p-4 transition-all duration-300 group ${
                  isDarkMode
                    ? "bg-green-900/20 border-green-700 hover:border-green-600 hover:shadow-lg hover:shadow-green-500/20"
                    : "bg-gradient-to-br from-green-50 to-teal-50 border-green-200 hover:border-green-300 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 ${
                      isDarkMode
                        ? "bg-green-900/40"
                        : "bg-green-100"
                    }`}
                  >
                    <GitBranch
                      className={`w-6 h-6 ${isDarkMode ? "text-green-400" : "text-green-600"}`}
                    />
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 ${isDarkMode ? "text-green-400" : "text-green-600"} group-hover:translate-x-1 transition-transform duration-300`}
                  />
                </div>
                <h3
                  className={`font-semibold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  AI Agent Node Flow
                </h3>
                <p
                  className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  AI system architecture with validation,
                  fallback logic, and evidence grounding
                </p>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span
                    className={`px-2 py-1 rounded ${isDarkMode ? "bg-green-900/40 text-green-400" : "bg-green-100 text-green-700"}`}
                  >
                    Validation
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${isDarkMode ? "bg-green-900/40 text-green-400" : "bg-green-100 text-green-700"}`}
                  >
                    Fallback
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Info Panel */}
          <div
            className={`border rounded-lg p-4 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
          >
            <p
              className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              <span className="font-medium">
                Settings Help:
              </span>
            </p>
            <ul
              className={`text-sm space-y-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              <li>
                • Shift templates define when each shift
                operates
              </li>
              <li>
                • KPI thresholds determine when alerts are
                triggered
              </li>
              <li>
                • API keys enable external integrations (handle
                securely)
              </li>
              <li>
                • Changes take effect immediately after saving
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}