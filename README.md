# Drive Trip Logger

A responsive trip journal for ROVE customers to log their driving trips and highlight memorable ones.

## How to run

To run the entire stack (frontend, backend, database) with a single command, run:

```bash
docker compose up --build
```

Once running, open [http://localhost:3000](http://localhost:3000) in your browser. 

*Note: No manual environment-file setup is required for local evaluation because Docker Compose uses development defaults out of the box. If you wish to override credentials or run the application outside of Docker, copy `.env.example` to `.env` and adjust the values accordingly.*

## Tech stack and why

Next.js 15 with the App Router and Server Actions provides a cohesive full-stack React UI and backend API in a single type-safe codebase, keeping development streamlined. Prisma was chosen as the ORM to provide a type-safe database client, schema safety, and repeatable migration tracking. PostgreSQL was selected for relational storage because of its robust date-time formatting, concurrency controls (exclusive row-level locking), and reliable indexing for ordered dashboard listings.

## What I would do next

If I had another two days, I would build and improve:
- **Comprehensive Testing**: Add unit tests for timezone/picker date math, integration tests for Prisma queries, and end-to-end testing (Cypress or Playwright) covering create, edit, delete, and toggle flows.
- **Explicit IANA Timezone Storage**: Store the user's specific IANA timezone string alongside the UTC timestamps in the database to support travel across daylight-saving and timezone boundaries.
- **Authentication & Multi-Tenant Isolation**: Add user accounts and row-level ownership to secure and separate trips between customers.

*What was cut for time:* Multi-user authentication and comprehensive automated test suites.

## Anything that broke or felt off

I would not put this version into production yet for the following reasons:
- **Lack of Authentication & Authorization**: There is no authentication layer or data ownership boundary; any visitor can currently view, edit, or delete any trip.
- **Optimistic UI Error Recovery**: The memorable toggle operates optimistically on the client, but lacks an automatic retry queue or state rollback if the network/database action fails.
- **Port Conflict in Development**: Local Compose originally clashed with local PostgreSQL instances on port `5432`; it has been configured to map to `127.0.0.1:5433` for local host access while maintaining isolated container communication.
- **Production Secrets**: The database credentials in the Compose configuration use development defaults and must be replaced with managed secrets (e.g. AWS Secrets Manager or Vercel Env) before cloud deployment.
