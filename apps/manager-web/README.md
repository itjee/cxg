# CXG Manager Web

AI-Powered Business Support Platform - Manager Interface

## Overview

This is the manager web application for the CXG Platform. It provides an admin interface inspired by Grafana's design system for managing tenants, infrastructure, and analytics.

## Features

- **Grafana-Inspired Design**: Clean, modern dashboard with collapsible sidebar
- **Dark/Light Theme**: Full theme support with system preference detection
- **Dashboard**: Real-time metrics and system overview
- **Tenant Management**: CRUD operations for managing platform tenants
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Type-Safe**: Full TypeScript support with strict mode

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand + TanStack Query
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm 8.15.0 or later

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server on port 8200
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Variables

Create a `.env.local` file:

```bash
# API endpoint
NEXT_PUBLIC_API_URL=http://localhost:8100/api/v1

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
```

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (main)/              # Main app route group
│   │   ├── dashboard/       # Dashboard page
│   │   ├── tenants/         # Tenant management
│   │   └── layout.tsx       # Main layout wrapper
│   └── layout.tsx           # Root layout with providers
├── components/
│   ├── layout/              # Layout components (Sidebar, Header)
│   └── ui/                  # shadcn/ui components
├── features/                # Feature modules
│   ├── dashboard/           # Dashboard components
│   └── tenant/              # Tenant management
├── lib/                     # Utilities and providers
└── types/                   # TypeScript types
```

## Pages

### Dashboard (`/dashboard`)
- System metrics overview
- Activity feed
- Performance charts
- System alerts

### Tenants (`/tenants`)
- Tenant list with filters
- CRUD operations
- Status and tier management

## Development Guidelines

Follow the project conventions defined in:
- [Frontend Guide](../../docs/07-FRONTEND-GUIDE.md)
- [Naming Conventions](../../docs/05-NAMING-CONVENTIONS.md)
- [API Specification](../../docs/09-API-SPECIFICATION.md)

## License

Proprietary - All rights reserved
