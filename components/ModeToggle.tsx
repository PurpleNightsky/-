import React from 'react';
import { AppTheme } from '../types';

interface ModeToggleProps {
  mode: 'auto' | 'manual';
  onToggle: (mode: 'auto' | 'manual') => void;
  theme: AppTheme;
  disabled: boolean;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onToggle, theme, disabled }) => {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const activeClasses = `${theme.accentBg} text-white ${theme.accentRing}`;
  const inactiveClasses = `${theme.buttonBg} ${theme.buttonText} ${theme.accentHoverBg} ${theme.hoverText} ${theme.accentRing}`;

  return (
    <div className={`flex p-1 space-x-1 rounded-full ${theme.cardBg} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button
        onClick={() => !disabled && onToggle('auto')}
        disabled={disabled}
        className={`${baseClasses} ${mode === 'auto' ? activeClasses : inactiveClasses}`}
        aria-pressed={mode === 'auto'}
      >
        실시간 날씨
      </button>
      <button
        onClick={() => !disabled && onToggle('manual')}
        disabled={disabled}
        className={`${baseClasses} ${mode === 'manual' ? activeClasses : inactiveClasses}`}
        aria-pressed={mode === 'manual'}
      >
        직접 선택
      </button>
    </div>
  );
};

export default ModeToggle;
