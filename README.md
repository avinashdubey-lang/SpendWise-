# SpendWise AI 💸
### AI-Powered Personal Finance Management for Smarter Spending

SpendWise AI is a full-stack personal finance application that helps users track expenses, manage monthly budgets, set savings goals, and understand their spending habits through AI-powered financial insights.

Built with **React, TypeScript, FastAPI, PostgreSQL, and Google Gemini**, SpendWise AI combines structured financial tracking with an interactive AI Coach to make personal finance management more intuitive and actionable.

---

## ✨ Features

- **📊 Financial Dashboard** — View financial summaries, recent transactions, budget progress, and spending breakdowns in one place.
- **💳 Expense Management** — Create, view, update, and delete expenses, with support for filtering and categorization.
- **🎯 Savings Goals** — Create financial goals and track progress using saved amounts and target values.
- **📅 Monthly Budget Management** — Set and review monthly financial budgets.
- **📈 Spending Insights** — Analyze monthly spending patterns and category-level expenses.
- **🤖 AI Financial Coach** — Interact with an AI-powered assistant for personalized spending guidance and financial insights.
- **🔐 Authentication** — Secure user authentication using JWT-based access tokens and password hashing.
- **🗄️ Persistent Storage** — Store financial data in PostgreSQL through SQLAlchemy.
- **🔄 REST API** — A FastAPI backend with documented endpoints and structured request validation.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Routing & Data Fetching | React Router, TanStack Query |
| HTTP Client | Axios |
| Visualization | Recharts |
| Backend | Python, FastAPI, Uvicorn |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Data Validation | Pydantic |
| Authentication | JWT, password hashing |
| Database Migrations | Alembic |
| AI Integration | Google Gemini API |
| Deployment | Render, Vercel |

---

## 🏗️ Architecture

SpendWise AI follows a frontend–backend architecture in which the React client communicates with a FastAPI REST API. The backend handles authentication, business logic, database operations, financial analysis, and AI integration.

```text
┌─────────────────────────────┐
│     React + TypeScript      │
│       Frontend (Vite)       │
└──────────────┬──────────────┘
               │
               │ HTTP / REST API
               ▼
┌─────────────────────────────┐
│          FastAPI            │
│                             │
│  Authentication             │
│  Expense Management         │
│  Budget & Goal Management   │
│  Financial Analysis         │
│  AI Coach Integration       │
└──────────────┬──────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
┌──────────────┐ ┌────────────────┐
│ PostgreSQL   │ │ Google Gemini  │
│ + SQLAlchemy │ │ AI Integration│
└──────────────┘ └────────────────┘
```

### How it works

1. Users interact with the frontend to manage expenses, budgets, and goals.
2. The frontend sends HTTP requests to the FastAPI backend.
3. The backend validates requests, enforces authentication, and executes application logic.
4. SQLAlchemy interacts with PostgreSQL to persist and retrieve financial records.
5. Financial analysis endpoints generate spending insights, while the AI Coach integrates with Google Gemini.

---

## 📁 Project Structure

```text
SpendWise-/
├── spendwise-backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routes/
│   │   └── ...
│   ├── alembic/
│   ├── requirements.txt
│   └── ...
│
├── spendwise-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md
```

*Note: The directory names above describe the high-level organization. Adjust the internal paths to match your actual repository.*

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.11 or another Python version compatible with your dependencies
- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/avinashdubey-lang/SpendWise-.git
cd SpendWise-
```

### 2. Set up the backend

Navigate to the backend directory:

```bash
cd spendwise-backend
```

Create and activate a virtual environment.

**Windows PowerShell**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file inside `spendwise-backend/`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/spendwise
GEMINI_API_KEY=your_gemini_api_key
```

Replace the database credentials and API key with your own values.

Ensure PostgreSQL is running and the database exists before starting the backend.

**Security:** Never commit your `.env` file, database credentials, or API keys to Git.

### 4. Run database migrations

If the repository's Alembic migration history has been verified and is ready for a fresh database, run:

```bash
alembic upgrade head
```

This applies the database schema migrations.

If migrations fail on a fresh database, fix and verify the migration history before proceeding. Do not assume the existing local database schema is automatically reproduced by the migrations.

### 5. Start the backend

From `spendwise-backend/`, run:

```bash
uvicorn app.main:app --reload
```

The backend should be available at:

