// Product Comparison Module

class ProductComparison {
  constructor() {
    this.products = [];
    this.selectedProducts = [];
    this.init();
  }

  async init() {
    await this.loadProducts();
    this.getProductsFromURL();
    if (this.selectedProducts.length > 0) {
      this.buildComparisonTable();
    }
    this.setupEventListeners();
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

  getProductsFromURL() {
    const params = new URLSearchParams(window.location.search);
    const productIds = params.get("products");

    if (!productIds) {
      // Check sessionStorage for comparison state
      const saved = sessionStorage.getItem("comparison-products");
      if (saved) {
        const ids = JSON.parse(saved);
        this.selectedProducts = this.products.filter((p) => ids.includes(p.id));
      }
      return;
    }

    const ids = productIds.split(",").map((id) => parseInt(id, 10));
    this.selectedProducts = this.products.filter((p) => ids.includes(p.id));
  }

  setupEventListeners() {
    const printBtn = document.getElementById("print-comparison");
    const resetBtn = document.getElementById("reset-comparison");

    if (printBtn) {
      printBtn.addEventListener("click", () => this.printComparison());
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetComparison());
    }

    // Remove from comparison buttons
    document.querySelectorAll(".remove-from-comparison").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = parseInt(btn.dataset.productId, 10);
        this.selectedProducts = this.selectedProducts.filter((p) => p.id !== productId);
        if (this.selectedProducts.length > 0) {
          this.buildComparisonTable();
        } else {
          this.showEmptyState();
        }
      });
    });
  }

  buildComparisonTable() {
    const emptyState = document.getElementById("empty-state");
    const table = document.getElementById("comparison-table");
    const headerRow = document.getElementById("comparison-header-row");
    const tbody = document.getElementById("comparison-tbody");

    if (!table || !headerRow || !tbody) return;

    // Hide empty state
    if (emptyState) emptyState.style.display = "none";
    table.style.display = "block";

    // Build header with product names
    let headerHTML = '<th class="comparison-th--label">Attribute</th>';
    this.selectedProducts.forEach((product) => {
      headerHTML += `
        <th>
          <div style="position: relative; padding-bottom: 30px">
            ${product.name}
            <button 
              type="button" 
              class="remove-from-comparison" 
              data-product-id="${product.id}"
              aria-label="Remove ${product.name} from comparison"
              title="Remove"
            >×</button>
          </div>
        </th>
      `;
    });
    headerRow.innerHTML = headerHTML;

    // Build body rows
    let bodyHTML = this.createComparisonRows();
    tbody.innerHTML = bodyHTML;

    // Re-attach event listeners for remove buttons
    document.querySelectorAll(".remove-from-comparison").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const productId = parseInt(btn.dataset.productId, 10);
        this.selectedProducts = this.selectedProducts.filter((p) => p.id !== productId);
        if (this.selectedProducts.length > 0) {
          this.buildComparisonTable();
        } else {
          this.showEmptyState();
        }
      });
    });
  }

  createComparisonRows() {
    const rows = [
      {
        label: "Product Image",
        getValue: (product) =>
          `<img src="${product.image}" alt="${product.name}" class="product-comparison-image" />`,
      },
      {
        label: "Category",
        getValue: (product) => `<span class="category-chip">${product.category}</span>`,
      },
      {
        label: "Description",
        getValue: (product) => `<p style="text-align: left; margin: 0">${product.shortDescription}</p>`,
      },
      {
        label: "Price",
        getValue: (product) => `<strong>${product.priceLabel}</strong>`,
      },
      {
        label: "In Stock",
        getValue: (product) => (product.outOfStock ? "❌ No" : "✓ Yes"),
      },
      {
        label: "Seasonal",
        getValue: (product) => (product.seasonal ? "✓ Yes" : "❌ No"),
      },
      {
        label: "Featured",
        getValue: (product) => (product.featured ? "✓ Yes" : "❌ No"),
      },
      {
        label: "Action",
        getValue: (product) =>
          `<a href="${product.selarUrl}" class="btn btn--primary btn--small" target="_blank" rel="noopener noreferrer">Buy on Selar</a>`,
      },
    ];

    let html = "";
    rows.forEach((row) => {
      html += `<tr><td><strong>${row.label}</strong></td>`;
      this.selectedProducts.forEach((product) => {
        html += `<td>${row.getValue(product)}</td>`;
      });
      html += `</tr>`;
    });

    return html;
  }

  showEmptyState() {
    const emptyState = document.getElementById("empty-state");
    const table = document.getElementById("comparison-table");

    if (emptyState && table) {
      emptyState.style.display = "block";
      table.style.display = "none";
      sessionStorage.removeItem("comparison-products");
    }
  }

  printComparison() {
    window.print();
  }

  resetComparison() {
    if (confirm("Clear all products from comparison?")) {
      this.selectedProducts = [];
      this.showEmptyState();
      sessionStorage.removeItem("comparison-products");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ProductComparison();
  });
} else {
  new ProductComparison();
}
