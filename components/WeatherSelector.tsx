
import React from 'react';
import { WeatherCondition, AppTheme } from '../types';
import { SunIcon, CloudIcon, SnowIcon, RainIcon } from './icons';

interface WeatherSelectorProps {
  currentWeather: WeatherCondition;
  onWeatherChange: (weather: WeatherCondition) => void;
  theme: AppTheme;
}

const weatherOptions: { name: WeatherCondition; icon: React.FC<{ className?: string }>; koreanName: string }[] = [
  { name: 'Clear', icon: SunIcon, koreanName: '맑음' },
  { name: 'Fog', icon: CloudIcon, koreanName: '흐림' },
  { name: 'Snow', icon: SnowIcon, koreanName: '눈' },
  { name: 'Rain', icon: RainIcon, koreanName: '비' },
];

const WeatherSelector: React.FC<WeatherSelectorProps> = ({ currentWeather, onWeatherChange, theme }) => {
  return (
    <div className={`flex justify-center items-center space-x-4 sm:space-x-6 p-4 rounded-full ${theme.cardBg}`}>
      {weatherOptions.map(({ name, icon: Icon, koreanName }) => (
        <button
          key={name}
          onClick={() => onWeatherChange(name)}
          className={`relative p-3 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.accentRing} ${
            currentWeather === name
              ? `${theme.accentBg} text-white`
              : `${theme.buttonBg} ${theme.buttonText} ${theme.accentHoverBg} ${theme.hoverText}`
          }`}
          aria-label={`${koreanName} 날씨 선택`}
        >
          <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
          {currentWeather === name && (
            <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 ${theme.accentIndicator} rounded-full`}></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default WeatherSelector;
