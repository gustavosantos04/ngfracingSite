These incremental migrations predate the adoption of Prisma Migrate in production.
The read-only production audit on 2026-10-26 confirmed that the current six tables
already match the application schema before ProductImageAsset, and that no
_prisma_migrations table exists. The old migrations assume other legacy tables
and must not be replayed against the existing database.

Their SQL is preserved unchanged here for reference. The active history starts at
0_existing_schema, a complete snapshot that can initialize a new empty database.
For the existing production database, mark 0_existing_schema applied only after
backup verification and explicit user approval, then deploy the additive image
asset migration. Do not run the baseline SQL against existing tables.
