# 7. Automation & Workflows

Path: `Automation -> Workflows` (folders supported). A workflow is one or more **triggers** plus a
sequence of **actions**, with If/Else branches, Wait steps and Goal events.

State per workflow in a blueprint: **allow re-entry**, **stop on response**, **time window**
(send only during business hours), timezone source.

## Trigger vocabulary (use these exact names)
**Contact:** Birthday Reminder, Contact Changed, Contact Created, Contact DND, Contact Tag,
Custom Date Reminder, Note Added, Note Changed, Task Added, Task Reminder, Task Completed,
Contact Engagement Score

**Events:** Inbound Webhook, Scheduler, Call Details, Email Events, Customer Replied,
Conversation AI Trigger, Custom Trigger, Form Submitted, Survey Submitted, Trigger Link Clicked,
Facebook Lead Form Submitted, TikTok Form Submitted, Video Tracking, Number Validation,
Messaging Error - SMS, LinkedIn Lead Form Submitted, Funnel/Website PageView, Quiz Submitted,
New Review Received, Prospect Generated, Click To WhatsApp Ads, External Tracking Event

**Appointments:** Appointment Status, Customer Booked Appointment, Service Booking, Rental Booking

**Opportunities:** Opportunity Status Changed, Opportunity Created, Opportunity Changed,
Pipeline Stage Changed, Stale Opportunities

**Payments:** Invoice, Payment Received, Order Form Submission, Order Submitted,
Documents & Contracts, Estimates, Subscription, Refund, Coupon Code Applied,
Coupon Redemption Limit Reached, Coupon Code Expired, Coupon Code Redeemed

**Courses / Memberships:** Category Started, Category Completed, Lesson Started, Lesson Completed,
New Signup, Offer Access Granted, Offer Access Removed, Product Access Granted,
Product Access Removed, Product Started, Product Completed, User Login

**Ecommerce:** Shopify Abandoned Cart, Shopify Order Placed, Shopify Order Fulfilled,
Order Fulfilled, Product Review Submitted, Abandoned Checkout

**Social and other:** Facebook Comment On A Post, Instagram Comment On A Post,
TikTok Comment On A Video, Transcript Generated, Google Lead Form Submitted, Start IVR Trigger,
Certificates Issued, Affiliate triggers, Communities access triggers

## Action vocabulary (use these exact names)
**Contact:** Create Contact, Find Contact, Update Contact Field, Add Contact Tag,
Remove Contact Tag, Assign to User, Remove Assigned User, Edit Conversation, Disable/Enable DND,
Add Note, Add Task, Copy Contact, Delete Contact, Modify Contact Engagement Score,
Add/Remove Contact Followers

**Communication:** Send Email, Send SMS, Send Slack Message, Call, Messenger, Instagram DM,
Manual Action, GMB Messaging, Send Internal Notification, Send Review Request, Conversation AI,
Facebook Interactive Messenger, Instagram Interactive Messenger, Reply in Comments, WhatsApp,
Send Live Chat Message

**Internal tools:** If Else, Wait, Goal Event, Split, Update Custom Value, Go To,
Remove from Workflow, Arrays, Drip Mode, Text Formatter, Custom Code

**Data out:** Webhook / Custom Webhook, Google Sheets

**AI:** AI Prompt, Eliza AI Appointment Booking, Send to Eliza Agent Platform

**Appointments:** Update Appointment Status, Generate One Time Booking Link

**Opportunities:** Create/Update Opportunity, Remove Opportunity

**Payments:** Stripe One-Time Charge, Send Invoice, Send Documents and Contracts

**Marketing:** Add to Google Analytics, Add to Google AdWords, Add to Custom Audience (Facebook),
Remove from Custom Audience (Facebook), Facebook Conversion API

**IVR:** Gather Input on Call, Play Message, Connect to Call, End Call, Record Voicemail

## The eight workflows almost every business needs
1. **Speed to lead** - Form Submitted -> SMS within 60 seconds, internal notification, create opportunity
2. **Booking confirmation and reminders** - Customer Booked Appointment -> confirmation, 24h and 2h reminders
3. **No-show recovery** - Appointment Status = No-Show -> three-touch rebook offer
4. **Unbooked lead nurture** - long-cycle drip with a Goal Event on booking
5. **Post-service review request** - Appointment Status = Showed or Payment Received -> wait, then Send Review Request
6. **Database reactivation** - Scheduler or bulk audience -> dormant-customer offer
7. **Stale opportunity rescue** - Stale Opportunities -> notify owner, add task
8. **Dunning / failed payment** - Subscription or Invoice trigger -> retry sequence and internal alert

## Design rules
- **One trigger, one job.** Giant multi-trigger workflows cannot be debugged.
- **Always add a Goal Event** so a lead who converts exits follow-up immediately.
- Wrap every outbound sequence in a **time window** so nothing texts at 3am.
- **Stop on response** for any conversational sequence.
- Prefix each workflow with its folder number so execution order reads at a glance.
