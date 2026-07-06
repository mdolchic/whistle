function updateMeta() {
  document.title = "Whistle — ставки на спорт, аналитика матчей и ответственная игра";

  const metaMappings = [
    ["meta[property='og:title']", "content", "Whistle — ставки на спорт, аналитика матчей и ответственная игра"],
    ["meta[name='twitter:title']", "content", "Whistle — ставки на спорт, аналитика матчей и ответственная игра"],
    ["meta[property='og:site_name']", "content", "Whistle"],
    ["meta[property='og:url']", "content", "https://whistle.pro"],
    ["link[rel='canonical']", "href", "https://whistle.pro"],
  ];

  for (const [selector, attribute, value] of metaMappings) {
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute(attribute, value);
    }
  }
}

function updateBranding() {
  const logoBadge = document.querySelector("header a[aria-label*='главную'] span");
  if (logoBadge) {
    logoBadge.textContent = "W";
  }

  const titleElement = document.querySelector("header a[aria-label*='главную'] .text-sm.font-semibold");
  if (titleElement) {
    titleElement.textContent = "Whistle";
  }

  const homeLink = document.querySelector("header a[aria-label]");
  if (homeLink) {
    homeLink.setAttribute("aria-label", "На главную, Whistle");
  }
}

function insertPromoBanner() {
  const siteFrame = document.querySelector(".site-frame");
  if (!siteFrame) {
    return;
  }

  const existingPromo =
    siteFrame.querySelector(":scope > [data-whistle-promo='top']") ||
    Array.from(siteFrame.children).find((element) =>
      element.textContent?.includes("Промокод WHIST50"),
    );

  if (existingPromo) {
    existingPromo.dataset.whistlePromo = "top";
    return;
  }

  const promoBanner = document.createElement("div");
  promoBanner.dataset.whistlePromo = "top";
  promoBanner.className =
    "border-b border-[rgba(198,161,91,0.24)] bg-[rgba(198,161,91,0.14)] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#f3e2bf] sm:px-6";
  promoBanner.textContent = "Промокод WHIST50 — бонус до 300 рублей";

  siteFrame.prepend(promoBanner);
}

function updateBettingCards() {
  const allButtons = Array.from(document.querySelectorAll("a"));

  for (const button of allButtons) {
    const label = button.textContent?.trim();

    if (label === "Начать ставить") {
      button.href = "https://fastgame777.xyz/0MA3XW";
      button.target = "_blank";
      button.rel = "noopener noreferrer";
      button.setAttribute("aria-label", "Начать ставить. Открыть сайт ставок в новой вкладке.");

      const card = button.closest("div.rounded-3xl");
      if (card && !card.querySelector("[data-whistle-promo='bet']")) {
        const promo = document.createElement("p");
        promo.dataset.whistlePromo = "bet";
        promo.className = "mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-soft";
        promo.textContent = "Промокод WHIST50 — бонус до 300 рублей";
        card.appendChild(promo);
      }
    }

    if (label === "Получить бонус") {
      const card = button.closest("div.rounded-3xl");
      const descriptions = card?.querySelectorAll("p");
      const description = descriptions?.[descriptions.length - 1];
      if (description && !description.innerHTML.includes("WHIST50")) {
        description.innerHTML =
          'Бонусные предложения доступны по правилам акции. Промокод <span class="font-semibold text-[#f3e2bf]">WHIST50</span> дает бонус до <span class="font-semibold text-[#f3e2bf]">300 рублей</span>. Проверьте условия бонусов до активации.';
      }
    }
  }
}

function initWhistleCustomizations() {
  updateMeta();
  updateBranding();
  insertPromoBanner();
  updateBettingCards();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWhistleCustomizations);
} else {
  initWhistleCustomizations();
}
