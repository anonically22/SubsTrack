# SubsTrack

Originally the idea was just to track subscriptions, but while working on it I realized the bigger problem is **financial awareness**. Most tools focus on budgeting mechanics or expense categorization. SubsTrack instead focuses on helping users **see recurring spending clearly** and understand the patterns behind it.

The project is currently in the **frontend completion phase**, where the goal is to build a fully functioning interface with dummy logic before connecting the backend.

The design direction is inspired by institutional fintech and data platforms — calm, structured, and analytical.

---

# Core Idea

Subscriptions feel small because they are recurring and frictionless.  

₹499/month does not feel significant.  
₹5,988/year changes perception.

SubsTrack is designed to expose these patterns and show how recurring payments shape spending behavior.

The platform combines:

- Subscription tracking
- Money flow awareness
- Behavioral spending insights

The goal is not to force budgeting decisions but to **surface financial patterns clearly**.

---

# Design Philosophy

The UI is intentionally minimal and structured.

Instead of looking like a productivity tool, the interface behaves more like a **financial dashboard**.

Key principles:

- Calm visual hierarchy
- Strong typography
- Large whitespace
- Data-first layout
- Subtle interactions

The interface should feel analytical rather than decorative.

---

# Layout System

The interface uses a structured grid and consistent spacing to keep the UI disciplined and readable.

Cards and content blocks are used instead of tables wherever possible to improve scanability.

The application layout is designed **mobile-first**, with a bottom navigation system similar to native mobile apps.

---

# Typography System

Typography carries most of the emotional tone of the product.

**Noto Serif Display**  
Used for narrative statements and insight sections.

**Noto Sans Display**  
Used for interface text and UI labels.

**Noto Sans Mono**  
Used for all financial values.

Displaying currency in a monospace font helps reinforce the idea that these numbers represent **data points rather than price tags**.

---

# Color Direction

Background  
`#0e0e0e`

Accent  
`#337de6`

The palette is intentionally minimal. The interface avoids gradients or decorative color systems to maintain a calm fintech aesthetic.

---

# Product Structure

The platform currently includes four main areas.

---

## Dashboard (Home)

The dashboard acts as the financial overview.

It displays:

- Monthly income
- Monthly expenses
- Subscription spending
- Remaining balance

Additional sections include:

Upcoming subscription renewals  
Behavioral spending insights  
Quick actions for adding data

The goal is to make the dashboard feel like a **financial awareness panel**.

---

## Subscription Manager

The subscription manager allows users to track recurring services.

Subscriptions are displayed as cards rather than tables and include:

- Service name
- Cost
- Billing cycle
- Renewal date
- Renewal countdown

Users can add, edit, or remove subscriptions through modal forms.

---

## Money Flow

Money Flow works as a lightweight financial ledger.

It allows users to record income and expenses so subscription costs can be seen in context.

Example entries:

+ ₹45,000 Salary  
- ₹1,200 Groceries  
- ₹300 Transport  
- ₹499 Netflix

This section intentionally avoids complicated budgeting systems and focuses on **simple chronological tracking**.

---

## Behavioral Insight System

The dashboard includes a simple insight layer that generates observations based on the current financial data.

Example insights:

Subscriptions account for a percentage of total spending  
Spending increased compared to last month  
Largest recurring expense  
Subscription growth trends

These insights are currently generated using dummy logic but will later be connected to real data.

---

## Master Admin Dashboard

A hidden admin dashboard has been added for internal monitoring.

This panel is accessible through a restricted route and is not part of the main user navigation.

The admin dashboard includes:

System metrics overview  
API monitoring table  
User activity list  
Testing controls  
Activity logs

This allows internal testing of platform behavior and simulated system analytics.

---

# Mobile Experience

The application is designed **mobile-first**.

Key mobile features:

Bottom navigation bar  
Full-width cards  
Large touch targets  
Vertical scrolling layout

The interface is intended to behave like a mobile application even though a native mobile version is not implemented yet.

The long-term goal is to convert the platform into a **progressive web application (PWA)**.

---

# Tech Stack

React + Vite  
Tailwind CSS  
Framer Motion  
Lucide React  
React Router

The backend will later be integrated using **Supabase**, but the current focus is completing the frontend architecture.

---

# Current Progress

- [x] Product concept defined
- [x] Design system finalized
- [x] Landing page implemented
- [x] Authentication interface implemented
- [x] Dashboard structure implemented
- [x] Subscription manager implemented
- [x] Money flow ledger implemented
- [x] Behavioral insight system added
- [x] Master admin dashboard created
- [x] Mobile-first layout implemented
- [x] Mock data layer for frontend testing

---

# Next Steps

The next phase of development will focus on connecting the interface to real data.

Planned work includes:

Supabase authentication  
Database schema design  
Subscription CRUD operations  
Transaction storage  
Insight engine powered by real data

Once backend integration is complete, the platform will transition from a prototype interface to a functional product.

---

# Project Note

What began as a simple subscription tracker gradually evolved into a small exploration of **financial awareness, behavioral design, and data visualization**.

The goal is not to build another budgeting app.

The goal is to build something that makes financial patterns **visible enough to change behavior naturally**.