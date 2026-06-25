(() => {
  "use strict";

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a,button")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  const closeModal = target => {
    if (!target) return;
    target.hidden = true;
    const visibleModal = document.querySelector(".modal:not([hidden])");
    if (!visibleModal) document.body.classList.remove("modal-open");
  };

  const openModal = target => {
    if (!target) return;
    target.hidden = false;
    document.body.classList.add("modal-open");
    target.querySelector(".modal-close")?.focus();
  };

  const qrModal = document.getElementById("qr-modal");

  document.addEventListener("click", event => {
    const qrTrigger = event.target.closest("[data-open-qr]");
    if (qrTrigger) {
      event.preventDefault();
      openModal(qrModal);
      return;
    }

    const closeButton = event.target.closest("[data-close-modal]");
    if (closeButton) {
      closeModal(closeButton.closest(".modal"));
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal:not([hidden])").forEach(closeModal);
    }
  });

  const metricTotal = document.getElementById("metric-total");
  const metricCategories = document.getElementById("metric-categories");
  if (metricTotal || metricCategories) {
    fetch("assets/data/summary.json")
      .then(response => response.ok ? response.json() : Promise.reject(new Error("load failed")))
      .then(data => {
        if (metricTotal) metricTotal.textContent = `${data.total}+`;
        if (metricCategories) metricCategories.textContent = data.categories;
      })
      .catch(() => {});
  }
})();
