# 3. Opportunities & Pipeline Stages

Path: `Opportunities -> Pipelines -> Create New Pipeline`. Board or list view, filterable by
pipeline, stage, assigned user, source, date range, and lead value.

## Opportunity record fields
Opportunity name / linked Contact / **Pipeline** / **Stage** / **Lead Value** / **Status** /
Assigned user (owner) / Source / Tags / Followers / Notes and Tasks / custom opportunity fields.

**Status values:** `Open`, `Won`, `Lost`, `Abandoned`. Status is independent of stage - a deal
sits in a stage *and* carries a status. Report on both. A stage can also be hidden from the funnel
chart so admin-only stages stay out of conversion math.

## Design rules
- **One pipeline per motion, not per service.** New-customer acquisition, reactivation, and
  post-sale delivery are different motions and belong in different pipelines.
- **5 to 8 stages.** Each stage is a state the *customer* is in, advanced by an observable event
  (form submitted, appointment showed, invoice paid) - never by a mood ("Warm Lead").
- **Write the entry and exit event for every stage.** Ambiguity here is why pipelines rot.
- **Automate the movement** with the `Create/Update Opportunity` workflow action. Dragging cards
  by hand is a fallback, not the design.
- **Set Lead Value on creation** from the average ticket so the funnel chart forecasts revenue.

## Related workflow triggers
`Opportunity Created` / `Opportunity Changed` / `Opportunity Status Changed` /
`Pipeline Stage Changed` / `Stale Opportunities` (no movement in N days - the best hygiene
trigger in the platform; every pipeline should have one).

## Blueprint checklist per pipeline
purpose / stages with entry and exit events / lead value rule / owner assignment rule /
stale threshold / what Won and Lost each trigger / which smart list surfaces each stage
