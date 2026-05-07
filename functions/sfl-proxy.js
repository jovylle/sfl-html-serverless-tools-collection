const API_BASE = "https://sfl.world";

const STATIC_ENDPOINTS = {
  exchange: "/api/v1.1/exchange",
  prices: "/api/v1/prices",
  auctions: "/api/v1/auctions",
  nfts: "/api/v1/nfts"
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,OPTIONS"
};

function json(statusCode, body, cacheControl = "public, max-age=30") {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl
    },
    body: JSON.stringify(body)
  };
}

function parseFarmId(rawFarmId) {
  const farmId = Number.parseInt(String(rawFarmId || ""), 10);
  if (!Number.isFinite(farmId) || farmId < 1) return null;
  return farmId;
}

async function fetchUpstream(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "sfl-html-serverless-tools-collection/1.1",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Upstream ${response.status} for ${path}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchUpstreamHtml(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "sfl-html-serverless-tools-collection/1.1",
        "Accept": "text/html"
      }
    });

    if (!response.ok) {
      throw new Error(`Upstream ${response.status} for ${path}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function stripTags(value) {
  return decodeHtmlEntities(String(value || "").replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

function parseFactions(html) {
  const tableMatch = html.match(/<table[^>]*>([\s\S]*?<tbody>[\s\S]*?<\/tbody>[\s\S]*?)<\/table>/i);
  if (!tableMatch) return { rows: [] };

  const table = tableMatch[1];
  const rowMatches = table.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  const rows = [];

  for (const row of rowMatches) {
    const cols = row.match(/<td[\s\S]*?<\/td>/gi) || [];
    if (cols.length < 13) continue;
    const values = cols.map((col) => stripTags(col));
    const faction = values[1] || "";
    if (!["NIGHTSHADES", "SUNFLORIANS", "GOBLINS", "BUMPKINS"].includes(faction)) continue;

    rows.push({
      faction,
      cost: values[2] || "-",
      costDelta: values[3] || "-",
      members: values[4] || "-",
      membersDelta: values[5] || "-",
      marksTop100: values[6] || "-",
      marksTotal: values[7] || "-",
      emblemsTotal: values[8] || "-",
      pawShieldOwners: values[9] || "-",
      seasonBanner: values[10] || "-",
      lifetimeBanner: values[11] || "-",
      diamondVip: values[12] || "-"
    });
  }

  return { rows };
}

function parseSkills(html) {
  const startToken = '<td colspan="10" class="h5 text-bg-secondary ta-left"><div class="p-5">';
  const endToken = "</div></td></tr>";
  const sections = [];
  let cursor = 0;

  while (true) {
    const start = html.indexOf(startToken, cursor);
    if (start === -1) break;
    const nameStart = start + startToken.length;
    const nameEnd = html.indexOf(endToken, nameStart);
    if (nameEnd === -1) break;

    const sectionName = stripTags(html.slice(nameStart, nameEnd));
    const nextStart = html.indexOf(startToken, nameEnd + endToken.length);
    const block = html.slice(nameEnd + endToken.length, nextStart === -1 ? html.length : nextStart);
    const rowMatches = block.match(/<tr><td class="ta-left b">[\s\S]*?<\/tr>/gi) || [];
    const skills = rowMatches.slice(0, 14).map((row) => {
      const cols = row.match(/<td[\s\S]*?<\/td>/gi) || [];
      return {
        name: stripTags(cols[0] || ""),
        points: stripTags(cols[1] || ""),
        island: stripTags(cols[2] || ""),
        boosts: stripTags(cols[3] || "")
      };
    }).filter((item) => item.name);

    if (sectionName && skills.length) {
      sections.push({ section: sectionName, skillCount: skills.length, skills });
    }

    cursor = nameEnd + endToken.length;
  }

  return { sections };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ""
    };
  }

  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed" }, "no-store");
  }

  const query = event.queryStringParameters || {};
  const endpoint = String(query.endpoint || "");

  try {
    if (endpoint === "dashboard") {
      const [exchange, prices, auctions, nfts] = await Promise.all([
        fetchUpstream(STATIC_ENDPOINTS.exchange),
        fetchUpstream(STATIC_ENDPOINTS.prices),
        fetchUpstream(STATIC_ENDPOINTS.auctions),
        fetchUpstream(STATIC_ENDPOINTS.nfts)
      ]);
      return json(200, { exchange, prices, auctions, nfts }, "public, max-age=60");
    }

    if (endpoint === "factions") {
      const html = await fetchUpstreamHtml("/util/factions");
      const data = parseFactions(html);
      return json(200, data, "public, max-age=300");
    }

    if (endpoint === "skills") {
      const html = await fetchUpstreamHtml("/info/skills");
      const data = parseSkills(html);
      return json(200, data, "public, max-age=300");
    }

    if (endpoint === "land") {
      const farmId = parseFarmId(query.farmId);
      if (!farmId) return json(400, { error: "Invalid farmId" }, "no-store");
      const data = await fetchUpstream(`/api/v1/land/${farmId}`);
      return json(200, data, "public, max-age=60");
    }

    if (endpoint === "landInfo") {
      const farmId = parseFarmId(query.farmId);
      if (!farmId) return json(400, { error: "Invalid farmId" }, "no-store");
      const data = await fetchUpstream(`/api/v1/land/info/nft_id/${farmId}`);
      return json(200, data, "public, max-age=300");
    }

    if (Object.prototype.hasOwnProperty.call(STATIC_ENDPOINTS, endpoint)) {
      const data = await fetchUpstream(STATIC_ENDPOINTS[endpoint]);
      return json(200, data, "public, max-age=60");
    }

    return json(
      400,
      {
        error: "Invalid endpoint",
        allowed: [
          "dashboard",
          "exchange",
          "prices",
          "auctions",
          "nfts",
          "land",
          "landInfo",
          "factions",
          "skills"
        ]
      },
      "no-store"
    );
  } catch (error) {
    return json(
      502,
      {
        error: "Upstream request failed",
        message: error instanceof Error ? error.message : String(error)
      },
      "no-store"
    );
  }
};
