# VRIN Frontend - Smart Memory Dashboard

Enterprise-grade React dashboard for VRIN's Hybrid RAG system, featuring interactive knowledge graph visualization, real-time updates, and user-defined AI specialization management.

## 🚀 Architecture Overview

VRIN's frontend is a **Next.js 15 application** that provides a comprehensive dashboard for managing AI-powered knowledge graphs and expert specializations.

### Core Technology Stack

- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19 with concurrent features
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query + custom hooks
- **Real-time**: Socket.IO client for live updates
- **Visualization**: Cytoscape.js for knowledge graphs

## 🏗️ Frontend Architecture

### **Modern Next.js 15 Structure**
```
app/                          # Next.js App Router
├── layout.tsx               # Root layout with providers
├── page.tsx                 # Landing page
├── dashboard/               # Main dashboard interface
├── auth/                    # Authentication pages
├── api/                     # API route handlers
└── knowledge-graph/         # Graph visualization pages

components/                   # Feature-organized components
├── dashboard/               # Dashboard-specific components
│   ├── sections/           # Main dashboard sections
│   ├── knowledge-graph/    # Graph visualization
│   ├── layout/             # Navigation and layout
│   └── providers.tsx       # Context providers
├── ui/                     # shadcn/ui base components
└── [feature-components]    # Landing page components

hooks/                       # Custom React hooks
├── use-auth.ts             # Authentication state
├── use-api-keys.ts         # API key management
├── use-knowledge-graph.ts  # Graph data fetching
└── use-real-time-updates.ts # Live updates

config/                      # Configuration
└── api.ts                  # Centralized API endpoints

types/                       # TypeScript definitions
└── knowledge-graph.ts      # Core data models
```

### **State Management Architecture**

**TanStack Query** for server state:
- API caching and synchronization
- Optimistic updates
- Background refetching
- Error handling and retries

**Custom Hooks** for domain logic:
- `use-auth.ts` - User authentication and session management
- `use-knowledge-graph.ts` - Graph data fetching and real-time updates
- `use-api-keys.ts` - API key CRUD operations
- `use-vrin-service.ts` - Backend service integration

**Real-time Updates**:
- Socket.IO client for live graph updates
- Conflict resolution for simultaneous edits
- Real-time statistics and status indicators

## 🎯 Key Features

### **Interactive Knowledge Graph Dashboard**
- **Real-time Visualization**: Live graph updates using Cytoscape.js
- **Multi-section Interface**: Home, API Docs, API Keys, Settings
- **Temporal Timeline**: Time-based knowledge graph operations
- **Conflict Resolution**: Automatic handling of contradictory information
- **Node Details**: Interactive exploration of entities and relationships

### **User-Defined AI Specialization**
- **Custom Expert Configuration**: Define domain-specific AI reasoning
- **Specialization Management**: Save and manage multiple expert profiles
- **Analysis Depth Control**: Surface, detailed, or expert-level analysis
- **Reasoning Focus**: Cross-document synthesis, causal chains, pattern detection

### **Enterprise Authentication**
- **Multi-key Support**: Users can create multiple API keys
- **Bearer Token Authentication**: Secure JWT-based authentication
- **User Isolation**: Complete data separation by user_id
- **Account Management**: Registration, login, email verification

### **Production-Ready UI Components**
- **shadcn/ui Foundation**: Accessible, customizable component library
- **Radix UI Primitives**: Headless UI components with full accessibility
- **Theme Support**: Dark/light mode with next-themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔧 Development Setup

