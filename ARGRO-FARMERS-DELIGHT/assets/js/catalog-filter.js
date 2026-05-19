(function () {
  "use strict";

  var root = document.getElementById("catalog-root");
  if (!root) return;

  function scriptTag() {
    return document.querySelector('script[src*="catalog-filter"]');
  }

  var jsonPath =
    (scriptTag() && scriptTag().getAttribute("data-json")) ||
    "data/products.json";
  var grid = document.getElementById("catalog-grid");
  var empty = document.getElementById("catalog-empty");
  var toolbar = document.getElementById("catalog-filters");

  function escapeHtml(s) {
    if (!s) return "";
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function productPath(id) {
    var n = String(id).padStart(2, "0");
    return "products/product-" + n + ".html";
  }

  function renderCard(p) {
    var catLabel = escapeHtml(p.category.replace(/-/g, " "));
    return (
      '<article class="flip-card anim-slide-in-left" data-category="' +
      escapeHtml(p.category) +
      '" tabindex="0">' +
      '<div class="flip-card__inner">' +
      '<div class="flip-card__front">' +
      '<div class="flip-card__media"><img src="' +
      escapeHtml(p.image) +
      '" alt="" loading="lazy" width="400" height="250" /></div>' +
      '<div class="flip-card__front-body">' +
      '<span class="category-chip">' +
      catLabel +
      "</span>" +
      "<h3>" +
      escapeHtml(p.name) +
      "</h3>" +
      '<p class="muted">' +
      escapeHtml(p.shortDescription) +
      '</p><p class="flip-card__hint">Click or press Enter to flip · Details &amp; Selar</p>' +
      "</div></div>" +
      '<div class="flip-card__back">' +
      "<div>" +
      "<h3>" +
      escapeHtml(p.name) +
      "</h3>" +
      '<p class="price">' +
      escapeHtml(p.priceLabel) +
      "</p>" +
      "<p>" +
      escapeHtml(p.shortDescription) +
      "</p></div>" +
      '<div class="flip-card__actions">' +
      '<a class="btn btn--primary" href="' +
      escapeHtml(p.selarUrl) +
      '" target="_blank" rel="noopener noreferrer">Buy on Selar</a>' +
      '<a class="btn btn--outline" href="' +
      productPath(p.id) +
      '">Full details</a>' +
      "</div></div></div></article>"
    );
  }

  var products = [];

  function setEmpty(show) {
    if (!empty) return;
    empty.classList.toggle("is-visible", show);
    if (grid) grid.style.display = show ? "none" : "";
  }

  function applyFilter(cat) {
    var cards = grid.querySelectorAll(".flip-card");
    var visible = 0;
    cards.forEach(function (card) {
      var match = cat === "all" || card.getAttribute("data-category") === cat;
      card.hidden = !match;
      card.style.display = match ? "" : "none";
      if (match) visible++;
    });
    setEmpty(visible === 0);
  }

  function wireFilters() {
    if (!toolbar) return;
    toolbar.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        toolbar.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        applyFilter(btn.getAttribute("data-filter") || "all");
      });
    });
  }

  function attachFlipHandlers() {
    document.querySelectorAll("#catalog-grid .flip-card").forEach(function (card) {
      if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
      card.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        card.classList.toggle("is-flipped");
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Enter") {
          if (e.target.closest("a")) return;
          e.preventDefault();
          card.classList.toggle("is-flipped");
        }
      });
    });
  }

  function resolveJsonUrl() {
    try {
      return new URL(jsonPath, window.location.href).href;
    } catch (e) {
      return jsonPath;
    }
  }

  fetch(resolveJsonUrl())
    .then(function (r) {
      if (!r.ok) throw new Error("json");
      return r.json();
    })
    .then(function (list) {
      products = list;
      if (grid) {
        grid.innerHTML = list.map(renderCard).join("");
        grid.classList.add("card-grid");
      }
      attachFlipHandlers();
      wireFilters();
      applyFilter("all");
    })
    .catch(function () {
      if (grid) {
        grid.innerHTML =
          "<p class='muted'>Could not load products. Use a local web server (see RUN.cmd) so <code>data/products.json</code> can load.</p>";
      }
    });
})();
