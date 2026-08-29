import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let serverModule = null;

async function loadServer() {
  if (serverModule) return serverModule;

  try {
    serverModule = (await import("../dist/server/server.js")).default;
  } catch (e1) {
    try {
      const absolutePath = join(__dirname, "../dist/server/server.js");
      // Try importing using file:// URL for absolute path
      const absoluteFileUrl = `file://${absolutePath}`;
      serverModule = (await import(absoluteFileUrl)).default;
    } catch (e2) {
      console.error("[Handler] Failed to load server from ../dist/server/server.js:", e1 && e1.stack ? e1.stack : e1);
      console.error("[Handler] Also failed with absolute path (attempted file://):", e2 && e2.stack ? e2.stack : e2);
      const checkPath = join(__dirname, "../dist/server/server.js");
      console.error("[Handler] cwd:", process.cwd());
      console.error("[Handler] exists (relative):", fs.existsSync(join(__dirname, "../dist/server/server.js")));
      console.error("[Handler] exists (absolute):", fs.existsSync(checkPath));
      // list files in dist/server for debugging
      try {
        console.error("[Handler] dist/server contents:", fs.readdirSync(join(__dirname, "../dist/server")).slice(0, 100));
      } catch (re) {
        console.error("[Handler] Could not list dist/server:", re && re.stack ? re.stack : re);
      }
      throw new Error("Could not load server module");
    }
  }
  return serverModule;
}

async function getRequestBody(req) {
  if (["GET", "HEAD", "DELETE"].includes(req.method)) {
    return undefined;
  }

  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });
    req.on("end", () => {
      resolve(data);
    });
    req.on("error", reject);
function serveStatic(filePath, res) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return false;
    }
    const content = fs.readFileSync(filePath);
    const ext = filePath.split(".").pop();
    const mimeTypes = {
      js: "application/javascript",
      css: "text/css",
      json: "application/json",
      svg: "image/svg+xml",
      png: "image/png",
      jpg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      woff: "font/woff",
      woff2: "font/woff2",
      ttf: "font/ttf",
    };
    res.statusCode = 200;
    res.setHeader("content-type", mimeTypes[ext] || "application/octet-stream");
    res.setHeader("cache-control", "public, max-age=31536000, immutable");
    res.end(content);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  try {
    const url = req.url ?? "/";

    // Serve static assets directly
    if (url.startsWith("/assets/")) {
      const assetPath = join(__dirname, "../dist/client", url);
      if (serveStatic(assetPath, res)) {
        return;
      }
    }

    // Delegate to SSR server
    const server = await loadServer();
    const protocol = req.headers["x-forwarded-proto"] ?? "https";
    const host = req.headers.host ?? "localhost";
    const fullUrl = `${protocol}://${host}${url}`;

    const body = await getRequestBody(req);
    const request = new Request(fullUrl, {
      method: req.method ?? "GET",
      headers: req.headers,
      body: body ? body : undefined,
    });

    const response = await server.fetch(request, {}, {});
    const responseBody = await response.text();

    res.statusCode = response.status;
    for (const [key, value] of response.headers.entries()) {
      if (value) {
        res.setHeader(key, value);
      }
    }

    res.end(responseBody);
  } catch (error) {
    console.error("[vercel-handler] Error:", error instanceof Error ? error.stack : error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(
      '<!doctype html><html lang="es"><body><h1>Error interno del servidor</h1><p>Por favor, intenta de nuevo.</p></body></html>'
    );
  }
}
