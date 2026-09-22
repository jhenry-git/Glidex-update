# Quick ad image generator
import subprocess

ads = [
    ('carousel_1', 'Mercedes-Benz GLC', 'KES 4.6M • 109,455 km'),
    ('carousel_2', 'Range Rover Vogue', 'KES 12.2M • 50,000 km'),
    ('carousel_3', 'Mercedes C200', 'KES 2.6M • 100,000 km'),
    ('discovery', '2,000+ Verified Cars', 'No hidden fees. No middlemen.'),
    ('lead_gen', 'Get Pre-Qualified', '2 minutes. Free. No commitment.'),
]

for filename, headline, subhead in ads:
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080">
  <rect width="1080" height="1080" fill="#0f172a"/>
  <text x="540" y="400" font-family="Arial" font-size="60" fill="white" text-anchor="middle">{headline}</text>
  <text x="540" y="480" font-family="Arial" font-size="40" fill="#94a3b8" text-anchor="middle">{subhead}</text>
  <rect x="400" y="800" width="280" height="80" rx="10" fill="#3b82f6"/>
  <text x="540" y="850" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Shop Now</text>
  <text x="540" y="950" font-family="Arial" font-size="24" fill="#64748b" text-anchor="middle">GlideX • glidexcars.com</text>
</svg>'''
    with open(f'{filename}.svg', 'w') as f:
        f.write(svg)
    print(f'Created: {filename}.svg')

# Convert to PNG using rsvg-convert if available
for filename, _, _ in ads:
    try:
        subprocess.run(['rsvg-convert', '-w', '1080', f'{filename}.svg', '-o', f'{filename}.png'], check=True)
        print(f'Converted: {filename}.png')
    except:
        print(f'Keep as SVG: {filename}.svg (rsvg-convert not available)')
