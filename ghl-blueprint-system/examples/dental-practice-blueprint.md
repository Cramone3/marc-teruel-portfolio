# GoHighLevel Build Blueprint - Dental Practice (General + Cosmetic)
*Draft for review. Nothing below has been built yet. Version 1.0*

## 0. Snapshot

**Business:** Two-dentist general practice with a cosmetic arm (Invisalign, implants, veneers).
Two hygienists. Revenue split roughly 60% hygiene/restorative recall, 40% high-ticket cosmetic.
Average hygiene visit ~$180. Average cosmetic case ~$4,800. Cosmetic sales cycle 2-8 weeks.

**Primary goal:** fill the two chronically empty slots per provider per day - measured as
**booked-and-showed appointments per week**, split new patient vs reactivated.

**Assumptions** (no intake answered - correct any of these and the build shifts):
1. Single location, one timezone, no DSO/multi-site rollup.
2. The practice keeps its existing practice-management system (Dentrix/Open Dental/Eaglesoft) as
   the clinical system of record. GHL owns marketing, intake, booking, and money-in follow-up only.
3. Insurance is accepted but not verified inside GHL.
4. Front desk staffed 8am-5pm Mon-Thu, 8am-2pm Fri. After-hours calls currently go to voicemail.
5. A dormant patient list exists (18+ months since last visit) of roughly 1,200-2,000 records.

**Prerequisites** - none of the below is optional, each has an owner and a lead time:
| Item | Why | Owner | Lead time |
|---|---|---|---|
| Stripe connected in `Payments -> Integrations` | Deposits, Text2Pay, treatment plan payments | Practice | 1 day |
| LC Phone number + **A2P 10DLC** brand/campaign registration | All SMS. Unregistered traffic is filtered | Agency | 1-3 weeks |
| Sending domain with SPF/DKIM/DMARC | Email deliverability | Agency + IT | 2 days + warm-up |
| Google Business Profile access | Reviews, GBP messaging | Practice | 1 day |
| Meta Business + Google Ads access | Lead forms, Conversion API | Practice | 1 day |
| AI credits enabled | Voice AI billed per minute, Conversation AI per message | Practice | same day |

**Out of scope / platform limits - state these to the client before signing:**
- GHL does **not** two-way sync with dental PMS software natively. Appointments booked in GHL must
  be entered into the PMS by front desk, or bridged with Zapier/Make against the PMS API where one
  exists. Budget for one of: a daily manual reconciliation habit, or a paid bridge.
- **GHL is not a HIPAA-covered platform by default.** Treat it as marketing infrastructure: no
  clinical detail, no diagnoses, no x-rays, no treatment notes in contact records, SMS, or AI
  transcripts. Confirm the practice's own BAA/compliance position in writing before launch.
- Insurance eligibility checking is not native. Collect carrier and member ID as intake fields;
  verification stays a human task in the PMS.

---

## 1. Calendars

| Calendar | Type | Duration | Assigned | Notice / Range | Deposit | Sets stage |
|---|---|---|---|---|---|---|
| `Hygiene - Cleaning & Exam (60m)` | Round Robin | 60m | Hygienist A, B | 4h / 60 days | No | Appointment Booked |
| `New Patient - Exam & X-Rays (75m)` | Round Robin | 75m | Dr. 1, Dr. 2 | 12h / 45 days | No | Consult Booked |
| `Cosmetic - Invisalign/Veneer Consult (45m)` | Round Robin | 45m | Dr. 1, Dr. 2 | 12h / 30 days | **$49 refundable** | Consult Booked |
| `Emergency - Same Day Relief (30m)` | Round Robin | 30m | Dr. 1, Dr. 2 | **1h** / 3 days | No | Consult Booked |
| `Treatment - Restorative Block (90m)` | Personal per provider | 90m | Individual | 24h / 60 days | Per plan | Treatment Started |

