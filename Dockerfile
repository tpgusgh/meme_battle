# 공식 FastAPI 이미지를 기반으로 설정
FROM python:3.10

# 작업 디렉토리 설정
WORKDIR /app

# 필요 라이브러리 복사
COPY requirements.txt .

# 라이브러리 설치
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# FastAPI 실행
CMD ["uvicorn", "backend:app", "--host", "0.0.0.0", "--port", "8000"]

