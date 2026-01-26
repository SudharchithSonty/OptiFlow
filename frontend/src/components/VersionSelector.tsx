import { useDarkMode } from './DarkModeContext';

interface VersionSelectorProps {
  versions: number[];
  currentVersion: number;
  onVersionChange: (version: number) => void;
}

export function VersionSelector({ versions, currentVersion, onVersionChange }: VersionSelectorProps) {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className="flex items-center gap-2">
      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Version:</span>
      <select
        value={currentVersion}
        onChange={(e) => onVersionChange(Number(e.target.value))}
        className={`border rounded px-3 py-1.5 ${
          isDarkMode
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'
        }`}
      >
        {versions.map((v) => (
          <option key={v} value={v}>
            v{v} {v === versions[versions.length - 1] && '(Latest)'}
          </option>
        ))}
      </select>
    </div>
  );
}