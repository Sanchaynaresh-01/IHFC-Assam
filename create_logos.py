import base64

ihfc_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 100" width="420" height="100">
  <defs>
    <linearGradient id="ihfc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f2b48" />
      <stop offset="100%" stop-color="#1b5299" />
    </linearGradient>
    <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>
  <!-- Emblem: IIT Delhi Gear & Cobotics Hexagon -->
  <g transform="translate(10, 10)">
    <polygon points="40,2 75,22 75,62 40,82 5,62 5,22" fill="url(#ihfc-grad)" />
    <!-- Gear teeth -->
    <circle cx="40" cy="42" r="24" fill="none" stroke="#ffffff" stroke-width="4" stroke-dasharray="10,6" />
    <circle cx="40" cy="42" r="14" fill="url(#accent-grad)" />
    <!-- Connecting IoT node dots -->
    <circle cx="40" cy="18" r="3.5" fill="#ffffff" />
    <circle cx="60" cy="30" r="3.5" fill="#ffffff" />
    <circle cx="60" cy="54" r="3.5" fill="#ffffff" />
    <circle cx="40" cy="66" r="3.5" fill="#ffffff" />
    <circle cx="20" cy="54" r="3.5" fill="#ffffff" />
    <circle cx="20" cy="30" r="3.5" fill="#ffffff" />
    <line x1="40" y1="18" x2="40" y2="35" stroke="#ffffff" stroke-width="2" />
    <line x1="60" y1="54" x2="48" y2="46" stroke="#ffffff" stroke-width="2" />
    <line x1="20" y1="54" x2="32" y2="46" stroke="#ffffff" stroke-width="2" />
  </g>
  <!-- Text Branding -->
  <text x="100" y="38" font-family="'Plus Jakarta Sans', Inter, sans-serif" font-weight="800" font-size="28" fill="#0f2942" letter-spacing="0.5">IHFC</text>
  <text x="180" y="38" font-family="'Plus Jakarta Sans', Inter, sans-serif" font-weight="600" font-size="13" fill="#d97706" letter-spacing="1.5">IIT DELHI</text>
  <text x="100" y="58" font-family="Inter, sans-serif" font-weight="600" font-size="12" fill="#2d6a4f" letter-spacing="0.2">Technology Innovation Hub</text>
  <text x="100" y="74" font-family="Inter, sans-serif" font-weight="400" font-size="10.5" fill="#64748b" letter-spacing="0.1">TIH Foundation for IoT &amp; IoE @ IIT Delhi</text>
</svg>"""

samagra_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 100" width="420" height="100">
  <defs>
    <linearGradient id="assam-green" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1b4332" />
      <stop offset="100%" stop-color="#2d6a4f" />
    </linearGradient>
    <linearGradient id="sun-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#ef4444" />
    </linearGradient>
  </defs>
  <!-- Emblem: Lamp of Knowledge / Rising Sun over Assam Hills -->
  <g transform="translate(10, 10)">
    <circle cx="40" cy="40" r="38" fill="#f8fafc" stroke="#1b4332" stroke-width="2.5" />
    <!-- Rising Sun Rays -->
    <path d="M40,16 L40,10 M20,24 L14,19 M60,24 L66,19 M12,40 L6,40 M68,40 L74,40" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" />
    <circle cx="40" cy="36" r="16" fill="url(#sun-grad)" opacity="0.9" />
    <!-- Rolling Hills / Tea Terraces -->
    <path d="M10,54 Q25,44 40,49 Q55,44 70,54 L70,68 Q55,62 40,64 Q25,62 10,68 Z" fill="url(#assam-green)" />
    <!-- Open Book / Gyan Deep -->
    <path d="M24,58 Q40,52 40,64 Q40,52 56,58 L56,66 Q40,60 40,70 Q40,60 24,66 Z" fill="#ffffff" />
    <circle cx="40" cy="50" r="3" fill="#f59e0b" />
  </g>
  <!-- Text Branding -->
  <text x="96" y="34" font-family="'Plus Jakarta Sans', Inter, sans-serif" font-weight="800" font-size="20" fill="#1b4332" letter-spacing="0.3">SAMAGRA SHIKSHA</text>
  <text x="96" y="54" font-family="'Plus Jakarta Sans', Inter, sans-serif" font-weight="700" font-size="16" fill="#d97706" letter-spacing="1">ASSAM</text>
  <text x="96" y="72" font-family="Inter, sans-serif" font-weight="500" font-size="11" fill="#475569" letter-spacing="0.2">Education Department, Govt. of Assam</text>
</svg>"""

with open("frontend/src/assets/logos/ihfc-logo.svg", "w", encoding="utf-8") as f:
    f.write(ihfc_svg)

with open("frontend/src/assets/logos/samagra-shiksha-assam.svg", "w", encoding="utf-8") as f:
    f.write(samagra_svg)

# Also create png files
with open("frontend/src/assets/logos/ihfc-logo.png", "wb") as f:
    f.write(ihfc_svg.encode("utf-8")) # SVG can be loaded directly or as image in browser

with open("frontend/src/assets/logos/samagra-shiksha-assam.png", "wb") as f:
    f.write(samagra_svg.encode("utf-8"))

print("Logos successfully created in frontend/src/assets/logos/")
