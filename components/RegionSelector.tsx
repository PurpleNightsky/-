import React from 'react';
import { City, AppTheme } from '../types';
import { LocationMarkerIcon } from './icons';

interface RegionSelectorProps {
  cities: City[];
  selectedCity: string;
  onCityChange: (cityName: string) => void;
  theme: AppTheme;
  disabled: boolean;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ cities, selectedCity, onCityChange, theme, disabled }) => {
  return (
    <div className={`relative flex items-center ${theme.cardBg} rounded-full shadow-md`}>
      <div className={`pl-4 pr-2 pointer-events-none absolute inset-y-0 left-0 flex items-center ${theme.secondaryText}`}>
        <LocationMarkerIcon className="w-6 h-6" />
      </div>
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        disabled={disabled}
        className={`w-48 sm:w-56 appearance-none rounded-full border-2 ${theme.borderColor} ${theme.buttonBg} py-3 pl-12 pr-8 text-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 ${theme.accentRing} disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="도시 선택"
      >
        {cities.map(city => (
          <option key={city.name} value={city.name}>
            {city.koreanName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionSelector;
