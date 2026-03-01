# Method × Shopify Checkout Demo

An interactive demo showing how [Method Financial](https://methodfi.com) enables frictionless card-on-file checkout inside a Shopify storefront — no manual card entry required.

The demo simulates a Gymshark-styled checkout experience. A shopper fills out their email, verifies their identity via a one-time code, and Method automatically surfaces their linked credit cards. They select a card, enter their CVV, and Method retrieves the full card details — which are then passed directly to Shopify Payments for tokenization and order creation.

Every API call is visible in real time in the built-in API Inspector on the right side of the screen.

---

## How it works

The checkout flow makes 7 total API calls across two systems:

### Method Financial (6 calls)

| # | Call | Description |
|---|------|-------------|
| 1 | `POST /entities` | Creates a Method entity for the shopper |
| 2 | `POST /entities/{id}/connect` | Connects the entity's financial accounts |
| 3 | `GET /accounts?holder_id={id}` | Retrieves the shopper's linked credit cards |
| 4 | `POST /accounts/{id}/verification_sessions` | Opens a network verification session on the selected card (`type: network`) |
| 5 | `PUT /accounts/{id}/verification_sessions/{id}` | Submits the CVV to verify the card via the card network |
| 6 | `GET /accounts/{id}/sensitive` | Retrieves the full PAN, expiration, and billing address |

### Shopify Payments (1 call)

| # | Call | Description |
|---|------|-------------|
| 7 | `POST https://checkout.shopify.com/sprinkles/v1/payment_instruments` | Vaults the full card number — Shopify tokenizes it and returns a payment instrument token |

---

## API Inspector

The right-hand panel shows every API call as it happens:

- **Method calls** — dark border, green `200` status badge
- **Shopify call** — green border, shopping bag icon, `Shopify` badge in place of a status code
- A **system handoff divider** visually separates the Method and Shopify sections, making the data flow clear

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Use the **Reset demo** button in the top right to restart the flow from the beginning.

---

## Tech stack

- [Next.js 14](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/) — page and component transitions
- [Zustand](https://zustand-demo.pmnd.rs/) — global demo state
- All API calls are mocked with realistic payloads and random latency — no real credentials required
