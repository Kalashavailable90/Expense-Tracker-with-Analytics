# RupeePulse

RupeePulse is an expense tracker I built to keep everyday money tracking simple. Add income and expenses, set monthly budgets, and see where your money is going—all in one place, using Indian Rupees (₹).

**Try it:** [Open RupeePulse](https://kalashavailable90.github.io/Expense-Tracker-with-Analytics/)

**Source code:** [GitHub repository](https://github.com/Kalashavailable90/Expense-Tracker-with-Analytics)

## What it can do

- Add, edit, search, filter, and delete income and expense transactions.
- See a dashboard with your balance, income, expenses, and savings.
- Set category budgets and keep an eye on how much you have left.
- Explore spending by category and compare monthly activity.
- Get a quick look at spending insights and your largest expenses.
- Import and export transactions as CSV.
- View and print a monthly statement.
- Switch between dark and light themes.

The app starts with sample transactions so you can explore the dashboard. You can clear the sample data and enter your own.

## Your data

Transactions, budgets, and theme settings are saved in your browser's `localStorage`. The app does not need an account or its own application server. Your data stays in that browser, so it won't automatically follow you to another device or browser. Export your transactions as a CSV if you want to keep a separate copy.

## Run it locally

You'll need Node.js and npm installed.

```bash
git clone https://github.com/Kalashavailable90/Expense-Tracker-with-Analytics.git
cd Expense-Tracker-with-Analytics
npm ci
npm run dev
```

Open the local address printed by Vite (usually `http://localhost:5173`).

## Useful commands

```bash
npm run dev       # Start the local development server
npm run build     # Create a production build in dist/
npm run preview   # Preview the production build locally
npm run test:run  # Run the tests once
npm run test      # Run the tests in watch mode
```

## Built with

- React
- Vite
- Recharts
- date-fns
- Vitest and React Testing Library

## Deployment

The live site is hosted with GitHub Pages. Pushing changes to `main` runs the GitHub Actions workflow, which builds and deploys the site.
