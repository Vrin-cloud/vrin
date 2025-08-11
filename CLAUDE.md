# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Development server**: `npm run dev` (runs on http://localhost:3000)
- **Build production**: `npm run build`
- **Start production**: `npm start`
- **Lint code**: `npm run lint`

## Architecture Overview

This is a Next.js 15 application for VRIN, a smart memory system for AI applications. The project implements a knowledge graph dashboard with real-time capabilities.

### Key Architecture Components

**Frontend Framework**: Next.js 15 with App Router, React 19, TypeScript, and Tailwind CSS

**State Management**: 
- TanStack Query for API state management and caching
- Custom React hooks for domain-specific state (auth, API keys, knowledge graph)

**UI Components**: 
- Radix UI primitives with shadcn/ui component library
- Custom components in `/components` organized by feature areas
- Theme support with next-themes for dark/light mode

**API Integration**:
- Centralized API configuration in `config/api.ts` 
- AWS API Gateway backend at `gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod`
- Authentication via Bearer tokens
- Real-time updates using Socket.IO client

### Project Structure

**Core Application**:
- `/app` - Next.js App Router pages and layouts
- `/components` - Reusable UI components organized by feature
- `/hooks` - Custom React hooks for data fetching and state
- `/types` - TypeScript type definitions
- `/config` - API and application configuration
- `/lib` - Utility functions

**Key Features**:
- **Authentication**: Login/signup flow with email verification
- **Knowledge Graph**: Interactive visualization using Cytoscape.js
- **Dashboard**: Multi-section interface (Home, API Docs, API Keys, Settings)
- **Real-time Updates**: Live graph updates and conflict resolution
- **Temporal Data**: Support for time-based knowledge graph operations

### Core Types and Data Models

The application centers around knowledge graph concepts defined in `types/knowledge-graph.ts`:
- **Triple**: Subject-predicate-object relationships with metadata
- **Node/Edge**: Graph visualization elements
- **TemporalTriple**: Time-aware facts with validity periods
- **ConflictResolution**: Automatic handling of contradictory information

### Development Guidelines

**Component Patterns**:
- Use shadcn/ui components as base building blocks
- Implement proper TypeScript typing throughout
- Follow existing component organization by feature area
- Use Radix UI for accessible primitives

**API Integration**:
- Use the centralized `apiCall` helper from `config/api.ts`
- Implement proper error handling for API failures
- Use TanStack Query for data fetching with appropriate caching strategies

**Styling**:
- Tailwind CSS with custom theme configuration
- Consistent spacing and color schemes
- Support both light and dark themes
- Use Framer Motion for animations where appropriate