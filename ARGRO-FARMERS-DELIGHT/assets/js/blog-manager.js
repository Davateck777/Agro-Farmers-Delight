// Blog & Knowledge Base Module

class BlogManager {
  constructor() {
    this.articles = [
      {
        id: 1,
        title: "Getting Started with Hybrid Seeds",
        anchor: "hybrid-seeds",
        category: "Seeds",
        excerpt: "Learn how to choose, plant, and get maximum yield from certified hybrid seeds — including why you should never save them for replanting.",
        image: "assets/images/products/Maize Hybrid Variety.PNG",
        author: "Agro Farmers Delight",
        date: "2025-05-10",
        readTime: 6,
        tags: ["seeds", "beginner", "hybrid", "maize"],
      },
      {
        id: 2,
        title: "Organic Pest Management Techniques",
        anchor: "organic-pest",
        category: "Crop Protection",
        excerpt: "Discover neem-based sprays, biological controls, and cultural practices that protect your crops sustainably — without costly chemical residues.",
        image: "assets/images/products/Biological Pest Control Kit.PNG",
        author: "Agro Farmers Delight",
        date: "2025-05-05",
        readTime: 7,
        tags: ["organic", "pest-control", "sustainable", "neem"],
      },
      {
        id: 3,
        title: "Soil Testing and Preparation",
        anchor: "soil-testing",
        category: "Tools",
        excerpt: "Master soil pH and moisture testing to stop wasting fertiliser and start unlocking the nutrients already in your field.",
        image: "assets/images/products/Digital Soil Moisture & pH Meter.PNG",
        author: "Agro Farmers Delight",
        date: "2025-04-28",
        readTime: 5,
        tags: ["soil", "testing", "tools", "pH"],
      },
      {
        id: 4,
        title: "Smart Water Management: Drip Irrigation for Smallholder Farmers",
        anchor: "smart-irrigation",
        category: "Innovation",
        excerpt: "How solar-powered drip irrigation slashes water use by 50%, enables year-round cropping, and pays back within a single dry-season harvest.",
        image: "assets/images/products/Solar-Powered Drip Irrigation Kit.PNG",
        author: "Agro Farmers Delight",
        date: "2025-04-20",
        readTime: 8,
        tags: ["irrigation", "solar", "water", "innovation"],
      },
      {
        id: 5,
        title: "Digital Farm Records: Beat Crop Loss with Data",
        anchor: "farm-records",
        category: "Farm Management",
        excerpt: "Most farmers underestimate their cost of production by 40%. Digital record-keeping fixes that — and unlocks credit, premium markets, and smarter decisions.",
        image: "assets/images/products/Garden Tool Complete Set.PNG",
        author: "Agro Farmers Delight",
        date: "2025-04-15",
        readTime: 6,
        tags: ["records", "data", "management", "profit"],
      },
    ];

    this.faqs = [
      {
        question: "What is the best time to plant seeds?",
        answer: "The best planting time depends on your region and crop type. Generally, plant during your local rainy season or when soil temperatures are suitable for germination.",
      },
      {
        question: "How often should I water my crops?",
        answer: "Watering frequency depends on rainfall, soil type, and crop. Most crops need consistent moisture but not waterlogged soil. Check soil moisture 2 inches deep.",
      },
      {
        question: "What organic pesticides are most effective?",
        answer: "Neem oil, spinosad, and insecticidal soaps are effective organic options. Always follow label directions and local regulations.",
      },
      {
        question: "How do I know my soil pH?",
        answer: "Use a soil testing kit or send samples to a local agricultural extension office. Most crops prefer a pH between 6.0 and 7.0.",
      },
    ];

    this.init();
  }

  init() {
    this.setupSearchFilter();
    this.setupFAQToggle();
    this.displayBlogArticles();

    const params = new URLSearchParams(window.location.search);
    const articleId = params.get("id");
    if (articleId && document.getElementById("article-detail-container")) {
      this.displayArticleDetail(articleId);
    }

    if (document.getElementById("faq-container")) {
      this.displayFAQSection();
    }
  }

