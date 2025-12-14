# backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8000

# Updated CMD for production
CMD ["sh", "-c", "python manage.py makemigrations api && \
    python manage.py migrate --noinput && \
    python manage.py collectstatic --noinput && \
    #  python manage.py populate_db && \
    gunicorn backend.wsgi:application --config gunicorn_config.py"]