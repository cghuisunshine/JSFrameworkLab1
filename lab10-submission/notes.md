# Lab 10 – Notes

- **Provider & setup:** Used **AWS S3 (us-west-2)** with a private bucket; created an IAM user with programmatic access and scoped keys, wired into the backend via `.env` (`S3_REGION`, `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`). Backend built with **Hono + @aws-sdk v3**; DB is **Neon Postgres + Drizzle**; frontend is **React + Vite + TanStack Query**.

- **Biggest challenge – CORS on browser uploads:** Initial `PUT` to S3 failed due to missing/incorrect bucket CORS. Fix was adding the exact origin `http://localhost:5173`, allowing `PUT, GET, HEAD`, exposing `ETag`, and keeping the bucket **private**.

- **Auth & cookies through dev proxy:** Ensured the Vite dev server proxies `/api/*` and that `fetch(..., { credentials: 'include' })` is used everywhere. Without this, `POST /api/upload/sign` returned 401 because session cookies didn’t reach the API.

- **Key vs URL gotcha:** The DB stores **only the object key** (e.g., `uploads/123-file.png`). If you mistakenly store the full S3 URL, download signing breaks and results in `403 AccessDenied`. The read layer now replaces keys with **time-limited signed download URLs**.

- **Content-Type matters on upload:** For reliable `ETag`/integrity and correct file rendering later, the browser `PUT` includes `Content-Type: file.type`. Missing/incorrect content type caused confusing behavior when downloading/displaying receipts.

- **End-to-end flow verified:** Upload → update expense with `fileKey` → list/detail pages show **working “Download Receipt”** links. Links expire (1h), and **refetch** via React Query reliably provides a fresh signed URL.

