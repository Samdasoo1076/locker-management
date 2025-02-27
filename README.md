# 사물함 관리 시스템

React와 Node.js를 사용한 사물함 관리 시스템입니다. 사물함 배치, 사용자 등록, 수정, 해제 등의 기능을 제공합니다.

## 기능

- 사물함 배치도 시각화
- 사물함 크기 조정 (행/열)
- 사용자 등록 및 수정
- 사용 기간 관리
- 실시간 상태 확인

## 시스템 요구사항

- Node.js 14.0.0 이상
- MariaDB 10.0 이상
- npm 또는 yarn

## 설치 방법

1. 저장소 클론

```bash
git clone [repository-url]
cd locker-management
```

2. 데이터베이스 설정

```sql
CREATE DATABASE IF NOT EXISTS SAMUL;
USE SAMUL;

CREATE TABLE IF NOT EXISTS lockers (
    id VARCHAR(36) PRIMARY KEY,
    number INT NOT NULL,
    row_pos INT NOT NULL,
    col_pos INT NOT NULL,
    status ENUM('available', 'occupied') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    locker_id VARCHAR(36) UNIQUE,
    name VARCHAR(50) NOT NULL,
    student_id VARCHAR(20),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (locker_id) REFERENCES lockers(id) ON DELETE SET NULL
);
```

3. 백엔드 서버 설정

```bash
cd server
npm install
```

4. 프론트엔드 설정

```bash
cd locker-management
npm install
```

5. 환경 변수 설정

- server/.env 파일 생성:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=2134
DB_NAME=SAMUL
PORT=5000
```

## 실행 방법

1. 백엔드 서버 실행

```bash
cd server
node src/server.js
```

2. 프론트엔드 실행

```bash
cd locker-management
npm start
```

## 주요 기술 스택

### 프론트엔드

- React
- TypeScript
- Tailwind CSS

### 백엔드

- Node.js
- Express
- MySQL2
- CORS

### 데이터베이스

- MariaDB

## 프로젝트 구조

```
locker-management/
├── src/
│   ├── components/
│   │   ├── Locker.tsx
│   │   ├── LockerGrid.tsx
│   │   └── LockerManagement.tsx
│   ├── services/
│   │   └── lockerService.ts
│   ├── types/
│   │   └── types.ts
│   └── App.tsx
└── server/
    ├── src/
    │   ├── db.js
    │   └── server.js
    └── package.json
```

## 라이선스

MIT License

## 기여 방법

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
