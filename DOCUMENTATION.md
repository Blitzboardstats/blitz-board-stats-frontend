
# Blitz Board Stats - Project Documentation

## 📱 Overview

Blitz Board Stats is a comprehensive mobile-first web application designed for managing youth Flag and Tackle football teams. The platform provides roster management, communication tools, scheduling capabilities, and live stat tracking functionality.

### Key Features
- **Team Management**: Create and manage multiple teams with role-based access
- **Player Roster Management**: Add players, track guardian information, and manage team composition
- **Live Stat Tracking**: Real-time game statistics for both Flag and Tackle football
- **Event Scheduling**: Create and manage games, practices, tournaments, and scrimmages
- **Team Communication**: Huddle chat system with announcements and messaging
- **RSVP System**: Player attendance tracking for events
- **Guardian Access**: Parents can view their player's stats and team information

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling and development
- **React Router** for navigation
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **TanStack Query** for data fetching and caching
- **Sonner** for toast notifications

### Backend Stack
- **Supabase** for backend services:
  - PostgreSQL database
  - Authentication (email/password)
  - Row Level Security (RLS) policies
  - Edge Functions for serverless logic
  - Real-time subscriptions
  - File storage

### Key Libraries
- **Lucide React** for icons
- **React Hook Form** with Zod validation
- **Date-fns** for date manipulation
- **Recharts** for data visualization

## 🎯 User Roles & Permissions

### Admin / Coach / Team Manager
- Full access to all team management features
- Create and manage teams, players, and events
- Access to live stat tracking tools
- Can send invitations and manage team membership

### Stat Tracker (Flag & Tackle)
- Full access to stat entry and game management
- Can create and manage roster and events
- Real-time stat tracking capabilities

### Parent / Guardian
- View-only access to their player's information
- Access to team schedule and chat
- Can RSVP for their player
- View player statistics and team information

## 📊 Database Schema

### Core Tables

#### `teams`
- Team information (name, football type, age group, season)
- Team creator and coach relationships
- Team statistics (wins, losses, draws)

#### `players`
- Player profiles with guardian information
- Jersey numbers and positions
- Photo storage capabilities

#### `events`
- Games, practices, tournaments, and scrimmages
- Date, time, location, and opponent information
- RSVP tracking and attendance management

#### `game_stats` & `live_stat_actions`
- Comprehensive stat tracking for both Flag and Tackle football
- Quarter-by-quarter performance data
- Real-time action logging

#### `team_invitations`
- Email-based invitation system
- Role-specific invitations (coach, member, player)
- Expiration and status tracking

### Access Control
The application uses Supabase Row Level Security (RLS) with custom security definer functions to handle complex access patterns while avoiding infinite recursion issues.

## 🏈 Football Types & Statistics

### Flag Football Stats
**Offensive Actions:**
- QB: Pass Attempts, Completions, Touchdowns, Interceptions, Extra Points (1/2), Sacks
- Players: Receptions, Runs, Touchdowns (6 pts), Fumbles, Extra Points (1/2)

**Defensive Actions:**
- Interceptions with variable points (1, 2, or 6)
- Flag Pulls
- Safeties (2 pts)

### Tackle Football Stats
**Offensive Actions:**
- QB: Completions, TD Passes, TD Runs, Interceptions, Extra Points (1/2)
- Players: Receptions, Runs, Touchdowns (6 pts), Fumbles, Extra Points (1/2)

**Defensive Actions:**
- Interceptions and Pick 6s
- Tackles and Sacks
- Safeties (2 pts)

**Special Teams:** (Future roadmap)
- Kicker, Punter, and Returner actions

## 🗂️ Team Setup & Configuration

### Divisions
**Flag Football:** 8U, 10U, 12U, 14U, 17U, Freshman, JV, Varsity
**Tackle Football:** Pop Warner 8U-14U, Freshman, JV, Varsity

