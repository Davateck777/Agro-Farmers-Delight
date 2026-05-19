



ARGRO-FARMERS-DELIGHT/
├── index.html                 # Home (+ trust strip, featured, CTAs)
├── catalog.html               # All 15 + client-side filter (optional but in MVP_DATA)
├── about.html
├── contact.html
├── policies.html
├── season.html                # “What to plant now” (editorial)
├── 404.html
├── categories/
│   ├── seeds.html
│   ├── crop-protection.html
│   ├── tools.html
│   └── services.html
├── products/
│   ├── product-01.html
│   ├── … 
│   └── product-15.html
├── data/
│   └── products.json          # Optional single source for cards + Selar hrefs
└── assets/
    ├── css/
    │   ├── main.css           # @import partials in one place (or link many in HTML)
    │   ├── base.css
    │   ├── layout.css
    │   ├── responsive.css     # RWD: cards, type, images
    │   ├── components/
    │   │   ├── cards.css      # Box-model cards
    │   │   ├── cube-3d.css    # “Top product of the day” cube
    │   │   └── flip-card.css  # 3D flip for other products
    │   └── animations/
    │       ├── slide-in-left.css
    │       └── scale-pulse.css
    ├── js/
    │   ├── main.js
    │   ├── catalog-filter.js
    │   ├── featured-cube-3d.js
    │   └── product-flip-cards.js
    └── images/
        ├── hero/
        └── products/