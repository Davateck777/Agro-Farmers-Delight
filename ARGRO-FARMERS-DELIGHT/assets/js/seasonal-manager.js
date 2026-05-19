// Seasonal Content Management Module

class SeasonalManager {
  constructor() {
    this.seasonalData = {
      title: "Planting Season Guide",
      subtitle: "This month focus on early-season prep and transplant health.",
      message: "May is ideal for starting rainy season crops. Prepare soil, select quality seeds, and monitor moisture.",
      daysUntilSeason: this.calculateDaysUntilDate(new Date(new Date().getFullYear(), 4, 15)), // May 15
      seasonalTips: [
        "Start seeds indoors 6-8 weeks before the last frost",
        "Test your soil for pH and nutrient content",
        "Prepare raised beds or containers with rich compost",
        "Check irrigation systems before the rains arrive",
        "Scout for early pests and beneficial insects",
      ],
      trendingProducts: [1, 2, 3, 4, 5], // Product IDs
      messages: [
        "May is ideal for starting rainy season crops. Prepare soil, select quality seeds.",
        "Early planting ensures healthy growth and better yields this season.",
        "Quality inputs now = stronger harvests later.",
      ],
    };

    this.products = [];
    this.currentMessageIndex = 0;
    this.init();
  }

  async init() {
    await this.loadProducts();
    this.setupCountdown();
    this.setupRotatingMessage();
    this.displaySeasonalContent();
  }

  async loadProducts() {
    try {
      const response = await fetch("data/products.json");
      this.products = await response.json();
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  }

  calculateDaysUntilDate(targetDate) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diff = target.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return Math.max(0, days);
  }

  setupCountdown() {
    const countdownEl = document.getElementById("seasonal-countdown");
    if (!countdownEl) return;

    const updateCountdown = () => {
      const days = this.seasonalData.daysUntilSeason;
      const weeks = Math.floor(days / 7);
      const remaining = days % 7;

      const html = `
        <div class="countdown-unit">
          <div class="countdown-value">${days}</div>
          <div class="countdown-label">Days</div>
        </div>
        <div class="countdown-unit">
          <div class="countdown-value">${weeks}</div>
          <div class="countdown-label">Weeks</div>
        </div>
        <div class="countdown-unit">
          <div class="countdown-value">${remaining}</div>
          <div class="countdown-label">Days Left</div>
        </div>
      `;

      countdownEl.innerHTML = html;
    };

    updateCountdown();

    // Update countdown every hour
    setInterval(updateCountdown, 3600000);
  }

  setupRotatingMessage() {
    const messageEl = document.getElementById("seasonal-message-rotate");
    if (!messageEl) return;

    const updateMessage = () => {
      const message = this.seasonalData.messages[this.currentMessageIndex];
      messageEl.innerHTML = `<span class="seasonal-message-text">${message}</span>`;
      this.currentMessageIndex = (this.currentMessageIndex + 1) % this.seasonalData.messages.length;
    };

    updateMessage();

    // Rotate message every 6 seconds
    setInterval(updateMessage, 6000);
  }

  displaySeasonalContent() {
    // Update header
    const headerEl = document.querySelector(".seasonal-copy h2");
    if (headerEl) {
      headerEl.textContent = this.seasonalData.title;
    }

    const subtitleEl = document.querySelector(".seasonal-copy > p:first-of-type");
    if (subtitleEl) {
      subtitleEl.textContent = this.seasonalData.subtitle;
    }

    // Display seasonal products
    this.displaySeasonalProducts();

    // Display tips
    this.displaySeasonalTips();

    // Add "New this season" badge to featured products
    this.addSeasonalBadges();
  }

  displaySeasonalProducts() {
    const gridEl = document.getElementById("seasonal-products-grid");
    if (!gridEl || this.products.length === 0) return;

    const seasonalProducts = this.products.filter((p) => this.seasonalData.trendingProducts.includes(p.id));

    if (seasonalProducts.length === 0) return;

    gridEl.innerHTML = seasonalProducts
      .map(
        (product) => `
      <article class="seasonal-product-card">
        <div style="position: relative">
          <img src="${product.image}" alt="${product.name}" class="seasonal-product-image" loading="lazy" />
          <span class="seasonal-tag">This Season</span>
        </div>
        <h4 class="seasonal-product-name">${product.name}</h4>
        <p class="seasonal-product-price">${product.priceLabel}</p>
        <a href="${product.selarUrl}" class="btn btn--primary btn--small seasonal-product-cta" target="_blank" rel="noopener noreferrer">
          Buy on Selar
        </a>
      </article>
    `
      )
      .join("");
  }

  displaySeasonalTips() {
    const tipsEl = document.getElementById("seasonal-tips-list");
    if (!tipsEl) return;

    tipsEl.innerHTML = this.seasonalData.seasonalTips
      .map(
        (tip) => `
      <li>
        <strong>${tip.split(":")[0]}:</strong>
        ${tip.split(":")[1] || tip}
      </li>
    `
      )
      .join("");
  }

  addSeasonalBadges() {
    // This would typically be called to mark featured products as "new this season"
    const featuredProducts = document.querySelectorAll(".flip-card[data-featured='true']");
    featuredProducts.forEach((el) => {
      el.classList.add("new-this-season");
    });
  }

  // Get seasonal content for display
  getSeasonalStatus() {
    const now = new Date();
    const month = now.getMonth();
    const dayOfMonth = now.getDate();

    // Define seasons (customize based on your region)
    let season = "Dry";
    let seasonalAdvice = "Prepare fields and store seeds properly.";

    if (month >= 3 && month <= 9) {
      // April to October
      season = "Rainy/Planting";
      seasonalAdvice = "Ideal time for planting. Focus on soil health and moisture management.";
    } else if (month === 10) {
      season = "Harvest";
      seasonalAdvice = "Begin harvesting early-season crops. Plan for storage.";
    }

    return { season, seasonalAdvice, daysUntilSeason: this.seasonalData.daysUntilSeason };
  }

  updateSeasonalProducts(newProductIds) {
    this.seasonalData.trendingProducts = newProductIds;
    this.displaySeasonalProducts();
  }

  updateSeasonalMessage(newMessage) {
    this.seasonalData.messages.push(newMessage);
  }

  updateSeasonalTips(newTips) {
    this.seasonalData.seasonalTips = newTips;
    this.displaySeasonalTips();
  }
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("seasonal-countdown") || document.getElementById("seasonal-message-rotate")) {
      window.seasonalManager = new SeasonalManager();
    }
  });
} else {
  if (document.getElementById("seasonal-countdown") || document.getElementById("seasonal-message-rotate")) {
    window.seasonalManager = new SeasonalManager();
  }
}