### Shared settings
- **Slot interval** 15m, **buffer** 10m after every clinical appointment, **appointments per slot** 1.
- **Appointments per day** capped per provider: 8 hygiene, 6 doctor.
- **Look busy** 20% on the cosmetic consult calendar only - protects doctor time and raises
  perceived demand. Do not use it on Emergency.
- **Booking form** (custom, one per calendar family): First, Last, Mobile, Email, Date of Birth,
  `Clinical / Insurance Provider` (dropdown), `Clinical / Is this your first visit?`,
  `Clinical / Reason for visit` (short text, non-clinical), **consent checkbox**.
- **Consent copy:** "I agree to receive appointment reminders and occasional practice updates by
  SMS and email from {{custom_values.practice_name}}. Message and data rates may apply. Reply STOP
  to opt out." - required on every form for A2P compliance.
- **Confirmation page:** redirect to `/booked` with what to bring, parking, and an add-to-calendar link.
- **Auto-confirm** on. **Allow reschedule and cancel** on, up to 4 hours before.

### Emergency calendar exception
Minimum notice 1 hour, date range 3 days, and availability opened 8am-4pm daily. Emergency
bookings bypass all nurture: the workflow removes the contact from every marketing sequence and
fires an internal notification to the front desk immediately.

### Cosmetic deposit
$49, refundable at the visit or credited against treatment. This single setting is the highest-ROI
item on this page - it typically halves cosmetic consult no-shows. Set in `Forms & Payment ->
Accept payments`, description "Consultation hold - credited to your treatment".

**Wires into:** #3 (booking sets pipeline stage), #7 (confirmation, reminder, no-show workflows),
#4 (deposit), #5 (AI books into these calendars), #8 (calendar step in funnels).

---

## 2. Contact Smart Lists

### Foundations (build these before any list)
**Custom fields** - `Settings -> Custom Fields`, group `Clinical` (non-PHI only):
Insurance Provider (dropdown) / Member ID (text) / Last Visit Date (date) / Next Recall Due (date) /
Preferred Provider (dropdown) / Treatment Interest (multi-select: Invisalign, Implants, Veneers,
Whitening, Dentures) / Estimated Case Value (numeric) / Referred By (text).

**Tags** - `source:google-ads`, `source:meta`, `source:gbp`, `source:referral`, `source:walk-in`,
`service:invisalign`, `service:implants`, `service:whitening`, `service:hygiene`,
`status:new-patient`, `status:active-patient`, `status:dormant`, `status:no-show`,
`campaign:reactivation-q3`, `pref:sms-only`.

**Contact type rule:** `Lead` until first appointment reaches **Showed**, then `Customer`
(set by workflow 21, never by hand).

### Lists
| # | Smart list | Filter logic | Worked by | Cadence | Action |
|---|---|---|---|---|---|
| L1 | `Lead - New Today Unbooked` | Created On **Is** Today AND Tag **Is None of** `status:active-patient` AND Last Appointment At **Is Empty** | Front desk | 3x daily | Call, then log outcome |
| L2 | `Lead - Cosmetic Interest No Consult` | Treatment Interest **Is Not Empty** AND Opportunity Stage **Is Not** Consult Booked | Treatment coordinator | Daily | Personal call + case photos |
| L3 | `Patient - Recall Due 30 Days` | Next Recall Due **In the Next** 30 days AND DND all **Disabled** | Automated | Continuous | Feeds workflow 30 |
| L4 | `Patient - Overdue Recall 6mo+` | Last Visit Date **More Than** 6 months ago AND Tag **Is None of** `status:dormant` | Automated | Weekly | Feeds workflow 31 |
| L5 | `Patient - Dormant 18mo+` | Last Visit Date **More Than** 18 months ago | Campaign audience | Quarterly | Reactivation blast |
| L6 | `Ops - No-Show Last 30 Days` | Tag **Is** `status:no-show` AND Last Activity On **In the Last** 30 days | Front desk | Weekly | Rebook call |
| L7 | `Money - Unpaid Invoice 7d+` | Invoice status unpaid AND invoice date **More Than** 7 days ago | Office manager | Weekly | Text2Pay resend |
| L8 | `Health - Missing Mobile` | Phone **Is Empty** | Front desk | Weekly | Should stay near zero |
| L9 | `Health - No Source Tag` | Tags **Does Not Contain** `source:` | Agency | Weekly | Attribution leak audit |
| L10 | `Health - DND All Enabled` | DND all **Enabled** | Agency | Monthly | Confirm intentional |

