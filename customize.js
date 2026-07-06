const BETTING_URL = "https://fastgame777.xyz/0MA3XW";

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

function createPromoBanner() {
  const promoBanner = document.createElement("div");
  promoBanner.dataset.whistlePromo = "top";
  promoBanner.className =
    "border-b border-[rgba(198,161,91,0.24)] bg-[rgba(198,161,91,0.14)] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#f3e2bf] sm:px-6";
  syncPromoBannerContent(promoBanner);
  return promoBanner;
}

function syncPromoBannerContent(promoBanner) {
  if (promoBanner.querySelector("[data-whistle-promo-button='top']")) {
    return;
  }

  const content = document.createElement("div");
  content.className = "mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 sm:flex-row";

  const text = document.createElement("span");
  text.textContent = "Промокод WHIST50 — бонус до 300 рублей";

  const button = document.createElement("a");
  button.dataset.whistlePromoButton = "top";
  button.href = BETTING_URL;
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.className = "button-shared focus-visible:outline-none button-primary";
  button.textContent = "Перейти к ставкам";
  button.setAttribute("aria-label", "Перейти к ставкам. Открыть сайт ставок в новой вкладке.");

  content.append(text, button);
  promoBanner.replaceChildren(content);
}

function insertPromoBanner() {
  const body = document.body;
  if (!body) {
    return;
  }

  let promoBanner = body.querySelector("[data-whistle-promo='top']");
  if (!promoBanner) {
    promoBanner = createPromoBanner();
  }
  syncPromoBannerContent(promoBanner);

  const skipLink = body.querySelector("a[href='#content']");
  const anchorElement = skipLink || body.firstElementChild;

  if (!promoBanner.isConnected) {
    if (anchorElement) {
      anchorElement.insertAdjacentElement("afterend", promoBanner);
    } else {
      body.prepend(promoBanner);
    }
    return;
  }

  if (anchorElement && promoBanner.previousElementSibling !== anchorElement) {
    anchorElement.insertAdjacentElement("afterend", promoBanner);
  }
}

function watchPromoBanner() {
  const body = document.body;
  if (!body || body.dataset.whistlePromoObserver === "active") {
    return;
  }

  const observer = new MutationObserver(() => {
    insertPromoBanner();
  });

  observer.observe(body, { childList: true });
  body.dataset.whistlePromoObserver = "active";
}

function updateBettingCards() {
  const allButtons = Array.from(document.querySelectorAll("a"));
  const bettingLabels = new Set(["Начать ставить", "Пополнить счет", "Получить бонус", "Перейти к ставкам"]);

  for (const button of allButtons) {
    const label = button.textContent?.trim();

    if (label && bettingLabels.has(label)) {
      button.href = BETTING_URL;
      button.target = "_blank";
      button.rel = "noopener noreferrer";
      button.setAttribute("aria-label", `${label}. Открыть сайт ставок в новой вкладке.`);
    }

    if (label === "Начать ставить") {
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
  watchPromoBanner();
  updateBettingCards();

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(insertPromoBanner);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWhistleCustomizations);
} else {
  initWhistleCustomizations();
}

window.addEventListener("load", insertPromoBanner);
