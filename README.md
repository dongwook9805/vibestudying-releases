# VibeStudying Public Site & Releases

이 저장소는 VibeStudying의 public 저장소입니다.

- GitHub Pages 홈페이지
- Mac / Windows direct 배포 릴리즈 자산

## Live

- Site: `https://dongwook9805.github.io/vibestudying-releases/`
- Releases: `https://github.com/dongwook9805/vibestudying-releases/releases`
- Feedback board: homepage embedded board

## Desktop 배포

- `.dmg`: 신규 설치
- `-mac.zip` + `latest-mac.yml`: 앱 내부 자동 업데이트
- `.exe`: 신규 설치
- `.exe.blockmap` + `latest.yml`: 앱 내부 자동 업데이트

## 채널 정책

- `Mac / Windows`: direct download
- `iPad / iPhone`: App Store

## 홈페이지 피드백 보드 설정

GitHub Pages는 정적 사이트라서, 홈페이지 피드백 보드는 `Google Sheets + Google Apps Script` 저장소를 기준으로 구성되어 있습니다.

필요한 파일:

- `community-config.js`
- `google-feedback-board.gs`

### 1. Google Sheet 만들기

시트 이름:

- `Feedback`

첫 행 헤더:

- `id`
- `nickname`
- `message`
- `page_url`
- `created_at`
- `status`

### 2. Google Apps Script 붙이기

1. Google Sheet에서 `확장 프로그램 > Apps Script`
2. `google-feedback-board.gs` 내용을 그대로 붙여넣기
3. `배포 > 새 배포`
4. 유형: `웹 앱`
5. 실행 사용자: `나`
6. 액세스 권한: `모든 사용자`
7. 배포 후 `웹 앱 URL` 복사

### 3. 홈페이지 연결

`community-config.js`에 Apps Script URL을 넣습니다.

```js
window.VIBESTUDYING_COMMUNITY_CONFIG = {
  endpoint: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
};
```

### 동작 방식

- 읽기: 홈페이지가 Apps Script에서 최근 피드백을 읽어옵니다
- 쓰기: 사용자가 홈페이지에서 바로 피드백을 남깁니다
- 공개 여부: 시트의 `status`가 `public`인 항목만 홈페이지에 보입니다

즉 피드백을 숨기고 싶으면 해당 행의 `status`를 `hidden`으로 바꾸면 됩니다.
