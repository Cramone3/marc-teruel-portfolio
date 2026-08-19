# 8. Funnels

Path: `Sites -> Funnels -> New Funnel`. A funnel is an ordered set of **steps**, each step holding
one or more **pages** (A/B variants).

## Anatomy
- **Steps** - Landing / Opt-in, Application or Survey, Calendar (booking), Order form,
  One-click Upsell, Downsell, Thank You / Confirmation
- **Order form step** - product selection, bump offer, coupon field; requires a connected payment
  provider (see `04-payments.md`)
- **Forms & Surveys** - built inside the builder; submissions fire `Form Submitted` /
  `Survey Submitted` / `Quiz Submitted`
- **A/B split test** - variants per step with traffic distribution and stats
- **Funnel stats** - page views, opt-ins, conversion rate per step
- **Saved Sections** (Universal syncs everywhere, Global syncs within one asset, Template is
  static) and **Element Templates** for reusable blocks
- **Tracking code** per funnel or page (head/body), plus custom domain and path slug
- **Funnel & Website AI** generates pages from a prompt, URL, or image

## Design rules
- **One funnel, one offer, one action.** If a page asks for two things it converts on neither.
- Put the **calendar step immediately after the opt-in** for booking-driven businesses - do not
  make a lead wait for a callback that a self-book step could have captured.
- Always capture phone **and** email; sticky contacts prefill the rest.
- Consent checkbox with explicit SMS language on every form. In regulated industries this is
  non-negotiable and must be worded for the vertical.
- Set the `source:` tag and create the opportunity **on submission**, not later.
- Add the `Funnel/Website PageView` trigger on high-intent pages (pricing, booking) for retargeting.
- Confirmation page carries the next action (add to calendar, what to bring, how to reach us) -
  it is the highest-attention screen in the whole build and is usually wasted.
