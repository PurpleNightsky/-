export type WeatherCondition = 'Clear' | 'Fog' | 'Snow' | 'Rain';

export type Mood = 'happy' | 'sad';

export type RepeatMode = 'none' | 'all' | 'one';

export interface WeatherMoodEntry {
  weather_conditions: WeatherCondition;
  mood_fitness: string;
  mood_fitness_binary: Mood;
}

export interface Song {
  '노래 제목': string;
  '가수': string;
  mood_hits_en: Mood;
  youtube_video_id?: string;
}

export interface AppTheme {
  body: string;
  text: string;
  secondaryText: string;
  headerGradient: string;
  accentText: string;
  accentBg: string;
  accentRing: string;
  accentHoverBg: string;
  accentIndicator: string;
  cardBg: string;
  buttonBg: string;
  buttonText: string;
  hoverText: string;
  borderColor: string;
  rowHoverBg: string;
}

export interface City {
  name: string;
  koreanName: string;
  lat: number;
  lon: number;
}