L8-L10 are deliberately supposed to be empty. A non-empty health list means a form, an import, or
a workflow is broken - that is the point of building them.

**Wires into:** #6 (L3-L5 are campaign audiences), #7 (lists feed workflows via bulk Add to
Workflow), #3 (L2 mirrors the cosmetic pipeline), #4 (L7 drives collections).

---

## 3. Opportunities & Pipeline Stages

Three pipelines, one per motion. Do not merge them.

### Pipeline A - `New Patient Acquisition Pipeline`
| Stage | Entry event | Exit event | Automation | Lead value |
|---|---|---|---|---|
| New Inquiry | Form submitted, call, or chat | Contact made | WF 10 speed-to-lead | $180 |
| Contacted | Two-way reply or answered call | Appointment booked | WF 11 nurture starts | $180 |
| Consult Booked | Appointment created on any calendar | Appointment status changes | WF 20 confirm + remind | $180 |
| Showed | Appointment status = Showed | Treatment accepted or declined | WF 21 mark Customer, WF 50 review request | $180 |
| Treatment Accepted | Plan signed or invoice paid | - | Status **Won** | actual |
| Lost | No contact after 6 touches, or declined | - | Status **Lost**, reason required | - |

### Pipeline B - `Cosmetic Case Pipeline` (high-ticket, this is where the money is)
| Stage | Entry event | Exit event | Automation | Lead value |
|---|---|---|---|---|
| Interest Captured | `service:invisalign` / `implants` / `veneers` tag added | Consult booked | WF 12 cosmetic nurture with before/after proof | $4,800 |
| Consult Booked | Cosmetic calendar booking + $49 deposit paid | Consult attended | WF 20 + deposit receipt | $4,800 |
| Consulted | Appointment status = Showed | Plan sent | Task to treatment coordinator | $4,800 |
| Treatment Plan Sent | Document & Contract sent | Signed or declined | WF 40 plan follow-up, 4 touches over 14 days | quoted |
| Financing Pending | Third-party finance application started | Approved or declined | WF 41 status check | quoted |
| Case Accepted | Contract signed / deposit paid | - | Status **Won**, tag `status:active-patient` | actual |
| Case Declined | Explicit no or 45 days silent | - | Status **Lost**, into long-term nurture | - |

### Pipeline C - `Reactivation Pipeline`
Dormant Identified -> Outreach Sent -> Responded -> Rebooked (Won) -> Unresponsive (Lost after 3 waves).

### Rules
- **Stale threshold:** 7 days Pipeline A, 14 days Pipeline B. `Stale Opportunities` trigger fires
  WF 60, which notifies the owner and creates a task. No card sits untouched.
- **Owner:** front desk owns Pipeline A, the treatment coordinator owns Pipeline B, assigned at
  creation with `Assign to User`.
- **Lost requires a reason.** Custom opportunity field `Lost Reason` (dropdown: price, insurance,
  timing, went elsewhere, unreachable). Without it the pipeline teaches you nothing.

**Wires into:** #1 (bookings move stages), #4 (payment moves to Won), #7 (every transition is a
workflow), #2 (L2 mirrors Interest Captured).

---

## 4. Payments

**Provider:** Stripe (card, Apple Pay, Google Pay, ACH). Tap to Pay in the mobile app for
chairside collection.

### Products (`Payments -> Products`)
| Product | Type | Price | Used by |
|---|---|---|---|
| `Cosmetic Consult - Deposit` | One-time | $49 | Cosmetic calendar |
| `New Patient Special - Exam, X-Rays & Cleaning` | One-time | $99 | Funnel order form |
| `Whitening - Take Home Kit` | One-time | $299 | Invoice / Text2Pay |
| `Invisalign - Case Deposit` | One-time | $500 | Contract |
| `Membership Plan - Monthly` | Recurring monthly | $39 | Subscription for uninsured patients |
| `Membership Plan - Annual` | Recurring yearly | $399 | Subscription |

