# D1 migrations

## Initial schema
- 0001_initial_schema.sql
- 0002_seed_dev_data.sql
- 0003_expand_mvp_schema.sql

## Create D1 database (once)
```bash
cd apps/api
npx wrangler d1 create nexus-re-d1
```

Use the returned `database_id` in wrangler.toml under `[[d1_databases]]`.

## Apply migration locally
```bash
cd apps/api
npx wrangler d1 execute nexus-re-d1 --local --file=./migrations/0001_initial_schema.sql
```

## Apply migration remote
```bash
cd apps/api
npx wrangler d1 execute nexus-re-d1 --remote --file=./migrations/0001_initial_schema.sql
```

## Apply dev seed data
```bash
cd apps/api
npx wrangler d1 execute nexus-re-d1 --local --file=./migrations/0002_seed_dev_data.sql
npx wrangler d1 execute nexus-re-d1 --remote --file=./migrations/0002_seed_dev_data.sql
```

## Apply schema expansion
```bash
cd apps/api
npx wrangler d1 execute nexus-re-d1 --local --file=./migrations/0003_expand_mvp_schema.sql
npx wrangler d1 execute nexus-re-d1 --remote --file=./migrations/0003_expand_mvp_schema.sql
```
