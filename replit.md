# Пикми трип — SaaS платформа для спонтанных поездок

## Overview

This is a Russian travel booking platform called "Пикми трип" (Pickme Trip) that allows users to discover, view, and book short tours across Russia. The platform specializes in "hot deals" for weekend trips and spontaneous travel experiences. The platform now includes user authentication with two types of users: travelers and travel agencies, each with their own personal dashboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Migration to Replit Environment Complete (January 2025)
- **Migration Completed**: Successfully migrated from Replit Agent to standard Replit environment
- **Full Database Migration**: Successfully migrated to Supabase PostgreSQL database
- **Automatic Table Creation**: Database tables created programmatically on startup
- **Google OAuth Setup**: Configured Google authentication with proper redirect URI
- **Session Management**: Supabase-backed session storage for authentication
- **Data Integrity**: Removed all in-memory storage fallbacks - 100% Supabase
- **Sample Data**: Automatic insertion of sample tours on first run
- **Clean Architecture**: Removed duplicate storage files and legacy code
- **React Hooks Fix**: Fixed TooltipProvider import issues causing React hook errors
- **Google OAuth Ready**: Authentication system ready for Google OAuth credentials
- **Google OAuth Configured**: Added GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, fully functional
- **Supabase Auth Integration**: Migrated from Express sessions to full Supabase Auth system
- **Unified Authentication**: All user data and authentication now managed through Supabase

## Recent Changes

### Advanced Location Filtering & Enhanced Search System (January 2025)
- **Comprehensive Location Database**: Built hierarchical location system with 6 Russian regions and 3 world regions
- **Smart Keyword Matching**: Each location includes multiple keywords for intelligent tour filtering
- **Dual Location Filters**: Added both region-level and specific city/country filtering options
- **Enhanced Tours Page**: Dedicated location filter section with organized dropdowns
- **Intelligent Sorting**: Location-aware sorting that prioritizes relevance when filters are active
- **Multi-level Filtering**: Filter by region (e.g., Siberia, CIS) or specific location (e.g., St. Petersburg)
- **Destination Cards Integration**: Beautiful card-based destination selection with interactive filtering
- **URL Parameter Support**: All filters maintain state through URL parameters for sharing
- **Enhanced Search Form**: Refined styling with consistent spacing and modern aesthetics
- **Advanced Keyword System**: Comprehensive keyword matching for cities, landmarks, and regional terms
- **Smart Tour Discovery**: Tours are matched by location, title, and description content
- **Responsive Design**: All filtering components work seamlessly across devices

### Contact Page Redesign (January 2025)
- Replaced hero section background with minimalist nature landscape (SVG-generated realistic scenery)
- Implemented fully transparent glass-morphism contact cards with backdrop-filter blur
- Added advanced shadow effects and smooth hover animations (500ms transitions)
- Enhanced text readability with subtle drop shadows and optimized contrast
- Created modern, fast-responding UI with scale and transform effects on hover
- Maintained minimalist aesthetic while improving visual hierarchy

### Migration to Replit Environment (January 2025)
- Successfully migrated project from Replit Agent to standard Replit environment
- Verified all packages and dependencies are properly installed
- Confirmed application runs smoothly with proper client/server separation
- Ensured security best practices and robust architecture
- All functionality tested and working correctly
- **Google Authentication Setup**: Configured complete Google OAuth 2.0 integration
- **Database Migration**: Set up PostgreSQL database with fallback to in-memory storage
- **Storage Architecture**: Implemented dual storage system (database + in-memory for development)

### Complete Site Enhancement (January 2025)
- Added comprehensive page set: About Us, Contact, FAQ, Blog, and Favorites
- Created modern, minimalist design with gradient backgrounds and smooth animations
- Implemented responsive layouts with mobile-first approach
- Added interactive components with hover effects and micro-animations

### New Pages Implementation (January 2025)
- **About Page**: Company story, team information, values, and statistics
- **Contact Page**: Multi-channel contact information with interactive form
- **FAQ Page**: Comprehensive Q&A with search and categorization
- **Blog Page**: Travel articles with filtering, search, and engagement features
- **Favorites Page**: Personal collection of saved tours with management tools
- Enhanced profile page with favorites tab and improved navigation

### Tours Page Implementation (January 2025)
- Created comprehensive tours page with advanced filtering and search
- Added multi-select category filters with visual badges
- Implemented expanded duration options (short, half-day, full-day, overnight, weekend, long)
- Enhanced price range slider with proper dual-handle functionality
- Added active filter badges with individual remove buttons
- Implemented sorting options (popularity, price, rating, newest)
- Added grid/list view toggle with animated transitions
- Mobile-responsive design with collapsible filter sidebar
- Connected search functionality from hero section to tours page
- Updated header navigation to include direct Tours link

### Authentication System Implementation (January 2025)
- Added user registration and login system with username, email, password, and user type
- Created AuthContext for managing authentication state
- Implemented two user types: "traveler" and "agency"
- Added AuthModal component with beautiful, minimalist design
- Created user profile page for travelers with booking history and stats
- Updated header to show different options based on authentication status
- Admin panel now restricted to agency users only
- Added logout functionality with proper state cleanup

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
- **Database Provider**: Supabase (serverless PostgreSQL) - Independent from Replit

## Key Components

### Core Entities
1. **Tours**: Main product entity with title, description, location, duration, price, capacity, images, ratings, categories, and tags
2. **Bookings**: User reservations with personal details, tour selection, and booking status
3. **Users**: Full user authentication system with username, email, password, first/last name, and user type (traveler/agency)

### Frontend Components
- **Header**: Navigation with logo, menu items, authentication controls, and responsive design
- **Hero**: Landing section with search functionality and "surprise me" feature
- **Filters**: Category-based tour filtering (couples, nature, short trips, water activities, etc.)
- **TourCard**: Individual tour display with images, ratings, pricing, and booking options
- **BookingModal**: Form for tour reservations with validation
- **AuthModal**: Beautiful registration/login modal with user type selection
- **Admin Panel**: Tour management interface for travel agencies
- **Profile Page**: Personal dashboard for travelers with booking history, favorites, and statistics
- **About Page**: Company information with team, values, and interactive statistics
- **Contact Page**: Multi-channel contact form with real-time validation
- **FAQ Page**: Searchable knowledge base with collapsible answers
- **Blog Page**: Content management with categories, search, and engagement metrics
- **Favorites Page**: Personal tour collection with advanced filtering and management

### API Endpoints
- `POST /api/auth/register` - User registration with type selection
- `POST /api/auth/login` - User authentication
- `GET /api/tours` - Fetch all tours with optional category and hot deals filtering
- `GET /api/tours/:id` - Fetch individual tour details
- `POST /api/tours` - Create new tour (agency only)
- `PUT /api/tours/:id` - Update tour (agency only)
- `DELETE /api/tours/:id` - Delete tour (agency only)
- `GET /api/bookings` - Fetch all bookings (agency only)
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status (agency only)
- `GET /api/favorites` - Fetch user's favorite tours (planned)
- `POST /api/favorites` - Add tour to favorites (planned)
- `DELETE /api/favorites/:id` - Remove from favorites (planned)

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