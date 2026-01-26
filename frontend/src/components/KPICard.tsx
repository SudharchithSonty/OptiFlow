import { KPI } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useDarkMode } from './DarkModeContext';

interface KPICardProps {
  kpi: KPI;
  showDelta?: boolean;
}

export function KPICard({ kpi, showDelta = true }: KPICardProps) {
  const { isDarkMode } = useDarkMode();
  
  const getTrendIcon = () => {
    if (!kpi.trend) return null;
    if (kpi.trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (kpi.trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getDeltaColor = () => {
    if (!kpi.delta) return 'text-gray-600';
    // For setup time and downtime, negative is good
    const isInverse = kpi.name.toLowerCase().includes('setup') || kpi.name.toLowerCase().includes('downtime');
    const isPositive = isInverse ? kpi.delta < 0 : kpi.delta > 0;
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className={`mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{kpi.name}</div>
      <div className="flex items-baseline gap-2">
        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
          {kpi.value} {kpi.unit}
        </span>
        {showDelta && kpi.delta !== undefined && (
          <span className={`flex items-center gap-1 ${getDeltaColor()}`}>
            {getTrendIcon()}
            <span>
              {kpi.delta > 0 ? '+' : ''}
              {kpi.delta} {kpi.unit}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}