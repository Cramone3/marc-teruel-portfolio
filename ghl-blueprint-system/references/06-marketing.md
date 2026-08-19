# 6. Marketing

Path: `Marketing` -> Emails (Campaigns, Templates, Statistics, Scheduled), Social Planner,
Ad Manager, Trigger Links, Brand Board, Affiliate Manager, Template Library.
Reviews live under `Reputation`.

## Email
Builder-based templates and campaigns; send to a smart list or a manual segment; recipient
segments can be built inside the campaign. Statistics cover delivered, opened, clicked, replied,
bounced, complained, unsubscribed.

Deliverability prerequisites a blueprint must call out: a **dedicated sending domain with
SPF/DKIM/DMARC** verified, a warm-up ramp for cold domains, and list hygiene rules (suppress
2+ hard bounces, suppress 90-day non-openers from broadcast sends).

## SMS
Sent from workflows and conversations on LC Phone. **A2P 10DLC brand and campaign registration is
mandatory in the US** - unregistered traffic gets filtered. Every promotional sequence carries an
opt-out line; inbound STOP sets DND automatically.

## Social Planner
Schedule and publish to connected profiles (Facebook, Instagram, LinkedIn, Google Business Profile,
TikTok, X, Pinterest, YouTube). Bulk CSV upload, content calendar, evergreen recycling.

## Ad Manager
Creates and reports on Facebook, Instagram, Google and LinkedIn ads inside the platform, with lead
form leads flowing straight into Contacts via the Facebook Lead Form Submitted, TikTok Form
Submitted, LinkedIn Lead Form Submitted and Google Lead Form Submitted triggers.

## Trigger Links
Trackable links for email and SMS. A click fires the `Trigger Link Clicked` workflow trigger - the
cleanest intent signal available for scoring and for exiting a nurture sequence.

## Reputation / Reviews
Review requests by SMS and email (also the `Send Review Request` workflow action), the
`New Review Received` trigger, and **Reviews AI** for suggested or automatic replies.

## Other
**Brand Board** for colours, fonts and logos reused across builders. **Affiliate Manager** for
referral partners, with its own triggers. **Template Library** for pre-built funnels, sites,
emails and social posts.

## Marketing workflow actions
`Add to Google Analytics` / `Add to Google AdWords` / `Add to Custom Audience (Facebook)` /
`Remove from Custom Audience (Facebook)` / `Facebook Conversion API`

## Design rules
- Tag every inbound lead with a `source:` tag at capture. Attribution is only as good as the tag
  discipline at the front door.
- One channel owns each moment: SMS for time-sensitive (reminders, confirmations), email for
  educational, social for demand, review requests only after a Showed appointment or a paid invoice.
- Send Conversion API / offline conversion events back to the ad platform on the *money* event
  (invoice paid, opportunity Won), not on the form fill, or the algorithm optimises for cheap junk.
