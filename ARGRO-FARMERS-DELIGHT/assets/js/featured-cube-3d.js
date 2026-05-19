(function () {
  "use strict";

  function scriptTag() {
    return document.querySelector('script[src*="featured-cube-3d"]');
  }

  var jsonPath =
    (scriptTag() && scriptTag().getAttribute("data-json")) ||
    "data/products.json";

  function escapeHtml(s) {
    if (!s) return "";
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function fillCube(product) {
    var cube = document.getElementById("featured-cube");
    if (!cube || !product) return;

    var faces = cube.querySelectorAll("[data-cube-face]");
    var byType = {};
    faces.forEach(function (el) {
      byType[el.getAttribute("data-cube-face")] = el;
    });

    var imgHtml =
      '<img class="cube-face__img" src="' +
      escapeHtml(product.image) +
      '" alt="" loading="lazy" width="120" height="72" />';

    if (byType.front) {
      byType.front.innerHTML =
        '<div class="cube-face__inner">' +
        imgHtml +
        "<strong>" +
        escapeHtml(product.name) +
        "</strong></div>";
    }
    if (byType.back) {
      byType.back.innerHTML =
        '<div class="cube-face__inner"><span class="tag">Price</span><strong>' +
        escapeHtml(product.priceLabel) +
        "</strong><span>" +
        escapeHtml(product.shortDescription) +
        "</span></div>";
    }
    if (byType.right) {
      byType.right.innerHTML =
        '<div class="cube-face__inner"><span class="tag">Category</span><strong>' +
        escapeHtml(product.category.replace(/-/g, " ")) +
        "</strong></div>";
    }
    if (byType.left) {
      byType.left.innerHTML =
        '<div class="cube-face__inner"><span class="tag">Checkout</span><span>Secure purchase on Selar</span></div>';
    }
    if (byType.top) {
      byType.top.innerHTML =
        '<div class="cube-face__inner"><span class="tag">Today\'s pick</span><span>Top product of the day</span></div>';
    }
    if (byType.bottom) {
      byType.bottom.innerHTML =
        '<div class="cube-face__inner"><span>Trusted agronomy picks · Curated for growers</span></div>';
    }

    var caption = document.getElementById("cube-caption");
    if (caption) {
      caption.innerHTML =
        "<strong>" +
        escapeHtml(product.name) +
        "</strong><br /><span class='muted'>" +
        escapeHtml(product.shortDescription) +
        "</span>";
    }

    var cta = document.getElementById("cube-selar-cta");
    if (cta) {
      cta.href = product.selarUrl;
    }

    var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      cube.classList.remove("is-spinning");
    } else {
      cube.classList.add("is-spinning");
    }

    var pauseBtn = document.getElementById("cube-pause");
    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        cube.classList.toggle("is-spinning");
        pauseBtn.textContent = cube.classList.contains("is-spinning")
          ? "Pause rotation"
          : "Resume rotation";
      });
    }
  }

  function resolveJsonUrl() {
    try {
      return new URL(jsonPath, window.location.href).href;
    } catch (e) {
      return jsonPath;
    }
  }

  function run() {
    fetch(resolveJsonUrl())
      .then(function (r) {
        if (!r.ok) throw new Error("products json");
        return r.json();
      })
      .then(function (list) {
        var pod =
          list.find(function (p) {
            return p.productOfDay;
          }) || list[0];
        fillCube(pod);
      })
      .catch(function () {
        var cap = document.getElementById("cube-caption");
        if (cap) {
          cap.textContent =
            "Could not load product data. Serve this site over http(s) (local server).";
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
