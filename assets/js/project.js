(() => {
  "use strict";
  const copyFallback = text => { const el=document.createElement("textarea"); el.value=text; el.style.position="fixed"; el.style.opacity="0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); el.remove(); };
  document.querySelectorAll("[data-copy-project]").forEach(button => button.addEventListener("click", async () => {
    const status=document.querySelector("[data-copy-status]");
    try {
      const text=button.dataset.copyText || "";
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text); else copyFallback(text);
      if (status) status.textContent="项目信息已复制，可直接发送给企业微信顾问。";
    } catch (error) { if (status) status.textContent="复制失败，请手动选择页面信息。"; }
  }));
})();
