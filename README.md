# ConexGrow by CXG

**AI-powered business support platform for small and medium-sized companies**

ConexGrow is a comprehensive multi-tenant SaaS solution designed to help companies under 50 employees integrate and automate their business operations.

## 🚀 Quick Start

### For New Developers
```bash
# 1. Read the quick start guide
cat docs/01_onboarding/QUICK_START.md

# 2. Set up your environment
cd apps/backend-api
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e ".[dev]"

# 3. Start development
pnpm dev
```

### For Understanding the Project
Start with our comprehensive documentation structure:
- **📖 [Documentation Guide](docs/README_MAIN.md)** - Navigate all project documentation
- **🚀 [Quick Start](docs/01_onboarding/QUICK_START.md)** - Set up development environment (5 min)
- **🏗️ [Architecture](docs/02_architecture/PROJECT_MANIFEST.md)** - Understand system design
- **🔑 [Quick Commands](docs/07_references/README.md)** - Common commands reference

## 📚 Documentation

All documentation is organized in the `docs/` folder with the following structure:

| Section | Purpose |
|---------|---------|
| **01_onboarding** | Getting started guide for new developers |
| **02_architecture** | System design and project structure |
| **03_database** | DDL, schemas, and migration guides |
| **04_api** | API development and authentication |
| **05_frontend** | Next.js frontend applications |
| **06_deployment** | Deployment strategies and operations |
| **07_references** | Quick reference guides and utilities |
| **implementation** | Implementation details and completed work records |

### 📖 Quick Links
- 👉 **[Start here](docs/README_MAIN.md)**: Main documentation entry point
- 🚀 **[Quick Start](docs/01_onboarding/QUICK_START.md)**: Setup in 5 minutes
- 📋 **[Documentation Guidelines](docs/DOCUMENTATION_GUIDELINES.md)**: How to write/manage docs
- 🎯 **[Management Policy](DOCUMENTATION_MANAGEMENT.md)**: Documentation management system

## 🏢 Project Structure

```
ConexGrow/
├── apps/
│   ├── backend-api/          # FastAPI backend (Python)
│   ├── manager-web/          # Manager dashboard (Next.js)
│   └── tenants-web/          # Tenant workspace (Next.js)
├── packages/
│   ├── database/             # Database schemas and migrations
│   ├── ui-components/        # Shared React components
│   └── shared-types/         # TypeScript type definitions
├── docs/                      # Comprehensive documentation
└── scripts/                   # Development and utility scripts
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL 15+ with dual-database architecture
- **ORM**: SQLAlchemy 2.0+
- **Auth**: JWT with role-based access control (RBAC)
- **Cache**: Redis
- **AI/ML**: OpenAI API, LangChain

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI**: React 19 + Tailwind CSS
- **Components**: shadcn/ui
- **State**: Zustand
- **Data Fetching**: TanStack Query

## 🏗️ Architecture Highlights

### Dual-Database Pattern
- **Manager Database**: Service provider operations (tenant management, billing)
- **Tenant Database**: Client operations (ERP, CRM, SCM, WMS, workflows)

### Multi-Tenant SaaS
- Complete tenant isolation
- Separate authentication/authorization per tenant
- Scalable role-based permission system

### RBAC (Role-Based Access Control)
- Role hierarchy with categories and levels
- Multiple role support per user
- Permission conflict resolution strategies

## 🚀 Development Commands

### Root Commands (Turborepo)
```bash
pnpm dev          # Run all applications
pnpm build        # Build all applications
pnpm lint         # Lint all code
pnpm test         # Run all tests
pnpm clean        # Clean build artifacts
```

### Backend
```bash
cd apps/backend-api

# Setup
uv venv
source .venv/bin/activate
uv pip install -e ".[dev]"

# Development
uvicorn api.main:app --reload

# Quality checks
black .                # Format code
ruff check .          # Lint code
mypy src/             # Type checking

# Tests
pytest                # Run all tests
pytest --cov          # With coverage
```

### Frontend
```bash
cd apps/manager-web   # or apps/tenants-web

pnpm dev              # Start development server
pnpm build            # Production build
pnpm start            # Start production server
```

## 🔐 Key Features

- ✅ **Multi-tenant SaaS architecture** - Complete tenant isolation
- ✅ **ERP/CRM/SCM/WMS integration** - Unified workspace
- ✅ **Workflow automation** - Business process management
- ✅ **Advanced RBAC** - Granular permission control
- ✅ **AI capabilities** - Integrated AI agents and tools
- ✅ **Real-time updates** - WebSocket support
- ✅ **Analytics/BI** - Business intelligence dashboard

## 📋 Environment Variables

Create `.env` file in `apps/backend-api/`:

```bash
# Databases (dual-database pattern)
DATABASE_URL=postgresql://user:pass@localhost:5432/tnnt_db
MGMT_DATABASE_URL=postgresql://user:pass@localhost:5432/mgmt_db

# Redis
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256

# API Keys
OPENAI_API_KEY=sk-...

# Server
API_HOST=0.0.0.0
API_PORT=8100
```

See `apps/backend-api/.env.example` for full reference.

## 🧪 Testing

### Backend
```bash
cd apps/backend-api
pytest                           # All tests
pytest tests/unit/               # Unit tests only
pytest -k test_name              # Specific test
pytest --asyncio-mode=auto       # With async support
pytest --cov                     # With coverage report
```

## 📚 Documentation Standards

All implementation changes are documented in `docs/implementation/`. See [DOCUMENTATION_STRUCTURE.md](DOCUMENTATION_STRUCTURE.md) for details.

## 🤝 Contributing

When contributing:
1. Follow code style guidelines (black, ruff, mypy for backend)
2. Write tests for new functionality
3. Document significant changes in `docs/implementation/`
4. Use conventional commit messages
5. Create detailed pull requests

## 🚨 Common Issues

See [docs/07_references/README.md](docs/07_references/README.md) for troubleshooting and frequently asked questions.

## 📞 Support

- 📖 **Documentation**: [docs/README_MAIN.md](docs/README_MAIN.md)
- 🐛 **Issues**: Report via GitHub Issues
- 💬 **Questions**: Team Slack channel
- 🔍 **Code Search**: Use `docs/07_references/README.md` for quick lookups

## 📄 License

All rights reserved - CXG

---

**Last Updated**: 2025-10-27

**For complete documentation, please visit**: [docs/README_MAIN.md](docs/README_MAIN.md)

Happy Coding! 🎉
