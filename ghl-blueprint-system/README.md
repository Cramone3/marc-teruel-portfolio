# GoHighLevel Blueprint System

Turns an industry name into a build-ready GoHighLevel sub-account spec covering all nine modules:
Calendars, Contact Smart Lists, Opportunities & Pipelines, Payments, AI Agents, Marketing,
Automation & Workflows, Funnels, Websites.

## Use it

```bash
/ghl-blueprint Dental
```

Any of these work: `/ghl-blueprint HVAC contractor`, `/ghl-blueprint med spa, 3 locations`,
`/ghl-blueprint solo real estate agent, luxury listings`.

It asks up to four intake questions, then writes
`ghl-blueprint-system/blueprints/<slug>-blueprint.md` and publishes it as a shareable Artifact.
Answer "just assume" and it proceeds on documented defaults, listing every assumption up front.

## What is in here

| Path | Purpose |
|---|---|
| `.claude/skills/ghl-blueprint/SKILL.md` | The generator - method, rules, output contract |
| `references/00-naming-conventions.md` | Asset naming, tag taxonomy, custom values. Read first |
| `references/01-calendars.md` ... `09-websites.md` | Per-module GHL vocabulary: real field names, real menu paths, design rules |
| `references/intake-questions.md` | The intake bank the skill draws its four questions from |
| `templates/blueprint-outline.md` | Section order and headings of the output |
| `examples/dental-practice-blueprint.md` | Full worked example - the depth bar for every generation |
| `blueprints/` | Generated output lands here |

## Why the references exist

The failure mode of AI-generated GHL scopes is confident invention: triggers that do not exist,
menu paths that were never there, "workflows" that are just a list of adjectives. The reference
files pin the generator to the documented vocabulary - the actual trigger and action names, the
actual calendar types, the actual filter operators - so the output can be built by someone sitting
in front of the platform.

Refresh them when HighLevel ships changes; the trigger and action lists move a few times a year.

## Sources

Grounded in the HighLevel Support Portal, August 2026:

- [A List of Workflow Triggers](https://help.gohighlevel.com/support/solutions/articles/155000002292-a-list-of-workflow-triggers)
- [A List of Workflow Actions](https://help.gohighlevel.com/support/solutions/articles/155000002294-what-are-workflow-actions-complete-list-)
- [Round Robin Calendars: Setup, Distribution & Availability](https://help.gohighlevel.com/support/solutions/articles/155000001485-round-robin-calendars-setup-distribution-availability-explained)
- [Calendar Types](https://help.gohighlevel.com/support/solutions/folders/155000000686)
- [Getting Started With Smart Lists](https://help.gohighlevel.com/support/solutions/articles/48001062094-how-to-create-manage-smart-lists)
- [Advanced Filters in Smart Lists](https://help.gohighlevel.com/support/solutions/articles/155000007530-advanced-filters-in-smart-lists)
- [Getting Started - Setup Pipelines and Opportunities](https://help.gohighlevel.com/support/solutions/articles/155000005062-getting-started-setup-pipelines-and-opportunities)
- [Understanding Pipelines](https://help.gohighlevel.com/support/solutions/articles/155000001982-understanding-pipelines)
- [Payments](https://help.gohighlevel.com/support/solutions/155000000067) and [Documents & Contracts](https://help.gohighlevel.com/support/solutions/articles/155000000594-how-to-use-documents-contracts-)
- [AI Employee Overview](https://help.gohighlevel.com/support/solutions/articles/155000003906-ai-employee-overview)
- [How to Create Voice AI Agents](https://help.gohighlevel.com/support/solutions/articles/155000004107-how-to-create-voice-ai-agents)
- [Bot Goals Overview - Conversation AI](https://help.gohighlevel.com/support/solutions/articles/155000004417-bot-goals-overview-conversation-ai)
- [Marketing](https://help.gohighlevel.com/support/solutions/48000449565), [Overview of Ad Manager](https://help.gohighlevel.com/support/solutions/articles/155000002433-overview-of-ad-manager), [Set Up Social Planner](https://help.gohighlevel.com/support/solutions/articles/155000005063-getting-started-setup-social-planner)
- [Launch a Funnel](https://help.gohighlevel.com/support/solutions/articles/155000005057-getting-started-launch-a-funnel) and [Websites Overview](https://help.gohighlevel.com/support/solutions/articles/155000001633-websites-overview)

## Scope

This system drafts specs. It does not connect to or configure any live sub-account, and it does not
send anything to a client. Draft, review, then build by hand or hand it to a build team.