### How money is collected
- **Deposits** on the cosmetic calendar (see #1). Refunded or credited at the visit.
- **Text2Pay** for anything closed by phone - the single fastest path to payment. Front desk sends
  from the conversation view.
- **Documents & Contracts** for cosmetic treatment plans: scope, fees, payment schedule,
  e-signature, and an embedded deposit. Signature auto-generates the invoice.
- **Recurring invoices** for the in-house membership plan.
- **Estimates** for anything still being negotiated - never negotiate inside an invoice, because
  the accept event is what fires the automation.

### Revenue events that drive automation
`Payment Received` -> mark opportunity **Won**, contact type **Customer**, start WF 50 review request.
`Documents & Contracts` signed -> Pipeline B to Case Accepted, generate invoice, notify coordinator.
`Subscription` failed payment -> WF 45 dunning: day 0 friendly SMS, day 3 email with update link,
day 7 call task, day 10 pause and notify office manager.
`Refund` -> internal notification and a task to log the reason. Never silent.

**Compliance note:** invoice and receipt line items use service names only
("Restorative treatment"), never diagnostic detail.

**Wires into:** #1 (deposits), #3 (payment moves stage to Won), #7 (dunning, receipts, review
requests), #8 (order form step).

---

## 5. AI Agents

Three agents. Each has one job, defined hours, and hard refusal rules.

### Agent 1 - `Voice Agent - After-Hours Reception`
**Role:** answer calls outside front-desk hours instead of dropping them to voicemail. In a
practice taking 15+ after-hours calls a week, this is usually the largest single recovery in the build.

- **Voice/Model/Language:** warm, unhurried female voice, English (US).
- **Welcome (inbound):** "Thanks for calling {{custom_values.practice_name}}, this is the
  after-hours assistant. Is this a dental emergency, or would you like to book an appointment?"
- **Agent Prompt** - Role: after-hours receptionist. Objective: triage emergency vs routine, then
  book or capture. Collect: name, mobile, reason in the caller's own words, whether they are an
  existing patient. Avoid: any clinical advice, price quotes beyond published specials, insurance
  coverage promises. Transfer: any emergency, any distressed caller, any request for a human.
  Close: confirm the booking time and say a person will call in the morning.
- **Actions enabled:** `Appointment Booking` (Emergency and New Patient calendars only),
  `Update Contact Field`, `Send SMS` (booking confirmation), `Trigger Workflow` (WF 15 after-hours
  recap), `Call Transfer` (emergency line).
- **Post-call:** call summary + transcript to the front desk inbox; WF 15 creates the opportunity
  in Pipeline A at New Inquiry.
- **Deployment:** main number after 5pm Mon-Thu, after 2pm Fri, all weekend and holidays.
- **Cost:** billed per minute. At ~15 calls/week x 3 min, budget accordingly and review monthly.

### Agent 2 - `Chat Agent - Web & Social Intake` (Conversation AI)
- **Channels:** Web Chat, SMS, Facebook, Instagram, Google Business Profile.
- **Mode:** **Suggestive for the first 14 days**, then Auto-pilot for SMS and Web Chat only once
  the transcripts are clean. Non-negotiable in a health setting.
- **Bot Goals prompt:**
  - *Personality:* "You are the friendly front-desk assistant at {{ai.business_name}}. Warm, brief,
    never clinical. One question at a time."
  - *Goal:* "Get the visitor booked on the right calendar, or capture name, mobile and reason so a
    human can call."
  - *Additional information:* office hours, address, parking, accepted insurance carriers,
    published specials only, what to bring to a first visit, STOP handling.
  - *Custom values:* `{{custom_values.booking_link}}`, `{{custom_values.office_phone}}`.
