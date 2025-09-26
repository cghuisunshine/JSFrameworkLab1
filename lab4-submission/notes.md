* **From in-memory to persistent storage**: Instead of storing expenses in a simple array, I connected to a real Postgres database on Neon. Now data persists across server restarts and is shared across clients.

* **Schema & migrations**: I defined the table schema with Drizzle ORM (`pgTable`, `serial`, `varchar`, `integer`) and used `db:push` to create the `expenses` table. This made database setup much smoother compared to writing raw SQL.

* **Querying with Drizzle**: Replacing array operations (`findIndex`, `push`, `splice`) with `db.select`, `db.insert`, `db.update`, and `db.delete` was straightforward once I learned the Drizzle syntax, especially using helpers like `eq(...)`.

* **Gotchas**: Remembering to use the **HTTP connection string** from Neon (with `?sslmode=require`) was important — the pooled or TCP string won’t work with Bun’s driver. Also, `PATCH` needed an explicit check for empty objects, otherwise Drizzle would just no-op.

* **Consistency**: Thanks to the schema and Zod validation, the API still enforces proper types and constraints, but now backed by a reliable database. This makes the app feel more like a “real” service rather than just a demo.
