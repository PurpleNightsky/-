import React, { useState, useMemo, useEffect, useRef } from 'react';
import { WeatherCondition, Mood, Song, AppTheme, RepeatMode, City } from './types';
import { kpopMusicData, getWeatherMoodMap, getSongsByMood } from './services/moodService';
import RegionSelector from './components/RegionSelector';
import RecommendationCard from './components/RecommendationCard';
import MusicChart from './components/MusicChart';
import PlayerControls from './components/PlayerControls';
import ModeToggle from './components/ModeToggle';
import WeatherSelector from './components/WeatherSelector';

const koreanWeatherMap: Record<WeatherCondition, string> = {
  Clear: '맑음',
  Fog: '흐림',
  Snow: '눈',
  Rain: '비',
};

const koreanCities: City[] = [
  { name: 'Seoul', koreanName: '서울', lat: 37.5665, lon: 126.9780 },
  { name: 'Busan', koreanName: '부산', lat: 35.1796, lon: 129.0756 },
  { name: 'Daegu', koreanName: '대구', lat: 35.8714, lon: 128.6014 },
  { name: 'Incheon', koreanName: '인천', lat: 37.4563, lon: 126.7052 },
  { name: 'Gwangju', koreanName: '광주', lat: 35.1595, lon: 126.8526 },
  { name: 'Daejeon', koreanName: '대전', lat: 36.3504, lon: 127.3845 },
  { name: 'Ulsan', koreanName: '울산', lat: 35.5384, lon: 129.3114 },
  { name: 'Jeju', koreanName: '제주', lat: 33.4996, lon: 126.5312 },
];

const themes: Record<WeatherCondition, AppTheme> = {
  Clear: {
    body: 'bg-sky-100',
    text: 'text-slate-800',
    secondaryText: 'text-slate-500',
    headerGradient: 'from-orange-400 to-amber-400',
    accentText: 'text-orange-500',
    accentBg: 'bg-orange-500',
    accentRing: 'focus:ring-orange-400',
    accentHoverBg: 'hover:bg-orange-500',
    accentIndicator: 'bg-orange-400',
    cardBg: 'bg-white/60 backdrop-blur-lg',
    buttonBg: 'bg-white/70',
    buttonText: 'text-slate-700',
    hoverText: 'hover:text-white',
    borderColor: 'border-slate-200',
    rowHoverBg: 'hover:bg-orange-500/10',
  },
  Fog: {
    body: 'bg-slate-900',
    text: 'text-white',
    secondaryText: 'text-slate-400',
    headerGradient: 'from-slate-400 to-gray-500',
    accentText: 'text-slate-300',
    accentBg: 'bg-slate-500',
    accentRing: 'focus:ring-slate-400',
    accentHoverBg: 'hover:bg-slate-500',
    accentIndicator: 'bg-slate-400',
    cardBg: 'bg-slate-800/50 backdrop-blur-sm',
    buttonBg: 'bg-slate-700/80',
    buttonText: 'text-slate-300',
    hoverText: 'hover:text-white',
    borderColor: 'border-slate-700',
    rowHoverBg: 'hover:bg-slate-700/50',
  },
  Snow: {
    body: 'bg-blue-950',
    text: 'text-white',
    secondaryText: 'text-slate-300',
    headerGradient: 'from-sky-300 to-indigo-400',
    accentText: 'text-sky-400',
    accentBg: 'bg-sky-500',
    accentRing: 'focus:ring-sky-400',
    accentHoverBg: 'hover:bg-sky-500',
    accentIndicator: 'bg-sky-400',
    cardBg: 'bg-blue-900/50 backdrop-blur-sm',
    buttonBg: 'bg-blue-800/80',
    buttonText: 'text-white',
    hoverText: 'hover:text-white',
    borderColor: 'border-blue-800',
    rowHoverBg: 'hover:bg-sky-500/20',
  },
  Rain: {
    body: 'bg-indigo-950',
    text: 'text-white',
    secondaryText: 'text-slate-400',
    headerGradient: 'from-blue-500 to-purple-500',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500',
    accentRing: 'focus:ring-cyan-400',
    accentHoverBg: 'hover:bg-cyan-500',
    accentIndicator: 'bg-cyan-400',
    cardBg: 'bg-indigo-900/50 backdrop-blur-sm',
    buttonBg: 'bg-indigo-800/80',
    buttonText: 'text-white',
    hoverText: 'hover:text-white',
    borderColor: 'border-indigo-800',
    rowHoverBg: 'hover:bg-cyan-500/20',
  },
};

