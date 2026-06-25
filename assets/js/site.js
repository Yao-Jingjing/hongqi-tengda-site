(() => {
  "use strict";

  const OFFICIAL_EMAIL = "drwang@hongqitengda.cn";

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) {
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
    document.body.classList.remove("modal-open");
  };

  const openModal = target => {
    if (!target) return;
    target.hidden = false;
    document.body.classList.add("modal-open");
    target.querySelector(".modal-close")?.focus();
  };

  const qrModal = document.getElementById("qr-modal");
  document.querySelectorAll("[data-open-qr]").forEach(button => {
    button.addEventListener("click", () => openModal(qrModal));
  });

  const decodeValue = value => {
    try {
      return decodeURIComponent(String(value || "").replace(/\+/g, " "));
    } catch {
      return String(value || "");
    }
  };

  const parseMailto = href => {
    const raw = String(href || "").replace(/^mailto:/i, "");
    const separatorIndex = raw.indexOf("?");
    const addressPart = separatorIndex >= 0 ? raw.slice(0, separatorIndex) : raw;
    const queryPart = separatorIndex >= 0 ? raw.slice(separatorIndex + 1) : "";
    const params = new URLSearchParams(queryPart);
    return {
      href: href || `mailto:${OFFICIAL_EMAIL}`,
      address: decodeValue(addressPart) || OFFICIAL_EMAIL,
      subject: params.get("subject") || ""
    };
  };

  const copyText = async text => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("copy failed");
  };

  const showTemporaryText = (button, message, duration = 1800) => {
    if (!button) return;
    const original = button.dataset.originalText || button.textContent;
    button.dataset.originalText = original;
    button.textContent = message;
    window.setTimeout(() => {
      button.textContent = original;
    }, duration);
  };

  const createEmailModal = () => {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "email-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "email-modal-title");
    modal.hidden = true;
    modal.innerHTML = `
      <div class="modal-backdrop" data-close-modal></div>
      <div class="modal-panel email-modal-panel">
        <button class="modal-close" type="button" data-close-modal aria-label="关闭">×</button>
        <span class="section-en">CONTACT BY EMAIL</span>
        <h2 id="email-modal-title">需求提交与订单查询</h2>
        <p><span data-email-guidance>发布需求请写明服务项目、样品或模型信息、数量、交付时间及联系方式；查询订单请提供订单编号、项目名称和联系人。</span> 若浏览器未设置默认邮件应用，也可复制邮箱后使用常用邮箱发送。</p>
        <div class="email-address-box">
          <span>需求与订单受理邮箱</span>
          <strong data-email-address>${OFFICIAL_EMAIL}</strong>
        </div>
        <div class="email-subject-row" data-email-subject-row hidden>
          <span>邮件主题</span>
          <strong data-email-subject></strong>
        </div>
        <div class="email-modal-actions">
          <button class="button" type="button" data-open-email-app>打开邮箱</button>
          <button class="button button-outline" type="button" data-copy-modal-email>复制受理邮箱</button>
        </div>
        <small class="email-modal-tip">若“打开邮箱”没有反应，请复制受理邮箱，并使用您常用的邮箱发送。</small>
      </div>`;
    document.body.appendChild(modal);
    return modal;
  };

  const emailModal = createEmailModal();
  let activeMailto = `mailto:${OFFICIAL_EMAIL}`;
  let activeEmail = OFFICIAL_EMAIL;

  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const mail = parseMailto(link.getAttribute("href"));
      activeMailto = mail.href;
      activeEmail = mail.address;
      emailModal.querySelector("[data-email-address]").textContent = mail.address;
      const subjectRow = emailModal.querySelector("[data-email-subject-row]");
      const subjectValue = emailModal.querySelector("[data-email-subject]");
      if (mail.subject) {
        subjectValue.textContent = mail.subject;
        subjectRow.hidden = false;
      } else {
        subjectValue.textContent = "";
        subjectRow.hidden = true;
      }
      openModal(emailModal);
    });
  });

  emailModal.querySelector("[data-open-email-app]")?.addEventListener("click", () => {
    window.location.href = activeMailto;
  });


  emailModal.querySelector("[data-copy-modal-email]")?.addEventListener("click", async event => {
    const button = event.currentTarget;
    try {
      await copyText(activeEmail);
      showTemporaryText(button, "邮箱已复制");
    } catch {
      window.prompt("请复制官网邮箱：", activeEmail);
    }
  });


  document.querySelectorAll("[data-copy-email]").forEach(button => {
    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail || OFFICIAL_EMAIL;
      try {
        await copyText(email);
        showTemporaryText(button, "邮箱已复制");
      } catch {
        window.prompt("请复制官网邮箱：", email);
      }
    });
  });

  document.addEventListener("click", event => {
    const closeButton = event.target.closest("[data-close-modal]");
    if (closeButton) closeModal(closeButton.closest(".modal"));
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
