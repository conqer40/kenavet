# FieldForce Pro implementation plan

1. Bootstrap Next.js / TypeScript with PostgreSQL adapters (PGlite for a runnable local installation; PostgreSQL/Supabase for deployment).
2. Apply reproducible relational migrations, tenant foreign keys, RLS, RBAC and immutable audit events.
3. Implement secure database sessions, password reset, user administration and permission-scoped data services.
4. Implement customers, visits, idempotent collections, invoice entry, plans, leave balances and configurable sequential approvals.
5. Build Arabic-first responsive workspace, dashboards, customer profiles, reports, imports, exports, settings and notifications.
6. Add private attachments, PWA offline shell, Android packaging configuration and integration boundaries.
7. Run integration/security tests, lint, type checks, production build and browser checks. Document deployment and limitations precisely.

## Design decisions

- Authorization belongs in the service layer and PostgreSQL RLS, never in UI filtering. Every business transaction sets a verified tenant, user, area and permission context using a restricted database role.
- Tenant-scoped composite foreign keys prevent cross-company relationship injection.
- Monetary values are decimal strings; PostgreSQL NUMERIC performs arithmetic.
- Approval requests snapshot configured steps. Row locks serialize decisions and balance consumption. No financial self-approval.
- Local development uses the same PostgreSQL schema in PGlite, not a mocked browser database. Production refuses embedded storage unless explicitly enabled for a single-instance installation.
- Cloud provisioning requires operator credentials; local seed data is explicitly separate from production bootstrap.
