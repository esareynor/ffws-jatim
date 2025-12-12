FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p storage/models storage/scalers logs

# Expose port (default 8000, can be overridden by FLASK_PORT env var)
EXPOSE 8000

# Run with gunicorn - uses environment variables for configuration
CMD sh -c "gunicorn --bind 0.0.0.0:${FLASK_PORT:-8000} --workers ${GUNICORN_WORKERS:-4} --timeout ${GUNICORN_TIMEOUT:-120} wsgi:gunicorn_app"