- **Bot Training:** practice FAQ pairs, the site's Services and Insurance pages, the New Patient PDF.
- **Actions:** `Appointment Booking`, `Contact Info` (name, mobile, treatment interest),
  `Trigger Workflow` (speed-to-lead), `Human Handover`.
- **Handover triggers:** emergency words, pain descriptions, insurance verification, refund or
  billing dispute, any second unanswered question, any "talk to a person".

### Agent 3 - `Reviews AI - Response Assistant`
Drafts replies to new Google reviews. **Suggestive only, permanently.** 5-star replies may be
auto-sent after 30 days of clean output; anything 3 stars or below always routes to the office
manager. A public reply must never confirm someone was a patient or reference any treatment - it
acknowledges the feedback and moves the conversation offline to a phone number.

### Guardrails (all agents)
Never: diagnose, recommend treatment, estimate a fee not on the published list, confirm insurance
coverage, discuss another patient, promise a clinical outcome, or continue after an emergency
phrase. Emergency phrase list: uncontrolled bleeding, swelling of face or throat, difficulty
breathing or swallowing, knocked-out tooth, trauma, severe pain rated 8+. On any of these the
agent says: "That needs immediate attention - please call {{custom_values.office_phone}} now, or
go to your nearest emergency room if you are having trouble breathing or swallowing." Then it
transfers or ends. Always disclose it is an assistant when asked. No clinical detail in any SMS body.

**Wires into:** #1 (books calendars), #2 (fills fields), #3 (creates opportunities),
#6 (review replies), #7 (triggers workflows), #9 (chat widget).

---

## 6. Marketing

### Email programme
| Programme | Audience | Cadence | Purpose |
|---|---|---|---|
| Recall reminder | L3 `Recall Due 30 Days` | 30d, 14d, 3d before due | Book the hygiene visit |
| Overdue recall | L4 `Overdue 6mo+` | Monthly, 3 touches then stop | Recover the lapsed |
| Cosmetic education | `service:` tagged, unbooked | Weekly x 6 | Before/after proof, financing, FAQ |
| Practice newsletter | All Customers, DND disabled | Monthly | Stay top of mind, referral ask |
| Post-treatment care | Treatment Accepted | Day 1, 7, 30 | Aftercare and satisfaction |

Deliverability rules: dedicated sending domain with SPF/DKIM/DMARC, two-week warm-up before any
list above 500, suppress 2+ hard bounces, exclude 90-day non-openers from broadcasts.

### SMS programme
Transactional only unless the contact opted into marketing: confirmations, reminders, no-show
rebooks, Text2Pay links, review requests. Every promotional message ends "Reply STOP to opt out."
A2P 10DLC registration must be complete before the first send. No clinical or treatment detail in
any SMS body - "your appointment" never "your root canal".

### Social Planner
3 posts/week: one before/after (with signed photo consent on file), one team or behind-the-scenes,
one educational tip. Facebook, Instagram, and Google Business Profile. GBP posts matter more than
Instagram for a local practice - weight accordingly.

### Ads (Ad Manager)
- Meta lead form: "New Patient Special $99 - Exam, X-Rays & Cleaning", geo-fenced 8 miles.
  Leads land via `Facebook Lead Form Submitted` -> WF 10.
- Google Search: "dentist near me", "emergency dentist", "invisalign [city]" -> the funnel in #8.
- **Send Conversion API / offline conversions on the money event** (opportunity Won or invoice
  paid), not on the form fill. Optimising to form fills in dental buys you tyre-kickers.

### Trigger links
`Recall Email - Book Cleaning`, `Cosmetic Email - See Before & After`, `Reactivation - Claim Offer`.
A click fires `Trigger Link Clicked`, which scores the contact and pulls them into a live sequence.

### Review engine
`Send Review Request` fires 3 hours after an appointment reaches **Showed** (SMS first, email at
48h if no review). Never before the visit. Reviews AI drafts replies; 3 stars and below go to the
office manager. Target: 8+ new Google reviews per month.

