// /frontend/src/router.tsx
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import App from './App'

import ExpensesListPage from './routes/expenses.list'
import ExpenseDetailPage from './routes/expenses.detail'
import ExpenseNewPage from './routes/expenses.new'

// Root layout wraps the navbar and <Outlet/> (inside App.tsx)
const rootRoute = createRootRoute({
  component: () => <App />,
})

// Child of root: index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/', // index is "/"
  component: () => <p>Home Page</p>,
})

// Parent segment for /expenses
// NOTE: child paths will be relative: "new", "$id"
const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'expenses', // <-- no leading slash
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
})

const expensesListRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: '/',            // renders at "/expenses"
  component: ExpensesListPage,
})

const expensesNewRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: 'new',          // "/expenses/new"
  component: ExpenseNewPage,
})

const expensesDetailRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: '$id',
  component: () => {
    const { id } = expensesDetailRoute.useParams()
    return <ExpenseDetailPage id={Number(id)} />
  },
})


// and then:
const routeTree = rootRoute.addChildren([
  indexRoute,
  expensesRoute.addChildren([expensesListRoute, expensesNewRoute, expensesDetailRoute]),
])



export const router = createRouter({ routeTree })

// Good DX: default error + notFound components (from the lab)
router.update({
  defaultNotFoundComponent: () => <p>Page not found</p>,
  defaultErrorComponent: ({ error }) => <p>Error: {(error as Error).message}</p>,
})

// Type registration so TS knows about your router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />
}
