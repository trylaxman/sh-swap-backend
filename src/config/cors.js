// src/config/cors.js
const cors = require("cors");

function parseAllowlist() {
  // Example: CORS_ALLOWLIST=http://localhost:3000,http://127.0.0.1:3000,https://yourdomain.com
  const raw = process.env.CORS_ALLOWLIST || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin, allowlist) {
  if (!origin) return true; // IMPORTANT: allow server-to-server, curl, Postman (no Origin header)

  // Exact matches
  if (allowlist.includes(origin)) return true;

  // Optional: allow localhost:* during dev
  if (process.env.NODE_ENV !== "production") {
    if (/^https?:\/\/localhost:\d+$/.test(origin)) return true;
    if (/^https?:\/\/127\.0\.0\.1:\d+$/.test(origin)) return true;
  }

  // Optional: allow subdomains via regex list
  // Example: CORS_ALLOWLIST_REGEX=^https:\/\/.*\.yourdomain\.com$
  const regexRaw = process.env.CORS_ALLOWLIST_REGEX;
  if (regexRaw) {
    try {
      const re = new RegExp(regexRaw);
      if (re.test(origin)) return true;
    } catch (e) {
      // ignore bad regex
    }
  }

  return false;
}

function corsConfig() {
  const allowlist = parseAllowlist();

  return cors({
    origin: (origin, cb) => {
      if (isAllowedOrigin(origin, allowlist)) return cb(null, true);
      // return cb(new Error("CORS blocked")); // <- don't throw noisy errors
      return cb(null, false); // cleaner: just disallow
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    maxAge: 86400,
  });
}

module.exports = { corsConfig };
