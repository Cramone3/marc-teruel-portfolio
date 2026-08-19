---
name: ghl-blueprint
description: Generate a complete, build-ready GoHighLevel sub-account blueprint for a specific business or industry — covering Calendars, Contact Smart Lists, Opportunities & Pipelines, Payments, AI Agents, Marketing, Automation & Workflows, Funnels, and Websites. Use when the user names an industry or business ("build me a GHL setup for a dental clinic", "GHL blueprint for HVAC", "what does a med spa need in HighLevel") or asks for a GHL scope/proposal/onboarding draft for a niche.
---

# GoHighLevel Blueprint Generator

Turns a business or industry name into a **draft build spec** a GHL operator can implement
without guessing — exact asset names, exact GHL screen paths, exact field values.

The output is a *draft for a human to approve*, not a claim that anything was built.
Nothing in this skill touches a live sub-account.

## Inputs

Minimum viable input is a single industry ("Dental"). Everything else has a defensible default.

Before generating, ask **at most 4** questions using `AskUserQuestion` — only the ones whose
answer would materially change the build. Pull them from `ghl-blueprint-system/references/intake-questions.md`.
Highest-leverage four are usually:

1. **Revenue model** — one-off jobs / recurring memberships / high-ticket consult-then-close / e-comm
2. **Booking model** — single provider / multi-provider round robin / multi-location / no booking (quote-first)
3. **Team size & who works leads** — solo owner vs front desk vs sales team (drives round robin, pipelines, notifications)
4. **Compliance / regulated speech** — health (HIPAA-adjacent), finance, legal, insurance (drives AI guardrails, SMS content, consent language)

If the user says "just assume" or gives no answers, proceed with the defaults and put every
assumption in an **Assumptions** block at the top of the blueprint. Never block on intake.

## Method

1. Read `ghl-blueprint-system/references/00-naming-conventions.md` first — every asset the
   blueprint names must follow it, so the sub-account stays sortable.
2. Read the reference file for each module (`01-calendars.md` … `09-websites.md`). These carry
   the real GHL vocabulary: exact field names, exact trigger/action names, real menu paths.
   **Never invent a trigger, action, or field name that isn't in those files** — if the build
   needs something outside the documented vocabulary, say so explicitly and describe the
   workaround (usually Custom Webhook, Custom Trigger, or a Custom Code action).
3. Follow the section order and headings in `ghl-blueprint-system/templates/blueprint-outline.md`.
4. Study `ghl-blueprint-system/examples/dental-practice-blueprint.md` for depth and tone. Match
   that level of specificity — a section that could be pasted into any industry is a failed section.

## Rules that make the output usable

- **Industry-specific or delete it.** "Nurture sequence" is worthless. "Post-op check-in at
  hour 24 after a Same-Day Crown appointment marked Showed" is a build spec. Every asset name,
  pipeline stage, SMS body, and AI guardrail must be recognizably *this* industry.
- **Name the path.** Every asset gets its GHL location: `Calendars → Calendar Settings → Create Calendar → Round Robin`.
- **Wire the modules to each other.** The blueprint is one system, not nine lists. Calendar
  bookings must move a pipeline stage; the pipeline stage must fire a workflow; the workflow must
  send the invoice; the invoice paid must tag the contact; the tag must feed the smart list.
  Every section ends with a **Wires into** line naming the sections it connects to.
- **Flag cost and dependency.** Mark anything needing a paid add-on or external connection:
  LC Phone/LC Email, AI credits (Voice AI is billed per minute, Conversation AI per message),
  a payment processor connection, Meta Business/Google Ads access, a verified sending domain,
  A2P 10DLC registration. Put these in the **Prerequisites** block, not buried mid-section.
- **Be honest about limits.** If GHL genuinely doesn't do something the industry needs
  (true two-way EHR/PMS sync, HIPAA BAA scope, complex inventory), say so plainly and give the
  bridge (Zapier/Make/LeadConnector API, custom webhook) rather than pretending it's native.
- **Compliance is not optional copy.** Regulated industries get: consent language on every form,
  opt-out on every SMS sequence, no PHI/financial detail in outbound message bodies, and an
  AI guardrail block listing what the agent must refuse to discuss.
- **Sequence the build.** End with a phased build order (what must exist before what) and a
  pre-launch QA checklist with real test steps.

## Output

Write to `ghl-blueprint-system/blueprints/<business-slug>-blueprint.md`.

Then publish it as an Artifact (load the `artifact-design` skill first) so it can be handed to a
client or a build team, and give the user the link. Keep the file as the source of truth —
re-publishing the same file path updates the same artifact URL.

## Scope guard

This skill drafts specs. It does not configure a sub-account, does not send anything to a client,
and does not publish anything public without the user asking. Draft first, ship on request.
