# Lab 9 — Backend-Managed Authentication with Kinde (TypeScript SDK + Hono)


- **Moving auth to the server:**  
  Authentication is now handled entirely on the backend using Kinde’s TypeScript SDK, so OAuth flows, token validation, and session management happen on the server instead of React. The frontend just renders links and calls `/api/auth/me`.

- **Cookies vs localStorage:**  
  Tokens are stored in **HttpOnly cookies**, which are inaccessible to JavaScript. This prevents XSS attacks and makes sessions safer. LocalStorage would expose tokens to client-side scripts and increase risk.

- **What the SDK simplified:**  
  The SDK manages the full OAuth 2.0 / OIDC flow, token exchange, and session handling automatically—no manual JWT parsing, jose validation, or refresh logic. It also provides helper methods like `isAuthenticated` and `getUserProfile` to protect routes and fetch user info easily.

- **Server-driven security model:**  
  With the backend controlling sessions, we avoid trusting the browser with sensitive data. The server can enforce authorization and revoke sessions centrally.

- **Development experience:**  
  Using Vite’s proxy makes the app appear same-origin, so cookies just work without extra CORS complexity. The flow feels seamless even in local dev.


