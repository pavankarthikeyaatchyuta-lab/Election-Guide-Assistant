FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port (Cloud Run sets PORT env var)
EXPOSE 8080

CMD ["python", "start.py"]
