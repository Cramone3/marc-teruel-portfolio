# 4. Payments

Path: `Payments` (Integrations, Products, Orders, Subscriptions, Invoices & Estimates,
Documents & Contracts, Coupons, Transactions, Payment Links).

## Providers
Stripe, PayPal, Authorize.net, NMI, Square. **Connect a provider before anything else in this
module** - products, order forms, calendar deposits and invoices all depend on it.
Supported on invoices and Text2Pay links: card, Apple Pay, Google Pay, ACH debit (US, Stripe),
and manual methods (cash, cheque, bank transfer) recorded as offline payments. Tap to Pay is
available in the mobile app for in-person collection.

## Building blocks
| Object | Use |
|---|---|
| **Products** | One-time or **recurring** (subscription) items with prices; used by order forms, invoices, contracts |
| **Invoices** | One-off or **recurring templates**, scheduled sending, auto-reminders, partial payment / deposit |
| **Estimates** | Send a quote, let the customer accept, then convert to invoice |
| **Text2Pay** | SMS a payment link - the fastest path to money for phone-closed sales |
| **Documents & Contracts** | Proposals and e-signature agreements with one-time or recurring payments embedded; can auto-generate the invoice on signature |
| **Coupons** | Percentage or fixed discount codes, redemption limits, expiry |
| **Order forms** | The checkout step inside a funnel; supports bump offers, upsells and downsells |
| **Subscriptions** | Recurring plan management, cancellation and failed-payment visibility |

## Payment-related workflow triggers
`Invoice` / `Payment Received` / `Order Form Submission` / `Order Submitted` /
`Documents & Contracts` / `Estimates` / `Subscription` / `Refund` /
`Coupon Code Applied` / `Coupon Redemption Limit Reached` / `Coupon Code Expired` /
`Coupon Code Redeemed`

## Payment workflow actions
`Stripe One-Time Charge` / `Send Invoice` / `Send Documents and Contracts`

## Design rules
- **Every product a customer can buy exists as a Product record**, even if it is usually sold in
  person. Without it there is no revenue reporting inside GHL.
- **Deposits belong on the calendar** for high-no-show services - it is the cheapest no-show fix
  available.
- **Failed payment is a lifecycle event, not an accounting one.** Build a dunning workflow off the
  `Subscription` trigger for any recurring plan.
- **Never put price negotiation in an invoice.** Use an Estimate or a Document & Contract so the
  accept/sign event is captured as a trigger.
