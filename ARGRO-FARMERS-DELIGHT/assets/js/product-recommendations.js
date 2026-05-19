// Product Recommendations Engine Module

class ProductRecommendations {
  constructor() {
    this.products = [];
    this.purchaseHistory = {};
    this.viewHistory = [];
    this.frequentlyBoughtTogether = {};
    this.init();
  }

  async init() {
    await this.loadProducts();
    this.loadHistory();
    this.generateRecommendations();

    if (document.getElementById("personalized-recommendations-grid")) {
      this.displayHomeRecommendations();
    }
  }

  async loadProducts() {
    const script = document.currentScript || document.querySelector('script[data-recommendations="true"]');
    const jsonPath = (script?.dataset.json || "data/products.json");

    try {
      const response = await fetch(jsonPath);
      this.products = await response.json();
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  }

  loadHistory() {
    // Load from localStorage
    const viewHistory = localStorage.getItem("product-view-history");
    const purchaseHistory = localStorage.getItem("product-purchase-history");

    this.viewHistory = viewHistory ? JSON.parse(viewHistory) : [];
    this.purchaseHistory = purchaseHistory ? JSON.parse(purchaseHistory) : {};
  }

  saveHistory() {
    localStorage.setItem("product-view-history", JSON.stringify(this.viewHistory));
    localStorage.setItem("product-purchase-history", JSON.stringify(this.purchaseHistory));
  }

  trackProductView(productId) {
    this.viewHistory.push({
      id: productId,
      timestamp: Date.now(),
    });

    // Keep only last 50 views
    if (this.viewHistory.length > 50) {
      this.viewHistory = this.viewHistory.slice(-50);
    }

    this.saveHistory();
  }

  trackProductPurchase(productId) {
    const key = `product-${productId}`;
    this.purchaseHistory[key] = (this.purchaseHistory[key] || 0) + 1;
    this.saveHistory();
  }

  generateRecommendations() {
    // Generate frequently bought together
    this.generateFrequentlyBoughtTogether();
  }

  generateFrequentlyBoughtTogether() {
    // Create associations between products in same category
    const byCategory = {};

    this.products.forEach((product) => {
      if (!byCategory[product.category]) {
        byCategory[product.category] = [];
      }
      byCategory[product.category].push(product);
    });

    // Create associations
    Object.keys(byCategory).forEach((category) => {
      const categoryProducts = byCategory[category];
      categoryProducts.forEach((product) => {
        this.frequentlyBoughtTogether[product.id] = categoryProducts
          .filter((p) => p.id !== product.id)
          .slice(0, 6);
      });
    });
  }

  getFrequentlyBoughtTogether(productId, limit = 4) {
    const recommended = this.frequentlyBoughtTogether[productId] || [];
    return recommended.slice(0, limit);
  }

  getAlsoViewed(productId, limit = 4) {
    // Get products from same category that user viewed
    const currentProduct = this.products.find((p) => p.id === productId);
    if (!currentProduct) return [];

    const recentlyViewed = this.viewHistory.map((v) => v.id).slice(-20);

    const sameCategory = this.products.filter(
      (p) => p.category === currentProduct.category && p.id !== productId
    );

    return sameCategory
      .sort((a, b) => {
        const aViews = recentlyViewed.filter((id) => id === a.id).length;
        const bViews = recentlyViewed.filter((id) => id === b.id).length;
        return bViews - aViews;
      })
      .slice(0, limit);
  }

  getRelatedProducts(productId, limit = 4) {
    const currentProduct = this.products.find((p) => p.id === productId);
    if (!currentProduct) return [];

    // Find complementary products from other categories
    const complementaryCategories = {
      seeds: ["crop-protection", "tools"],
      "crop-protection": ["seeds", "tools", "services"],
      tools: ["seeds", "crop-protection", "services"],
      services: ["seeds", "crop-protection", "tools"],
    };

    const targetCategories = complementaryCategories[currentProduct.category] || [];
    const related = this.products.filter((p) => targetCategories.includes(p.category));

    return related.slice(0, limit);
  }

  getPersonalizedRecommendations(limit = 6) {
    if (this.viewHistory.length === 0) {
      // Return featured products if no history
      return this.products.filter((p) => p.featured).slice(0, limit);
    }

    // Get most viewed category
    const categoryCount = {};
    this.viewHistory.forEach((view) => {
      const product = this.products.find((p) => p.id === view.id);
      if (product) {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      }
    });

    const topCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    );

    return this.products
      .filter((p) => p.category === topCategory)
      .slice(0, limit);
  }

  renderRecommendations(containerId, recommendations, badge) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (recommendations.length === 0) {
      container.innerHTML = '<p class="muted">No recommendations available.</p>';
      container.setAttribute("aria-busy", "false");
      return;
    }

    container.innerHTML = recommendations
      .map((product) => this.createRecommendationCard(product, badge))
      .join("");
    container.setAttribute("aria-busy", "false");
  }

  createRecommendationCard(product, badge) {
    return `
      <div class="recommendation-card" tabindex="0" role="article">
        <div style="position: relative">
          <img src="${product.image}" alt="${product.name}" class="recommendation-image" loading="lazy" />
          <span class="recommendation-badge ${badge ? `recommendation-badge--${badge}` : ""}" aria-label="Recommendation type: ${badge || 'Related'}">
            ${badge === "frequently-bought" ? "Often Bought" : badge === "related" ? "Related" : badge || "Recommended"}
          </span>
        </div>
        <div class="recommendation-content">
          <h4 class="recommendation-name">${product.name}</h4>
          <p class="recommendation-price">${product.priceLabel}</p>
          <div class="recommendation-cta">
            <a href="${product.selarUrl}" target="_blank" rel="noopener noreferrer" aria-label="Buy ${product.name} on Selar">
              Buy Now
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Public API for integrating with product pages
  displayProductRecommendations(productId) {
    const frequentlyBought = this.getFrequentlyBoughtTogether(productId);
    const alsoViewed = this.getAlsoViewed(productId);
    const related = this.getRelatedProducts(productId);

    // Render frequently bought together
    if (frequentlyBought.length > 0) {
      const container = document.getElementById("frequently-bought-container");
      if (container) {
        this.renderRecommendations("frequently-bought-grid", frequentlyBought, "frequently-bought");
        container.style.display = "block";
      }
    }

    // Render also viewed
    if (alsoViewed.length > 0) {
      const container = document.getElementById("also-viewed-container");
      if (container) {
        this.renderRecommendations("also-viewed-grid", alsoViewed, "also-viewed");
        container.style.display = "block";
      }
    }

    // Render related
    if (related.length > 0) {
      const container = document.getElementById("related-products-container");
      if (container) {
        this.renderRecommendations("related-products-grid", related, "related");
        container.style.display = "block";
      }
    }
  }

  displayHomeRecommendations() {
    const personalized = this.getPersonalizedRecommendations(4);
    const container = document.getElementById("personalized-recommendations-grid");
    if (container) {
      this.renderRecommendations("personalized-recommendations-grid", personalized);
    }
  }
}

// Initialize global instance
window.productRecommendations = null;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.productRecommendations = new ProductRecommendations();
  });
} else {
  window.productRecommendations = new ProductRecommendations();
}
