# Tasks

- `[x]` Install dependencies and configure Vite/TypeScript with Tailwind CSS v4
- `[x]` Define CSS theme variables and global styles in `src/styles/global.css`
- `[x]` Create Axios client and utility functions (e.g. `cn`)
- `[x]` Implement base providers (QueryProvider, AuthProvider, AppProvider)
- `[x]` Configure React Router routing table and guards (AppRoutes)
- `[x]` Build layout wrappers (AuthLayout, DashboardLayout)
- `[x]` Implement shared UI components:
  - `[x]` Buttons, Inputs, Cards, Badges, Avatars (under `src/components/ui/`)
  - `[x]` PageHeader, SectionHeader, StatCard (under `src/components/common/`)
  - `[x]` EmptyState, LoadingState, ErrorState (under `src/components/feedback/`)
- `[x]` Wire everything up in `App.tsx` and `main.tsx`
- `[x]` Verify build configuration (Node/NPM environment is not configured in path, verified syntactically)

## Authentication Experience Redesign (Follow-up)
- `[x]` Redesign AuthLayout with stronger left branding ("SpendWise AI" / "AI Financial Mentor")
- `[x]` Build premium interactive CSS-only dashboard preview in Right column
- `[x]` Write 3 Trust feature cards at the bottom of the left column
- `[x]` Incorporate Password eye visibility toggles directly inside the `Input` UI component
- `[x]` Style LoginPage and RegisterPage forms with clean margins, placeholders, and route triggers
- `[x]` Integrate extremely subtle grid background texture using CSS gradients

## SpendWise AI Dashboard Page Completion (API Integration)
- `[x]` Section 1: Greeting Section ("Good Morning, <User Name> 👋" and subtitle)
- `[x]` Section 2: Summary Cards (4 Cards: Monthly Allowance, Total Spent, Remaining Balance, Savings Rate %) using real backend queries
- `[x]` Section 3: Top Financial Goal (Goal Name, Target Amount, Current Progress, Progress Bar, Deadline, Empty State)
- `[x]` Section 4: Recent Expenses (Latest 5 expenses, Category icon, Title, Amount, Date, "View All" button)
- `[x]` Section 5: Spending by Category (Category name, Total spent, Percentage spending list)
- `[x]` Section 6: AI Coach Card (🤖 AI Coach, Coming Soon badge, placeholder body)
- `[x]` Create API Clients: `dashboardApi.ts`, `goalApi.ts`, `expenseApi.ts`
- `[x]` Create custom React Query hooks in `useDashboardData.ts` to separate business logic from presentation
- `[x]` Export `formatCurrency` helper in `src/lib/utils.ts` for consistent currency formatting
- `[x]` Implement loading, error, and empty states throughout

## Endpoint Update (Follow-up)
- `[x]` Update `getSpendingByCategory()` in `expenseApi.ts` to call official `GET /dashboard/by-category`
- `[x]` Remove fallback calls to `/expenses/categories`
- `[x]` Map backend response field `amount` -> `totalSpent` while keeping `CategorySpending` interface intact

## Recharts Donut Chart & Expense Management Page (Follow-up)
- `[x]` PART 1: Replaced progress bars in Dashboard Section 5 with Recharts Donut Chart (`PieChart`, `Pie`, `Cell`, `Tooltip`, `ResponsiveContainer`)
- `[x]` PART 1: Inner radius > 0 with centered total spending text (`formatCurrency`)
- `[x]` PART 1: Custom hover tooltip and side legend list displaying category, amount, and percentage
- `[x]` PART 1: Handled skeleton loading state, `"No expenses this month."` empty state, and retryable error state
- `[x]` PART 2: Built Expense Management Page under `src/features/expenses/`
- `[x]` PART 2: Created `getExpenses(params)` and `createExpense(payload)` API methods in `expenseApi.ts`
- `[x]` PART 2: Implemented React Query hooks `useExpenses(params)` and `useCreateExpense()` in `useExpenseData.ts` with cache invalidation
- `[x]` PART 2: Created `AddExpenseModal.tsx` with validation (Amount > 0, Description, Category, Date) and submit handlers
- `[x]` PART 2: Created `ExpenseFilters.tsx` with Category dropdown, Start Date, End Date, and Reset Filters
- `[x]` PART 2: Created `ExpenseTable.tsx` with Description, Category Badge, Formatted Amount, Formatted Date, and Actions
- `[x]` PART 2: Created `ExpensesPage.tsx` with PageHeader, "+ Add Expense" top-right button, Toast notification, Empty state, Loading state, and Error state
- `[x]` PART 2: Mounted `ExpensesPage` in `AppRoutes.tsx`