### Seasons
- Spring 2025, Summer 2025, Fall 2025, Winter 2025
- Spring 2026, Summer 2026

### Event Types
- **Practice**: Team training sessions
- **Game**: Competitive matches with opponents
- **Tournament**: Multi-team competitions
- **Scrimmage**: Practice games

## 🚀 Key Features Implementation

### Team Management
- **Team Creation**: Coaches can create teams with specific football types and divisions
- **Player Management**: Add players with guardian information and emergency contacts
- **Invitation System**: Email-based invitations for coaches, members, and guardians
- **Role-based Access**: Different permissions based on user roles

### Live Game Tracking
- **Drag & Drop Interface**: Intuitive player management during games
- **Real-time Statistics**: Live stat entry with immediate updates
- **Quarter Management**: Track stats by quarters/halves
- **Score Calculation**: Automatic team and player scoring

### Communication Hub (Huddle)
- **Team Announcements**: Broadcast important information
- **Direct Messaging**: Private conversations between users
- **File Sharing**: Photo and document sharing capabilities
- **Notifications**: Real-time updates for team activities

### Scheduling & RSVP
- **Event Creation**: Create detailed events with location and timing
- **RSVP Management**: Track player attendance with notes
- **Calendar Views**: Multiple viewing options (week, month, future)
- **Reminders**: Automated RSVP reminder system

## 📱 Mobile-First Design

The application is designed with a mobile-first approach:
- **Bottom Navigation**: Easy thumb navigation on mobile devices
- **Touch-Friendly Interface**: Large touch targets for mobile interaction
- **Responsive Design**: Adapts to all screen sizes
- **Offline Capabilities**: Basic functionality works offline

## 🔐 Security & Authentication

### Authentication
- Email/password authentication via Supabase Auth
- Secure session management
- Password reset functionality

### Authorization
- Row Level Security (RLS) policies
- Role-based access control
- Guardian-specific data access
- Team-scoped permissions

### Data Protection
- Encrypted data transmission
- Secure file storage
- GDPR-compliant data handling
- Parent/guardian privacy controls

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ with npm
- Supabase account and project

### Installation
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🚢 Deployment

### Supabase Setup
1. Create new Supabase project
2. Run database migrations
3. Configure RLS policies
4. Set up edge functions
5. Configure authentication providers

### Frontend Deployment
- Optimized for Vercel, Netlify, or similar platforms
- Static build generation with Vite
- Environment variable configuration required

## 📊 Performance & Optimization

### Data Fetching
- TanStack Query for caching and state management
- Optimistic updates for better UX
- Background data synchronization

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Optimized bundle sizes

### Database Optimization
- Efficient queries with proper indexing
- RLS policies optimized for performance
- Connection pooling via Supabase

## 🔮 Future Roadmap

### MVP Features
- Enhanced play-by-play logging
- Player season-over-season analytics
- Auto-highlight video exports
- Live scoring overlays

### Advanced Features
- AI-powered game insights
- Advanced statistics and analytics
- Integration with wearable devices
- Tournament management system

## 🎨 Design Philosophy

The application follows these design principles:

> "To chase greatness, you need to measure your grind."

> "Stats aren't just numbers — they're proof you're getting better."

> "Don't guess your progress. Know it. Track it. Own it."

### UI/UX Guidelines
- **Simplicity**: Clean, intuitive interfaces
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Sub-3 second load times
- **Consistency**: Unified design language throughout

## 📞 Support & Maintenance

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Automatic error reporting
- Fallback UI states

### Monitoring
- Performance monitoring
- User analytics
- Error tracking
- Database performance metrics

### Updates
- Regular security updates
- Feature rollouts
- Database migrations
- User communication

## 📄 License & Legal

- Application code is proprietary
- Uses open-source dependencies under respective licenses
- Complies with youth sports data protection regulations
- COPPA-compliant for users under 13

---

*This documentation is maintained alongside the codebase and should be updated with any significant changes to the application architecture or features.*
