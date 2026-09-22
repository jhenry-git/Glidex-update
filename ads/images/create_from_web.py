import urllib.request
import ssl
import os

# Cars from glidexcars.com
cars = [
    {
        "name": "Range Rover Vogue",
        "year": 2019,
        "price": "KES 12.2M",
        "mileage": "50,000 km",
        "tagline": "Luxury meets performance",
        "cta": "View Details",
        "bg_color": "#1a1a2e"
    },
    {
        "name": "Mercedes-Benz GLC 250",
        "year": 2016,
        "price": "KES 4.6M",
        "mileage": "109,455 km",
        "tagline": "Premium SUV Comfort",
        "cta": "View Details",
        "bg_color": "#16213e"
    },
    {
        "name": "Mercedes-Benz C200",
        "year": 2015,
        "price": "KES 2.6M",
        "mileage": "100,000 km",
        "tagline": "Elegant Sedan",
        "cta": "View Details",
        "bg_color": "#0f3460"
    },
    {
        "name": "Mitsubishi Evo 10",
        "year": 2012,
        "price": "KES 3.2M",
        "mileage": "100,000 km",
        "tagline": "Performance Legend",
        "cta": "View Details",
        "bg_color": "#1a1a2e"
    },
    {
        "name": "Mitsubishi Outlander PHEV",
        "year": 2013,
        "price": "KES 1.9M",
        "mileage": "100,000 km",
        "tagline": "Eco-Friendly Hybrid",
        "cta": "View Details",
        "bg_color": "#16213e"
    },
    {
        "name": "Mercedes-Benz C250",
        "year": 2011,
        "price": "KES 1.6M",
        "mileage": "100,000 km",
        "tagline": "Classic Luxury",
        "cta": "View Details",
        "bg_color": "#0f3460"
    }
]

# Create SVG templates for each car
for car in cars:
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080">
  <!-- Background -->
  <rect width="1080" height="1080" fill="{car["bg_color"]}"/>
  
  <!-- Gradient overlay -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0.2" />
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#grad)"/>
  
  <!-- Car Image Placeholder -->
  <rect x="90" y="150" width="900" height="500" fill="#2a2a4a" rx="20"/>
  <text x="540" y="420" font-family="Arial" font-size="24" fill="#888" text-anchor="middle">[CAR IMAGE: {car["name"]}]</text>
  
  <!-- Car Name -->
  <text x="540" y="750" font-family="Arial" font-size="72" fill="white" text-anchor="middle" font-weight="bold">{car["name"]}</text>
  
  <!-- Price -->
  <text x="540" y="830" font-family="Arial" font-size="56" fill="#3b82f6" text-anchor="middle" font-weight="bold">{car["price"]}</text>
  
  <!-- Details -->
  <text x="540" y="890" font-family="Arial" font-size="32" fill="#94a3b8" text-anchor="middle">{car["year"]} • {car["mileage"]}</text>
  
  <!-- CTA Button -->
  <rect x="390" y="940" width="300" height="80" rx="40" fill="#3b82f6"/>
  <text x="540" y="995" font-family="Arial" font-size="36" fill="white" text-anchor="middle" font-weight="bold">{car["cta"]}</text>
  
  <!-- GlideX Branding -->
  <text x="540" y="1050" font-family="Arial" font-size="20" fill="#64748b" text-anchor="middle">GlideX Cars • glidexcars.com</text>
</svg>'''
    
    filename = car["name"].lower().replace(" ", "_").replace("-", "_")
    with open(f'{filename}.svg', 'w') as f:
        f.write(svg)
    print(f'Created: {filename}.svg')

# Create hero/ad banner
hero = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200x628">
  <rect width="1200" height="628" fill="#0f172a"/>
  
  <!-- Car images row -->
  <rect x="50" y="50" width="180" height="140" fill="#2a2a4a" rx="10"/>
  <rect x="260" y="50" width="180" height="140" fill="#2a2a4a" rx="10"/>
  <rect x="470" y="50" width="180" height="140" fill="#2a2a4a" rx="10"/>
  <rect x="680" y="50" width="180" height="140" fill="#2a2a4a" rx="10"/>
  <rect x="890" y="50" width="180" height="140" fill="#2a2a4a" rx="10"/>
  
  <text x="140" y="130" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">[Cars]</text>
  <text x="350" y="130" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">[Cars]</text>
  <text x="560" y="130" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">[Cars]</text>
  <text x="770" y="130" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">[Cars]</text>
  <text x="980" y="130" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">[Cars]</text>
  
  <!-- Headline -->
  <text x="600" y="300" font-family="Arial" font-size="64" fill="white" text-anchor="middle" font-weight="bold">2,000+ Verified Cars</text>
  <text x="600" y="360" font-family="Arial" font-size="32" fill="#94a3b8" text-anchor="middle">No hidden fees. No middlemen.</text>
  
  <!-- CTA -->
  <rect x="500" y="420" width="200" height="60" rx="30" fill="#3b82f6"/>
  <text x="600" y="460" font-family="Arial" font-size="28" fill="white" text-anchor="middle" font-weight="bold">Shop Now</text>
  
  <text x="600" y="550" font-family="Arial" font-size="24" fill="#64748b" text-anchor="middle">glidexcars.com</text>
</svg>'''

with open('hero_banner.svg', 'w') as f:
    f.write(hero)
print('Created: hero_banner.svg')

print('\n✅ All ad templates created!')
print('Next: Download real car images and replace placeholders')
