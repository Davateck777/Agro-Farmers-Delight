// Product Search & Advanced Filtering Module

class ProductSearch {
  constructor() {
    this.products = [];
    this.filteredResults = [];
    this.selectedForComparison = new Set();
    this.currentSort = "relevance";
    this.init();
  }

  async init() {
    await this.loadProducts();
    this.setupEventListeners();
    this.restoreComparisonState();
  }

  async loadProducts() {
    const script = document.currentScript || document.querySelector('script[data-json]');
    const jsonPath = script?.dataset.json || "data/products.json";

    try {
      const response = await fetch(jsonPath);
      this.products = await response.json();
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  }

  setupEventListeners() {
    // Search
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    if (searchInput && searchBtn) {
      searchInput.addEventListener("input", (e) => this.handleSearch(e.target.value));
      searchBtn.addEventListener("click", () => this.handleSearch(searchInput.value));
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.handleSearch(searchInput.value);
      });
    }

    // Filters
    const filterCheckboxes = document.querySelectorAll('input[name="category"], input[name="price"], input[name="availability"]');
    filterCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => this.applyFilters());
    });

    // Clear filters
    const clearBtn = document.getElementById("clear-filters");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearAllFilters());
    }

    // Sort
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.displayResults();
      });
    }

    // Comparison
    const compareBtn = document.getElementById("compare-btn");
    if (compareBtn) {
      compareBtn.addEventListener("click", () => this.openComparison());
    }

    // Filters toggle on mobile
    const filtersToggle = document.getElementById("filters-toggle");
    const filtersContent = document.getElementById("filters-content");
    if (filtersToggle && filtersContent) {
      filtersToggle.addEventListener("click", () => {
        const isExpanded = filtersToggle.getAttribute("aria-expanded") === "true";
        filtersToggle.setAttribute("aria-expanded", !isExpanded);
        filtersContent.classList.toggle("is-open");
      });
    }
  }

  handleSearch(query) {
    const trimmedQuery = query.toLowerCase().trim();

    if (!trimmedQuery) {
      this.filteredResults = [];
      this.displayResults();
      return;
    }

    this.filteredResults = this.products.filter((product) => {
      const name = product.name.toLowerCase();
      const description = product.shortDescription.toLowerCase();
      const category = product.category.toLowerCase();

      return (
        name.includes(trimmedQuery) ||
        description.includes(trimmedQuery) ||
        category.includes(trimmedQuery)
      );
    });

    this.applyFilters();
  }

  getActiveFilters() {
    const filters = {
      categories: [],
      prices: [],
      availability: [],
    };

    document.querySelectorAll('input[name="category"]:checked').forEach((cb) => {
      if (cb.value !== "all") filters.categories.push(cb.value);
    });

    document.querySelectorAll('input[name="price"]:checked').forEach((cb) => {
      filters.prices.push(cb.value);
    });

    document.querySelectorAll('input[name="availability"]:checked').forEach((cb) => {
      filters.availability.push(cb.value);
    });

    return filters;
  }

  applyFilters() {
    const filters = this.getActiveFilters();
    const allCategoryChecked = document.querySelector('input[name="category"][value="all"]').checked;

    this.filteredResults = this.filteredResults.filter((product) => {
      // Category filter
      if (!allCategoryChecked && filters.categories.length > 0) {
        if (!filters.categories.includes(product.category)) return false;
      }

      // Price filter
      if (filters.prices.length > 0) {
        const price = this.extractPrice(product.priceLabel);
        const matchesPrice = filters.prices.some((range) => this.isPriceInRange(price, range));
        if (!matchesPrice) return false;
      }

      // Availability filter
      if (filters.availability.length > 0) {
        const isInStock = !product.outOfStock;
        const isSeasonal = product.seasonal || false;

        const hasInStock = filters.availability.includes("in-stock") && isInStock;
        const hasSeasonal = filters.availability.includes("seasonal") && isSeasonal;

        if (!(hasInStock || hasSeasonal)) return false;
      }

      return true;
    });

    this.displayResults();
  }

  extractPrice(priceLabel) {
    const match = priceLabel.match(/₦?(\d+,?\d*)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ""), 10);
    }
    return 0;
  }

  isPriceInRange(price, range) {
    const [min, max] = range.split("-").map((v) => parseInt(v, 10));

    if (range.endsWith("+")) {
      return price >= min;
    }

    return price >= min && price <= max;
  }

  sortResults() {
    const results = [...this.filteredResults];

    switch (this.currentSort) {
      case "price-low":
        results.sort((a, b) => this.extractPrice(a.priceLabel) - this.extractPrice(b.priceLabel));
        break;
      case "price-high":
        results.sort((a, b) => this.extractPrice(b.priceLabel) - this.extractPrice(a.priceLabel));
        break;
      case "name":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "relevance":
      default:
        // Keep original order (or implement scoring if needed)
        break;
    }

    return results;
  }

  displayResults() {
    const grid = document.getElementById("search-results-grid");
    const noResults = document.getElementById("no-results");
    const countEl = document.getElementById("results-count");
    const compareBtn = document.getElementById("compare-btn");

    if (!grid) return;

    const sortedResults = this.sortResults();
    countEl.textContent = `Showing ${sortedResults.length} result${sortedResults.length !== 1 ? "s" : ""}`;

    if (sortedResults.length === 0) {
      grid.innerHTML = "";
      noResults.style.display = "block";
      compareBtn.style.display = "none";
      return;
    }

    noResults.style.display = "none";
    compareBtn.style.display = sortedResults.length > 0 ? "inline-block" : "none";

    grid.innerHTML = sortedResults
      .map((product) => this.createProductCard(product))
      .join("");

    // Add comparison checkbox handlers
    document.querySelectorAll(".comparison-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const productId = parseInt(e.target.dataset.productId, 10);
        if (e.target.checked) {
          if (this.selectedForComparison.size >= 4) {
            e.target.checked = false;
            alert("You can compare up to 4 products at a time.");
            return;
          }
          this.selectedForComparison.add(productId);
        } else {
          this.selectedForComparison.delete(productId);
        }
        this.updateComparisonUI();
        this.saveComparisonState();
      });

      const productId = parseInt(checkbox.dataset.productId, 10);
      checkbox.checked = this.selectedForComparison.has(productId);
    });
  }

  createProductCard(product) {
    const isSelected = this.selectedForComparison.has(product.id);
    return `
      <article class="flip-card product-card--comparable" data-category="${product.category}">
        <input 
          type="checkbox" 
          class="comparison-checkbox" 
          data-product-id="${product.id}"
          ${isSelected ? "checked" : ""}
          aria-label="Select ${product.name} for comparison"
        />
        <div class="flip-card__inner">
          <div class="flip-card__front">
            <div class="flip-card__media">
              <img src="${product.image}" alt="" loading="lazy" width="400" height="250" />
            </div>
            <div class="flip-card__front-body">
              <span class="category-chip">${product.category}</span>
              <h3>${product.name}</h3>
              <p class="muted">${product.shortDescription}</p>
              <p class="flip-card__hint">Click or press Enter to flip</p>
            </div>
          </div>
          <div class="flip-card__back">
            <div>
              <h3>${product.name}</h3>
              <p class="price">${product.priceLabel}</p>
              <p class="muted">Checkout on Selar for the latest price and stock.</p>
            </div>
            <div class="flip-card__actions">
              <a class="btn btn--primary" href="${product.selarUrl}" target="_blank" rel="noopener noreferrer">Buy on Selar</a>
              <a class="btn btn--outline" href="products/product-${String(product.id).padStart(2, "0")}.html">Full details</a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  updateComparisonUI() {
    const compareBtn = document.getElementById("compare-btn");
    const compareCount = document.getElementById("compare-count");

    if (compareBtn && compareCount) {
      compareCount.textContent = this.selectedForComparison.size;
      compareBtn.disabled = this.selectedForComparison.size < 2;
      compareBtn.style.display = this.selectedForComparison.size > 0 ? "inline-block" : "none";
    }
  }

  openComparison() {
    if (this.selectedForComparison.size < 2) {
      alert("Please select at least 2 products to compare.");
      return;
    }

    const ids = Array.from(this.selectedForComparison).join(",");
    window.location.href = `compare.html?products=${ids}`;
  }

  saveComparisonState() {
    sessionStorage.setItem("comparison-products", JSON.stringify(Array.from(this.selectedForComparison)));
  }

  restoreComparisonState() {
    const saved = sessionStorage.getItem("comparison-products");
    if (saved) {
      this.selectedForComparison = new Set(JSON.parse(saved));
    }
  }

  clearAllFilters() {
    document.querySelectorAll('input[name="category"], input[name="price"], input[name="availability"]').forEach((cb) => {
      cb.checked = cb.value === "all" || cb.value === "in-stock";
    });

    this.filteredResults = [];
    document.getElementById("search-results-grid").innerHTML =
      '<p class="muted">Enter a search query to see results.</p>';
    document.getElementById("no-results").style.display = "none";
    document.getElementById("search-input").value = "";
  }
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ProductSearch();
  });
} else {
  new ProductSearch();
}