const mapWeatherCodeToCondition = (code: number): WeatherCondition => {
  if (code >= 200 && code < 300) return 'Rain'; // Thunderstorm
  if (code >= 300 && code < 400) return 'Rain'; // Drizzle
  if (code >= 500 && code < 600) return 'Rain'; // Rain
  if (code >= 600 && code < 700) return 'Snow'; // Snow
  if (code >= 700 && code < 800) return 'Fog';  // Atmosphere (mist, fog, haze, etc.)
  if (code === 800) return 'Clear'; // Clear
  if (code > 800) return 'Fog';     // Clouds -> Mapped to Fog for '흐림'
  return 'Clear';
};


const App: React.FC = () => {
  const [weatherMode, setWeatherMode] = useState<'auto' | 'manual'>('auto');
  const [selectedCity, setSelectedCity] = useState<City>(koreanCities[0]);
  const [currentWeather, setCurrentWeather] = useState<WeatherCondition>('Clear');
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTheme = themes[currentWeather];

  const weatherMoodMap = useMemo(() => getWeatherMoodMap(), []);
  const happySongs = useMemo(() => getSongsByMood(kpopMusicData, 'happy'), []);
  const sadSongs = useMemo(() => getSongsByMood(kpopMusicData, 'sad'), []);

  const resetPlaylistForWeather = (weather: WeatherCondition) => {
    const newMood = weatherMoodMap.get(weather) || 'happy';
    const newSongList = newMood === 'happy' ? happySongs : sadSongs;
    if (newSongList.length > 0) {
      setCurrentSongIndex(Math.floor(Math.random() * newSongList.length));
    } else {
      setCurrentSongIndex(null);
    }
    setIsPlaying(false);
  }

  useEffect(() => {
    document.body.className = currentTheme.body;
  }, [currentTheme]);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoadingWeather(true);
      setWeatherError(null);
      try {
        const apiKey = "f9b11ade95ae313d1ea1334ec6033647";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "날씨 정보를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        const condition = mapWeatherCodeToCondition(data.weather[0].id);
        
        setCurrentWeather(condition);
        resetPlaylistForWeather(condition);

      } catch (error) {
        setWeatherError(error instanceof Error ? error.message : String(error));
        console.error(error);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    if (weatherMode === 'auto') {
      fetchWeather();
    }
  }, [selectedCity, weatherMode]);

  const currentMood: Mood = weatherMoodMap.get(currentWeather) || 'happy';
  const songListForCurrentMood = currentMood === 'happy' ? happySongs : sadSongs;

  const currentSong = currentSongIndex !== null ? songListForCurrentMood[currentSongIndex] : null;

  const handleCityChange = (cityName: string) => {
    const city = koreanCities.find(c => c.name === cityName);
    if (city) {
      setSelectedCity(city);
    }
  };

  const handleWeatherChange = (weather: WeatherCondition) => {
    setCurrentWeather(weather);
    resetPlaylistForWeather(weather);
  };

  const handleModeToggle = (newMode: 'auto' | 'manual') => {
    if (isLoadingWeather) return;
    setWeatherMode(newMode);
    if (newMode === 'manual') {
      setIsLoadingWeather(false);
      setWeatherError(null);
    }
  };
  
  const handlePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const handleNextSong = () => {
    if (songListForCurrentMood.length === 0) return;
    const newIndex = (currentSongIndex! + 1) % songListForCurrentMood.length;
    setCurrentSongIndex(newIndex);
  };

  const handlePrevSong = () => {
    if (songListForCurrentMood.length === 0) return;
    const newIndex = (currentSongIndex! - 1 + songListForCurrentMood.length) % songListForCurrentMood.length;
    setCurrentSongIndex(newIndex);
  };

  const handleSongSelect = (song: Song) => {
    const songIndex = songListForCurrentMood.findIndex(s => s['노래 제목'] === song['노래 제목'] && s['가수'] === song['가수']);
    if (songIndex !== -1) {
      setCurrentSongIndex(songIndex);
      setIsPlaying(true);
    }
  };

  const handleRepeatToggle = () => {
    const modes: RepeatMode[] = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const handleSongEnd = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'all') {
      handleNextSong();
    } else { // repeatMode is 'none'
      if (currentSongIndex === songListForCurrentMood.length - 1) {
        setIsPlaying(false);
      } else {
        handleNextSong();
      }
    }
  };

  const handlePlaylistCreate = () => {
    const videoIds = songListForCurrentMood
      .map(song => song.youtube_video_id)
      .filter((id): id is string => !!id);

    if (videoIds.length > 0) {
      const playlistUrl = `https://www.youtube.com/watch_videos?video_ids=${videoIds.join(',')}`;
      window.open(playlistUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('이 플레이리스트에 포함된 YouTube 영상을 찾을 수 없습니다.');
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSongIndex]);
  
  const playlistTitle = `플레이리스트: ${currentMood === 'happy' ? '신나는' : '감성적인'} 분위기`;

  return (
    <div className={`min-h-screen ${currentTheme.text} font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-500 pb-28`}>
      <audio 
        ref={audioRef}
        src={`https://storage.googleapis.com/specart-sites/speclabs/aistudio-prototyping/public/assets/sky_melody_preview.mp3`} // NOTE: Placeholder audio
        onEnded={handleSongEnd}
      />
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10 transition-all duration-500" 
        style={{backgroundImage: `url(https://picsum.photos/seed/${currentWeather}/1920/1080)`}}>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/10"></div>

      <main className="w-full max-w-5xl mx-auto z-10 flex flex-col items-center space-y-12">
        <header className="text-center space-y-4">
            <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r ${currentTheme.headerGradient} text-transparent bg-clip-text`}>
              하늘 멜로디
            </h1>
            <p className={`${currentTheme.secondaryText} text-lg max-w-2xl`}>
              {weatherMode === 'auto'
                ? '지역을 선택하고 현재 날씨에 맞는 K-Pop을 추천받으세요.'
                : '날씨를 선택하고 그에 맞는 K-Pop을 추천받으세요.'}
            </p>
        </header>
        
        <div className="flex flex-col items-center space-y-6">
          <ModeToggle
            mode={weatherMode}
            onToggle={handleModeToggle}
            theme={currentTheme}
            disabled={isLoadingWeather}
          />
          {weatherMode === 'auto' ? (
            <RegionSelector 
              cities={koreanCities}
              selectedCity={selectedCity.name}
              onCityChange={handleCityChange}
              theme={currentTheme}
              disabled={isLoadingWeather}
            />
          ) : (
            <WeatherSelector 
              currentWeather={currentWeather}
              onWeatherChange={handleWeatherChange}
              theme={currentTheme}
            />
          )}
        </div>

        <div className="w-full flex flex-col items-center space-y-6">
            {isLoadingWeather ? (
              <div className="text-center p-8">
                <p className="text-xl animate-pulse">날씨를 불러오는 중...</p>
              </div>
            ) : weatherError ? (
              <div className="text-center p-8 bg-red-500/10 text-red-500 rounded-lg">
                <p className="font-bold">오류 발생!</p>
                <p className="text-sm">{weatherError}</p>
              </div>
            ) : (
              <>
                <p className={`text-xl ${currentTheme.secondaryText} text-center`}>
                  {weatherMode === 'auto' ? (
                    <>
                      <span className={`font-bold ${currentTheme.accentText}`}>{selectedCity.koreanName}</span>의 현재 날씨는 <span className={`font-bold ${currentTheme.accentText}`}>{koreanWeatherMap[currentWeather]}</span>! 이 분위기에 어울리는 노래를 추천해 드릴게요.
                    </>
                  ) : (
                    <>
                      현재 선택된 날씨는 <span className={`font-bold ${currentTheme.accentText}`}>{koreanWeatherMap[currentWeather]}</span>! 이 분위기에 어울리는 노래를 추천해 드릴게요.
                    </>
                  )}
                </p>
                {currentSong ? (
                  <RecommendationCard
                    song={currentSong}
                    theme={currentTheme}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                  />
                ) : (
                  <p>이 분위기에 맞는 노래가 없습니다.</p>
                )}
              </>
            )}
        </div>
        
        <div className="w-full">
            <MusicChart 
              title={playlistTitle} 
              songs={songListForCurrentMood} 
              onSongSelect={handleSongSelect}
              onPlaylistCreate={handlePlaylistCreate}
              theme={currentTheme} 
              currentSong={currentSong}
              isPlaying={isPlaying}
            />
        </div>
      </main>
      
      {currentSong && !isLoadingWeather && !weatherError && (
        <PlayerControls
          currentSong={currentSong}
          isPlaying={isPlaying}
          repeatMode={repeatMode}
          onPlayPause={handlePlayPause}
          onNext={handleNextSong}
          onPrev={handlePrevSong}
          onRepeatToggle={handleRepeatToggle}
          theme={currentTheme}
        />
      )}
    </div>
  );
};

export default App;