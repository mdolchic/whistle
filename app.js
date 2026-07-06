const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const ORIGIN = "https://sportclan.vercel.app";
const ROOT_DIR = __dirname;
const INDEX_PATH = path.join(ROOT_DIR, "index.html");
const BRAND_NAME = "Whistle";
const BET_LINK = "https://fastgame777.xyz/0MA3XW";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

const FALLBACK_NEWS_RESPONSE = {
  items: [
    {
      id: "fallback-1",
      title: "Форма команд и календарь остаются важными факторами перед матчами недели",
      source: "Редакционный fallback",
      description:
        "Свежий спортивный контекст помогает оценивать события спокойнее, но не гарантирует результат.",
      imageUrl: "/images/news-placeholder.svg",
    },
    {
      id: "fallback-2",
      title: "Травмы, составы и мотивация помогают лучше понимать спортивный контекст",
      source: "Редакционный fallback",
      description:
        "Перед выбором события полезно смотреть не только на счет, но и на кадровые и турнирные вводные.",
      imageUrl: "/images/news-placeholder.svg",
    },
    {
      id: "fallback-3",
      title: "Движение коэффициентов отражает интерес рынка, но не гарантирует исход события",
      source: "Редакционный fallback",
      description:
        "Изменение линии может помочь заметить новые факторы анализа, но не заменяет самостоятельную оценку.",
      imageUrl: "/images/news-placeholder.svg",
    },
    {
      id: "fallback-4",
      title: "Лайв-события требуют особенно внимательного контроля бюджета",
      source: "Редакционный fallback",
      description:
        "Быстрый темп матча повышает риск импульсивных решений, поэтому лимиты и паузы особенно важны.",
      imageUrl: "/images/news-placeholder.svg",
    },
    {
      id: "fallback-5",
      title: "Перед выбором матча важно учитывать статистику, составы и турнирную мотивацию",
      source: "Редакционный fallback",
      description:
        "Нейтральная подборка для случаев, когда внешние RSS временно недоступны.",
      imageUrl: "/images/news-placeholder.svg",
    },
  ],
  source: "fallback",
  updatedAt: new Date().toISOString(),
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function customizeHtml(html) {
  return html
    .replaceAll("SportClan", BRAND_NAME)
    .replaceAll("sportclan", BRAND_NAME.toLowerCase())
    .replace('<body><div hidden=""><!--$--><!--/$--></div>', '<body><div hidden=""><!--$--><!--/$--></div>')
    .replace('<div class="site-frame min-h-screen overflow-x-hidden"><header class="sticky top-0 z-40 border-b border-white/10 bg-[#081018]/80 backdrop-blur-xl">', '<div class="site-frame min-h-screen overflow-x-hidden"><div class="border-b border-[rgba(198,161,91,0.24)] bg-[rgba(198,161,91,0.14)] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#f3e2bf] sm:px-6">Промокод WHIST50 — бонус до 300 рублей</div><header class="sticky top-0 z-40 border-b border-white/10 bg-[#081018]/80 backdrop-blur-xl">')
    .replace('aria-label="На главную, Whistle"><span class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-brand">SC</span>', 'aria-label="На главную, Whistle"><span class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-brand">W</span>')
    .replace('<div class="flex items-center gap-3"><a href="#responsible" class="button-shared focus-visible:outline-none button-primary">Памятка по рискам</a></div>', '<div class="flex items-center gap-3"><div class="hidden rounded-full border border-[rgba(198,161,91,0.24)] bg-[rgba(198,161,91,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft md:inline-flex">Промокод WHIST50 — бонус до 300 рублей</div><a href="#responsible" class="button-shared focus-visible:outline-none button-primary">Памятка по рискам</a></div>')
    .replace('href="#events" class="button-shared focus-visible:outline-none button-primary w-full px-5 text-center whitespace-normal leading-5" aria-label="Начать ставить. Перед началом ставок сначала изучите событие, сравните линию и оцените риски."', `href="${BET_LINK}" target="_blank" rel="noopener noreferrer" class="button-shared focus-visible:outline-none button-primary w-full px-5 text-center whitespace-normal leading-5" aria-label="Начать ставить. Открыть сайт ставок в новой вкладке."`)
    .replace('Перед началом ставок сначала изучите событие, сравните линию и оцените риски.</p>', 'Перед началом ставок сначала изучите событие, сравните линию и оцените риски.</p><p class="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-soft">Промокод WHIST50 — бонус до 300 рублей</p>')
    .replace('Бонусные предложения доступны по правилам акции. Проверьте условия бонусов до активации.</p>', 'Бонусные предложения доступны по правилам акции. Промокод <span class="font-semibold text-[#f3e2bf]">WHIST50</span> дает бонус до <span class="font-semibold text-[#f3e2bf]">300 рублей</span>. Проверьте условия бонусов до активации.</p>');
}

function sendFile(response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || "application/octet-stream";
  const stream = fs.createReadStream(filePath);

  stream.on("error", () => {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  });

  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=300",
  });
  stream.pipe(response);
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const body = Buffer.concat(chunks);
          resolve({
            statusCode: response.statusCode || 500,
            headers: response.headers,
            body: body.toString("utf8"),
          });
        });
      })
      .on("error", reject);
  });
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          resolve({
            statusCode: response.statusCode || 500,
            headers: response.headers,
            body: Buffer.concat(chunks),
          });
        });
      })
      .on("error", reject);
  });
}

