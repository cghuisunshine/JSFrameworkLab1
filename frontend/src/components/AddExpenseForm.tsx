import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'

type Expense = {
  id: number
  title: string
  amount: number
  fileUrl: string | null
}

const API = '/api'

export function AddExpenseForm() {
  const qc = useQueryClient()
  const [title, setTitle] = useState('')
  const [amountInput, setAmountInput] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const amountValue = Number(amountInput)
  const amountError =
    amountInput !== '' && (!Number.isFinite(amountValue) || amountValue <= 0 || !Number.isInteger(amountValue))
      ? 'Amount must be a positive whole number'
      : null

  const mutation = useMutation({
    mutationFn: async (payload: { title: string; amount: number }) => {
      const res = await fetch(`${API}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const message = await res.text().catch(() => '')
        throw new Error(message || 'Failed to add expense')
      }
      return (await res.json()) as { expense: Expense }
    },
    onMutate: async (newItem) => {
      await qc.cancelQueries({ queryKey: ['expenses'] })
      const previous = qc.getQueryData<{ expenses: Expense[] }>(['expenses'])
      if (previous) {
        const optimistic: Expense = {
          id: Date.now(),
          title: newItem.title,
          amount: newItem.amount,
          fileUrl: null,
        }
        qc.setQueryData(['expenses'], {
          expenses: [...previous.expenses, optimistic],
        })
      }
      return { previous }
    },
    onError: (_err, _newItem, ctx) => {
      if (ctx?.previous) qc.setQueryData(['expenses'], ctx.previous)
    },
    onSuccess: () => {
      setTitle('')
      setAmountInput('')
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['expenses'] })
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    if (amountError) {
      setFormError(amountError)
      return
    }

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setFormError('Title is required')
      return
    }

    if (amountInput === '') {
      setFormError('Amount is required')
      return
    }

    mutation.mutate({ title: trimmedTitle, amount: amountValue })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap items-start gap-2 rounded border bg-background p-4">
      <div className="flex flex-1 min-w-[200px] flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" htmlFor="expense-title">
          Title
        </label>
        <input
          id="expense-title"
          className="rounded border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            if (formError) setFormError(null)
          }}
          placeholder="Coffee"
          disabled={mutation.isPending}
        />
      </div>

      <div className="flex w-40 flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" htmlFor="expense-amount">
          Amount
        </label>
        <input
          id="expense-amount"
          className="rounded border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          type="number"
          step="1"
          value={amountInput}
          onChange={(event) => {
            setAmountInput(event.target.value)
            if (formError) setFormError(null)
          }}
          placeholder="12"
          min="1"
          aria-invalid={Boolean(amountError)}
          aria-describedby="expense-amount-help"
          disabled={mutation.isPending}
        />
        <p
          id="expense-amount-help"
          className={`text-xs ${amountError ? 'text-red-600' : 'text-muted-foreground'}`}
        >
          {amountError ? amountError : 'Enter a positive amount.'}
        </p>
      </div>

      <button
        type="submit"
        className="mt-6 rounded bg-black px-3 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        disabled={mutation.isPending || Boolean(amountError)}
      >
        {mutation.isPending ? (
          <span className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Adding…
          </span>
        ) : (
          'Add Expense'
        )}
      </button>

      <div className="basis-full space-y-1">
        {formError && <p className="text-sm text-red-600">{formError}</p>}
        {mutation.isError && (
          <p className="text-sm text-red-600">{mutation.error?.message ?? 'Could not add expense.'}</p>
        )}
      </div>
    </form>
  )
}
