# Make My Marriage

Make My Marriage is a full-stack wedding-management application for collaboratively planning and managing Indian weddings.

## Technology stack

- Next.js App Router
- React
- TypeScript
- MongoDB with Mongoose
- Zod validation
- Custom server-side session authentication
- Vitest

## Requirements

- Node.js 18.18 or newer
- npm
- MongoDB

## Local setup

Install the dependencies:

```bash
npm install
```

Create the local environment file from the example:

```bash
cp .env.example .env.local
```

Update `MONGODB_URI` in `.env.local`, then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev        # Start the development server
npm run build      # Create a production build
npm run start      # Start the production server
npm run lint       # Run ESLint
npm run typecheck  # Run the TypeScript compiler checks
npm test           # Run the test suite
```

## Project structure

```text
src/app/       Next.js routes, layouts, and pages
src/config/    Environment and application configuration
src/server/    Database, authentication, and HTTP utilities
src/types/     Shared TypeScript types
tests/         Unit and integration tests
docs/          Product, database, and system design documents
```

## Documentation

- [Product requirements](docs/PRD.md)
- [System design](docs/SYSTEM_DESIGN.md)
- [Database design](docs/DATABASE_DESIGN.md)
