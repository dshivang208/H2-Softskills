// scripts/prerender.mjs
//
// Runs after `vite build`. Writes a real, per-route static HTML file for
// every static marketing route, with the correct <title>/<meta
// description>/<link rel="canonical">/OG tags baked directly into the raw
// HTML — no headless browser required.
//
// WHY THIS REPLACED THE OLD PUPPETEER-BASED VERSION:
// The previous version booted a `vite preview` server and used
// Puppeteer/@sparticuz-chromium to visit each route and snapshot the
// post-JS DOM. That's fragile inside Vercel's build container (missing
// shared libs, launch timeouts, version drift) — and it had a top-level
// catch that logged a warning and exited 0 ("success") on failure. That
// meant a broken prerender step never showed up as a failed deploy: it
// just silently stopped producing per-route files.
//
// The practical effect: every route (/about, /services, /projects, /blog,
// /contact) fell back to serving the exact same generic index.html —
// same <title>, same <meta description>, and critically the same
// hardcoded <link rel="canonical" href="https://www.h2softskills.com/">.
// Googlebot's raw HTML fetch (which happens before/independent of JS
// execution) saw identical content with a canonical tag pointing every
// route back to "/", so it folded all the inner pages into the homepage
// and only ever indexed "/". This script removes that entire failure
// mode: the tags below are static strings pulled straight from each
// page's <SEO ... /> props (see src/Pages/*.jsx), so there is nothing
// that can fail to launch, time out, or silently no-op.
//
// Dynamic/data-driven routes (/services/:serviceId,
// /projects/:projectId/case-study, /blog/:slug) are NOT covered here —
// their slugs come from the backend. Admin routes are skipped (noindex
// via robots.txt, behind login). If those need indexing later, generate
// them the same way: fetch the slugs, then call writeRoute() for each.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SITE_URL = "https://www.h2softskills.com";
const SITE_NAME = "H2 Softskills";
const DIST_DIR = path.resolve("dist");
const TEMPLATE_PATH = path.join(DIST_DIR, "index.html");

// Keep these in sync with the <SEO title=... description=... path=... />
// props on each page component. This is intentionally a flat list of
// plain strings, not a build-time import of the JSX, so this script has
// zero runtime dependencies beyond Node's fs.
const ROUTES = [
  {
    path: "/",
    // Home passes no `title` prop, so SEO.jsx's default applies — keep
    // this identical to the <title> already in index.html.
    title: `${SITE_NAME} | Custom Web, App & AI Development Company`,
    description:
      "H2 Softskills builds production-grade web platforms, mobile apps, CRM systems, blockchain products and AI automation for businesses ready to scale.",
  },
  {
    path: "/about",
    title: `About Us | ${SITE_NAME}`,
    description:
      "Learn about H2 Softskills — a process-driven digital solutions partner helping businesses grow with technology, from our mission to the team behind it.",
  },
  {
    path: "/services",
    title: `Our Services | ${SITE_NAME}`,
    description:
      "Explore H2 Softskills' services: web & full stack development, mobile apps, blockchain, CRM solutions, digital marketing, and AI & automation.",
  },
  {
    path: "/projects",
    title: `Projects | ${SITE_NAME}`,
    description:
      "See real projects H2 Softskills has shipped — from cricket-scoring platforms to school management portals, built and running in production.",
  },
  {
    path: "/blog",
    title: `Blog | ${SITE_NAME}`,
    description:
      "Insights on web development, mobile apps, blockchain, CRM, digital marketing and AI automation from the H2 Softskills team.",
  },
  {
    path: "/contact",
    title: `Contact Us | ${SITE_NAME}`,
    description:
      "Get in touch with H2 Softskills. Email h2softskillsadmin@gmail.com or reach us in Cranbourne East, Victoria, Australia to start your project.",
  },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replaceTag(html, regex, replacement) {
  if (!regex.test(html)) {
    throw new Error(`Expected tag not found in template (pattern: ${regex})`);
  }
  return html.replace(regex, replacement);
}

function buildHtmlForRoute(template, route) {
  const canonicalUrl = `${SITE_URL}${route.path}`;
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);

  let html = template;

  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = replaceTag(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${description}" />`
  );
  html = replaceTag(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${title}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${description}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${title}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${description}" />`
  );

  return html;
}

function outputPathFor(routePath) {
  if (routePath === "/") return path.join(DIST_DIR, "index.html");
  return path.join(DIST_DIR, routePath.replace(/^\//, ""), "index.html");
}

function main() {
  if (!existsSync(TEMPLATE_PATH)) {
    console.error("dist/index.html not found — run `vite build` before prerendering.");
    process.exit(1);
  }

  const template = readFileSync(TEMPLATE_PATH, "utf-8");
  let failures = 0;

  for (const route of ROUTES) {
    try {
      const html = buildHtmlForRoute(template, route);
      const outPath = outputPathFor(route.path);
      mkdirSync(path.dirname(outPath), { recursive: true });
      writeFileSync(outPath, html, "utf-8");
      console.log(`Prerendered ${route.path} -> ${path.relative(process.cwd(), outPath)}`);
    } catch (err) {
      failures += 1;
      console.error(`! Failed to prerender ${route.path}: ${err.message}`);
    }
  }

  if (failures > 0) {
    // Unlike the old script, fail the build loudly. A silent partial
    // prerender is exactly the bug this rewrite exists to prevent —
    // better to block a bad deploy than ship pages with wrong canonical
    // tags again.
    console.error(`\n${failures} route(s) failed to prerender. Failing the build.`);
    process.exit(1);
  }

  console.log(`\nAll ${ROUTES.length} static routes prerendered successfully.`);
}

main();