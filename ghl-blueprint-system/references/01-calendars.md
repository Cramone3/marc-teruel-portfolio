# 1. Calendars

Path: `Calendars -> Calendar Settings -> Create Calendar`. Groups: `Calendars -> Groups`.

## Calendar types
| Type | Use it when |
|---|---|
| **Simple / Personal** | One provider, one service, self-booking |
| **Round Robin** | Several interchangeable providers; distribute load |
| **Collective** | Every assigned member must be free at the same time (panel / joint consult) |
| **Class Booking** | One host, many attendees on one slot (seminar, group class, webinar) |
| **Service** | Service businesses needing variations, add-ons, staff-specific pricing/duration |
| **Service Menu** | Customer-facing menu grouping several service calendars |

Round Robin distribution: **Optimize for Availability** (fills the earliest open slot) or
**Optimize for Equal Distribution** (evaluates bookings over roughly a one-month window for
fairness). Team members can carry a **priority** ranking, and a rescheduled appointment can be
forced back to the original assignee.

## Settings worth specifying in a blueprint
**Meeting details** - calendar name, description, calendar logo, custom URL slug, meeting invite
title (supports custom values), event color, group, meeting location (Zoom / Google Meet / phone /
physical address / custom).

**Availability** - weekly working hours per member, date-specific hours and exceptions,
**Slot duration**, **Slot interval**, **Buffer time** before/after, **Appointments per slot**,
**Appointments per day**, **Minimum scheduling notice**, **Date range** (how far ahead booking
opens), **Look busy** (hide a percentage of open slots), timezone source.

**Forms & payment** - default or custom booking form, **sticky contact**, consent checkbox and
consent text, **Accept payments** (currency, description), deposit vs full amount.

**Notifications & additional options** - confirmation page (default or **Redirect URL**),
auto-confirm new appointments, allow rescheduling / cancelling, Google Analytics and Meta Pixel on
the booking widget, **assigned team member**, guests/attendees, recurring appointments.

## Appointment statuses (these drive downstream automation)
`New` / `Confirmed` / `Showed` / `No-Show` / `Cancelled` / `Invalid`

Branch on them with the **Appointment Status** workflow trigger. This is the most under-used
automation surface in GHL - no-show recovery and post-visit review requests both hang off it.

## Blueprint checklist per calendar
name / type / duration / interval / buffer / who is assigned / notice + date range / form +
consent / payment or deposit / confirmation + reminder cadence / which pipeline stage a booking
sets / what happens on No-Show
