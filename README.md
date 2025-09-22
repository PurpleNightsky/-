날씨 기반 음악 추천 앱이에요. 앱을 켜면 **맨 위에 현재 날씨(맑음, 흐림, 비, 눈)**가 딱 뜨고, 그 밑에는 날씨에 맞춰 오늘 추천 음악 한 곡을 보여줘요. (예: 맑음 → 슬픔 차트, 흐림 → 행복 차트) 추천 곡은 좌우 화살표 눌러서 다른 곡으로 넘겨볼 수 있고, 화면을 아래로 내리면 전체 인기차트도 확인할 수 있어요!

PRD: 날씨 기반 음악 추천 앱
1. 제품 개요
제품명: 하늘멜로디


설명: 사용자의 일상적인 날씨와 기분을 기반으로 맞춤 음악을 추천하는 앱.
핵심 가치: “날씨가 만드는 기분, 기분이 고르는 노래.”
타겟 사용자: 날씨나 기분에 따라 음악을 듣고 싶은 일반 사용자, 감정 맞춤 음악 경험을 원하는 Z세대 및 MZ세대.

2. 목적
사용자의 날씨/기분 데이터를 반영해 맞춤 음악 추천 경험 제공
단순한 음악 추천을 넘어 오늘의 감정에 어울리는 해석적 경험 제공
추천 기반 음악 소비를 늘려 사용자 체류 시간과 재사용률 증가

3. 사용자 시나리오
사용자가 앱을 열면 오늘의 날씨와 기분이 표시된다.
앱은 사용자 기분 기록 또는 날씨 기반 기분 예측 로직으로 오늘의 기분을 결정한다.
결정된 기분에 따라 “행복차트” 혹은 “슬픔차트”에서 음악을 추천한다.
사용자는 추천된 곡을 듣거나, 같은 차트에서 다른 곡을 탐색할 수 있다.
인기차트를 통해 다른 사용자가 많이 들은 음악도 확인 가능하다.

4. 기능 요구사항
4.1 데이터 입력
Daily Weather & Mood JSON
date: YYYY-MM-DD
weather: {맑음, 비, 눈, 흐림}
mood: {피곤함, 행복, 중립, 스트레스} (Optional)
Music List JSON
title, artist, chart_type, rank, album, duration, image_url, preview_url

4.2 추천 로직
오늘 날짜와 일치하는 데이터 선택
기분 데이터(mood)가 있으면 최우선 사용
없으면 날씨 기반 기분 추정 규칙 적용
맑음 → 행복
흐림/눈 → 중립
비 → 스트레스
기분에 따라 차트 선택
행복·중립 → 행복차트
피곤함·스트레스 → 슬픔차트
차트 내 랜덤 혹은 상위 N곡 추천

4.3 UI 출력 (한국어)
헤더: 오늘, 당신의 날씨와 음악
날씨·기분 섹션: 오늘의 날씨/기분 + 간단한 설명
추천 곡 카드: 곡 정보, 태그, 버튼(듣기/담기), 탐색 화살표
다른 음악 추천 섹션: 같은 차트에서 추가 곡 리스트
인기차트 섹션: 오늘 TOP 트랙 + 보조정보 표시
Copy Bank: 기분별 설명 문구 제공

5. UI/UX 요구사항
한국어 인터페이스 유지
카드형 UI, 좌/우 탐색 가능
“듣기/재생목록 담기” 버튼 제공
감정별 카피 문구 자동 출력
반응형 UI (모바일 우선)

6. 비기능 요구사항
성능: 추천 결과는 1초 이내 로딩
확장성: 음악 데이터셋 확장 시 로직 그대로 적용 가능
호환성: iOS, Android, Web 지원
데이터 보안: 사용자 mood 기록은 로컬 우선, 선택적 클라우드 동기화

7. 성공 지표 (KPI)
일간 활성 사용자(DAU)
평균 체류 시간
추천곡 재생 클릭률(CTR)
재사용률(리텐션)
플레이리스트 담기 비율


프롬프트
You are a music recommendation assistant. Your task is to recommend a song to the user based on today's weather and mood, using two input datasets.

--- INPUT DATA ---

1. Daily Weather & Mood (JSON object):
- Fields:
  - date (string, format: YYYY-MM-DD)
  - weather ∈ {맑음, 비, 눈, 흐림}
  - mood ∈ {피곤함, 행복, 중립, 스트레스}  // Optional

2. Music List (JSON array):
- Each object contains:
  - title (string)
  - artist (string)
  - chart_type ∈ {행복차트, 슬픔차트}
  - rank (integer)
  - album (optional)
  - duration (optional)
  - image_url (optional)
  - preview_url (optional)

--- LOGIC ---

1. Use today’s date (match with `date` field in first dataset).
2. If a `mood` is present, use it as the final mood.
3. If `mood` is missing:
   - Estimate mood based on `weather` using the following rules:
     - 맑음 → 행복
     - 흐림 → 중립
     - 비 → 스트레스
     - 눈 → 중립
4. Based on final mood:
   - If mood ∈ {행복, 중립} → randomly select or top-N from chart_type = "행복차트"
   - If mood ∈ {피곤함, 스트레스} → randomly select or top-N from chart_type = "슬픔차트"

--- UI OUTPUT (in Korean) ---

[Header Section]
- 타이틀: 오늘, 당신의 날씨와 음악
- 서브: 날씨가 만드는 기분, 기분이 고르는 노래

[Weather & Mood Section]
- 오늘의 날씨: {weather}
- 오늘의 기분: {mood} (예측)
- 설명: 오늘은 {weather}이라서 {mood}에 가깝네요. 기분에 맞는 음악을 추천할게요.

[Recommended Music Card]
- 섹션 타이틀: 오늘의 추천 한 곡
- 곡 정보: {title} – {artist}
- 태그: #행복차트 또는 #슬픔차트
- 설명:
  - mood ∈ {행복, 중립} → 기분이 한결 가벼워지는 리듬, 지금 딱 어울려요.
  - mood ∈ {피곤함, 스트레스} → 조용히 감정에 기대어 쉬어갈 시간이에요.
- 버튼: 듣기 / 재생목록에 담기
- 화살표 툴팁: 이전 추천 / 다음 추천

[Other Songs Section]
- 섹션 타이틀: 다른 음악도 들어볼까요?
- 설명: 지금 기분과 같은 차트에서 더 골라보세요.
- 카드 반복: {rank}. {title} – {artist}

[Popular Chart Section]
- 섹션 타이틀: 인기차트
- 설명: 모두가 사랑한 오늘의 TOP 트랙
- 반복 항목: {rank}. {title} – {artist}
- 보조정보: {album} · {duration}
- 버튼: 듣기 / 담기

[Copy Bank based on mood]
- mood ∈ {행복, 중립}:
  - 햇살 같은 비트로 오늘을 더 가볍게.
  - 기분 좋은 한 곡, 지금 떠나볼까요?
  - 리듬에 발맞춰, 오늘도 온기 가득하게.
- mood ∈ {피곤함, 스트레스}:
  - 조용히 감정에 기대어 숨을 고르는 시간.
  - 무겁던 마음, 음악으로 살짝 내려놓기.
  - 잔잔한 선율이 오늘을 감싸줄 거예요.


사용 데이터셋
https://www.kaggle.com/datasets/smayanj/fitness-tracker-dataset 

https://www.kaggle.com/datasets/jojoyin/mood-weather 
