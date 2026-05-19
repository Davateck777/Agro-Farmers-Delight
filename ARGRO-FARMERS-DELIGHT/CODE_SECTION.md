



Below is a **list-only outline** of the **code sections** each file typically needs (no implementation). Assumes the **Strategy A + optional `catalog.html`** tree under `mvp-agri-hosting/`.

---

### Root HTML pages

**`index.html`**  
- `DOCTYPE` + `html` + `lang`  
- `<head>`: charset, viewport, title, meta description, stylesheet links (order: base → layout → components → animations → responsive), optional favicon  
- **Accessibility**: skip link  
- **Header / site nav**: logo, links (categories, catalog, about, contact, policies, season)  
- **Hero**: headline, subcopy, primary CTA (catalog or category)  
- **Trust strip**: short bullets (e.g. Selar checkout, support)  
- **Featured / “top product of the day”**: wrapper for **3D cube** (markup for cube faces + labels)  
- **Category shortcuts**: cards or buttons to 4 category pages  
- **Optional**: teaser for `season.html`  
- **Footer**: nav repeat, legal link, social  
- `<script defer>`: `main.js`, `featured-cube-3d.js` (and `products.json` path or inline config)

**`catalog.html`**  
- Same `<head>` pattern + page-specific title/description  
- **Page header**: H1, short intro  
- **Toolbar**: category/tag filter controls (buttons or `<select>`)  
- **Product grid**: repeatable **flip-card** markup ×15 (or injected by JS)  
- **Empty state** (hidden until filter has no matches)  
- Footer  
- Scripts: `main.js`, `catalog-filter.js`, `product-flip-cards.js`

**`about.html`**  
- `<head>`  
- **Header/nav**  
- **Mission / story** sections (headings + paragraphs)  
- **Why Selar / how buying works** (short)  
- Footer  
- `main.js` (nav only if needed)

**`contact.html`**  
- `<head>`  
- **Contact methods**: email, phone, WhatsApp (links)  
- **Optional**: simple HTML form (name, message) with `action`/`mailto` or form provider later  
- Footer  
- Optional small **client-side validation** section in `main.js` if form exists

**`policies.html`**  
- `<head>`  
- **Refunds / fulfillment** (Selar seller terms)  
- **Shipping / digital vs physical** if relevant  
- **Agronomic / product disclaimer** for inputs  
- **Privacy** stub if you add analytics later  
- Footer  

**`season.html`**  
- `<head>`  
- **Editorial blocks** by month/season (headings, lists, internal links to catalog/categories)  
- Footer  

**`404.html`**  
- `<head>` (minimal)  
- **Message** + links to `index.html` and `catalog.html`  
- Footer optional  

---

### `categories/*.html` (4 files)

