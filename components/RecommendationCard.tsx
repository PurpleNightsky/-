import React, { useState, useEffect } from 'react';
import { Song, AppTheme } from '../types';
import { PlayIcon, PauseIcon, YouTubeIcon } from './icons';

interface RecommendationCardProps {
  song: Song;
  theme: AppTheme;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ song, theme, isPlaying, onPlayPause }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    setIsImageLoaded(false);
  }, [song]);

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(song['가수'] + ' ' + song['노래 제목'])}`;

  return (
    <div className="w-full max-w-md mx-auto relative animate-fade-in">
      <div className={`${theme.cardBg} rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-center flex flex-col items-center justify-center`}>
        <div className="relative group w-32 h-32 sm:w-40 sm:h-40 mb-6">
          <img
            key={song['노래 제목']}
            src={`https://picsum.photos/seed/${song['노래 제목']}/400/400`}
            alt="앨범 아트"
            className={`w-full h-full rounded-lg shadow-lg border-4 ${theme.borderColor} object-cover transition-opacity duration-500 ease-in-out ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={onPlayPause}
              className={`text-white p-3 rounded-full ${theme.accentBg} ${theme.accentHoverBg} transition-colors focus:outline-none focus:ring-2 ${theme.accentRing}`}
              aria-label={isPlaying ? '일시정지' : '재생'}
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              ) : (
                <PlayIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              )}
            </button>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight truncate w-full" title={song['노래 제목']}>
          {song['노래 제목']}
        </h2>
        <p className={`${theme.secondaryText} text-lg sm:text-xl mt-2`}>{song['가수']}</p>
        <a
          href={youtubeSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors ${theme.buttonBg} ${theme.buttonText} ${theme.accentHoverBg} ${theme.hoverText} focus:outline-none focus:ring-2 ${theme.accentRing}`}
        >
          <YouTubeIcon className="w-5 h-5" />
          <span>YouTube에서 듣기</span>
        </a>
      </div>
    </div>
  );
};

export default RecommendationCard;