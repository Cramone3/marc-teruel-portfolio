# 2. Contact Smart Lists

Path: `Contacts -> Smart Lists -> + Add Smart List`. Saved, shareable views whose membership
recalculates automatically as data changes (unlike a static imported list).

## Filter grammar
Every filter is **field + operator + value**, combined with **AND / OR** and nestable groups.

| Field type | Operators |
|---|---|
| **String** (name, email, tags, timezone, opportunity pipeline, attribution) | Is / Is Not / Contains / Does Not Contain / Is any of / Is None of / Is Empty / Is Not Empty |
| **Date** (Created On, Last Activity On, Last Appointment At, Date of Birth, Last Email Clicked) | Is (Today, Tomorrow, Yesterday, This Week/Month/Quarter/Year) / Between / On / More Than / Less Than / In the Next / In the Last / After / Before / Is Empty / Is Not Empty |
| **Numeric** (Engagement Score, numeric custom fields) | Equal To / Does Not Equal / Between / Greater Than (or Equal) / Less Than (or Equal) / Is Empty / Is Not Empty |
| **DND** (DND all, SMS, Email, Calls & Voicemails, WhatsApp, FB Messenger) | Enabled / Disabled |

Also filterable: tags, contact type (**Lead** / **Customer**), assigned user, source, opportunity
pipeline and stage, appointment data, campaign or workflow membership, and custom fields.

## What smart lists are for
1. **Operating queues** staff work every day (Needs Callback Today, Unpaid Invoices 7d+)
2. **Campaign audiences** pushed into a workflow via bulk select -> Add to Workflow
3. **Health checks** that should stay near-empty (Missing Phone, No Source Tag, DND All)

For each list a blueprint must state: the exact filter logic, who opens it and how often, and the
action taken on a row. A smart list nobody works is decoration.

## Bulk actions from a list
Add / Remove tag, Add to Workflow or Campaign, Send Email or SMS, Export, Delete, Merge,
Assign to user, Add to Audience.