**Wires into:** #2 (audiences), #5 (Reviews AI), #7 (every send is a workflow), #8 (ad traffic
destination).

---

## 7. Automation & Workflows

Folders: `10 Lead Capture` / `20 Booking` / `30 Recall` / `40 Case Follow-Up` / `50 Reputation` /
`60 Ops & Hygiene`.

| # | Workflow | Trigger | Key actions | Exit goal |
|---|---|---|---|---|
| 10 | Form Submitted -> Speed to Lead | Form Submitted, FB Lead Form Submitted | Add source tag, Create Opportunity, Send SMS, Internal Notification, 5-touch follow-up | Appointment booked |
| 11 | Unbooked Lead Nurture | Tag added, no appointment | Email + SMS over 21 days | Appointment booked |
| 12 | Cosmetic Interest Nurture | Tag `service:invisalign` etc. | 6 educational emails + 2 SMS | Consult Booked |
| 15 | After-Hours Call Recap | Conversation AI Trigger (Voice) | Create opportunity, notify front desk, morning callback task | Contacted |
| 20 | Booking Confirm & Remind | Customer Booked Appointment | Confirmation SMS+email, 24h and 2h reminders | Appointment Showed |
| 21 | Showed -> Customer | Appointment Status = Showed | Contact type Customer, tag `status:active-patient`, set Last Visit Date | - |
| 22 | No-Show Recovery | Appointment Status = No-Show | Tag, 3-touch rebook over 5 days, task on touch 3 | Rebooked |
| 30 | Recall Due | Custom Date Reminder on Next Recall Due | Email + SMS at 30d, 14d, 3d | Appointment booked |
| 31 | Overdue Recall | Smart list L4 | 3 monthly touches then stop | Appointment booked |
| 32 | Dormant Reactivation | Bulk add from L5 | Offer, reminder, last call over 10 days | Rebooked |
| 40 | Treatment Plan Follow-Up | Documents & Contracts sent | 4 touches over 14 days | Signed |
| 41 | Financing Status Check | Stage = Financing Pending | Day 2 and day 5 check-ins | Approved |
| 45 | Failed Payment Dunning | Subscription | Day 0 SMS, day 3 email, day 7 call task, day 10 pause | Payment Received |
| 50 | Review Request | Appointment Status = Showed | Wait 3h, Send Review Request, email at 48h | Review received |
| 60 | Stale Opportunity Rescue | Stale Opportunities (7d / 14d) | Notify owner, Add Task | Stage changed |
| 61 | Birthday | Birthday Reminder | Email with a whitening offer | - |

Global settings on every outbound workflow: **time window 8am-7pm local**, **stop on response**,
re-entry off except 30/31.

### WF 10 - Speed to Lead, expanded
1. Trigger: `Form Submitted` (any intake form) OR `Facebook Lead Form Submitted`.
2. `Add Contact Tag` -> matching `source:` tag.
3. `Create/Update Opportunity` -> Pipeline A, stage New Inquiry, value $180, assign front desk.
4. `Send SMS` immediately: *"Hi {{contact.first_name}}, it's Sarah at
   {{custom_values.practice_name}}. Thanks for reaching out! Would you like the first available
   time, or do mornings or afternoons work better for you?"*
5. `Send Internal Notification` to front desk (call within 5 minutes).
6. `Wait` 10 min -> If Else: no reply -> `Call` front desk connect attempt.
7. `Wait` 1h, 1 day, 3 days -> three more touches, alternating SMS and email.
8. `Goal Event`: appointment booked -> exit and enter WF 20.
9. After touch 6 with no reply -> opportunity status **Lost**, reason unreachable.

### WF 22 - No-Show Recovery, expanded
1. Trigger: `Appointment Status` = No-Show.
2. `Add Contact Tag` `status:no-show`, `Create/Update Opportunity` back to Contacted.
3. `Send SMS` within 15 min: *"Hi {{contact.first_name}}, we missed you today - everything ok? Here
   are the next open times: {{custom_values.booking_link}}"* (no judgement, no fee talk).
