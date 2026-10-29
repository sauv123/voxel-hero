import os
import sys
import math
from PIL import Image, ImageDraw
import subprocess

WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION = 8.5  # seconds
TOTAL_FRAMES = int(FPS * DURATION)

SCREENS_DIR = "/Users/sauveersinha/Developer/ColorDock/site/assets/screens"
dock_img = Image.open(os.path.join(SCREENS_DIR, "dock-dark.png")).convert("RGBA")
gen_img = Image.open(os.path.join(SCREENS_DIR, "generate-dark.png")).convert("RGBA")
contrast_img = Image.open(os.path.join(SCREENS_DIR, "contrast-dark.png")).convert("RGBA")
assets_img = Image.open(os.path.join(SCREENS_DIR, "assets-dark.png")).convert("RGBA")

# Base background wallpaper: dark macOS desktop with subtle gradient & ambient lighting
def make_backdrop():
    base = Image.new("RGBA", (WIDTH, HEIGHT), (14, 15, 19, 255))
    draw = ImageDraw.Draw(base)
    # Subtle radial glow from center
    for r in range(500, 0, -25):
        alpha = int(24 * (1.0 - r / 500.0))
        bbox = [WIDTH//2 - r, HEIGHT//2 - int(r*0.65), WIDTH//2 + r, HEIGHT//2 + int(r*0.65)]
        draw.ellipse(bbox, fill=(28, 36, 52, alpha))
    
    # Subtle dot grid
    grid_spacing = 32
    for x in range(0, WIDTH, grid_spacing):
        for y in range(0, HEIGHT, grid_spacing):
            draw.point((x, y), fill=(255, 255, 255, 10))
            
    return base

base_backdrop = make_backdrop()

# Generate poster first
poster = base_backdrop.copy()
# Draw dock at bottom
dock_w = int(dock_img.width * 0.68)
dock_h = int(dock_img.height * 0.68)
dock_scaled = dock_img.resize((dock_w, dock_h), Image.Resampling.LANCZOS)
poster.paste(dock_scaled, ((WIDTH - dock_w) // 2, HEIGHT - dock_h - 24), dock_scaled)

# Draw Generate window on left
gen_w = int(gen_img.width * 0.54)
gen_h = int(gen_img.height * 0.54)
gen_scaled = gen_img.resize((gen_w, gen_h), Image.Resampling.LANCZOS)
poster.paste(gen_scaled, (140, (HEIGHT - gen_h) // 2 - 35), gen_scaled)

# Draw Contrast window on right overlapping
contrast_w = int(contrast_img.width * 0.50)
contrast_h = int(contrast_img.height * 0.50)
contrast_scaled = contrast_img.resize((contrast_w, contrast_h), Image.Resampling.LANCZOS)
poster.paste(contrast_scaled, (WIDTH - contrast_w - 140, (HEIGHT - contrast_h) // 2 - 15), contrast_scaled)

poster_rgb = poster.convert("RGB")
out_poster_path = "/Users/sauveersinha/.gemini/antigravity/scratch/voxel-hero/public/works/colordock.webp"
poster_rgb.save(out_poster_path, "WEBP", quality=92)
poster_rgb.save("/Users/sauveersinha/.gemini/antigravity/scratch/voxel-hero/public/colordock.webp", "WEBP", quality=92)
print("Saved poster to:", out_poster_path)

# Video Generation with smooth timeline
out_video_path = "/Users/sauveersinha/.gemini/antigravity/scratch/voxel-hero/public/works/colordock.mp4"
ffmpeg_cmd = [
    "ffmpeg", "-y",
    "-f", "rawvideo",
    "-vcodec", "rawvideo",
    "-s", f"{WIDTH}x{HEIGHT}",
    "-pix_fmt", "rgba",
    "-r", str(FPS),
    "-i", "-",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "19",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    out_video_path
]

proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)

def smooth_step(edge0, edge1, x):
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)

def paste_centered(target, img, cx, cy, scale=1.0, opacity=1.0):
    if opacity <= 0 or scale <= 0:
        return
    w = max(1, int(img.width * scale))
    h = max(1, int(img.height * scale))
    scaled = img.resize((w, h), Image.Resampling.LANCZOS)
    if opacity < 1.0:
        alpha = scaled.split()[3]
        alpha = alpha.point(lambda p: int(p * opacity))
        scaled.putalpha(alpha)
    x = int(cx - w / 2)
    y = int(cy - h / 2)
    target.paste(scaled, (x, y), scaled)

for frame_idx in range(TOTAL_FRAMES):
    t = frame_idx / float(FPS) # time in seconds
    frame = base_backdrop.copy()
    
    # Persistent Dock at the bottom
    dock_base_scale = 0.68
    dock_cy = HEIGHT - 84
    paste_centered(frame, dock_img, WIDTH // 2, dock_cy, scale=dock_base_scale, opacity=1.0)
    
    # Scene 1: Dock Hero intro with gentle pulse (0.0s to 2.2s)
    if t < 2.4:
        pass
            
    # Scene 2: Generate Window (1.8s to 4.4s)
    if 1.8 <= t < 4.4:
        local_t = t - 1.8
        enter = smooth_step(0.0, 0.45, local_t)
        exit = smooth_step(2.1, 2.5, local_t)
        alpha = enter * (1.0 - exit)
        scale = 0.54 + 0.02 * math.sin(local_t * 0.9)
        y_offset = (1.0 - enter) * 35 + exit * -25
        paste_centered(frame, gen_img, WIDTH // 2, HEIGHT // 2 - 65 + int(y_offset), scale=scale, opacity=alpha)

    # Scene 3: Contrast Checker (4.1s to 6.6s)
    if 4.1 <= t < 6.6:
        local_t = t - 4.1
        enter = smooth_step(0.0, 0.45, local_t)
        exit = smooth_step(2.0, 2.4, local_t)
        alpha = enter * (1.0 - exit)
        scale = 0.53 + 0.02 * math.sin(local_t * 0.9)
        y_offset = (1.0 - enter) * 35 + exit * -25
        paste_centered(frame, contrast_img, WIDTH // 2, HEIGHT // 2 - 65 + int(y_offset), scale=scale, opacity=alpha)

    # Scene 4: Asset Board (6.3s to 8.5s)
    if 6.3 <= t <= 8.5:
        local_t = t - 6.3
        enter = smooth_step(0.0, 0.45, local_t)
        exit = smooth_step(1.8, 2.2, local_t)
        alpha = enter * (1.0 - exit)
        scale = 0.46 + 0.02 * math.sin(local_t * 0.9)
        y_offset = (1.0 - enter) * 35 + exit * -25
        paste_centered(frame, assets_img, WIDTH // 2, HEIGHT // 2 - 65 + int(y_offset), scale=scale, opacity=alpha)

    # Write frame to ffmpeg
    raw_bytes = frame.tobytes()
    proc.stdin.write(raw_bytes)

proc.stdin.close()
proc.wait()

# Copy to root public as well
subprocess.run(["cp", out_video_path, "/Users/sauveersinha/.gemini/antigravity/scratch/voxel-hero/public/colordock.mp4"])
print("Generated video successfully:", out_video_path)
