// Social & Community Features Module

class SocialCommunity {
  constructor() {
    this.testimonials = [
      {
        id: 1,
        author: "Chidi Okafor",
        role: "Maize farmer, Kaduna",
        text: "The hybrid seeds from Agro Farmers Delight increased my yield by 40%. Customer service was excellent!",
        rating: 5,
        date: "2026-04-15",
      },
      {
        id: 2,
        author: "Amina Hassan",
        role: "Vegetable grower, Lagos",
        text: "Best place to source quality inputs. The organic pesticides are effective and affordable.",
        rating: 5,
        date: "2026-04-10",
      },
      {
        id: 3,
        author: "Kwame Mensah",
        role: "Rice farmer, Oyo State",
        text: "Reliable products and fast delivery. Will definitely order again.",
        rating: 4,
        date: "2026-03-28",
      },
      {
        id: 4,
        author: "Fatima Ahmed",
        role: "Smallholder farmer, Kano",
        text: "The seasonal guides are super helpful. I learned so much about soil preparation.",
        rating: 5,
        date: "2026-03-15",
      },
    ];

    this.feedback = [];
    this.currentCarouselIndex = 0;
    this.init();
  }

  init() {
    this.setupSocialSharing();
    this.setupTestimonialCarousel();
    this.setupCommunityFeedback();
    this.loadFeedback();
    this.displayFeedback();

    window.addEventListener("resize", () => {
      this.displayTestimonials();
    });
  }

  setupSocialSharing() {
    const shareButtons = document.querySelectorAll("[data-share]");
    shareButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const platform = btn.dataset.share;
        this.shareProduct(platform);
      });
    });
  }

  shareProduct(platform) {
    const url = window.location.href;
    const title = document.title;
    const text = "Check out this great agricultural product!";

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + "\n\n" + url)}`;
        break;
      case "copy":
        this.copyToClipboard(url);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Link copied to clipboard!");
    });
  }

  setupTestimonialCarousel() {
    const prevBtn = document.getElementById("testimonials-prev");
    const nextBtn = document.getElementById("testimonials-next");
    const dots = document.querySelectorAll(".carousel-dot");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.previousTestimonial());
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.nextTestimonial());
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToTestimonial(index));
    });

    this.displayTestimonials();
  }

  nextTestimonial() {
    this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.testimonials.length;
    this.displayTestimonials();
  }

  previousTestimonial() {
    this.currentCarouselIndex =
      (this.currentCarouselIndex - 1 + this.testimonials.length) % this.testimonials.length;
    this.displayTestimonials();
  }

  goToTestimonial(index) {
    this.currentCarouselIndex = index;
    this.displayTestimonials();
  }

  displayTestimonials() {
    const container = document.getElementById("testimonials-container");
    if (!container) return;

    // Calculate visible range (show 1-3 depending on screen size)
    const visibleCount = window.innerWidth >= 768 ? 2 : 1;
    const startIndex = this.currentCarouselIndex;
    const endIndex = Math.min(startIndex + visibleCount, this.testimonials.length);

    const visible = this.testimonials.slice(startIndex, endIndex);

    container.innerHTML = visible.map((testimonial) => this.createTestimonialCard(testimonial)).join("");

    // Update dots
    const dots = document.querySelectorAll(".carousel-dot");
    dots.forEach((dot, index) => {
      const isActive = index === this.currentCarouselIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    // Update button states
    const prevBtn = document.getElementById("testimonials-prev");
    const nextBtn = document.getElementById("testimonials-next");
    if (prevBtn) prevBtn.disabled = this.currentCarouselIndex === 0;
    if (nextBtn) nextBtn.disabled = endIndex >= this.testimonials.length;
  }

  createTestimonialCard(testimonial) {
    const initials = testimonial.author
      .split(" ")
      .map((n) => n[0])
      .join("");

    const stars = Array(5)
      .fill(0)
      .map(
        (_, i) =>
          `<span class="star ${i < testimonial.rating ? "" : "empty"}" aria-hidden="true">★</span>`
      )
      .join("");

    return `
      <article class="testimonial-card" role="article">
        <div class="testimonial-stars" role="img" aria-label="${testimonial.rating} out of 5 stars">
          ${stars}
        </div>
        <blockquote class="testimonial-text" cite="${testimonial.author}">
          "${testimonial.text}"
        </blockquote>
        <footer class="testimonial-author">
          <div class="testimonial-avatar" aria-hidden="true">${initials}</div>
          <div class="testimonial-author-info">
            <h4>${testimonial.author}</h4>
            <p>${testimonial.role}</p>
          </div>
        </footer>
      </article>
    `;
  }

  setupCommunityFeedback() {
    const form = document.getElementById("community-feedback-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.submitFeedback(form);
      });
    }
  }

  submitFeedback(form) {
    const textarea = form.querySelector("textarea");
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');

    if (!textarea?.value.trim() || !nameInput?.value.trim() || !emailInput?.value.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const feedback = {
      id: Date.now(),
      author: nameInput.value,
      email: emailInput.value,
      text: textarea.value,
      date: new Date().toISOString(),
    };

    this.feedback.push(feedback);
    this.saveFeedback();
    this.displayFeedback();

    form.reset();
    alert("Thank you for your feedback!");
  }

  saveFeedback() {
    localStorage.setItem("community-feedback", JSON.stringify(this.feedback));
  }

  loadFeedback() {
    const saved = localStorage.getItem("community-feedback");
    if (saved) {
      this.feedback = JSON.parse(saved);
    }
  }

  displayFeedback() {
    const container = document.getElementById("feedback-list");
    if (!container) return;

    if (this.feedback.length === 0) {
      container.innerHTML = '<p class="muted">No feedback yet. Be the first to share!</p>';
      return;
    }

    container.innerHTML = this.feedback
      .slice()
      .reverse()
      .map((item) => this.createFeedbackItem(item))
      .join("");
  }

  createFeedbackItem(feedback) {
    const date = new Date(feedback.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `
      <li class="feedback-item" role="article">
        <div class="feedback-author">${feedback.author}</div>
        <div class="feedback-date"><time datetime="${feedback.date}">${date}</time></div>
        <div class="feedback-text">${this.escapeHtml(feedback.text)}</div>
      </li>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  addSocialSharingToProducts() {
    const productCards = document.querySelectorAll(".flip-card");
    productCards.forEach((card) => {
      const shareDiv = document.createElement("div");
      shareDiv.className = "social-sharing";
      shareDiv.innerHTML = `
        <span class="social-sharing-label">Share:</span>
        <button class="social-btn social-btn--facebook" onclick="window.socialCommunity.shareProduct('facebook')" aria-label="Share on Facebook">📘</button>
        <button class="social-btn social-btn--twitter" onclick="window.socialCommunity.shareProduct('twitter')" aria-label="Share on Twitter">𝕏</button>
        <button class="social-btn social-btn--whatsapp" onclick="window.socialCommunity.shareProduct('whatsapp')" aria-label="Share on WhatsApp">💬</button>
      `;

      const backContent = card.querySelector(".flip-card__back");
      if (backContent && !backContent.querySelector(".social-sharing")) {
        backContent.appendChild(shareDiv);
      }
    });
  }
}

// Initialize global instance
window.socialCommunity = null;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.socialCommunity = new SocialCommunity();
  });
} else {
  window.socialCommunity = new SocialCommunity();
}
