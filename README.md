# Drive Trip Logger

A responsive trip journal for recording routes, departure and arrival times,
distance, notes, and memorable drives.

## How to run

Requirements: Docker with Docker Compose.

After cloning the repository, start the database, apply the committed Prisma
migrations, build the app, and run everything with one command:

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). PostgreSQL data is kept in
a Docker volume, so it survives container restarts.

No environment-file setup is required for local evaluation because Compose uses
development defaults. To override the database credentials or run the app
outside Docker, copy `.env.example` to `.env` and adjust the values.

## Tech stack and why

Next.js 15 with the App Router and Server Actions provides the React UI and backend in one typed codebase, which keeps this small CRUD application straightforward. Prisma gives the service layer a type-safe database client and repeatable migrations. PostgreSQL was selected for durable relational storage and reliable date, filtering, and aggregate queries.

## Implemented Improvements

The following production readiness improvements have been completed:
- **UTC Database Storage & Local Timezone Rendering**: Trips are now saved with UTC timestamps in the database. The client dynamically parses and displays them in the browser's local timezone. Layout-matching skeletons prevent Next.js hydration mismatches on date rendering and form initialization.
- **Atomic Star Toggling (No Race Conditions)**: Converted the read-modify-write star toggling logic into an atomic `UPDATE` query utilizing PostgreSQL's row-level locking. Tab filtering has been shifted entirely to the client synchronously, preventing filter race conditions.
- **Scale-Ready Database Pagination & Filtering**: Filter and limit states are driven entirely by URL search parameters (`?filter=all&limit=10`). The database queries use `take` limits on the server, and all client-side states have been removed. This eliminates out-of-order race conditions and ensures summary card/list state synchronization naturally.
- **Production Observability (Error Logs)**: Configured Server Action catch blocks to capture error objects and output them via `console.error` for cloud logging providers (Vercel, AWS CloudWatch, Sentry).

## What I would do next

With another two days, I would:

- Add unit tests for validation and date handling, integration tests for the
  Prisma service, and end-to-end coverage for create, edit, delete, filter, and
  memorable workflows.
- Add authentication and per-user trip ownership.
- Store an explicit IANA timezone with each trip and test daylight-saving and
  cross-timezone behavior.

The main features cut for time were authentication and comprehensive automated tests.

## What broke or felt off

- Local development originally collided with an existing PostgreSQL process on
  port `5432`. The Compose database is now exposed only on
  `127.0.0.1:5433`, while containers continue to use `db:5432`.
- The memorable toggle is optimistic, but failed updates are reported rather
  than automatically retried.

I would not deploy this version as a multi-user production service yet. It has
no authentication or ownership boundary, the example database credentials must
be replaced with managed secrets, and it still needs automated tests, backups,
monitoring, rate limiting, and a documented recovery process.
