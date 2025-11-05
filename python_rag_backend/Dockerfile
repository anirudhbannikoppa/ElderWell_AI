# Use Python 3.10 slim image as base to minimize container size
FROM python:3.10-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    # Prevents Python from writing pyc files
    # Ensures Python output is sent straight to terminal without buffering
    FLASK_ENV=production

# Create and set working directory
WORKDIR /app

# Install system dependencies required for Python packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
COPY setup.py .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/
COPY app.py .
COPY store_index.py .

# Create non-root user for security
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["python3", "app.py"]