4. `Wait` 2 days -> email with one-click rebook.
5. `Wait` 3 days -> `Add Task` for a front-desk call.
6. `Goal Event`: new appointment booked -> exit.
7. Two no-shows in 90 days -> internal notification; the practice decides on a deposit requirement.

### WF 32 - Dormant Reactivation, expanded
Audience: L5, added in waves of 200 (never blast 2,000 at once - it torches deliverability and
overwhelms the phone).
Day 0 SMS: *"Hi {{contact.first_name}}, it's {{custom_values.practice_name}}. It's been a while
since your last cleaning - we've kept your spot. Want the next available? Reply YES and we'll book
it. Reply STOP to opt out."*
Day 3 email with a $99 return-patient exam and cleaning offer. Day 7 final SMS. Day 10 exit,
tag `status:dormant`, stop.
Expect 3-8% rebook on a cold dental list. At ~1,500 records that is 45-120 appointments - which is
why this ships in phase 1, not phase 4.

**Wires into:** everything. This section is the nervous system.

---

## 8. Funnels

### Funnel 1 - `New Patient Special Funnel` (paid traffic destination)
| Step | Page | Content | Outcome |
|---|---|---|---|
| 1 | Landing | "$99 New Patient Exam, X-Rays & Cleaning" - hero, 3 trust bullets (same-week openings, most insurance accepted, gentle-care team), 4 reviews, doctor photo, sticky Book button | Form |
| 2 | Booking | Embedded `New Patient - Exam & X-Rays (75m)` calendar | Appointment |
| 3 | Confirmation | Time, address with map, parking, what to bring, add to calendar, "text us" link | - |

Form fields: First, Last, Mobile, Email, Insurance Provider, "First visit?", consent checkbox.
On submit: tag `source:` + `status:new-patient`, create Pipeline A opportunity, start WF 10.
Split test the headline (price-led vs anxiety-led: "Dentistry for people who hate the dentist").

### Funnel 2 - `Invisalign Consult Funnel`
Landing (smile assessment quiz, 5 questions) -> Results page with a personalised "you may be a
candidate" message and financing from $X/month -> Booking with the $49 deposit -> Confirmation
with before/after gallery. Quiz submission tags `service:invisalign` and fires WF 12.
The deposit step is the qualifier - it will reduce booking volume and increase revenue.

### Funnel 3 - `Emergency Dental Funnel`
Single page, phone number as the primary CTA above the fold, calendar as secondary. Under 4
seconds to load. Someone in pain does not read a long-form page. This is where mobile speed pays.

### Funnel 4 - `Membership Plan Funnel`
Plan comparison -> Order form with the recurring product -> Welcome page. Aimed at uninsured
patients; the order form creates the subscription and starts the welcome sequence.

Shared: Meta Pixel + GA4 on every page, `Funnel/Website PageView` trigger on booking pages for
retargeting, sticky contacts on, mobile-first review of every page before launch.

**Wires into:** #1 (calendar step), #3 (opportunity on submit), #4 (order form and deposit),
#6 (ad destination), #7 (WF 10 and 12).

---

## 9. Websites

### Sitemap
`/` Home - hero with booking CTA, services grid, reviews, team, insurance logos, map, FAQ
`/services/*` one page per money service: general, cosmetic, invisalign, implants, emergency
`/new-patients` what to expect, forms, insurance, financing
`/about` doctors and team - the most-visited page on most dental sites after Home
`/insurance` accepted carriers and membership plan
`/contact` map, hours, phone, embedded booking
`/book` full calendar page
`/blog` organic content

### Per-page rules
Every page carries the same primary CTA: **Book Appointment**. Phone is a `tel:` link pulled from
`{{custom_values.office_phone}}`. Chat widget on every page, routed to Conversation AI with
handover to the front desk in business hours.

### SEO targets
`dentist [city]`, `emergency dentist [city]`, `invisalign [city]`, `dental implants [city]`,
`teeth whitening [city]`. LocalBusiness/Dentist schema via custom code in the head. NAP identical
to the Google Business Profile, character for character. GBP is the highest-value ranking asset a
local practice has - the site supports it, not the other way round.

