# 채팅 서버

Django의 Channels 라이브러리를 활용하여 구현된 웹소켓 기반의 실시간 채팅 애플리케이션

## 기술스택
![Python](https://img.shields.io/badge/-Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/-Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Redis](https://img.shields.io/badge/-Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![SQLite](https://img.shields.io/badge/-SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)


## 주요 기능

1. **실시간 1대1 채팅**: 사용자들 간의 실시간 채팅을 지원
2. **채팅 기록 저장**: 채팅방에서 나누었던 기록 저장 및 불러오기


## 시작하기

### 필요 사항

- Python
- Django 
- Django Channels
- Redis (채널 레이어 및 비동기 지원을 위해)

### 설치 및 실행

```bash
# 가상 환경 설정
python -m venv venv

# 가상환경 접속
venv\Scripts\activate

# 필요한 패키지 설치
pip install -r requirements.txt

# DB 마이그레이션
python manage.py migrate

# 서버 실행
python manage.py runserver
```

# 레디스 설치
```bash
docker run -d --restart always --name redis7 --publish 6379:6379 redis:7
```
