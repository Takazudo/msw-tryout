---
title: Welcome
sidebar_position: 1
---

# MSW Tryout Documentation

Welcome to the MSW (Mock Service Worker) Tryout project documentation.

## About This Project

This is a simple tryout project featuring:
- **Backend**: Netlify Functions (serverless)
- **Frontend**: Next.js 15 gallery application
- **Images**: Hosted externally at takazudomodular.com
- **Features**: Gallery with pagination, modal dialog, blurhash placeholders

## Quick Links

- **[INBOX](./inbox/)**: Development notes and implementation guides
- **[Data](./data/)**: Data structures and API documentation
- **[Misc](./misc/)**: Configuration and development setup
- **[API Reference](/api/msw-tryout)**: OpenAPI specification for gallery endpoints

## Getting Started

### Running the Application

Two terminal sessions are required:

1. **Terminal 1 - Next.js Dev Server (Port 3200)**:
   ```bash
   cd app && npm run dev
   ```

2. **Terminal 2 - Netlify Dev Server (Port 8888)**:
   ```bash
   npm run dev
   ```

### Accessing the Application

Always access via Netlify Dev proxy:
- **Correct**: http://localhost:8888
- **Incorrect**: http://localhost:3200 (missing Netlify Functions proxy)

## Documentation Structure

This documentation is organized into the following categories:

### INBOX
Development notes, technical documentation, and implementation guides captured during active development. This is where you'll find the latest findings and architectural decisions.

### Data
Documentation about data structures, storage, and business logic. Includes details about gallery data format, API response structures, and pagination mechanisms.

### Misc
Configuration, environment setup, and operational procedures. Contains development guidelines, port configuration, and documentation style rules.

## Technology Stack

- **Next.js 15**: React framework with App Router
- **Netlify Functions**: Serverless backend
- **Blurhash**: Image placeholder generation
- **Docusaurus**: Documentation site generator

## Contributing to Documentation

When adding new documentation:
1. Follow the [Doc Style Rules](./misc/doc-style-rule.md)
2. Use appropriate category (INBOX for development notes, Data for data structures, Misc for configuration)
3. Include clear examples and code snippets
4. Add frontmatter with title and sidebar_position

---

For more information, see the CLAUDE.md file in the project root.
