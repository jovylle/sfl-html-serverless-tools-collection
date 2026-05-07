exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ""
    };
  }

  const path = event.queryStringParameters?.path;
  if (!path || !path.startsWith("/api/")) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid path. Use /api/... only." })
    };
  }

  const targetUrl = `https://sfl.world${path}`;

  try {
    const upstream = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "sfl-html-serverless-tools-collection/1.0"
      }
    });

    const text = await upstream.text();
    return {
      statusCode: upstream.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=60"
      },
      body: text
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Upstream request failed",
        message: error instanceof Error ? error.message : String(error)
      })
    };
  }
};
