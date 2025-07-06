FROM python:3.10-slim

# 作業ディレクトリ
WORKDIR /app

# 必要ファイルコピー
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]