import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Settings,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Wrench,
  ClipboardCheck,
  TrendingDown,
  ChevronRight,
  Bell,
  Calendar,
} from "lucide-react";
import { useDarkMode } from "../DarkModeContext";

interface Machine {
  id: string;
  name: string;
  status: "running" | "idle" | "setup" | "down";
  currentOp?: string;
  nextSetup?: string;
  nextSetupTime?: string;
}

interface UpcomingSetup {
  id: string;
  machineId: string;
  machineName: string;
  fromProduct: string;
  toProduct: string;
  scheduledTime: string;
  estimatedDuration: number;
}

interface LateOrder {
  id: string;
  orderId: string;
  orderName: string;
  dueTime: string;
  currentStatus: string;
  delayMinutes: number;
}

interface Alert {
  id: string;
  type: "downtime" | "at-risk" | "changeover" | "late";
  severity: "high" | "medium" | "low";
  title: string;
  time: string;
}

const mockMachines: Machine[] = [
  {
    id: "M01",
    name: "CNC Mill 1",
    status: "running",
    currentOp: "ORD-1234 Op 2",
    nextSetup: "Bracket tooling",
    nextSetupTime: "14:30",
  },
  {
    id: "M03",
    name: "Press 3",
    status: "down",
    currentOp: undefined,
  },
  {
    id: "M05",
    name: "Drill 5",
    status: "setup",
    currentOp: "Changing bits",
    nextSetup: undefined,
  },
];

const mockUpcomingSetups: UpcomingSetup[] = [
  {
    id: "SETUP-001",
    machineId: "M01",
    machineName: "CNC Mill 1",
    fromProduct: "Widget A",
    toProduct: "Bracket B",
    scheduledTime: "14:30",
    estimatedDuration: 15,
  },
  {
    id: "SETUP-002",
    machineId: "M04",
    machineName: "Grinder 4",
    fromProduct: "Cover C",
    toProduct: "Shaft D",
    scheduledTime: "15:00",
    estimatedDuration: 20,
  },
];

const mockLateOrders: LateOrder[] = [
  {
    id: "LATE-001",
    orderId: "ORD-1234",
    orderName: "Widget A Production",
    dueTime: "16:00",
    currentStatus: "In Progress",
    delayMinutes: 45,
  },
  {
    id: "LATE-002",
    orderId: "ORD-1238",
    orderName: "Gear Pressing",
    dueTime: "17:00",
    currentStatus: "Not Started",
    delayMinutes: 120,
  },
];

const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    type: "downtime",
    severity: "high",
    title: "M03 Hydraulic failure - requires maintenance",
    time: "11:30",
  },
  {
    id: "ALT-002",
    type: "late",
    severity: "high",
    title: "ORD-1234 at risk of missing 16:00 deadline",
    time: "13:00",
  },
  {
    id: "ALT-003",
    type: "changeover",
    severity: "medium",
    title: "M01 requires 3rd setup today - check tooling",
    time: "13:45",
  },
];

const statusConfig = {
  running: {
    label: "Running",
    color: "text-green-700",
    bgColor: "bg-green-100",
    icon: CheckCircle2,
  },
  idle: {
    label: "Idle",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    icon: Clock,
  },
  setup: {
    label: "Setup",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    icon: Wrench,
  },
  down: {
    label: "Down",
    color: "text-red-700",
    bgColor: "bg-red-100",
    icon: XCircle,
  },
};

