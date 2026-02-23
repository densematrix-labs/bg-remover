"""API endpoint tests"""
import pytest
from io import BytesIO
from PIL import Image


def test_health(client):
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "bg-remover"


def test_metrics(client):
    """Test metrics endpoint returns prometheus format"""
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "bg_removal_total" in response.text or "HELP" in response.text


def test_trial_status_new_device(client):
    """Test trial status for new device"""
    response = client.get(
        "/api/v1/trial-status",
        headers={"X-Device-Id": "test-new-device-001"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["remaining_tokens"] == 3
    assert data["is_free_trial"] is True


def test_remove_background_success(client, sample_image):
    """Test successful background removal"""
    response = client.post(
        "/api/v1/remove-background",
        files={"file": ("test.png", sample_image, "image/png")},
        headers={"X-Device-Id": "test-device-002"}
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert "X-Remaining-Tokens" in response.headers
    
    # Verify output is valid PNG
    img = Image.open(BytesIO(response.content))
    assert img.format == "PNG"


def test_remove_background_with_bg_color(client, sample_image):
    """Test background removal with custom color"""
    response = client.post(
        "/api/v1/remove-background?bg_color=%23ffffff",
        files={"file": ("test.png", sample_image, "image/png")},
        headers={"X-Device-Id": "test-device-003"}
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"


def test_remove_background_invalid_file(client):
    """Test rejection of non-image file"""
    response = client.post(
        "/api/v1/remove-background",
        files={"file": ("test.txt", BytesIO(b"not an image"), "text/plain")},
        headers={"X-Device-Id": "test-device-004"}
    )
    assert response.status_code == 400
    assert "valid image" in response.json()["detail"].lower()


def test_free_trial_exhausted(client, sample_image):
    """Test 402 when free trial exhausted"""
    device_id = "test-exhausted-device-005"
    
    # Use up all 3 free trials
    for i in range(3):
        sample_image.seek(0)
        response = client.post(
            "/api/v1/remove-background",
            files={"file": ("test.png", sample_image, "image/png")},
            headers={"X-Device-Id": device_id}
        )
        assert response.status_code == 200
    
    # Fourth request should fail with 402
    sample_image.seek(0)
    response = client.post(
        "/api/v1/remove-background",
        files={"file": ("test.png", sample_image, "image/png")},
        headers={"X-Device-Id": device_id}
    )
    assert response.status_code == 402
    data = response.json()
    
    # Verify error detail format
    detail = data["detail"]
    assert isinstance(detail, dict), "402 error detail should be dict"
    assert "error" in detail, "Detail must have 'error' field"
    assert "payment_required" in detail.get("code", "") or "payment" in detail.get("error", "").lower()
    assert detail.get("remaining_tokens") == 0


def test_error_detail_serializable(client, sample_image):
    """Verify all error responses have serializable detail (not [object Object])"""
    device_id = "test-serializable-device-006"
    
    # Exhaust trials
    for i in range(3):
        sample_image.seek(0)
        client.post(
            "/api/v1/remove-background",
            files={"file": ("test.png", sample_image, "image/png")},
            headers={"X-Device-Id": device_id}
        )
    
    # Get 402 error
    sample_image.seek(0)
    response = client.post(
        "/api/v1/remove-background",
        files={"file": ("test.png", sample_image, "image/png")},
        headers={"X-Device-Id": device_id}
    )
    
    detail = response.json()["detail"]
    if isinstance(detail, dict):
        # Must have error or message field
        assert "error" in detail or "message" in detail, \
            f"Object detail must have 'error' or 'message': {detail}"
    else:
        assert isinstance(detail, str), f"Detail must be string or object: {detail}"
