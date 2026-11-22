# RupeePulse | Enterprise-Grade Personal Finance & Analytics Engine

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-purple.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-2.13.0-22c55e.svg)](https://recharts.org/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing_22/22-brightgreen.svg?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Currency: INR](https://img.shields.io/badge/Currency-₹_INR_(en--IN)-orange.svg)](https://en.wikipedia.org/wiki/Indian_rupee)

> **RupeePulse** is a client-side personal finance and analytics web application engineered for Indian citizens, households, and professionals. Designed with a mobile-first, privacy-first architecture, it provides financial observability, automated cash flow intelligence, dynamic budget tracking, and real-time visualization in **Indian Rupees (₹ INR)**—with **zero backend dependencies and complete local data sovereignty**.

---

## 📌 Executive Summary

Modern personal finance applications often compromise user privacy through mandatory third-party account linkages, intrusive ad tracking, and complex subscription gates. **RupeePulse** eliminates these frictions by operating entirely within the user's browser, persisting all cryptographic and transactional data to `localStorage`. 

Built strictly using vanilla CSS variables, React 18, and pure functional utility pipelines, RupeePulse delivers sub-millisecond interaction speeds, WCAG-compliant accessibility, and financial breakdowns formatted in the Indian numbering system (`en-IN` Lakhs & Crores).

---

## 🌟 Key Functional Pillars

### 1. Financial Ledger & Rapid Data Capture
- **2-Second Quick-Add Engine**: Inline quick-capture bar located directly on the dashboard allowing one-click logging without modal friction.
- **Granular Transaction Metadata**: Supports categorization, custom notes, date pickers, and explicit payment mode attribution (`UPI [GPay / PhonePe]`, `Cash`, `Credit / Debit Card`, `Net Banking`).
- **One-Tap Quick Amounts**: Pre-calibrated rupee increment pills (`+₹100`, `+₹200`, `+₹500`, `+₹1,000`, `+₹2,000`, `+₹5,000`) for thumb-friendly mobile input.
- **Accidental Deletion Safeguard**: A reactive toast notification with a 5-second countdown allowing one-click transaction restoration via an in-memory undo buffer.

### 2. Analytical Intelligence & Visual Telemetry
- **Cash Flow Barometer**: Real-time proportional distribution bar mapping total monthly inflow against outflow and net retained capital.
- **Dynamic Timeframe Switching**: Instant toggle between `This Month`, `Last Month`, `Last 3 Months`, and `All Time` horizons with unified reactive chart updates.
- **Spending Allocation Donut Chart**: Interactive Recharts pie visualization with custom glassmorphic tooltips and a high-contrast accessible table alternative.
- **6-Month Cash Flow Trends**: Grouped bar visualization tracking income vs. expenses with automated net savings velocity calculation.
- **Algorithmic Spending Insights**: Automated month-over-month pattern detection (e.g., *"You spent 18% less on Fuel, Metro & Auto compared to last month. Great job!"*).
- **Top 5 Single Expenditures**: Automated identification and ranking of the largest capital drains in any given timeframe.

### 3. Category-Level Budget Governance
- **Proportional Threshold Tracking**: Real-time spending progress bars mapped against user-defined monthly limits.
- **Dynamic Risk Indicators**: Color transitions from emerald green ($< 80\%$) to amber warning ($80\% - 100\%$) and alert crimson with an **EXCEEDED** badge ($> 100\%$).
- **Overall Budget Buffer**: At-a-glance visibility into global monthly budget utilization and remaining safety buffer.

### 4. Enterprise Data Portability & Reporting
- **RFC 4180-Compliant CSV Export**: Instant generation and download of complete transactional records with escaped comma handling.
- **Validated CSV Ingestion**: Multi-stage CSV parsing with schema verification, column mapping, row-by-row error logging, and duplicate entry detection.
- **Printable Financial Statement**: Formatted statement view optimized for desktop printing or PDF generation (`window.print()`).

---

## 🏗️ System Architecture & Technology Stack

| Layer | Technology | Rationale & Architectural Choice |
| :--- | :--- | :--- |
| **Runtime & Framework** | React 18.3 (Vite 5) | Component-driven reactivity, concurrent rendering features, instant HMR. |
| **State Management** | React Context + `useReducer` | Predictable, unidirectional data flow with zero external boilerplate libraries. |
| **Persistence** | `localStorage` + Custom Hook | Zero server overhead, absolute privacy, seamless cross-session persistence. |
| **Data Visualization** | Recharts 2.13 | Composable SVG chart primitives with responsive container calculations. |
| **Date Processing** | date-fns 3.6 | Modular, immutable, tree-shakeable date computation and formatting. |
| **Design System** | Pure CSS Variables + CSS Modules | Zero UI component runtime overhead, sub-5KB CSS footprint, dark/light themes. |
| **Test Harness** | Vitest 2.1 + React Testing Library | Blazing fast parallelized test execution in a simulated JSDOM environment. |

---

## 📁 Source Code Organization

```text
Expense Tracker with Analytics/
├── src/
│   ├── components/
│   │   ├── Analytics/
│   │   │   ├── CategoryDonutChart.jsx     # Spending breakdown donut & table view
│   │   │   ├── CSVManager.jsx             # CSV export & validated import engine
│   │   │   ├── MonthlyComparisonChart.jsx # 6-month historical cash flow bar chart
│   │   │   ├── MonthlyStatementModal.jsx  # Printable monthly financial statement
│   │   │   ├── SpendingInsights.jsx       # Month-over-month delta anomaly insights
│   │   │   └── TopExpenses.jsx            # Top 5 monthly expense ranker
│   │   ├── BudgetTracker/
│   │   │   └── BudgetTracker.jsx          # Category budget cards & progress bars
│   │   ├── common/
│   │   │   ├── Icons.jsx                  # Zero-dependency inline SVG icon library
│   │   │   ├── Modal.jsx                  # Accessible dialog with Esc & backdrop handlers
│   │   │   └── Toast.jsx                  # Floating alert toast with Undo restoration
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx              # Main dashboard overview assembler
│   │   │   ├── QuickAddBar.jsx            # 1-click transaction quick entry bar
│   │   │   └── SummaryCards.jsx           # Net balance, income, expense, savings cards
│   │   ├── Filters/
│   │   │   └── FilterBar.jsx              # Debounced search, type, and date filter bar
│   │   ├── Navbar.jsx                     # Top navigation, theme toggle, and guide modal
│   │   ├── TransactionForm/
│   │   │   └── TransactionForm.jsx        # Full transaction modal with validation & quick notes
│   │   └── TransactionList/
│   │       └── TransactionList.jsx        # Paginated transaction ledger
│   ├── context/
│   │   ├── ExpenseContext.jsx             # Unified state provider and dispatcher
│   │   ├── expenseReducer.js              # Pure reducer logic for all state mutations
│   │   └── expenseReducer.test.js         # Vitest suite for reducer actions
│   ├── data/
│   │   ├── categories.js                  # Indian category tokens, colors, and icons
│   │   └── sampleData.js                  # Multi-month realistic Indian Rupee seed data
│   ├── hooks/
│   │   ├── useDebounce.js                 # 250ms input debouncing hook
│   │   ├── useKeyboardShortcut.js         # Global hotkey listener ('N' key modal trigger)
│   │   └── useLocalStorage.js             # Safe localStorage synchronization hook
│   ├── test/
│   │   └── setup.js                       # JSDOM polyfills & matchMedia mocks
│   ├── utils/
│   │   ├── calculations.js                # Pure financial math & aggregator functions
│   │   ├── calculations.test.js           # Vitest suite for calculation utilities
│   │   ├── csv.js                         # RFC 4180 CSV export & validation parser
│   │   ├── csv.test.js                    # Vitest suite for CSV parsing
│   │   └── formatters.js                  # en-IN currency, dates, percentages
│   ├── App.jsx                            # Primary shell with routing and hotkey binding
│   ├── index.css                          # Custom CSS variables, themes, and animations
│   └── main.jsx                           # Application DOM mount
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 📊 Data Models & Schema Contracts

### Transaction Entity
```typescript
interface Transaction {
  id: string;               // Unique identifier (e.g. "tx-1711234567")
  type: "income" | "expense";
  amount: number;           // Positive numeric float in INR
  category: string;         // Mapped to Indian category taxonomy
  date: string;             // ISO 8601 UTC timestamp string
  note?: string;            // Description (max 120 chars)
  paymentMode?: "UPI" | "Cash" | "Card" | "NetBanking";
}
```

### Budget Entity
```typescript
interface Budget {
  category: string;         // Category target
  monthlyLimit: number;     // Monthly allocated limit in INR (>= 0)
}
```

---

## 🚀 Installation & Local Development

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Setup Instructions
```bash
# 1. Clone the repository
git clone https://github.com/Kalashavailable90/Expense-Tracker-with-Analytics.git

# 2. Enter project directory
cd Expense-Tracker-with-Analytics

# 3. Install dependencies
npm install

# 4. Launch local development server
npm run dev
```

The application will be accessible at `http://localhost:5173/`.

---

## 🧪 Automated Testing Suite

RupeePulse maintains a unit test suite testing pure calculation utilities, CSV validation parsers, and state reducer logic.

```bash
# Run unit test suite once
npm run test:run

# Run test suite in continuous watch mode
npm run test
```

### Test Coverage Summary:
```text
 ✓ src/context/expenseReducer.test.js  (7 tests)
 ✓ src/utils/csv.test.js               (4 tests)
 ✓ src/utils/calculations.test.js      (11 tests)

 Test Files  3 passed (3)
      Tests  22 passed (22)
   Duration  4.93s
```

---

## 🛠️ Production Build & Deployment

```bash
# Compile optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🗺️ Roadmap & Planned Enhancements

- [ ] **Multi-Account Split**: Tracking separate wallets for Bank Accounts, Cash in Hand, and Wallets.
- [ ] **Recurring Subscriptions**: Automated detection and recurring scheduling for SIPs and utility bills.
- [ ] **IndexedDB Migration**: Support for local receipt photo uploads and attachments.
- [ ] **PWA Offline Manifest**: Progressive Web App installation for full native mobile app behavior.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
