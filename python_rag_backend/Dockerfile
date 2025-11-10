FROM python:3.10-slim-buster

# Set working directory
WORKDIR /app

# Copy only requirements first (for better caching)
COPY requirements.txt .

# Install dependencies (ignore -e . if exists)
RUN sed -i '/^-e/d' requirements.txt && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose Flask port
EXPOSE 8080

# Run the Flask app
CMD ["python", "app.py"]
