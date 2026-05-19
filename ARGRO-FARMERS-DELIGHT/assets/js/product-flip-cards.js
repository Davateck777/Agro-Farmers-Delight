(function () {
  "use strict";

  function initCard(card) {
    if (!card.hasAttribute("tabindex")) {
      card.setAttribute("tabindex", "0");
    }

    function toggleFlip() {
      card.classList.toggle("is-flipped");
    }

    card.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      toggleFlip();
    });

    card.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") {
        if (e.target.closest("a")) return;
        e.preventDefault();
        toggleFlip();
      }
    });
  }

  document.querySelectorAll(".flip-card").forEach(initCard);
})();