**`seeds.html`**, **`crop-protection.html`**, **`tools.html``, **`services.html`** (same section pattern)**  
- `<head>` (page title + description per category)  
- **Breadcrumb** (Home → Category)  
- **H1** + short category intro  
- **Card grid** of products in that category (links to `products/product-XX.html`)  
- Footer  
- Scripts: `main.js`, `product-flip-cards.js` if cards flip on category pages  

---

### `products/product-01.html` … `product-15.html`

**Each product detail page**  
- `<head>` (unique title, meta description, optional OG for sharing)  
- **Breadcrumb**: Home → Category → Product name  
- **Product hero**: name, tagline  
- **Media**: main image (+ optional thumbnails or single image)  
- **Key facts**: price display, region/season, format (as static text)  
- **Story / benefits**  
- **Specs / details** (list or table)  
- **FAQ-style** bullets  
- **Primary CTA**: “Buy on Selar” (`<a href="…" target="_blank" rel="noopener noreferrer">`)  
- **Secondary**: link to `contact.html`  
- **Related products** (optional static links)  
- Footer  
- Scripts: `main.js` minimally; flip/cube usually not required here  

---

### `data/products.json`

**Logical sections (structure)**  
- **Schema comment** (in a separate README or top comment — JSON doesn’t allow comments in strict parsers; document fields externally if needed)  
- **Array of product objects**, each with e.g.:  
  - `id`, `slug`, `name`, `category` (enum matching 4 categories), `shortDescription`  
  - `selarUrl`, `priceLabel`, `image`, `featured` / `productOfDay`  
  - Optional: `tags`, `seasonNotes`  

---

### `assets/css/main.css`

**Sections**  
- `@import` order (or single bundle with **comment blocks**):  
  - `base.css`  
  - `layout.css`  
  - `components/cards.css`, `cube-3d.css`, `flip-card.css`  
  - `animations/slide-in-left.css`, `scale-pulse.css`  
  - `responsive.css` last  

*(Alternatively list the same order as `<link>` tags in HTML instead of `@import`.)*

---

### `assets/css/base.css`

- **CSS variables** (colors, spacing, radii, shadows, font stacks)  
- **Reset / normalize** (minimal)  
- **Root**: `box-sizing`, smooth scroll optional  
- **Typography**: headings, body, links  
- **Global utilities** (e.g. `.visually-hidden`, focus ring)  

---

### `assets/css/layout.css`

- **Page shell** (header, main, footer)  
- **Containers** / max-width wrappers  
- **Grids** for card rows  
- **Section spacing**  

---

### `assets/css/responsive.css`

- **Breakpoints** (commented)  
- **Fluid typography** (`clamp` / fluid type scale)  
- **Responsive card grid** (columns vs 1-col)  
- **Responsive images** rules (`img { max-width: 100%; height: auto; }`, optional aspect-ratio helpers)  
- **Nav**: mobile menu layout if toggled in JS  

---

### `assets/css/components/cards.css`

- **Card container** (box model: width, padding, margin, border, `border-radius`)  
- **Card media / image area**  
- **Card body** (title, excerpt, meta)  
- **Card footer** (CTA row)  
- **States**: hover/focus for accessibility  

---

### `assets/css/components/cube-3d.css`

- **Scene / perspective** wrapper  
- **Cube** transform container  
- **Six faces** (or simplified 4-face billboard) positioning  
- **Rotation** / animation hooks (class toggles)  
- **Reduced motion** media query  

---

### `assets/css/components/flip-card.css`

- **Flip container** (`perspective`)  
- **Inner** (`transform-style`, `transition`)  
- **Front / back** faces  
- **Flip trigger** (`.is-flipped` or `:hover` + keyboard alternative)  

---

### `assets/css/animations/slide-in-left.css`

- **`@keyframes`** for slide-in from left  
- **Utility classes** (e.g. `.anim-slide-in-left`, stagger delays if used)  

---

### `assets/css/animations/scale-pulse.css`

- **`@keyframes`** for pulse scale  
- **Utility classes** (e.g. `.anim-scale-pulse`)  
- Optional **iteration** / `prefers-reduced-motion`  

---

### `assets/js/main.js`

- **Config** (paths, selectors) optional  
- **DOMContentLoaded** bootstrap  
- **Mobile nav** toggle (if present)  
- **Global UI** helpers (e.g. close menus on escape)  
- Optional: **lazy enhancement** hooks  

---

### `assets/js/catalog-filter.js`

- **Load or reuse** product list (from `products.json` or embedded)  
- **Filter state** (active category/tag)  
- **DOM update**: show/hide cards or rebuild grid  
- **Empty state** toggle  
- **URL hash/query** (optional) for shareable filtered view  

---

### `assets/js/featured-cube-3d.js`

- **Read** “product of the day” (from JSON flag, date hash, or first featured)  
- **Map** data to cube face nodes  
- **Rotation** / class cycling (interval or user control)  
- **Reduced motion** check  
- **Resize** / optional touch  

---

### `assets/js/product-flip-cards.js`

- **Query** all flip-card roots  
- **Click / keyboard** flip for accessibility (`tabindex`, `Enter`/`Space`)  
- Optional: **one-open-at-a-time** behavior  

---

### Summary

| Area | What you’re listing per file |
|------|------------------------------|
| HTML | head, a11y, header/nav, main sections, footer, deferred scripts |
| CSS | tokens/base, layout, components, animations, responsive last |
| JS | init, data binding, filter/cube/flip responsibilities split |
| JSON | single array schema for 15 items + Selar URLs |

If you want the **same list mapped to `ARGRO-FARMERS-DELIGHT`** instead of `mvp-agri-hosting`, say so and we can align names to that folder.