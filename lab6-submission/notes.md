* **Proxy vs CORS (dev):** Vite’s dev proxy lets the React app call relative paths like `/api/...` and forwards them to `http://localhost:3000`, so there are **no CORS preflights or headers to manage**. It also mirrors production-style paths, while enabling hot reloads on 5173.

* **When to use CORS instead:** If you skip the proxy and hit absolute URLs (e.g. `http://localhost:3000/api/...`) you must **enable CORS on the backend** (origins, methods, headers). This works, but it’s **more config noise and easier to misconfigure** during development.

* **Typed fetch helper:** A small `request<T>()` wrapper centralizes `fetch` with **consistent JSON parsing, 204 handling, and structured HttpError** (`{ status, message }`). Components stay clean and **inherit strong TypeScript types** for responses.

* **Cleaner components & DX:** With `api.getExpenses/createExpense/deleteExpense`, UI code is **declarative and minimal** (no repetitive try/catch/headers everywhere). Errors surface uniformly, making **UI error messages predictable**.