### **Prerequisites**
- Node.js 18+ 
- npm/yarn/pnpm
- Git

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd vrin

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Development Commands**
- **Development server**: `npm run dev` (http://localhost:3000)
- **Production build**: `npm run build`
- **Start production**: `npm start`
- **Lint code**: `npm run lint`

## 🌐 Backend Integration

### **API Configuration**
The frontend connects to VRIN's production AWS infrastructure:

- **Auth API**: `https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod`
- **RAG API**: `https://thuiu23t0c.execute-api.us-east-1.amazonaws.com/dev`
- **Authentication**: Bearer token with JWT
- **Real-time**: Socket.IO for live updates

### **API Integration Pattern**
```typescript
// Centralized API configuration
export const apiCall = async (endpoint: string, options: RequestInit = {}, apiKey?: string) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: getAuthHeaders(apiKey),
    ...options
  });
  return response.json();
};

// Custom hooks for data fetching
export const useKnowledgeGraph = () => {
  return useQuery({
    queryKey: ['knowledge-graph'],
    queryFn: () => apiCall('/graph'),
    refetchInterval: 30000, // Real-time updates
  });
};
```

## 📊 Core Data Models

### **Knowledge Graph Types**
```typescript
// Temporal knowledge graph with provenance
interface Triple {
  subject: string;
  predicate: string;
  object: string;
  confidence?: number;
  timestamp?: Date;
  source?: string;
  status?: 'active' | 'deprecated' | 'conflicted';
}

// Interactive graph visualization
interface Node {
  id: string;
  name: string;
  type: string;
  connections?: number;
  position?: { x: number; y: number };
}

// Real-time updates
interface GraphUpdate {
  type: 'node_added' | 'edge_updated' | 'conflict_resolved';
  timestamp: Date;
  data: Node | Edge | ConflictResolution;
}
```

## 🎨 Design System

### **Component Architecture**
- **Atomic Design**: Atoms (buttons) → Molecules (forms) → Organisms (sections)
- **Feature Organization**: Components grouped by dashboard sections
- **Consistent Theming**: CSS variables with Tailwind for dark/light modes
- **Accessibility**: ARIA compliance through Radix UI primitives

### **Styling Approach**
```typescript
// Tailwind with custom theme configuration
const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... comprehensive design tokens
      }
    }
  }
}
```

## 🔒 Security & Performance

### **Security Features**
- **Authentication**: JWT tokens with secure storage
- **API Security**: Bearer token authentication for all requests
- **Data Isolation**: User-specific data filtering
- **Input Validation**: Client-side validation with server verification

### **Performance Optimizations**
- **Next.js 15**: Latest optimizations and concurrent features
- **TanStack Query**: Intelligent caching and background updates
- **Code Splitting**: Automatic route-based splitting
- **Asset Optimization**: Next.js built-in image and font optimization

## 🚀 Deployment

### **Production Deployment**
- **Platform**: Vercel (recommended) or any Node.js hosting
- **Build**: Static generation with dynamic API routes
- **Environment**: Production API endpoints configured
- **Monitoring**: Real-time error tracking and performance monitoring

### **Environment Configuration**
```bash
# Production environment variables
NEXT_PUBLIC_API_URL=https://api.vrin.ai
NEXT_PUBLIC_AUTH_URL=https://auth.vrin.ai
NEXT_PUBLIC_SOCKET_URL=https://realtime.vrin.ai
```

## 🎯 What Makes VRIN Frontend Unique

### **vs. Traditional Dashboards**
- ✅ **Real-time Knowledge Graphs** - Live visualization of AI memory
- ✅ **User-Defined Experts** - Customize AI reasoning for any domain
- ✅ **Temporal Intelligence** - Time-aware fact management
- ✅ **Conflict Resolution** - Automatic handling of contradictory information

### **vs. Basic Admin Interfaces**
- ✅ **Interactive Visualization** - Cytoscape.js graph exploration
- ✅ **Modern React Architecture** - Next.js 15 with latest features
- ✅ **Enterprise Authentication** - Multi-key, secure user management
- ✅ **Production-Ready** - Full AWS integration with real-time updates

## 📚 Documentation

- **Architecture**: See `CLAUDE.md` for development guidelines
- **API Integration**: Check `config/api.ts` for endpoint configuration
- **Component Library**: shadcn/ui documentation for UI components
- **State Management**: TanStack Query docs for data fetching patterns

---

**🎉 VRIN Frontend represents the next generation of AI dashboard interfaces - combining real-time knowledge graph visualization with user-defined AI specialization management in a production-ready Next.js application.**

*Last updated: August 16, 2025 - Next.js 15 with React 19*
