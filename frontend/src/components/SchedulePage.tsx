import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { mockOrders, mockMachines } from '../types';
import { useDarkMode } from './DarkModeContext';

interface SchedulePageProps {
  role: 'owner' | 'planner' | 'supervisor';
}

export function SchedulePage({ role }: SchedulePageProps) {
  const { isDarkMode } = useDarkMode();
  const [selectedDate, setSelectedDate] = useState('2026-01-02');
  const [selectedShift, setSelectedShift] = useState<'A' | 'B' | 'C'>('A');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');

  const shifts = ['A', 'B', 'C'] as const;
  const shiftTimes = {
    A: '08:00 - 16:00',
    B: '16:00 - 00:00',
    C: '00:00 - 08:00',
  };

  // Filter orders for selected date and shift
  const scheduledOrders = mockOrders.filter(order => 
    order.scheduledStart && order.scheduledStart.startsWith(selectedDate)
  );

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>
          {role === 'supervisor' ? "Today's Schedule" : 'Production Schedule'}
        </h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          {role === 'supervisor' 
            ? 'View your assigned orders and tasks'
            : 'Manage shift schedules and machine allocation'}
        </p>
      </div>

      {/* Controls */}
      <div className={`rounded-lg border p-4 mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Date Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateDate('prev')}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <ChevronLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <CalendarIcon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`bg-transparent border-none outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              />
            </div>
            <button
              onClick={() => navigateDate('next')}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>

          {/* Shift Selection */}
          <div className="flex gap-2">
            {shifts.map((shift) => (
              <button
                key={shift}
                onClick={() => setSelectedShift(shift)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedShift === shift
                    ? 'bg-blue-600 text-white'
                    : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>Shift {shift}</span>
                <span className="text-xs block mt-1 opacity-80">{shiftTimes[shift]}</span>
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          {role === 'planner' && (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === 'timeline' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
              >
                List
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Content */}
      {viewMode === 'timeline' ? (
        <div className={`rounded-lg border p-4 lg:p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Machine Timeline - Shift {selectedShift}</h2>
          
          {/* Timeline Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Time Header */}
              <div className="flex mb-4">
                <div className="w-32 flex-shrink-0" />
                <div className="flex-1 grid grid-cols-8 gap-px">
                  {Array.from({ length: 8 }, (_, i) => {
                    const hour = selectedShift === 'A' ? 8 + i : selectedShift === 'B' ? 16 + i : i;
                    return (
                      <div key={i} className={`text-xs text-center pb-2 border-b ${isDarkMode ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200'}`}>
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Machine Rows */}
              {mockMachines.map((machine) => {
                const machineOrders = scheduledOrders.filter(o => o.assignedMachine === machine.id);
                
                return (
                  <div key={machine.id} className="flex mb-3">
                    <div className="w-32 flex-shrink-0 pr-4">
                      <div className={`p-2 rounded-lg ${
                        machine.status === 'operational' ? 'bg-green-50' :
                        machine.status === 'maintenance' ? 'bg-yellow-50' :
                        'bg-red-50'
                      }`}>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-900' : 'text-gray-900'}`}>{machine.name}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-700' : 'text-gray-600'}`}>{machine.type}</p>
                      </div>
                    </div>
                    
                    <div className={`flex-1 relative h-16 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      {machineOrders.map((order) => {
                        const startTime = new Date(order.scheduledStart!);
                        const endTime = new Date(order.scheduledEnd!);
                        const shiftStart = selectedShift === 'A' ? 8 : selectedShift === 'B' ? 16 : 0;
                        const startHour = startTime.getHours() + startTime.getMinutes() / 60;
                        const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                        
                        const left = ((startHour - shiftStart) / 8) * 100;
                        const width = (duration / 8) * 100;
                        
                        return (
                          <div
                            key={order.id}
                            className={`absolute top-1 bottom-1 rounded px-2 py-1 ${
                              order.priority === 'rush' ? 'bg-red-500 text-white' :
                              order.priority === 'high' ? 'bg-orange-500 text-white' :
                              'bg-blue-500 text-white'
                            }`}
                            style={{ left: `${left}%`, width: `${width}%` }}
                          >
                            <p className="text-xs truncate">{order.orderNumber}</p>
                            <p className="text-xs opacity-90 truncate">{order.product}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className={`rounded-lg border p-4 lg:p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Scheduled Orders - Shift {selectedShift}</h2>
          
          {scheduledOrders.length > 0 ? (
            <div className="space-y-3">
              {scheduledOrders.map((order) => (
                <div key={order.id} className={`border rounded-lg p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>{order.orderNumber}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          order.priority === 'rush' ? 'bg-red-100 text-red-700' :
                          order.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.priority}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          order.status === 'in-progress' ? 'bg-green-100 text-green-700' :
                          order.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className={`mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{order.product}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Customer: {order.customer} · Quantity: {order.quantity}
                      </p>
                    </div>
                  </div>

                  <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div>
                      <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Machine</p>
                      <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.assignedMachine}</p>
                    </div>
                    <div>
                      <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Start Time</p>
                      <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {order.scheduledStart ? new Date(order.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>End Time</p>
                      <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {order.scheduledEnd ? new Date(order.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Time</p>
                      <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.setupTime + order.runTime}m</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No orders scheduled for this shift</p>
            </div>
          )}
        </div>
      )}

      {/* Machine Status Summary */}
      <div className={`mt-6 rounded-lg border p-4 lg:p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Machine Status</h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {mockMachines.map((machine) => (
            <div key={machine.id} className={`p-3 border rounded-lg ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{machine.name}</p>
                <span className={`w-2 h-2 rounded-full ${
                  machine.status === 'operational' ? 'bg-green-500' :
                  machine.status === 'maintenance' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{machine.type}</p>
              <p className={`text-xs mt-1 ${
                machine.status === 'operational' ? 'text-green-700' :
                machine.status === 'maintenance' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {machine.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}