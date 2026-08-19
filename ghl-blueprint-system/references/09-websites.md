# 9. Websites

Path: `Sites -> Websites -> New Website`. Same page builder as funnels; the difference is
structure and intent.

| | Funnel | Website |
|---|---|---|
| Structure | Linear steps | Navigable pages + menu |
| Intent | One conversion action | Browse, research, trust |
| Traffic | Paid / campaign | Organic, brand, GBP, referral |

## What a site build includes
- Pages: Home, Services (one page per money service), About / Team, Pricing or Insurance,
  Contact, plus a booking page embedding the calendar widget
- **Navigation menus**, header and footer, mobile layout check on every page
- **Blog** for organic content, with categories and authors
- **Store** for e-commerce, tied to Products
- **SEO** per page: title, meta description, slug, OG image, schema via custom code
- **Custom domain** and SSL, redirects for any legacy URLs
- **Chat widget** (routes into Conversations, and to Conversation AI if enabled)
- **Tracking**: GA4, Meta Pixel, Google Ads tag, and the `Funnel/Website PageView` trigger for
  high-intent pages
- Accessibility and speed: compressed images, real text over image-text, sane contrast

## Design rules
- Every page ends in the **same primary action** as the funnel (book, call, or quote). A site
  without a persistent booking CTA is a brochure.
- Phone number is a `tel:` link and a custom value, never typed text.
- Do not rebuild the funnel inside the site - link to it, so stats stay attributable.
- If the client has an existing site they will not move, build only the booking page and blog in
  GHL, and embed the calendar and chat widget on their current platform. Say this explicitly
  rather than assuming a full migration.
