# Missing Functionalities and UI Limitations

> This checklist captures the current product gaps and interface limitations in the Small Basket MVP. Use this to prioritize the next improvements and keep the hosted deployment out of scope for now.

## Product / Feature Gaps

- [ ] Full user authentication and authorization
  - [ ] Real signup / login flow with password handling
  - [ ] Account email verification or password reset
  - [ ] Connected profile persistence beyond guest accounts
- [ ] Robust search experience
  - [ ] Search input with autocomplete and token highlight
  - [ ] Full-text product search across name, category, description
  - [ ] Search result relevance ranking and no-results guidance
- [ ] Filter and sort controls for product browsing
  - [ ] Category / subcategory faceting
  - [ ] Price range filtering
  - [ ] Brand filtering
  - [ ] Discount / rating filters
- [ ] Full shopping cart behavior
  - [ ] Persist cart between sessions for logged-in users
  - [ ] Clear item variant support (weight/size/litre selections)
  - [ ] Coupon code / promo application
- [ ] Checkout/payment realism
  - [ ] Actual payment gateway integration (Stripe / Razorpay / UPI)
  - [ ] Validated card / netbanking / wallet flows
  - [ ] COD limit handling and proper order validation
  - [ ] Payment status and retry handling
- [ ] Orders and order tracking
  - [ ] Order history with accurate statuses
  - [ ] Order detail view with shipment updates
  - [ ] Cancel / return / refund support
- [ ] Wishlist / saved items proper flow
  - [ ] Save for later persistence
  - [ ] Move between cart and saved list
- [ ] Product detail improvements
  - [ ] Real product attributes (size, unit, quantity options)
  - [ ] Proper related products / upsells
  - [x] Visually similar products restored in detail page
- [ ] Reviews and ratings backend support
  - [ ] Review submission tied to authenticated users
  - [ ] Review moderation or spam handling
  - [ ] Aggregate rating calculations
- [ ] Address management and delivery
  - [ ] Validated shipping addresses with structured fields
  - [ ] Multiple saved address edit/delete
  - [ ] Delivery slot selection tied to checkout
  - [x] Geolocation / current location address capture
- [ ] Admin / content management
  - [ ] Product creation / update / delete UI
  - [ ] Order management and status update UI
  - [ ] User management and analytics
- [ ] Backend data quality / product metadata
  - [ ] Real image URLs for products
  - [ ] Accurate categories and normalized labels
  - [ ] Standardized units for grocery/liquid items
  - [ ] Explicit/adult product filtering support

## UI / UX Limitations

- [ ] Product card unit display is still inconsistent
  - [ ] `1 pc` should only appear for pieces, not all products
  - [ ] Grocery should show `250 g`, `500 g`, `1 kg` where relevant
  - [ ] Liquids should show `1 L`, `500 ml`, etc.
- [ ] Placeholder or greyed-out imagery in many cards
- [x] Product card add-to-cart quantity flow fixed (single submission, consistent increment)
- [ ] Account / wallet / payment UI is mostly visual and not fully functional
- [ ] Some pages still feel boilerplate and lack real user flow
  - [ ] `My Account` text is static and does not show real profile metadata reliably
  - [ ] Wallet page only supports manual top-up and no real payment link to checkout
  - [ ] Contact / delivery / checkout forms are not fully validated or connected
- [ ] Search and filter UI is limited and does not support dynamic result refinement
- [ ] Recommendations and product groupings need better visual hierarchy
- [ ] No consistent mobile/adaptive layout polish across all pages
- [ ] No clear empty state guidance for missing products or cart
- [ ] No onboarding or user guidance for new users
- [ ] Some modals and tooltips are basic and not accessible
- [ ] Checkout summary lacks explicit shipping / tax breakdown and confirmation flow

## Quality and Maintenance

- [ ] Code has many inline styles instead of reusable design system classes
- [ ] Hardcoded category/title logic is brittle and needs normalization
- [ ] No consistent component reuse for buttons, cards, and forms
- [ ] No centralized state for checkout / cart / account flows
- [ ] No analytics / telemetry for feature usage

## Deployment / Release Notes

- [ ] Hosting is intentionally out of scope for current work
- [ ] Deployment should be deferred until UI and functionality are stable
- [ ] If hosting is later required, select a lightweight full-stack deployment path only after core flows are complete

## Suggested next focus areas

- [ ] Fix product listing and unit display first
- [ ] Complete checkout/payment flow with a single real payment method
- [ ] Add search + filter support for catalog browsing
- [ ] Harden account/auth and saved user data storage
- [ ] Add real product images and normalize categories