- API base: `http://127.0.0.1:8000`
- Interactive API documentation: `http://127.0.0.1:8000/docs`
- Alternative API documentation: `http://127.0.0.1:8000/redoc`

### 6. Set up the frontend

Open a **second terminal** from the repository root:

```bash
cd spendwise-frontend
npm install
```

Create the frontend environment file if your API client uses an environment variable such as `VITE_API_BASE_URL`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Make sure the variable name matches the one actually used by your frontend code.

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

`http://localhost:5173`

---

## 🔑 Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `GEMINI_API_KEY` | API key for Google Gemini |
| `VITE_API_BASE_URL` | Backend API URL used by the frontend, if configured in the application |

Keep secrets on the backend. Only expose frontend environment variables that are intended to be public; Vite variables prefixed with `VITE_` are bundled into client-side code.

---

## 🌐 API Overview

The backend exposes REST endpoints for the application's core functionality.

| Domain | Functionality |
|---|---|
| Authentication | User registration, login, and token-based access |
| Expenses | Create, retrieve, update, delete, and filter expenses |
| Budgets | Set and retrieve monthly financial budgets |
| Financial Analysis | Retrieve monthly financial analysis |
| Spending Insights | Generate spending summaries and insights |
| Goals | Create and manage savings goals |
| AI Coach | Generate AI-powered financial guidance |

Explore the running API's `/docs` page for the actual routes, request schemas, and response formats.

---

## 🔒 Security Considerations

- Passwords should be stored as hashes, never as plaintext.
- Protected endpoints should validate JWTs and enforce user-level authorization.
- API keys and database credentials should be stored in environment variables.
- User-owned financial records must be scoped to the authenticated user.
- Production deployments should use HTTPS and appropriately configured CORS.
- Financial recommendations generated by AI should be treated as informational guidance, not guaranteed financial outcomes.

---

## 🧪 Testing & Validation

Before deploying a release, verify:

- Registration and login flows.
- Access control for protected endpoints.
- Expense CRUD operations and filtering.
- Budget creation and monthly retrieval.
- Savings goal creation and progress updates.
- Financial analysis and spending insights.
- AI Coach responses and provider failure handling.
- Database migrations against a fresh database.
- Frontend-to-backend integration.
- Empty states, invalid input, and API error handling.

Automated test coverage should be documented here once the test suite has been implemented and verified.

---

## 🚢 Deployment

The application can be deployed as separate frontend and backend services.

- **Frontend:** Deploy `spendwise-frontend/` to Vercel.
- **Backend:** Deploy `spendwise-backend/` to Render.
- **Database:** Configure a PostgreSQL instance and provide its connection string through `DATABASE_URL`.

For production, configure the frontend to use the deployed backend URL, restrict CORS to the intended frontend origin, and ensure database migrations are applied safely before the application serves requests.

Add the live application and API documentation URLs here once they are publicly accessible.

- **Live Demo:** _Add deployment URL_
- **API Documentation:** _Add deployed `/docs` URL_

---

## 🧠 Engineering Highlights

SpendWise AI was built to explore practical full-stack engineering concepts, including:

- Designing REST APIs with FastAPI.
- Modeling relational financial data with PostgreSQL and SQLAlchemy.
- Implementing JWT-based authentication.
- Managing database schema changes with Alembic.
- Connecting a React frontend to backend services.
- Building financial summaries and category-level spending analysis.
- Integrating a third-party generative AI provider.
- Debugging frontend data mapping, database migration, and API integration issues.
- Managing environment-specific configuration for local development and deployment.

---

## 🗺️ Future Improvements

Potential areas for continued development include:

- Automated backend tests with pytest.
- More robust CI/CD and migration validation.
- Recurring expenses and transaction import.
- Advanced budgeting and savings analytics.
- Exportable financial reports.
- Improved AI response evaluation and graceful fallback behavior.
- Rate limiting, monitoring, and structured production logging.

---

## 👨‍💻 Author

**Avinash Dubey**

B.Tech Computer Science student interested in full-stack development, backend engineering, and building practical software products.

- GitHub: [avinashdubey-lang](https://github.com/avinashdubey-lang)
- Project Repository: [SpendWise AI](https://github.com/avinashdubey-lang/SpendWise-)

---

## 📄 License

Add a license before distributing this project. Until a license is included in the repository, reuse and redistribution are not explicitly granted.

---

*SpendWise AI — understand your spending, plan your budget, and make more informed financial decisions.*