export function TodayDashboard() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [currentTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );

  const handleMachineClick = (machineId: string) => {
    navigate(`/app/machines/${machineId}`);
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/app/orders/${orderId}`);
  };

  const handleAlertClick = (alertId: string) => {
    navigate("/app/alerts");
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // Navigate to specific pages
    if (action === "breakdown") {
      navigate("/app/machines/M03"); // Example - would be dynamic
    } else if (action === "setup-actuals") {
      navigate("/app/machines/M01/setup-actuals");
    } else if (action === "first-piece") {
      navigate("/app/machines/M01/first-piece-quality");
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4">
          {/* Title Row with View Schedule Button */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-gray-900 dark:text-gray-100">
                  Today's Production
                </h1>
                <button
                  onClick={() => navigate("/app/schedule")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    View Schedule
                  </span>
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Shift A • 2026-01-01 • Current Time:{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {currentTime}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-xl text-green-600 dark:text-green-400">
                {
                  mockMachines.filter(
                    (m) => m.status === "running",
                  ).length
                }
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Running
              </p>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />
            <div className="text-center">
              <p className="text-xl text-red-600 dark:text-red-400">
                {
                  mockMachines.filter(
                    (m) => m.status === "down",
                  ).length
                }
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Down
              </p>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />
            <div className="text-center">
              <p className="text-xl text-orange-600 dark:text-orange-400">
                {mockLateOrders.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Late
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Quick Actions */}
          <div>
            <h2 className="text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleQuickAction("breakdown")}
                className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-3"
              >
                <AlertTriangle className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-medium">Log Breakdown</p>
                  <p className="text-sm text-red-100">
                    Report machine issue
                  </p>
                </div>
              </button>

              <button
                onClick={() =>
                  handleQuickAction("setup-actuals")
                }
                className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-3"
              >
                <Wrench className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-medium">
                    Log Setup Actuals
                  </p>
                  <p className="text-sm text-blue-100">
                    Record setup time
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction("first-piece")}
                className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-3"
              >
                <ClipboardCheck className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-medium">
                    Log First-Piece Check
                  </p>
                  <p className="text-sm text-green-100">
                    Quality verification
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Two Column Layout on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* My Machines */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900 dark:text-gray-100">
                    My Machines
                  </h2>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {mockMachines.length} assigned
                  </span>
                </div>
                <div className="space-y-3">
                  {mockMachines.map((machine) => {
                    const statusInfo =
                      statusConfig[machine.status];
                    const Icon = statusInfo.icon;

                    return (
                      <button
                        key={machine.id}
                        onClick={() =>
                          handleMachineClick(machine.id)
                        }
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all text-left"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <p className="text-gray-900 dark:text-gray-100">
                                {machine.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                {machine.id}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${statusInfo.bgColor} ${statusInfo.color}`}
                          >
                            <Icon className="w-4 h-4" />
                            {statusInfo.label}
                          </span>
                          {machine.currentOp && (
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {machine.currentOp}
                            </p>
                          )}
                        </div>

                        {machine.nextSetup && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Next Setup:
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                {machine.nextSetup}
                              </p>
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                {machine.nextSetupTime}
                              </p>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming Setups */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900 dark:text-gray-100">
                    Upcoming Setups
                  </h2>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {mockUpcomingSetups.length} today
                  </span>
                </div>
                <div className="space-y-3">
                  {mockUpcomingSetups.map((setup) => (
                    <div
                      key={setup.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-gray-100">
                              {setup.machineName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                              {setup.machineId}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            {setup.scheduledTime}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {setup.estimatedDuration} min
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {setup.fromProduct}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">
                          →
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {setup.toProduct}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Late Orders */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900 dark:text-gray-100">
                    Late Orders
                  </h2>
                  <span className="text-sm text-red-600 dark:text-red-400">
                    {mockLateOrders.length} items
                  </span>
                </div>
                <div className="space-y-3">
                  {mockLateOrders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() =>
                        handleOrderClick(order.orderId)
                      }
                      className="w-full bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg p-4 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-mono text-sm text-gray-900 dark:text-gray-100">
                              {order.orderId}
                            </p>
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded">
                              Late
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-400">
                            {order.orderName}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Due Time:
                          </p>
                          <p className="text-gray-900 dark:text-gray-100">
                            {order.dueTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Delayed By:
                          </p>
                          <p className="text-red-600 dark:text-red-400">
                            {order.delayMinutes} min
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Status:{" "}
                          <span className="text-gray-900 dark:text-gray-100">
                            {order.currentStatus}
                          </span>
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Alerts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900 dark:text-gray-100">
                    Top Alerts
                  </h2>
                  <button
                    onClick={() => navigate("/app/alerts")}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {mockAlerts.map((alert) => {
                    const bgColor =
                      alert.severity === "high"
                        ? "bg-red-50"
                        : alert.severity === "medium"
                          ? "bg-orange-50"
                          : "bg-yellow-50";
                    const borderColor =
                      alert.severity === "high"
                        ? "border-red-200"
                        : alert.severity === "medium"
                          ? "border-orange-200"
                          : "border-yellow-200";
                    const iconColor =
                      alert.severity === "high"
                        ? "text-red-600"
                        : alert.severity === "medium"
                          ? "text-orange-600"
                          : "text-yellow-600";

                    return (
                      <button
                        key={alert.id}
                        onClick={() =>
                          handleAlertClick(alert.id)
                        }
                        className={`w-full border rounded-lg p-4 hover:shadow-sm transition-all text-left ${bgColor} ${borderColor}`}
                      >
                        <div className="flex items-start gap-3">
                          <Bell
                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                              {alert.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {alert.time}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}