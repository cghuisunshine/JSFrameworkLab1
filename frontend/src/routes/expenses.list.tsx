// /frontend/src/routes/expenses.list.tsx
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { AddExpenseForm } from '../components/AddExpenseForm'

export type Expense = { id: number; title: string; amount: number; fileUrl: string | null }

// Use "/api" if you configured a Vite proxy in dev; otherwise use
// const API = 'http://localhost:3000/api'
const API = '/api'

export default function ExpensesListPage() {
  const qc = useQueryClient()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const res = await fetch(`${API}/expenses`, {
        credentials: 'include',
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status}: ${txt || res.statusText}`)
      }
      return (await res.json()) as { expenses: Expense[] }
    },
    staleTime: 5_000,
    retry: 1,
  })

  const deleteExpense = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/expenses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || 'Failed to delete expense')
      }
      return id
    },
    onMutate: async (id) => {
      setDeleteError(null)
      setDeletingId(id)
      await qc.cancelQueries({ queryKey: ['expenses'] })
      const previous = qc.getQueryData<{ expenses: Expense[] }>(['expenses'])
      if (previous) {
        qc.setQueryData(['expenses'], {
          expenses: previous.expenses.filter((item) => item.id !== id),
        })
      }
      return { previous }
    },
    onError: (err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(['expenses'], ctx.previous)
      const message = err instanceof Error ? err.message : 'Could not delete expense.'
      setDeleteError(message)
    },
    onSettled: () => {
      setDeletingId(null)
      qc.invalidateQueries({ queryKey: ['expenses'] })
    },
  })

  if (isLoading) {
    const skeletonRows = Array.from({ length: 4 })
    return (
      <section className="mx-auto max-w-3xl space-y-4 p-6">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Expenses</h2>
          <button className="rounded border px-3 py-1 text-sm" disabled>
            Loading…
          </button>
        </header>

        <AddExpenseForm />

        <ul className="space-y-2">
          {skeletonRows.map((_, index) => (
            <li
              key={index}
              className="rounded border bg-background p-3 shadow-sm"
            >
              <div className="flex items-center justify-between animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-slate-200" />
                  <div className="h-3 w-32 rounded bg-slate-200" />
                </div>
                <div className="h-4 w-16 rounded bg-slate-200" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>Could not load expenses. Please try again.</p>
          <p className="mt-1 text-xs opacity-80">{(error as Error).message}</p>
          <button
            className="mt-3 rounded border border-red-300 px-3 py-1 text-xs text-red-700 disabled:opacity-50"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? 'Retrying…' : 'Retry'}
          </button>
        </div>
      </div>
    )
  }

  const items = data?.expenses ?? []

  return (
    <section className="mx-auto max-w-3xl space-y-4 p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <button
          className="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      <AddExpenseForm />

      {deleteError && (
        <p className="text-sm text-red-600">Could not delete expense: {deleteError}</p>
      )}

      {items.length === 0 ? (
        <div className="rounded border bg-background p-6 text-center">
          <h3 className="text-lg font-semibold">No expenses yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start by adding your first expense using the form above.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((expense) => {
            const isDeleting = deleteExpense.isPending && deletingId === expense.id
            return (
              <li
                key={expense.id}
                className="flex items-center justify-between rounded border bg-background text-foreground p-3 shadow-sm"
              >
                <div className="flex flex-col">
                  <Link
                    to="/expenses/$id"
                    params={{ id: String(expense.id) }}
                    className="font-medium underline hover:text-primary"
                  >
                    {expense.title}
                  </Link>
                  {expense.fileUrl ? (
                    <a
                      href={expense.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary underline"
                    >
                      Download Receipt
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">Receipt not uploaded</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="tabular-nums">#{expense.amount}</span>
                  <button
                    type="button"
                    onClick={() => deleteExpense.mutate(expense.id)}
                    disabled={isDeleting}
                    className="text-sm text-red-600 underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? 'Removing…' : 'Delete'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
