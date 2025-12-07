# Level Up - Challenge-Based Social App

## Overview

Level Up is a gamified social platform where users compete in challenges, vote on submissions, and earn coins and XP. The application features a dark-first design with vibrant gradients and gaming-inspired UI elements to drive engagement and competition.

The platform is built as a full-stack TypeScript application with a React frontend and Express backend, designed to scale with database-backed persistence and session management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Rendering**
- React 18+ with TypeScript for type safety
- Client-side rendering (CSR) architecture - no server-side rendering
- Vite as the build tool and development server
- Wouter for lightweight client-side routing

**UI Component Strategy**
- shadcn/ui component library (New York style variant) providing pre-built, accessible components
- Radix UI primitives for complex interactive components (dialogs, dropdowns, tooltips, etc.)
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management

**Design System**
- Dark-first theme matching the Level Up flame logo colors
- Gradient palette: Cyan (#00d4ff), Blue (#6366f1), Purple (#a855f7), Magenta (#ec4899), Orange (#f97316)
- Page background: Deep purple gradient (radial from #1a0a2e → #0d0518 → #050509)
- Custom color system using HSL variables for theme flexibility
- Gaming/social platform aesthetic with energetic gradients and dark mode focus
- System font stack prioritizing SF Pro Text and native system fonts
- 8px-based spacing scale using Tailwind utilities

**State Management**
- TanStack Query (React Query) for server state, data fetching, and caching
- React Hook Form with Zod resolvers for form validation
- Local component state via React hooks

**Key Frontend Patterns**
- Mobile-first responsive design with breakpoint at 768px
- Accessibility-first components via Radix UI
- Toast notifications for user feedback
- Custom hooks for reusable logic (use-mobile, use-toast)

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and routing
- Node.js HTTP module wrapping Express for WebSocket support capability
- TypeScript throughout for type safety

**API Design**
- RESTful API conventions with `/api` prefix for all endpoints
- JSON request/response format
- Centralized error handling and logging middleware
- Request timing and logging for all API calls

**Database Layer**
- PostgreSQL as the primary database
- Drizzle ORM for type-safe database queries and schema management
- Schema-first approach with migrations stored in `/migrations`
- Shared schema definitions between client and server (`shared/schema.ts`)

**Current Schema**
- Users table with UUID primary keys, username/password authentication
- Extensible schema design ready for challenges, votes, coins, XP, and other gamification features

**Session & Authentication**
- Express session management with connect-pg-simple for PostgreSQL session store
- Session-based authentication (not JWT-based)
- Credentials included in fetch requests for cookie handling

**Development vs Production**
- In-memory storage fallback (`MemStorage`) for development without database
- Vite dev server integration with HMR (Hot Module Replacement)
- Production builds bundle server code with esbuild
- Selective dependency bundling to optimize cold start times

### Build & Deployment

**Build Pipeline**
- Client: Vite builds React app to `dist/public`
- Server: esbuild bundles server to single `dist/index.cjs` file
- Allowlist of dependencies to bundle (reduces syscalls, improves cold starts)
- TypeScript compilation checking via `tsc --noEmit`

**Development Workflow**
- `npm run dev` - runs development server with Vite HMR and live reload
- `npm run build` - production build for both client and server
- `npm run start` - runs production server from dist
- `npm run db:push` - pushes Drizzle schema changes to database

**Environment Configuration**
- `DATABASE_URL` required for PostgreSQL connection
- Node environment detection (`NODE_ENV`) for dev vs production behavior
- Replit-specific integrations for cartographer and dev banner in development

## External Dependencies

### UI & Component Libraries
- **shadcn/ui**: Pre-built accessible component library
- **Radix UI**: Unstyled, accessible component primitives (20+ components)
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Carousel/slider component
- **cmdk**: Command palette component

### Data & Forms
- **TanStack Query**: Server state management and data fetching
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation library
- **Drizzle Zod**: Integration between Drizzle ORM and Zod schemas

### Backend Services
- **Express**: Web server framework
- **Drizzle ORM**: Type-safe PostgreSQL ORM
- **PostgreSQL**: Primary relational database
- **connect-pg-simple**: PostgreSQL session store for Express
- **pg**: PostgreSQL client library

### Development Tools
- **Vite**: Build tool and dev server
- **esbuild**: Fast JavaScript bundler for server build
- **TypeScript**: Type system for JavaScript
- **Replit Plugins**: Development environment integrations (cartographer, dev banner, runtime error modal)

### Routing & Navigation
- **Wouter**: Lightweight client-side router (alternative to React Router)

### Utilities
- **date-fns**: Date manipulation library
- **nanoid**: Unique ID generation
- **clsx & tailwind-merge**: Conditional className utilities
- **class-variance-authority**: Component variant management