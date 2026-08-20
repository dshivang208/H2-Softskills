// scripts/prerender.mjs
//
// Runs after `vite build`. Boots the production build locally with
// `vite preview`, visits each real static route with a headless
// browser, waits for React (and the custom SEO.jsx component) to
// finish writing the <title>/<meta> tags, then writes the fully
// rendered HTML to disk as a static file for that route.
//
// Why: this is a client-only React SPA (react-router-dom, no SSR),
// so every URL is served the same generic index.html and the real
// per-page <title>/description only appear after JS runs (see
// src/components/SEO.jsx). Crawlers that don't wait for that end up
// indexing the generic homepage title/description for every page.
// Prerendering bakes the correct tags into the actual HTML file
// served for each route, so no JS execution is required to see them.
//
// Dynamic/data-driven routes (/services/:serviceId,
// /projects/:projectId/case-study, /blog/:slug) are intentionally
// NOT prerendered here — their slugs come from the backend and would
// need a separate "fetch all slugs, then render each" step. Admin
// routes are skipped too (already noindex via robots.txt and behind
// a login). The static marketing routes below are the priority.

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

// Vercel's build container is missing several shared libraries
// (libnss3.so and friends) that the regular `puppeteer` package's
// bundled Chromium needs, so `puppeteer.launch()` fails there with
// "error while loading shared libraries: libnss3.so". Locally (and
// on most other machines) the bundled Chromium works fine.
//
// Fix: on Vercel (or any CI), launch via @sparticuz/chromium, a
// Chromium build made specifically for serverless/build containers
// like Vercel's and AWS Lambda's, paired with puppeteer-core (which
// has the same API but doesn't bundle its own browser). Everywhere
// else, keep using the regular `puppeteer` package as before.
const IS_SERVERLESS_BUILD = Boolean(process.env.VERCEL || process.env.CI);

async function launchBrowser() {
  if (IS_SERVERLESS_BUILD) {
    const [{ default: chromium }, { default: puppeteerCore }] = await Promise.all([
      import("@sparticuz/chromium"),
      import("puppeteer-core"),
    ]);
    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  const { default: puppeteer } = await import("puppeteer");
  return puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

const PORT = 4322;
const HOST = "127.0.0.1";
const BASE_URL = `http://${HOST}:${PORT}`;
const DIST_DIR = path.resolve("dist");

// Every static route worth prerendering (no dynamic :param segments).
const ROUTES = ["/", "/about", "/services", "/projects", "/blog", "/contact"];

function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        const res = await fetch(url);
        if (res.ok || res.status === 404) return resolve();
      } catch {
        // server not up yet
      }
      if (Date.now() - start > timeoutMs) {
        return reject(new Error(`Timed out waiting for ${url}`));
      }
      setTimeout(attempt, 300);
    };
    attempt();
  });
}

function outputPathFor(route) {
  if (route === "/") return path.join(DIST_DIR, "index.html");
  return path.join(DIST_DIR, route.replace(/^\//, ""), "index.html");
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    console.error("dist/ not found — run `vite build` before prerendering.");
    process.exit(1);
  }

  console.log(`Starting preview server on ${BASE_URL} ...`);
  // shell: true is required on Windows, where "npx" actually resolves to
  // "npx.cmd" and Node's spawn() won't find it without going through a shell.
  const server = spawn(
    "npx",
    ["vite", "preview", "--port", String(PORT), "--host", HOST, "--strictPort"],
    { stdio: "inherit", shell: true }
  );

  const cleanupAndExit = (code) => {
    server.kill();
    process.exit(code);
  };

  try {
    await waitForServer(BASE_URL);

    const browser = await launchBrowser();

    for (const route of ROUTES) {
      const page = await browser.newPage();
      const url = `${BASE_URL}${route}`;
      console.log(`Prerendering ${route} ...`);

      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        // Small extra settle time for SEO.jsx's useEffect to flush.
        await new Promise((r) => setTimeout(r, 150));

        const html = await page.content();
        const outPath = outputPathFor(route);
        mkdirSync(path.dirname(outPath), { recursive: true });
        writeFileSync(outPath, html, "utf-8");
        console.log(`  -> wrote ${path.relative(process.cwd(), outPath)}`);
      } catch (err) {
        console.error(`  ! failed to prerender ${route}:`, err.message);
      } finally {
        await page.close();
      }
    }

    await browser.close();
    cleanupAndExit(0);
  } catch (err) {
    console.error("Prerender failed:", err);
    cleanupAndExit(1);
  }
}

main();
