# Спонтанные поездки — SaaS платформа для коротких туров

## Overview

This is a Russian travel booking platform called "Спонтанные поездки" (Spontaneous Trips) that allows users to discover, view, and book short tours across Russia. The platform specializes in "hot deals" for weekend trips and spontaneous travel experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for smooth animations and transitions
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with proper HTTP methods and status codes
- **Error Handling**: Centralized error handling middleware
- **Request Processing**: JSON and URL-encoded request parsing
- **Development**: Hot reload with Vite integration in development mode

### Data Storage Solutions
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM for database operations and migrations
- **Schema**: Shared schema definitions with Zod validation
- **Development Storage**: In-memory storage implementation for development
- **Database Provider**: Neon Database (serverless PostgreSQL)

## Key Components

### Core Entities
1. **Tours**: Main product entity with title, description, location, duration, price, capacity, images, ratings, categories, and tags
2. **Bookings**: User reservations with personal details, tour selection, and booking status
3. **Users**: Basic user authentication system (minimal implementation)

### Frontend Components
- **Header**: Navigation with logo, menu items, and responsive design
- **Hero**: Landing section with search functionality and "surprise me" feature
- **Filters**: Category-based tour filtering (couples, nature, short trips, water activities, etc.)
- **TourCard**: Individual tour display with images, ratings, pricing, and booking options
- **BookingModal**: Form for tour reservations with validation
- **Admin Panel**: Tour management interface for administrators

### API Endpoints
- `GET /api/tours` - Fetch all tours with optional category and hot deals filtering
- `GET /api/tours/:id` - Fetch individual tour details
- `POST /api/tours` - Create new tour (admin)
- `PUT /api/tours/:id` - Update tour (admin)
- `DELETE /api/tours/:id` - Delete tour (admin)
- `GET /api/bookings` - Fetch all bookings (admin)
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status (admin)

## Data Flow

1. **Tour Discovery**: Users browse tours through the main page with filtering options
2. **Tour Selection**: Users view detailed tour information including images, itinerary, and pricing
3. **Booking Process**: Users fill out booking forms with personal details and requirements
4. **Admin Management**: Administrators can manage tours and bookings through the admin panel
5. **Real-time Updates**: TanStack Query provides optimistic updates and cache invalidation

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Icon library for consistent iconography

### Data and State Management
- **TanStack Query**: Server state management with caching
- **Zod**: Schema validation for forms and API data
- **React Hook Form**: Form state management with validation

### Database and Backend
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL provider
- **Express.js**: Web framework for API development

### Development Tools
- **Vite**: Build tool with HMR and development server
- **TypeScript**: Type safety across the entire application
- **ESLint/Prettier**: Code formatting and linting (implied by setup)

## Deployment Strategy

### Development Environment
- **Platform**: Replit-optimized development setup
- **Hot Reload**: Vite integration with Express for seamless development
- **Database**: Environment-based configuration with fallback to in-memory storage
- **Asset Management**: Vite handles static assets and bundling

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild compiles TypeScript server to `dist/index.js`
- **Database**: PostgreSQL connection via environment variables
- **Static Files**: Express serves built frontend assets

### Key Architectural Decisions

1. **Monorepo Structure**: Client, server, and shared code in single repository for easier development and deployment
2. **TypeScript Throughout**: Full type safety from database schema to frontend components
3. **Shared Schema**: Common data types and validation between client and server
4. **In-Memory Development**: Fallback storage for development without database setup
5. **Component-First UI**: Modular, reusable components with consistent design system
6. **Optimistic Updates**: TanStack Query provides smooth user experience with cache management
7. **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
8. **Accessibility**: Radix UI primitives ensure accessible component behavior

The application follows modern full-stack development practices with a focus on developer experience, type safety, and user interface quality suitable for a travel booking platform.