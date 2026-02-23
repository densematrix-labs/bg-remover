"""Background removal API endpoints"""
import io
import os
from typing import Optional

from fastapi import APIRouter, File, UploadFile, HTTPException, Header, Query
from fastapi.responses import StreamingResponse
from PIL import Image
from rembg import remove
from prometheus_client import Counter, Histogram

router = APIRouter()

# Metrics
TOOL_NAME = os.getenv("TOOL_NAME", "bg-remover")
bg_removal_total = Counter(
    "bg_removal_total", 
    "Total background removal requests",
    ["tool", "status"]
)
bg_removal_duration = Histogram(
    "bg_removal_duration_seconds",
    "Background removal processing time",
    ["tool"]
)
free_trial_used = Counter(
    "free_trial_used_total",
    "Free trial usage count",
    ["tool"]
)

# Simple in-memory tracking for free trial (production would use Redis/DB)
_free_trial_used: dict[str, int] = {}
FREE_TRIAL_LIMIT = 3


def _check_free_trial(device_id: str) -> tuple[bool, int]:
    """Check if device has remaining free trial uses."""
    used = _free_trial_used.get(device_id, 0)
    remaining = max(0, FREE_TRIAL_LIMIT - used)
    return remaining > 0, remaining


def _consume_free_trial(device_id: str) -> int:
    """Consume one free trial use. Returns remaining uses."""
    _free_trial_used[device_id] = _free_trial_used.get(device_id, 0) + 1
    remaining = max(0, FREE_TRIAL_LIMIT - _free_trial_used[device_id])
    free_trial_used.labels(tool=TOOL_NAME).inc()
    return remaining


@router.post("/remove-background")
async def remove_background(
    file: UploadFile = File(...),
    x_device_id: Optional[str] = Header(None, alias="X-Device-Id"),
    bg_color: Optional[str] = Query(None, description="Background color hex (e.g., #ffffff)")
):
    """
    Remove background from uploaded image.
    
    Returns PNG with transparent background by default.
    Optionally specify bg_color to fill with solid color.
    """
    device_id = x_device_id or "anonymous"
    
    # Check free trial
    has_trial, remaining = _check_free_trial(device_id)
    if not has_trial:
        bg_removal_total.labels(tool=TOOL_NAME, status="payment_required").inc()
        raise HTTPException(
            status_code=402,
            detail={
                "error": "Free trial exhausted. Please purchase credits to continue.",
                "code": "payment_required",
                "remaining_tokens": 0
            }
        )
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        bg_removal_total.labels(tool=TOOL_NAME, status="invalid_input").inc()
        raise HTTPException(status_code=400, detail="Please upload a valid image file")
    
    try:
        with bg_removal_duration.labels(tool=TOOL_NAME).time():
            # Read and process image
            content = await file.read()
            input_image = Image.open(io.BytesIO(content))
            
            # Remove background
            output_image = remove(input_image)
            
            # Apply background color if specified
            if bg_color:
                try:
                    # Parse hex color
                    hex_color = bg_color.lstrip("#")
                    rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
                    
                    # Create new image with solid background
                    bg = Image.new("RGBA", output_image.size, rgb + (255,))
                    bg.paste(output_image, mask=output_image.split()[3])
                    output_image = bg.convert("RGB")
                except ValueError:
                    pass  # Invalid hex, keep transparent
            
            # Save to buffer
            buffer = io.BytesIO()
            if bg_color:
                output_image.save(buffer, format="PNG")
            else:
                output_image.save(buffer, format="PNG")
            buffer.seek(0)
        
        # Consume free trial
        new_remaining = _consume_free_trial(device_id)
        bg_removal_total.labels(tool=TOOL_NAME, status="success").inc()
        
        return StreamingResponse(
            buffer,
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename=bg-removed.png",
                "X-Remaining-Tokens": str(new_remaining),
                "X-Is-Free-Trial": "true"
            }
        )
        
    except Exception as e:
        bg_removal_total.labels(tool=TOOL_NAME, status="error").inc()
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")


@router.get("/trial-status")
async def trial_status(x_device_id: Optional[str] = Header(None, alias="X-Device-Id")):
    """Check remaining free trial uses for a device."""
    device_id = x_device_id or "anonymous"
    has_trial, remaining = _check_free_trial(device_id)
    return {
        "device_id": device_id,
        "remaining_tokens": remaining,
        "is_free_trial": True
    }
