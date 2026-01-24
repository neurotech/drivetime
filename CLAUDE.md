# DriveTime

A trip tracking application built with Next.js, Drizzle ORM, and SQLite.

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code (Biome)
pnpm lint

# Format code (Biome)
pnpm format

# Lint and format (Biome)
pnpm check

# Generate database migrations
pnpm db:generate

# Apply database migrations
pnpm db:migrate

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components
- `src/db/` - Database configuration and schema
- `src/lib/` - Shared utilities

## Database

The application uses SQLite with Drizzle ORM. The database file is `drivetime.db` in the project root.

### Schema

- **trips** - Trip records with date, locations, distance, and notes
