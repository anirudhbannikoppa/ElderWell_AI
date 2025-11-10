# =====================================
# 🐍 Use official lightweight Python image
# =====================================
FROM python:3.10-slim-buster

# Avoid Python writing .pyc files & buffering logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# =====================================
# 📂 Set working directory
# =====================================
WORKDIR /app

# =====================================
# 📦 Copy and install dependencies first (for caching)
# =====================================
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# =====================================
# 📁 Copy the rest of the application
# =====================================
COPY . .

# =====================================
# 🔓 Expose Flask port
# =====================================
EXPOSE 8080

# =====================================
# ▶️ Run the Flask application
# =====================================
CMD ["python", "app.py"]
