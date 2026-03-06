# SubsTrack

The original goal for SubsTrack was simple: track subscriptions. While working on it, I realized that most tools in this space focus on budgeting mechanics rather than **awareness**.

This project is an attempt to build something slightly different.

Instead of behaving like a traditional budgeting app, SubsTrack focuses on the **psychological impact of recurring spending**. Subscriptions are easy to ignore because they are small, automatic, and frictionless. The idea behind this project is to surface those patterns in a way that makes the cost more visible.

The aesthetic direction is inspired by institutional fintech and data-oriented platforms — calm, precise, and slightly clinical.

---

## Initial Direction

When I started shaping the product direction, I focused on two core ideas:

1. **Financial awareness over financial control**  
   Most apps try to force users into budgeting systems. SubsTrack instead focuses on simply showing the data clearly.

2. **Psychological visibility**  
   A ₹499/month subscription feels small.  
   A ₹5,988/year recurring payment feels very different.

The goal is to surface these patterns so the user naturally understands their spending behavior.

---

## Design Logic

I approached the UI more like a financial dashboard than a productivity app.

### Layout

Everything follows a **structured grid system**.  
Spacing and alignment are intentionally rigid so the interface feels analytical rather than decorative.

Large whitespace and consistent vertical rhythm are used to keep the interface calm and readable.

---

### Typography System

Typography is doing most of the heavy lifting in the design.

- **Noto Serif Display**  
  Used for narrative statements and high-level messaging.

- **Noto Sans Display**  
  Used for functional UI components and navigation.

- **Noto Sans Mono**  
  Used for all numbers and currency values.  
  Showing financial data in a monospaced font makes it feel more like raw data than a price label.

---

### Color Direction

The palette is intentionally minimal.

Primary background  
`#0e0e0e`

Accent color  
`#337de6`

The goal was to avoid gradients or decorative color systems. The interface should feel more like a financial instrument than a marketing page.

---

## Product Structure

The product is designed around three main areas.

### Dashboard (Home)

The dashboard acts as the central overview.

It shows:
- Monthly income
- Monthly expenses
- Total subscription cost
- Remaining balance

Additional sections include upcoming subscription renewals and short insight statements based on spending patterns.

---

### Subscription Manager

This section focuses purely on subscription tracking.

Subscriptions are displayed as cards instead of tables so they are easier to scan. Each card shows:

- Subscription name
- Cost
- Billing cycle
- Next renewal
- Renewal countdown

Users can add, edit, or remove subscriptions through a minimal modal form.

---

### Money Flow

While subscriptions are the core focus, I added a simple **Money Flow** section to make the platform usable for people who do not rely heavily on subscriptions.

This section works as a lightweight ledger showing income and expenses in chronological order.

Example entries:

+ ₹45,000 Salary  
- ₹1,200 Groceries  
- ₹300 Transport  
- ₹499 Netflix

This creates context around subscription spending rather than isolating it.

---

## Interaction Philosophy

Animations are intentionally subtle.

The goal is not to make the interface feel playful but **calm and deliberate**.

Interactions currently include:

- Fade-in transitions
- Number count animations
- Subtle hover elevation on cards
- Smooth modal transitions

The pacing is intentionally slower than typical dashboard animations so the interface feels closer to a financial terminal.

---

## Tech Stack

The stack was kept relatively simple so the focus could remain on the product design.

- **React + Vite**
- **Tailwind CSS (v3)**
- **Framer Motion** for animations and transitions
- **Lucide React** for icons

The backend will eventually be handled with **Supabase**, but the current phase is focused primarily on design and interface structure.

---

## Current Progress

- [x] Landing page structure and visual direction
- [x] Authentication layout (design stage / dummy state)
- [x] Dashboard overview system
- [x] Subscription manager interface
- [x] Money flow ledger design

---

## Next Steps

The current focus is finishing the **design and ideation phase** before integrating backend logic.

Planned next steps:

- Supabase integration for authentication and data storage
- Subscription CRUD functionality
- Transaction logging for money flow
- Insight generation based on spending patterns

Longer term, I want to explore more behavioral insights around recurring spending.

---

## Project Note

What started as a simple subscription tracker gradually evolved into a small experiment around **financial awareness and interface psychology**.

The goal isn't to build another budgeting tool — it's to build something that makes spending patterns easier to notice.