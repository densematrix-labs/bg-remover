FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for rembg/onnxruntime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the U2Net model
RUN python -c "from rembg import remove; from PIL import Image; import io; \
    img = Image.new('RGBA', (10, 10)); remove(img)"

COPY app/ app/

ENV TOOL_NAME=bg-remover

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
