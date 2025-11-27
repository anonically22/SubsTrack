# 🚀 SubsTrack - Personal Subscription Tracker

<div align="center">

![SubsTrack Banner](https://img.shields.io/badge/SubsTrack-Subscription%20Manager-6366F1?style=for-the-badge&logo=react&logoColor=white)

**Track all your subscriptions • Reduce spending • Never miss a payment**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-6366F1?style=for-the-badge)](https://subs-track-nine.vercel.app/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## ✨ Features

### 🎯 Core Functionality
- **📊 Dashboard Overview** - Visual analytics of your spending patterns
- **💳 Subscription Management** - Add, edit, and track all your subscriptions
- **🔔 Smart Alerts** - Get notified before renewals with urgency indicators
- **📈 Analytics & Reports** - Detailed insights into spending by category
- **💰 Wallet View** - Track your balance and savings
- **🎁 Rewards Center** - Discover cashback offers and exclusive deals
- **🔍 Discover** - Browse and add new subscription services

### 🎨 Design Highlights
- **Modern UI/UX** - Clean, colorful interface with glassmorphism effects
- **Dark/Light Mode** - Seamless theme switching
- **Fully Responsive** - Optimized for mobile, tablet, and desktop
- **Vibrant Color Palette** - Indigo primary with emerald and amber accents
- **Consistent Spacing** - 8px-based design system for perfect alignment
- **Smooth Animations** - Delightful micro-interactions throughout

### 🇮🇳 India-First Features
- **INR Currency** - All amounts displayed in Indian Rupees (₹)
- **Local Services** - Pre-loaded with popular Indian subscriptions (Netflix, Hotstar, Spotify, Swiggy One, etc.)
- **Offline-First** - Works completely offline with LocalStorage

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18 + Vite |
| **Routing** | React Router DOM |
| **Styling** | Vanilla CSS with CSS Variables |
| **Charts** | Chart.js + React-Chartjs-2 |
| **Icons** | Lucide React |
| **Date Handling** | date-fns |
| **Storage** | LocalStorage API |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/anonically22/SubsTrack.git

# Navigate to the frontend directory
cd SubsTrack/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

---

## 📱 Screenshots

### Dashboard
Modern dashboard with spending analytics, smart alerts, and quick actions.

### Mobile Experience
Optimized mobile interface with FAB (Floating Action Button) for quick subscription additions.

### Wallet & Rewards
Track your balance, savings, and discover exclusive cashback offers.

---

## 🎯 Key Features Breakdown

### 1️⃣ Dashboard
- **Summary Cards** - Total monthly spend, active subscriptions, projected yearly cost
- **Spending Analytics** - Visual bar chart showing spending trends
- **Smart Alerts** - Urgent renewal notifications with days-left countdown
- **Recent Activity** - Quick view of latest subscription updates

### 2️⃣ Subscription Management
- **Add/Edit Subscriptions** - Comprehensive form with all details
- **Category Filtering** - Filter by Entertainment, Productivity, Music, etc.
- **Search Functionality** - Quickly find specific subscriptions
- **Status Tracking** - Active/Inactive badges with renewal dates

### 3️⃣ Analytics
- **Category Breakdown** - Pie chart showing spending distribution
- **Monthly Trends** - Line chart tracking spending over time
- **Detailed Reports** - Exportable financial summaries

### 4️⃣ Mobile-First Design
- **Bottom Navigation** - Easy thumb-reach navigation
- **FAB Button** - Prominent "Add New" floating action button
- **Responsive Grids** - Adaptive layouts for all screen sizes
- **Touch-Optimized** - Large tap targets and smooth gestures

---

## 🎨 Design System

### Color Palette
```css
Primary: #6366F1 (Indigo)
Secondary: #10B981 (Emerald)
Accent: #F59E0B (Amber)
Danger: #EF4444 (Red)
```

### Spacing System
Based on 8px grid for consistent alignment:
- `--space-2: 8px`
- `--space-4: 16px`
- `--space-6: 24px`
- `--space-8: 32px`

### Typography
- **Font Family**: Inter (Modern, readable, professional)
- **Weights**: 300-900 for flexible hierarchy

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx              # Main app layout with navigation
│   │   ├── PageHeader.jsx          # Consistent page headers
│   │   ├── RotatingCard.jsx        # 3D subscription cards
│   │   ├── SmartAlerts.jsx         # Renewal alert widgets
│   │   ├── SummaryCard.jsx         # Dashboard stat cards
│   │   └── SubscriptionCard.jsx    # Individual subscription display
│   ├── pages/
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   ├── Subscriptions.jsx       # Subscription list
│   │   ├── AddEditSubscription.jsx # Add/Edit form
│   │   ├── Analytics.jsx           # Charts & insights
│   │   ├── Wallet.jsx              # Balance & transactions
│   │   ├── Rewards.jsx             # Offers & cashback
│   │   ├── Discover.jsx            # Browse new services
│   │   ├── Reports.jsx             # Financial reports
│   │   ├── AlertsPage.jsx          # Notification center
│   │   ├── Profile.jsx             # Settings & preferences
│   │   ├── Login.jsx               # Mock login
│   │   ├── Signup.jsx              # Mock signup
│   │   └── LandingPage.jsx         # Welcome page
│   ├── context/
│   │   └── SubscriptionContext.jsx # Global state management
│   ├── data/
│   │   └── mockSubscriptions.json  # Sample Indian subscriptions
│   ├── index.css                   # Global styles & design system
│   ├── App.jsx                     # Root component with routing
│   └── main.jsx                    # Entry point
├── package.json
└── vite.config.js
```

---

## 🔮 Roadmap

- [ ] **Backend Integration** - Connect to real API
- [ ] **User Authentication** - Secure login system
- [ ] **Payment Integration** - Direct payment from app
- [ ] **Notifications** - Push notifications for renewals
- [ ] **Data Export** - CSV/PDF export functionality
- [ ] **Multi-Currency** - Support for multiple currencies
- [ ] **Subscription Sharing** - Family plan management
- [ ] **AI Recommendations** - Smart subscription suggestions

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@anonically22](https://github.com/anonically22)

---

## 🙏 Acknowledgments

- Design inspiration from modern fintech apps
- Icons by [Lucide](https://lucide.dev/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- Deployed on [Vercel](https://vercel.com/)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ for India 🇮🇳

[Live Demo](https://subs-track-nine.vercel.app/) • [Report Bug](https://github.com/anonically22/SubsTrack/issues) • [Request Feature](https://github.com/anonically22/SubsTrack/issues)

</div>
