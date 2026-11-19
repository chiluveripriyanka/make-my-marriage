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

## MongoDB setup

Wedding creation saves a wedding and its Admin membership in one transaction.
Use MongoDB Atlas or a replica set; standalone MongoDB does not support this flow.
Compass is a database client, not a database server.

For local development with Docker Desktop installed:

```bash
docker compose up -d --wait
docker compose exec mongo mongosh --quiet --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})'
docker compose exec mongo mongosh --quiet --eval 'db.hello().isWritablePrimary'
```

Run `rs.initiate` only once for a new volume. Wait until the final command returns
`true`, then use the replica-set URI in `.env.example` for both Next.js and Compass.
Port 27017 must be free. This local database has no authentication and is bound
to loopback; it is not a production configuration. `docker compose down` preserves
the named data volume. Atlas users should use their own URI instead.

## Local secrets and authentication

`.env.local` and `.mcp.json` are ignored local configuration files. Copy
`.mcp.example.json` to `.mcp.json` and supply the Stitch key only in that local
file or your MCP client's secret store. Never commit keys. If the previous key
was shared, revoke/rotate it in its Google project and update the local config.

Authentication currently supports signup, login, and logout. Password reset has
been removed; Resend credentials are not needed. `APP_URL` is retained for origin
validation and must match the actual browser origin, including its port.

Signup/login share a MongoDB-backed aggregate limit of 100 attempts per 15-minute
window, checked before parsing the body or performing password hashing. Each
account/action also allows 10 attempts per window. Client-supplied forwarding
headers are not trusted. The aggregate cap protects against rotating email
addresses but can temporarily affect all users during an attack; production
deployments should additionally enforce per-IP limits at a trusted edge proxy.

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