function fetchJson(url) {
  return fetchText(url).then((result) => ({
    ...result,
    json: JSON.parse(result.body),
  }));
}

async function proxySportsNews(response) {
  try {
    const remote = await fetchJson(`${ORIGIN}/api/sports-news`);
    if (remote.statusCode < 200 || remote.statusCode >= 300) {
      throw new Error(`Remote API returned ${remote.statusCode}`);
    }

    sendJson(response, 200, remote.json);
  } catch {
    sendJson(response, 200, {
      ...FALLBACK_NEWS_RESPONSE,
      updatedAt: new Date().toISOString(),
    });
  }
}

async function proxyHtml(response) {
  try {
    const remote = await fetchText(`${ORIGIN}/`);
    if (remote.statusCode < 200 || remote.statusCode >= 300) {
      throw new Error(`Remote HTML returned ${remote.statusCode}`);
    }

    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    });
    response.end(customizeHtml(remote.body));
    return;
  } catch {}

  try {
    const fallbackHtml = fs.readFileSync(INDEX_PATH, "utf8");
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    });
    response.end(customizeHtml(fallbackHtml));
    return;
  } catch {}

  response.writeHead(503, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end("Temporary unavailable");
}

async function proxyAsset(requestPath, response) {
  try {
    const remote = await fetchBuffer(`${ORIGIN}${requestPath}`);
    if (remote.statusCode < 200 || remote.statusCode >= 300) {
      throw new Error(`Remote asset returned ${remote.statusCode}`);
    }

    response.writeHead(200, {
      "Content-Type":
        remote.headers["content-type"] ||
        MIME_TYPES[path.extname(requestPath).toLowerCase()] ||
        "application/octet-stream",
      "Cache-Control": remote.headers["cache-control"] || "public, max-age=300",
    });
    response.end(remote.body);
    return true;
  } catch {
    return false;
  }
}

function resolveLocalAsset(urlPathname) {
  const normalized = path.normalize(decodeURIComponent(urlPathname)).replace(/^(\.\.[/\\])+/, "");
  return path.join(ROOT_DIR, normalized);
}

async function handleRequest(request, response) {
  try {
    if (!request.url) {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Bad request");
      return;
    }

    const url = new URL(request.url, `http://${request.headers.host || "127.0.0.1"}`);

    if (url.pathname === "/api/sports-news") {
      await proxySportsNews(response);
      return;
    }

    if (url.pathname === "/" || url.pathname === "/index.html" || url.pathname === "/api/index") {
      await proxyHtml(response);
      return;
    }

    const localPath = resolveLocalAsset(url.pathname);
    if (localPath.startsWith(ROOT_DIR) && fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
      sendFile(response, localPath);
      return;
    }

    if (await proxyAsset(url.pathname, response)) {
      return;
    }

    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  } catch (error) {
    response.writeHead(500, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end(`Internal error: ${error instanceof Error ? error.message : "unknown"}`);
  }
}

module.exports = {
  BRAND_NAME,
  handleRequest,
};
