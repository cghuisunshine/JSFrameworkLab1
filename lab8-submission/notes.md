Lab 8 — TanStack Router (File-Based Routing, Layouts)

1. Learning the Router system
I learned how TanStack Router provides a type-safe and declarative way to handle routing in React. Compared to React Router, its file-based and nested route system feels cleaner and easier to reason about, especially when building shared layouts.

2. Layouts and <Outlet> usage
Using <Outlet> in App.tsx helped me understand how nested routes render within a shared layout. This pattern keeps navigation (navbar, header, etc.) consistent across pages without duplicating code.

3. Dynamic and nested routes
Defining routes like /expenses/$id made it clear how TanStack Router handles parameters. Passing params into <Link> ensures type safety and reduces runtime routing errors.

4. Integration with TanStack Query
Combining TanStack Router with TanStack Query gave a smooth data flow — queries cache by route and refresh automatically after mutations. It’s powerful for maintaining up-to-date UI state with minimal boilerplate.

5. Error boundaries and NotFound
Adding defaultNotFoundComponent and defaultErrorComponent showed how to gracefully handle missing pages and fetch errors. It’s good practice for user experience and debugging.

6. Overall takeaway
This lab connected routing, data fetching, and layouts into a cohesive full-stack flow. I now see how TanStack tools fit together to build modern React apps that are structured, maintainable, and developer-friendly.