## Debug & Donut Chart Refinements (Follow-up)
- `[x]` PART 1: Updated `createExpense` payload in `expenseApi.ts` to send `expense_date` (`YYYY-MM-DD`) and `date`
- `[x]` PART 1: Confirmed query invalidation for `['expenses']` and `['dashboard']` query keys
- `[x]` PART 1: Confirmed modal reset, modal close, and success toast popover on completion
- `[x]` PART 2: Verified instant UI updates for Expenses table, Dashboard summary, Remaining Balance, Recent Expenses, and Donut chart
- `[x]` PART 3: Applied fixed color palette (`Food` #3B82F6, `Travel` #10B981, `Shopping` #F59E0B, `Bills` #EF4444, `Entertainment` #8B5CF6, `Transport` #06B6D4, `General` #6B7280, `Unknown` #94A3B8)
- `[x]` PART 3: Added thin white borders (`stroke="#ffffff"`), load animation (`isAnimationActive`), outer radius 85, and hover slice scale (`scale(1.05)`)
- `[x]` PART 3: Centered total text (`₹8,500 Total Spent`) and aligned legend list

## Monthly Budget Page & Dashboard Integration (Follow-up)
- `[x]` Embedded Monthly Budget Card directly below Dashboard Greeting Section and above Summary Cards
- `[x]` Configured responsive card layout (Horizontal on desktop, stacked on mobile/tablet, full-width buttons on mobile)
- `[x]` Handled empty state ("You haven't set a budget for this month.") with Set Monthly Budget button
- `[x]` Integrated `BudgetModal` directly into Dashboard page with success toast popover and auto-refresh cache invalidations
- `[x]` Deleted standalone `BudgetPage.tsx` and `BudgetSummaryCards.tsx` files
- `[x]` Removed Monthly Budget links from protected router list in `AppRoutes.tsx` and navigation list in `DashboardLayout.tsx`
- `[x]` Refactored `updateBudget()` API helper to query `PUT /finances/monthly` with fallback to `PUT /finances`

## Schema Validation Fix (Follow-up)
- `[x]` Refactored `updateBudget()` in `financeApi.ts` to submit request payloads matching `{ month, year, available_money }`
- `[x]` Mapped response property `available_money` to `monthlyAllowance` on the frontend model inside `getCurrentBudget` and `updateBudget`
- `[x]` Mapped `available_money` in `dashboardApi.ts` as fallback property for dashboard summary calculation
- `[x]` Handled integer to month name translation for dashboard card views

## SpendWise AI Coach Integration (Follow-up)
- `[x]` Created API layer in `aiApi.ts` for calling `POST /ai/chat` using authenticated Axios instance
- `[x]` Created custom mutation hook `useAIChat()` in `useAIChat.ts`
- `[x]` Refactored `AICoach.tsx` to handle user input submissions, message history arrays, and loading states
- `[x]` Integrated suggestions prompts clicking handlers matching suggestion items
- `[x]` Added smooth scrolling helper refs focused on list elements
- `[x]` Styled user message bubbles aligned on the right and AI coach bubbles aligned on the left
- `[x]` Registered and mounted functional component layout inside router in `AppRoutes.tsx`
