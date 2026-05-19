
Here is a concise **professional MVP feature list** for a **product-hosting site** that routes **each product** to its **Selar.co checkout URL**, with an **agricultural sector** theme, implemented with **HTML + CSS + JavaScript** only.

---

### Core product & commerce

- **Product catalog**: Name, short description, category, key specs (e.g. crop type, season, region, certification), price display (or “from” price), and **primary CTA** → **Selar product link** (`href` to Selar).
- **One product = one Selar link**: Clear, trackable “Buy on Selar” / “View on Selar” per item (opens in new tab with `rel="noopener"` for security).
- **Categories / filters**: e.g. seeds, inputs, equipment, services, training; optional filters by **region** or **product type** (client-side only).
- **Featured & seasonal**: “In season now”, “Featured”, or “Bundle” blocks (static or driven by a small JSON file in JS).
- **Trust & policy**: Short notes on returns/refunds **as handled on Selar**, delivery expectations, and support contact (since payment is on Selar).

---

### Agricultural sector theme (content & UX)

- **Sector-specific taxonomy**: Tags like organic, irrigation, livestock, crop protection, soil health, cooperative bulk, extension services.
- **Use-case copy**: Problem → outcome (e.g. yield, water use, post-harvest loss) aligned to each product.
- **Visual identity**: Earth tones, greens, imagery of farms/fields/livestock (optimized images, lazy loading in JS).
- **Trust for farmers**: Certifications, cooperative names, agronomist-backed copy (where true), **localized** currency/language hints if you serve multiple countries.
- **Education teaser**: Short “how to use” or seasonality tips; full depth can stay on Selar or a blog later.

---

### Information architecture & navigation

- **Home**: Value proposition, featured products, categories, trust strip, footer with legal/social.
- **Category pages**: Listing with cards linking to detail + Selar.
- **Product detail page**: Gallery (or single hero image), specs table, FAQs accordion, sticky “Buy on Selar” button.
- **About / mission**: Why this store exists for agriculture (builds trust before redirect).
- **Contact**: Form is optional for MVP (e.g. `mailto:` or embedded form provider); at minimum email/phone/WhatsApp.

---

### Technical MVP (HTML + CSS + JS)

- **Responsive layout**: Mobile-first; readable typography and tap targets for field use.
- **Performance**: Compressed images, minimal JS, defer non-critical scripts.
- **Accessibility**: Semantic HTML, focus states, alt text, contrast.
- **SEO basics**: Unique `<title>` and meta description per page; Open Graph tags for sharing (optional but professional).
- **Data source pattern**: Static HTML **or** a single `products.json` loaded by fetch + templated list (still no server required if hosted on static hosting).
- **Client-side search** (optional MVP+): Filter list by keyword on the catalog page.

---

### Analytics & growth (lightweight)

- **UTM parameters** appended to Selar links for campaign/source tracking (query string on the `href`).
- **Click tracking** on “Buy on Selar” (privacy-respecting: event to analytics if you add a snippet).

---

### Legal & safety (professional minimum)

- **Disclaimer**: Agronomic outcomes vary; follow label instructions; not a substitute for local extension advice where required.
- **Privacy**: If you add analytics or contact forms, a simple privacy note.
- **Brand**: Clarify relationship with Selar (you’re the storefront/curator; checkout is on Selar).

---

### Explicit non-goals for this MVP (keeps scope tight)

- **No in-site checkout** (Selar handles payments).
- **No user accounts** on your site (unless you add auth later).
- **No complex inventory sync** (manual updates to HTML/JSON when prices change).

---

If you want this mapped **to your actual `PRODUCT_HOSTING_SITE` repo** (what you already have vs gaps), say so and switch out of Ask mode or paste your folder structure—I can align this list to your files.