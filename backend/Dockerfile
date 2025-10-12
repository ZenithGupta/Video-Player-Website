# backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8000

# Final CMD: Create migrations for the 'api' app, apply them, and then run
CMD ["sh", "-c", "python manage.py makemigrations api && python manage.py migrate --noinput && python manage.py populate_db && python manage.py runserver 0.0.0.0:8000"]