# Drive Trip Logger

A focused trip journal for recording routes, timing, distance, notes, and the drives worth remembering.

## How to run

1. Create the environment file if it does not exist:

   ```bash
   cp .env.example .env
   ```

2. Start PostgreSQL, apply the committed Prisma migration, and run the app:

   ```bash
   docker compose up
   ```

Open [http://localhost:3000](http://localhost:3000). The app container waits for PostgreSQL to become healthy before running `prisma migrate deploy` and starting Next.js.

For local development outside Docker, point `DATABASE_URL` at a PostgreSQL database and run `pnpm install`, `pnpm prisma:migrate`, and `pnpm dev`.

## Tech stack & why

Next.js 15 App Router and Server Actions keep reads, mutations, and rendering close together while React Hook Form, Zod, Tailwind CSS, shadcn/ui, and Sonner provide a small typed UI layer. Prisma centralizes database access and produces a strict client contract. PostgreSQL was chosen for durable relational storage, reliable date and aggregate behavior, and a straightforward production path compared with file-backed alternatives.

## Project structure

- `src/app` - App Router pages, layouts, loading, error, and not-found states.
- `src/actions` - validated Server Action entry points for all mutations.
- `src/components` - shared layout, trip, common, and shadcn-style UI components.
- `src/lib` - Prisma singleton and shared formatting/class utilities.
- `src/schemas` - reusable Zod form validation.
- `src/services` - the only layer that performs Prisma queries.
- `src/types` - shared trip domain types.
- `prisma` - schema and committed PostgreSQL migration.
- `public` - static assets served by Next.js.

## Assumptions made

- Locations are free-form labels capped at 120 characters; map lookup is intentionally excluded.
- Date-time inputs use the browser's local timezone and Prisma stores the resulting timestamps.
- Distance supports decimal kilometers and is displayed with at most one decimal place.
- Filtering and offset pagination are URL-driven so links are shareable and browser navigation behaves predictably.
- Successful create, edit, and delete actions redirect to a fresh server-rendered list and show a Sonner toast.

## What's next

- Add focused unit tests for schema, pagination, and query-parameter edge cases plus service integration tests against a disposable PostgreSQL database.
- Add end-to-end coverage for create, edit, delete, filter, and memorable-toggle workflows.
- Add observability, structured logging, backups, and deployment-specific health endpoints.
- Improve timezone handling by storing a user-selected IANA timezone alongside each trip.

## Known limitations

- There is no authentication or ownership model, as required by the assignment, so one shared dataset is visible to every visitor.
- Offset pagination can become slower at very large offsets; cursor pagination would be the next scaling step.
- The memorable toggle uses an optimistic UI but does not queue retries after a failed request.
- Production operations still need managed secrets, database backups, monitoring, and a hardened deployment platform.