  setupSearchFilter() {
    const searchInput = document.getElementById("blog-search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => this.filterArticles(e.target.value));
  }

  setupFAQToggle() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      question?.addEventListener("click", () => this.toggleFAQ(item));
      question?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleFAQ(item);
        }
      });
    });
  }

  toggleFAQ(item) {
    const isOpen = item.classList.contains("is-open");
    item.classList.toggle("is-open");

    const question = item.querySelector(".faq-question");
    question?.setAttribute("aria-expanded", !isOpen);
  }

  displayBlogArticles() {
    const grid = document.getElementById("blog-articles-grid");
    if (!grid) return;

    grid.innerHTML = this.articles
      .map((article) => this.createBlogCard(article))
      .join("");
    grid.setAttribute("aria-busy", "false");
  }

  createBlogCard(article) {
    const articleLink = `blog-article.html#${article.anchor}`;

    return `
      <article class="blog-card" role="article" tabindex="0">
        <img src="${article.image}" alt="" class="blog-card-image" loading="lazy" />
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span class="blog-card-category">${article.category}</span>
            <span class="blog-read-time" aria-label="Estimated read time">${article.readTime} min read</span>
          </div>
          <h3 class="blog-card-title">
            <a href="${articleLink}" class="blog-card-link">${article.title}</a>
          </h3>
          <p class="blog-card-excerpt">${article.excerpt}</p>
          <div class="blog-card-footer">
            <span class="blog-read-time">
              <time datetime="${article.date}">${this.formatDate(article.date)}</time>
            </span>
            <a href="${articleLink}" class="blog-card-link">Read more →</a>
          </div>
        </div>
      </article>
    `;
  }

  filterArticles(query) {
    const grid = document.getElementById("blog-articles-grid");
    if (!grid) return;

    const filtered = this.articles.filter((article) => {
      const searchText = query.toLowerCase();
      return (
        article.title.toLowerCase().includes(searchText) ||
        article.excerpt.toLowerCase().includes(searchText) ||
        article.category.toLowerCase().includes(searchText) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchText))
      );
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="blog-empty" style="grid-column: 1 / -1">
          <p>No articles found matching "${query}". Try different keywords.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map((article) => this.createBlogCard(article)).join("");
  }

  displayArticleDetail(articleId) {
    const article = this.articles.find((a) => a.id === parseInt(articleId, 10));
    if (!article) return;

    const container = document.getElementById("article-detail-container");
    if (!container) return;

    container.innerHTML = `
      <article class="blog-article" role="main">
        <div class="article-header">
          <div class="blog-breadcrumb">
            <a href="blog.html">Blog</a>
            <span>/</span>
            <span>${article.category}</span>
          </div>
          <h1>${article.title}</h1>
          <div class="article-meta">
            <strong>By ${article.author}</strong>
            <time datetime="${article.date}">${this.formatDate(article.date)}</time>
            <span>${article.readTime} min read</span>
          </div>
        </div>

        <img src="${article.image}" alt="${article.title}" class="article-image" />

        <div class="article-content">
          <p>${article.excerpt}</p>
          <p>${article.content}</p>
          
          <h2>Key Takeaways</h2>
          <div class="article-highlight">
            <ul>
              <li>Choose appropriate varieties for your climate and soil</li>
              <li>Follow proper planting and watering guidelines</li>
              <li>Monitor crop health regularly throughout the season</li>
              <li>Harvest at the right time for maximum quality</li>
            </ul>
          </div>
        </div>

        <div class="social-sharing" role="group" aria-label="Share this article">
          <span class="social-sharing-label">Share this article:</span>
          <button class="social-btn social-btn--facebook" onclick="window.open('https://facebook.com/sharer/sharer.php?u=' + window.location.href, '_blank', 'width=600,height=400')" aria-label="Share on Facebook">
            Facebook
          </button>
          <button class="social-btn social-btn--twitter" onclick="window.open('https://twitter.com/intent/tweet?url=' + window.location.href + '&text=${article.title}', '_blank', 'width=600,height=400')" aria-label="Share on Twitter">
            Twitter
          </button>
          <button class="social-btn social-btn--whatsapp" onclick="window.open('https://wa.me/?text=${article.title} ' + window.location.href, '_blank')" aria-label="Share on WhatsApp">
            WhatsApp
          </button>
        </div>
      </article>

      <section class="related-articles">
        <h3>Related Articles</h3>
        <div class="related-articles-grid">
          ${this.articles
            .filter((a) => a.id !== article.id && a.category === article.category)
            .slice(0, 3)
            .map((a) => this.createBlogCard(a))
            .join("")}
        </div>
      </section>
    `;
  }

  displayFAQSection() {
    const container = document.getElementById("faq-container");
    if (!container) return;

    container.innerHTML = `
      <ul class="faq-list" role="region" aria-label="Frequently asked questions">
        ${this.faqs
          .map(
            (faq, index) => `
          <li class="faq-item">
            <button class="faq-question" aria-expanded="false" id="faq-${index}">
              ${faq.question}
              <span class="faq-toggle" aria-hidden="true">▼</span>
            </button>
            <div class="faq-answer" role="region" aria-labelledby="faq-${index}">
              <div class="faq-answer-content">
                ${faq.answer}
              </div>
            </div>
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    // Setup toggles for newly created items
    this.setupFAQToggle();
  }

  formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  searchFAQ(query) {
    const filtered = this.faqs.filter((faq) => {
      const search = query.toLowerCase();
      return faq.question.toLowerCase().includes(search) || faq.answer.toLowerCase().includes(search);
    });

    const container = document.getElementById("faq-container");
    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = '<p class="muted">No FAQs match your search.</p>';
      return;
    }

    container.innerHTML = `
      <ul class="faq-list">
        ${filtered
          .map(
            (faq, index) => `
          <li class="faq-item">
            <button class="faq-question" aria-expanded="false">
              ${faq.question}
              <span class="faq-toggle" aria-hidden="true">▼</span>
            </button>
            <div class="faq-answer">
              <div class="faq-answer-content">${faq.answer}</div>
            </div>
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    this.setupFAQToggle();
  }
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.blogManager = new BlogManager();
  });
} else {
  window.blogManager = new BlogManager();
}