### Tracking
GA4, Meta Pixel, Google Ads tag, call tracking number on the site with the real number on GBP.

### Existing site decision
If the practice has a site it will not move, do **not** migrate. Build only `/book` and the blog in
GHL, embed the calendar and chat widget in the existing platform, and point ads at the funnels in
#8. Say this out loud in the proposal - a forced migration is the fastest way to stall a build.

**Wires into:** #1 (booking page), #5 (chat widget), #6 (SEO and GBP), #8 (links to funnels).

---

## 10. Build Order

| Phase | Days | Contents | Why here |
|---|---|---|---|
| 0 - Access | 1-3 | Sub-account, Stripe, LC Phone + **A2P submitted**, domain DNS, GBP, Meta/Google | A2P has the longest lead time - start day 1 |
| 1 - Revenue now | 4-8 | Custom fields, tags, calendars, Pipeline A, WF 10/20/21/22, Funnel 1, dormant list import, WF 32 | Reactivation and speed-to-lead pay for the build |
| 2 - Follow-through | 9-14 | Smart lists, Pipeline B, Products, Text2Pay, Contracts, WF 30/31/40/45, review engine | Converts the traffic phase 1 created |
| 3 - AI | 15-20 | Conversation AI in Suggestive mode, Voice AI after-hours, Reviews AI | Needs real transcripts from phases 1-2 to train on |
| 4 - Demand | 21-28 | Website, Funnels 2-4, Social Planner, Ad Manager, Conversion API | Only worth turning on once intake actually converts |
| 5 - Handover | 29-30 | Staff training, loom library, QA pass, reporting review | - |

Turning on ads before phase 2 is the single most common way these builds waste money.

---

## 11. Pre-Launch QA Checklist

- [ ] Book a real appointment on every calendar from a phone on cellular data, not office wifi. Pass: confirmation SMS and email inside 60 seconds, correct provider, correct timezone.
- [ ] Cancel and reschedule that appointment. Pass: reminders stop, new reminders schedule.
- [ ] Force `No-Show` on a test appointment. Pass: WF 22 fires, tag applied, stage moves back.
- [ ] Force `Showed`. Pass: contact type flips to Customer, review request arrives 3h later.
- [ ] Pay a $1 test invoice and a test Text2Pay link. Pass: opportunity to Won, receipt sent, refund it.
- [ ] Sign a test Document & Contract. Pass: invoice auto-generates, stage moves, coordinator notified.
- [ ] Submit every funnel form. Pass: source tag, opportunity created, WF 10 SMS inside 60 seconds.
- [ ] Text the AI chat agent an emergency phrase ("my face is swollen"). Pass: agent stops, gives the emergency line, hands to human. **Do this before Auto-pilot, every time.**
- [ ] Call the main number after hours. Pass: Voice AI answers, books or captures, summary lands in the inbox.
- [ ] Reply STOP to a marketing SMS. Pass: DND set, all sequences stop, contact appears in L10.
- [ ] Confirm A2P 10DLC approved and the sending domain passes SPF/DKIM/DMARC.
- [ ] Open every site and funnel page on a real phone. Pass: under 4 seconds, no horizontal scroll, tap targets work.
- [ ] Confirm no clinical detail exists in any template, SMS body, AI prompt, or invoice line item.
- [ ] Health lists L8-L10 are empty.

## 12. Reporting

Weekly, 15 minutes, same four numbers:
1. **Booked and showed appointments** - new patient vs reactivated (the goal metric).
2. **Speed to first response** - target under 5 minutes in hours, under 12 hours overnight.
3. **No-show rate** by calendar - target under 10%; deposits are the lever.
4. **Cosmetic case acceptance** - Consulted to Case Accepted percentage and average case value.

Monthly: cost per booked appointment by source (Ad Manager + `source:` tags), review count and
average rating, membership subscription count and churn, AI usage cost against appointments booked.
