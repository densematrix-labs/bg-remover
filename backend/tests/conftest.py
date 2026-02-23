"""Test fixtures"""
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def sample_image():
    """Create a simple test image"""
    from PIL import Image
    import io
    
    img = Image.new('RGBA', (100, 100), (255, 0, 0, 255))
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    return buffer
