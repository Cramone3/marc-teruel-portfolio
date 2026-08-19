# 5. AI Agents (AI Employee)

AI Employee modules: **Voice AI**, **Conversation AI**, **Reviews AI**, **Content AI**,
**Funnel & Website AI**. Most are usage-billed (Voice AI per minute, Conversation AI per message)
- always list expected usage cost in a blueprint.

## Conversation AI
Path: `Settings -> Conversation AI` (bot configuration), enabled per channel and per contact.

**Bot Training** - the knowledge the agent answers from: Knowledge Base articles, uploaded
documents, crawled URLs, and FAQ pairs.

**Bot Goals** - the prompt, made of four parts:
- **Personality** (tone and role)
- **Goal / Intent** (the one outcome it drives toward)
- **Additional Information** (rules, e.g. "ask one question at a time")
- **Custom Values** for dynamic data, e.g. `{{ai.business_name}}`, `{{custom_values.booking_link}}`

**Bot Actions** - `Appointment Booking` (calendar + post-booking workflow), `Contact Info`
(collect and save missing fields), `Trigger Workflow`, and handover controls
(**Human Handover**, **Stop Bot**, **Transfer Bot**). A real-time test panel sits beside the prompt.

**Modes** - *Suggestive* (drafts a reply for a human to send) and *Auto-pilot* (sends on its own).
Ship regulated industries in Suggestive mode for the first two weeks, then promote.

**Settings worth specifying** - enabled channels (SMS, Facebook, Instagram, Web Chat, GBP,
WhatsApp), business hours vs after-hours behaviour, message delay, how many messages to wait for,
and stop-on-keyword.

## Voice AI
Path: `AI Agents -> Voice AI`. Configuration surface:
- **Core** - Agent Name, Voice, Model, Language, **Agent Prompt** (role, objective, what to
  collect, topics to avoid, when to transfer, how to close)
- **Communication** - separate inbound and outbound welcome messages, who speaks first, pause
  before speaking
- **Knowledge Base** - connected source plus when to search it
- **Actions** - `Call Transfer`, `Trigger Workflow`, `Send SMS`, `Update Contact Field`,
  `Appointment Booking`, `Custom Action` (webhook), `Agent Transfer` (to another voice agent)
- **Advanced** - call duration, idle reminders, silence handling, interruption sensitivity,
  transcription and pronunciation, voice speed and volume
- **Post-Call** - notifications, workflow to run, call summary, follow-up behaviour
- **Deployment** - phone number or Number Pool assignment, working hours

## Workflow-side AI
`Conversation AI` action (hand a conversation to the bot mid-workflow), `AI Prompt` action
(GPT-powered text generation inside a workflow), `Eliza AI Appointment Booking` and
`Send to Eliza Agent Platform`.

## Guardrails - required in every blueprint
State explicitly what the agent must **never** do: quote prices it cannot verify, give clinical /
legal / financial advice, discuss another customer's data, promise outcomes, or handle emergencies.
Define the emergency phrase list and the immediate human-handover path. Disclose it is an assistant
when asked. In regulated industries keep sensitive detail out of SMS bodies entirely.
