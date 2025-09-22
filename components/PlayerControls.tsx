import React from 'react';
import { Song, AppTheme, RepeatMode } from '../types';
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon, RepeatIcon, RepeatOneIcon, YouTubeIcon } from './icons';

interface PlayerControlsProps {
  currentSong: Song;
  isPlaying: boolean;
  repeatMode: RepeatMode;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onRepeatToggle: () => void;
  theme: AppTheme;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentSong,
  isPlaying,
  repeatMode,
  onPlayPause,
  onNext,
  onPrev,
  onRepeatToggle,
  theme,
}) => {
  const RepeatModeIcon = repeatMode === 'one' ? RepeatOneIcon : RepeatIcon;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(currentSong['가수'] + ' ' + currentSong['노래 제목'])}`;

  return (
    <footer className={`fixed bottom-0 left-0 right-0 ${theme.cardBg} ${theme.text} shadow-2xl p-4 z-50`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 w-1/3">
          <img
            src={`https://picsum.photos/seed/${currentSong['노래 제목']}/100/100`}
            alt="앨범 아트"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-md shadow-md"
          />
          <div className="truncate flex-1">
            <p className="font-bold truncate" title={currentSong['노래 제목']}>{currentSong['노래 제목']}</p>
            <p className={`${theme.secondaryText} text-sm truncate hidden sm:block`}>{currentSong['가수']}</p>
          </div>
           <a
            href={youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full ${theme.secondaryText} hover:${theme.accentText} transition-colors flex-shrink-0`}
            aria-label={`${currentSong['노래 제목']} YouTube에서 듣기`}
          >
            <YouTubeIcon className="w-5 h-5" />
          </a>
        </div>

        <div className="flex items-center justify-center space-x-4 flex-1">
          <button
            onClick={onPrev}
            className={`p-2 rounded-full ${theme.accentHoverBg} ${theme.hoverText} transition-colors focus:outline-none focus:ring-2 ${theme.accentRing}`}
            aria-label="이전 곡"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={onPlayPause}
            className={`p-3 rounded-full ${theme.accentBg} text-white transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.accentRing} ${theme.accentRing}-offset-2`}
            aria-label={isPlaying ? '일시정지' : '재생'}
          >
            {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
          </button>
          <button
            onClick={onNext}
            className={`p-2 rounded-full ${theme.accentHoverBg} ${theme.hoverText} transition-colors focus:outline-none focus:ring-2 ${theme.accentRing}`}
            aria-label="다음 곡"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-end w-1/3">
           <button
            onClick={onRepeatToggle}
            className={`p-2 rounded-full ${theme.accentHoverBg} ${theme.hoverText} transition-colors relative focus:outline-none focus:ring-2 ${theme.accentRing}`}
            aria-label={`반복 모드: ${repeatMode}`}
          >
            <RepeatModeIcon className={`w-6 h-6 ${repeatMode !== 'none' ? theme.accentText : theme.secondaryText}`} />
            {repeatMode !== 'none' && <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 ${theme.accentIndicator} rounded-full`}></span>}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default PlayerControls;