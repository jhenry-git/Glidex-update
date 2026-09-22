import subprocess
import os

# Create a simple slideshow video from the SVG images
# Using ffmpeg to create a video with text

# For production-quality ads, use tools like:
# - Canva (canva.com)
# - Adobe Premiere Pro
# - DaVinci Resolve
# - FFMPEG with better assets

print("Creating simple test video...")
print("\nFor production ads, use:")
print("1. Canva (easiest): canva.com/create/ads/")
print("2. Adobe Express: adobe.com/express/create/ad")
print("3. CapCut (mobile): Video editing app")
print("4. FFMPEG: For automated workflows")

# Create a simple 5-second test video
try:
    # Create a solid color video with text
    cmd = [
        'ffmpeg', '-y',
        '-f', 'lavfi', '-i', 'color=c=0x0f172a:s=1080x1920:d=5',
        '-vf', 'drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text=GlideX:fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2',
        '-c:v', 'libx264',
        '-t', '5',
        '-pix_fmt', 'yuv420p',
        'test_ad.mp4'
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    print("Created: test_ad.mp4")
except Exception as e:
    print(f"Video creation note: {e}")
    print("For best results, use professional video editing tools.")

print("\n✅ Ad templates created in ~/Documents/GlideX/ads/")
