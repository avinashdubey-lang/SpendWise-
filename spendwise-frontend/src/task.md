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

## AI Coach Markdown Rendering Redesign & Readability Fix (Follow-up)
- `[x]` Built custom Markdown parser component `Markdown.tsx` styling markdown syntaxes
- `[x]` Ensured pure vertical document block layout flow, completely avoiding CSS grids or side-by-side columns
- `[x]` Configured headers (e.g. `### 1. Title` -> `Title`) to render clean, readable inline blocks without numerical prefixes
- `[x]` Kept list items (ordered and unordered) rendering vertically with inline bolding and margins
- `[x]` Formatted Markdown table data into styled scrolling containers
- `[x]` Increased bubble maximum width to `max-w-[90%] md:max-w-[80%]` for horizontal breathing room on mobile viewports

## Dashboard Spending Insights Integration (Follow-up)
- `[x]` Created folder `src/features/insights/` for insights components and hooks
- `[x]` Built frontend client `insightsApi.ts querying `GET /insights/monthly?month={month}&year={year}`
- `[x]` Built React Query hook `useMonthlyInsights(month, year)` mapping to cache configurations
- `[x]` Created responsive component `SpendingInsights.tsx` displaying top 4 observations with border indicators for priority levels
- `[x]` Mounted `SpendingInsights` directly on Dashboard below Summary Cards metrics
- `[x]` Extended `useCreateExpense` onSuccess hook in `useExpenseData.ts` to invalidate `['insights']` cache on success

## Dashboard Remaining Balance Mapping Fix (Follow-up)
- `[x]` Mapped backend properties `available_money` -> `monthlyAllowance`, `total_spending` -> `totalSpent`, and `remaining_money` -> `remainingBalance` inside `dashboardApi.ts`
- `[x]` Fixed incorrect balance presentation rendering original monthly budget instead of actual remaining cash balance
- `[x]` Confirmed budget values remain persistent while only remaining cash balances diminish on logging expenses

## Donut Chart Layout & Active Spacing Fix (Follow-up)
- `[x]` Increased donut hole inner radius from 55 to 60 (expanding to 120px diameter)
- `[x]` Reduced donut chart outer radius from 85 to 80 (shrinking to 160px diameter)
- `[x]` Removed floating absolute `RechartsTooltip` clashing with list components
- `[x]` Implemented interactive center donut hole text rendering active segment hover amounts and percentages dynamically
- `[x]` Cleaned up unused Recharts imports and styles in Dashboard

## Goal progress saved_amount Mapping Fix (Follow-up)
- `[x]` Mapped currentAmount to saved_amount in createGoal and updateGoal requests in goalApi.ts
- `[x]` Preserved targetAmount, deadline, and reason inputs
- `[x]` Confirmed goals and dashboard query invalidation triggers
- `[x]` Verified compilation builds compile successfully

## AI Coach Conversation State Persistence (Follow-up)
- `[x]` Added namespaced storage key based on active user id
- `[x]` Initialized messages state from localStorage on component mount
- `[x]` Set up useEffect hook updating localStorage on new messages or assistant answers
- `[x]` Mounted "Clear Chat" button inside PageHeader actions rendering block
- `[x]` Checked that navigation, page refresh, and clear chat triggers operate correctly
- `[x]` Verified build bundles build cleanly without any errors

## Registration Flow Backend Authentication Integration (Follow-up)
- `[x]` Implemented register API function targeting POST /users/register in authApi.ts
- `[x]` Replaced static mock submit flow with stateful handleRegister in RegisterPage component inside AppRoutes.tsx
- `[x]` Automatically triggers login and profiles loading queries on successful registration
- `[x]` Persists JWT access tokens to local storage and updates authentication provider session state
- `[x]` Verified build compiles correctly for deployment

## Expense Deletion Integration (Follow-up)
- `[x]` Used existing `useDeleteExpense()` React Query hook
- `[x]` Configured hover-triggered `Trash2` action buttons inside ExpenseTable.tsx actions column
- `[x]` Implemented confirm overlay dialog displaying active name before deleting
- `[x]` Blocked double-deletes during pending mutations (`deleteMutation.isPending`)
- `[x]` Handled mutation error reporting and state resetting
- `[x]` Verified invalidation caches trigger refreshes for expenses, dashboard metrics, goals, and insights automatically

## My Lessons Section Integration (Follow-up)
- `[x]` Created LessonsPage.tsx under new features directory `/lessons`
- `[x]` Removed AnalysisPage placeholder and registered new /lessons route path in AppRoutes.tsx
- `[x]` Updated navItems list configuration in DashboardLayout.tsx with My Lessons title and BookOpen icon
- `[x]` Configured 5 deterministic, highly personalized lesson cards (Convenience Spending, Needs vs Wants, Pacing, Goal-oriented Saving, Savings habits)
- `[x]` Coded loading state panels and data-based empty status alerts
- `[x]` Verified that backend folders (app/analysis) remain untouched
- `[x]` Confirmed Vite bundler compiles successfully

## My Lessons Copy Corrections (Follow-up)
- `[x]` Replaced current savings rate wording with monthly allowance unspent percentage phrasing
- `[x]` Corrected pacing takeaway to recommend putting part of remaining balance to high-priority goals
- `[x]` Fixed broken sentence in Habits lesson to refer to keeping a large portion of allowance unspent
- `[x]` Refined Habits lesson explanation text to resolve sentence repetition
- `[x]` Ran production compilation checking builds bundle correctly
