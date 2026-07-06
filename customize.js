const BETTING_URL = "https://fastgame777.xyz/0MA3XW";
const NEWS_PLACEHOLDER_IMAGE = "/images/news-placeholder.svg";
const NEWS_REFRESH_INTERVAL_MS = 15 * 60 * 1000;

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
    "relative z-50 border-b border-[rgba(198,161,91,0.24)] bg-[rgba(198,161,91,0.14)] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#f3e2bf] sm:px-6";
  syncPromoBannerContent(promoBanner);
  return promoBanner;
}

function syncPromoBannerContent(promoBanner) {
  if (promoBanner.querySelector("[data-whistle-promo-button='top']")) {
    const button = promoBanner.querySelector("[data-whistle-promo-button='top']");
    if (button) {
      button.href = BETTING_URL;
      button.target = "_self";
      button.rel = "noreferrer";
    }
    return;
  }

  const content = document.createElement("div");
  content.className = "mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 sm:flex-row";

  const text = document.createElement("span");
  text.textContent = "Промокод WHIST50 — бонус до 300 рублей";

  const button = document.createElement("a");
  button.dataset.whistlePromoButton = "top";
  button.href = BETTING_URL;
  button.target = "_self";
  button.rel = "noreferrer";
  button.className = "button-shared focus-visible:outline-none button-primary";
  button.textContent = "Перейти к ставкам";
  button.setAttribute("aria-label", "Перейти к ставкам.");

  content.append(text, button);
  promoBanner.replaceChildren(content);
}

function insertPromoBanner() {
  const siteFrame = document.querySelector(".site-frame");
  if (!siteFrame) {
    return;
  }

  const strayPromoBanner = document.body?.querySelector(":scope > [data-whistle-promo='top']");
  if (strayPromoBanner) {
    strayPromoBanner.remove();
  }

  let promoBanner =
    siteFrame.querySelector(":scope > [data-whistle-promo='top']") ||
    Array.from(siteFrame.children).find((element) =>
      element.textContent?.includes("Промокод WHIST50"),
    );

  if (!promoBanner) {
    promoBanner = createPromoBanner();
    siteFrame.prepend(promoBanner);
  }

  promoBanner.dataset.whistlePromo = "top";
  promoBanner.classList.add("relative", "z-50");
  syncPromoBannerContent(promoBanner);
}

function watchPromoBanner() {
  const siteFrame = document.querySelector(".site-frame");
  if (!siteFrame || siteFrame.dataset.whistlePromoObserver === "active") {
    return;
  }

  const observer = new MutationObserver(() => {
    insertPromoBanner();
  });

  observer.observe(siteFrame, { childList: true });
  siteFrame.dataset.whistlePromoObserver = "active";
}

function updateBettingCards() {
  const allButtons = Array.from(document.querySelectorAll("a"));
  const bettingLabels = new Set(["Начать ставить", "Пополнить счет", "Получить бонус", "Перейти к ставкам"]);

  for (const button of allButtons) {
    const label = button.textContent?.trim();

    if (label && bettingLabels.has(label)) {
      button.href = BETTING_URL;
      button.target = "_self";
      button.rel = "noreferrer";
      button.setAttribute("aria-label", `${label}.`);
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

function formatNewsPublishedAt(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function normalizeNewsItems(payload) {
  const items = Array.isArray(payload?.items) ? payload.items : [];

  return items
    .filter((item) => item && item.title)
    .map((item, index) => ({
      id: item.id || `news-${index}`,
      title: item.title,
      source: item.source || "Спортивные новости",
      publishedAt: item.publishedAt || item.pubDate || item.date || "",
      imageUrl: item.imageUrl || item.image || NEWS_PLACEHOLDER_IMAGE,
      url: item.url || item.link || "#",
    }));
}

function createNewsCard(item) {
  const link = document.createElement("a");
  link.href = item.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "shrink-0 rounded-3xl focus-visible:rounded-3xl";

  const article = document.createElement("article");
  article.className =
    "flex min-h-[4.5rem] min-w-[19rem] max-w-[26rem] shrink-0 items-center gap-3 rounded-3xl border border-white/8 bg-white/[0.035] px-4 py-3 text-sm leading-5 text-[#e8dfd2] sm:min-w-[21rem]";

  const media = document.createElement("div");
  media.className = "h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20";

  const image = document.createElement("img");
  image.src = item.imageUrl;
  image.alt = item.title;
  image.width = 48;
  image.height = 48;
  image.loading = "lazy";
  image.referrerPolicy = "no-referrer";
  image.className = "h-full w-full object-cover";
  image.onerror = () => {
    image.src = NEWS_PLACEHOLDER_IMAGE;
  };

  const body = document.createElement("div");
  body.className = "min-w-0";

  const title = document.createElement("p");
  title.className = "line-clamp-2 font-medium text-[#f7f0e5]";
  title.textContent = item.title;

  const meta = document.createElement("p");
  meta.className = "mt-1 truncate text-xs leading-5 text-muted";
  const publishedAt = formatNewsPublishedAt(item.publishedAt);
  meta.textContent = [item.source, publishedAt].filter(Boolean).join(" • ");

  body.append(title);
  if (meta.textContent) {
    body.append(meta);
  }

  media.append(image);
  article.append(media, body);
  link.append(article);

  return link;
}

function renderNewsTickerNotice(title, description) {
  const track = document.querySelector(".news-ticker-track");
  if (!track) {
    return;
  }

  const card = document.createElement("div");
  card.className =
    "flex min-h-[4.25rem] min-w-[16rem] shrink-0 flex-col justify-center rounded-3xl border border-[rgba(198,161,91,0.2)] bg-[rgba(198,161,91,0.08)] px-4 py-3 text-sm leading-5 text-[#f2e6cf]";

  const headline = document.createElement("p");
  headline.className = "font-medium";
  headline.textContent = title;

  const body = document.createElement("p");
  body.className = "mt-1 text-xs leading-5 text-muted";
  body.textContent = description;

  card.append(headline, body);
  track.replaceChildren(card);
}

function renderNewsTickerItems(items) {
  const track = document.querySelector(".news-ticker-track");
  if (!track || !items.length) {
    return;
  }

  const doubledItems = [...items, ...items];
  track.replaceChildren(...doubledItems.map(createNewsCard));
}

async function refreshLiveNewsTicker() {
  renderNewsTickerNotice(
    "Обновляем спортивную ленту",
    "Показываем свежие новости сразу после ответа источника.",
  );

  try {
    const response = await fetch("/api/sports-news", { cache: "no-store" });
    if (!response.ok) {
      renderNewsTickerNotice(
        "Внешняя лента временно недоступна",
        "Попробуем обновить новости снова автоматически.",
      );
      return;
    }

    const payload = await response.json();
    const items = normalizeNewsItems(payload);
    renderNewsTickerItems(items);
  } catch {
    renderNewsTickerNotice(
      "Внешняя лента временно недоступна",
      "Попробуем обновить новости снова автоматически.",
    );
  }
}

function initWhistleCustomizations() {
  updateMeta();
  updateBranding();
  insertPromoBanner();
  watchPromoBanner();
  updateBettingCards();
  refreshLiveNewsTicker();
  window.setInterval(refreshLiveNewsTicker, NEWS_REFRESH_INTERVAL_MS);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(insertPromoBanner);
  });

  window.setTimeout(refreshLiveNewsTicker, 1500);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWhistleCustomizations);
} else {
  initWhistleCustomizations();
}

window.addEventListener("load", insertPromoBanner);
