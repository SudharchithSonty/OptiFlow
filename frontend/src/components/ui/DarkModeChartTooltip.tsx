import { useDarkMode } from '../DarkModeContext';

export function useDarkModeChartStyles() {
  const { isDarkMode } = useDarkMode();

  return {
    cartesianGrid: {
      stroke: isDarkMode ? '#374151' : '#e5e7eb',
    },
    axis: {
      stroke: isDarkMode ? '#9ca3af' : '#6b7280',
      tick: { fill: isDarkMode ? '#9ca3af' : '#6b7280' },
    },
    tooltip: {
      contentStyle: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
        borderRadius: '12px',
        color: isDarkMode ? '#f3f4f6' : '#111827',
        boxShadow: isDarkMode 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      labelStyle: {
        color: isDarkMode ? '#f3f4f6' : '#111827',
        fontWeight: 600,
      },
    },
    legend: {
      wrapperStyle: { 
        color: isDarkMode ? '#f3f4f6' : '#111827',
      },
    },
  };
}
