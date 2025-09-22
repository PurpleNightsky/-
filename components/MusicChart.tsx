
import React from 'react';
import { Song, AppTheme } from '../types';
import { MusicNoteIcon, YouTubeIcon, PlaylistAddIcon } from './icons';

interface MusicChartProps {
  title: string;
  songs: Song[];
  onSongSelect: (song: Song) => void;
  onPlaylistCreate: () => void;
  theme: AppTheme;
  currentSong: Song | null;
  isPlaying: boolean;
}

const MusicChart: React.FC<MusicChartProps> = ({ title, songs, onSongSelect, onPlaylistCreate, theme, currentSong, isPlaying }) => {
  return (
    <div className={`w-full max-w-4xl mx-auto ${theme.cardBg} rounded-2xl shadow-2xl p-6 sm:p-8`}>
      <div className={`flex justify-between items-center mb-6 border-b-2 ${theme.borderColor} pb-4`}>
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        <button
          onClick={onPlaylistCreate}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${theme.buttonBg} ${theme.buttonText} ${theme.accentHoverBg} ${theme.hoverText} focus:outline-none focus:ring-2 ${theme.accentRing}`}
          aria-label="이 플레이리스트로 YouTube 재생목록 만들기"
          disabled={songs.every(song => !song.youtube_video_id)}
        >
          <YouTubeIcon className="w-5 h-5" />
          <span>YouTube 플레이리스트</span>
        </button>
      </div>
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
        {songs.map((song, index) => {
          const isActive = currentSong?.['노래 제목'] === song['노래 제목'] && currentSong?.['가수'] === song['가수'];
          const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(song['가수'] + ' ' + song['노래 제목'])}`;
          return (
            <div
              key={`${song['노래 제목']}-${index}`}
              className={`flex items-center p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                isActive ? `${theme.accentBg}/20` : theme.rowHoverBg
              }`}
              onClick={() => onSongSelect(song)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && onSongSelect(song)}
              aria-label={`${song['가수']}의 ${song['노래 제목']} 선택하기`}
            >
              <div className="font-mono text-lg w-10 text-center relative">
                {isActive && isPlaying ? (
                    <MusicNoteIcon className={`w-6 h-6 mx-auto ${theme.accentText}`} />
                ) : (
                    <span className={isActive ? theme.accentText : theme.secondaryText}>{index + 1}</span>
                )}
              </div>
              <img 
                src={`https://picsum.photos/seed/${song['가수']}/100/100`}
                alt={song['가수']}
                className="w-12 h-12 rounded-md object-cover mx-4"
              />
              <div className="flex-1 truncate">
                <p className={`font-semibold truncate ${isActive ? theme.accentText : ''}`} title={song['노래 제목']}>{song['노래 제목']}</p>
                <p className={`${theme.secondaryText} text-sm truncate`}>{song['가수']}</p>
              </div>
              <a
                href={youtubeSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`ml-4 p-2 rounded-full ${theme.secondaryText} hover:${theme.accentText} transition-colors`}
                aria-label={`${song['노래 제목']} YouTube에서 검색`}
              >
                <YouTubeIcon className="w-6 h-6" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MusicChart;