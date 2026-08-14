import { useEffect } from 'react';

// Central place for site-wide identity — change once, applies everywhere.
export const SITE_NAME = 'H2 Softskills';
export const SITE_URL = 'https://www.h2softskills.com';
export const DEFAULT_DESCRIPTION =
  'H2 Softskills is a digital solutions company building web platforms, mobile apps, CRM systems, blockchain products and AI-driven automation for growing businesses.';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_KEYWORDS =
  'H2 Softskills, H2SoftSkills, H2 Softskills reviews, web development company, mobile app development, CRM solutions, blockchain development, AI automation, digital solutions company';

function upsertMetaByName(name, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertMetaByProperty(property, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Drop <SEO ... /> at the top of any page component to control that
 * route's title, meta description, canonical URL, social preview card,
 * and structured data.
 *
 * NOTE: because this is a client-rendered SPA (Vite + React, no SSR),
 * these tags are written after JS runs. That's fine for Google (it
 * renders JS before indexing) and fine for the document <title> bots
 * see in the address bar/search result. It is NOT reliably picked up
 * by dumb social-media scrapers (some LinkedIn/Slack/older Facebook
 * crawlers don't execute JS), which is why index.html also ships solid
 * static defaults — those cover shares of the homepage. If you want
 * every inner page (e.g. a specific blog post) to have a correct,
 * scraper-safe social preview, the real fix is prerendering/SSR later.
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords = DEFAULT_KEYWORDS,
  noIndex = false,
  jsonLd = null,
}) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} | Custom Web, App & AI Development Company`;
    document.title = fullTitle;

    const canonicalUrl = `${SITE_URL}${path}`;

    upsertMetaByName('description', description);
    upsertMetaByName('keywords', keywords);
    upsertMetaByName('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    upsertLink('canonical', canonicalUrl);

    upsertMetaByProperty('og:title', fullTitle);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:url', canonicalUrl);
    upsertMetaByProperty('og:image', image);
    upsertMetaByProperty('og:type', type);
    upsertMetaByProperty('og:site_name', SITE_NAME);
    upsertMetaByProperty('og:locale', 'en_US');

    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', fullTitle);
    upsertMetaByName('twitter:description', description);
    upsertMetaByName('twitter:image', image);

    upsertJsonLd('page-jsonld', jsonLd);

    // Cleanup the page-specific JSON-LD when this page unmounts so a
    // stale schema block doesn't linger into the next route before its
    // own effect runs.
    return () => upsertJsonLd('page-jsonld', null);
  }, [title, description, path, image, type, keywords, noIndex, jsonLd]);

  return null;
}