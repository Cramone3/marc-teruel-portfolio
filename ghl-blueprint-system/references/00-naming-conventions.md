# Naming Conventions (apply to every asset in a blueprint)

A sub-account becomes unmaintainable at ~40 assets unless names sort themselves. Use these.

| Asset | Pattern | Example |
|---|---|---|
| Calendar | `[Team] - [Service] ([Duration])` | `Hygiene - Cleaning & Exam (60m)` |
| Smart List | `[Lifecycle] - [Condition]` | `Patient - Overdue Recall 6mo+` |
| Pipeline | `[Motion] Pipeline` | `New Patient Acquisition Pipeline` |
| Stage | Verb-state, past tense where possible | `Consult Booked`, `Treatment Plan Sent` |
| Tag | `category:value`, lowercase, no spaces | `source:google-ads`, `service:invisalign` |
| Custom field | `Group / Field Name` | `Clinical / Insurance Provider` |
| Workflow | `[##] [Trigger] -> [Outcome]` | `10 Form Submitted -> Speed to Lead` |
| Workflow folder | `[##] Category` | `10 Lead Capture`, `20 Booking`, `30 Reactivation` |
| Funnel | `[Offer] Funnel` | `Free Whitening Consult Funnel` |
| Trigger link | `[Campaign] - [Destination]` | `Recall Email - Book Cleaning` |
| Product | `[Service] - [Term]` | `Membership Plan - Monthly` |
| Email template | `[##] [Sequence] - [Step]` | `30 Recall - Step 2 Reminder` |
| AI agent | `[Channel] Agent - [Role]` | `Voice Agent - After-Hours Reception` |

Numbering rule: workflows and folders use tens (10, 20, 30...) so new items slot in without a rename.

Tag taxonomy - keep to these six namespaces, nothing else:
`source:` `service:` `status:` `stage:` `campaign:` `pref:`

Tags are for *segmentation and routing*. They are not a status field - status lives on the
opportunity (Open/Won/Lost/Abandoned) and the appointment (Confirmed/Showed/No-Show/Cancelled).

Custom values: store business constants once at `Settings -> Custom Values`
(`{{custom_values.practice_name}}`, `{{custom_values.booking_link}}`, `{{custom_values.office_phone}}`,
`{{custom_values.review_link}}`) and reference them everywhere. Never hardcode a phone number,
address, or booking URL inside a workflow, email, or AI prompt.
