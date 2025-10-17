import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'

type UploadExpenseFormProps = {
  expenseId: number
}

type SignResponse = {
  uploadUrl: string
  key: string
}

const FALLBACK_CONTENT_TYPE = 'application/octet-stream'

export function UploadExpenseForm({ expenseId }: UploadExpenseFormProps) {
  const qc = useQueryClient()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const nextFile = event.target.files?.[0] ?? null
    setFile(nextFile)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!file) {
      setError('Please choose a file first.')
      return
    }

    setIsUploading(true)
    const contentType = file.type || FALLBACK_CONTENT_TYPE

    try {
      const signRes = await fetch('/api/upload/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ filename: file.name, type: contentType }),
      })
      if (!signRes.ok) {
        const txt = await signRes.text().catch(() => '')
        throw new Error(txt || `Failed to request upload URL (HTTP ${signRes.status})`)
      }

      const { uploadUrl, key } = (await signRes.json()) as SignResponse

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file,
      })
      if (!uploadRes.ok) {
        const txt = await uploadRes.text().catch(() => '')
        throw new Error(txt || `Failed to upload file (HTTP ${uploadRes.status})`)
      }

      const updateRes = await fetch(`/api/expenses/${expenseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fileKey: key }),
      })
      if (!updateRes.ok) {
        const txt = await updateRes.text().catch(() => '')
        throw new Error(txt || `Failed to save receipt (HTTP ${updateRes.status})`)
      }

      setFile(null)
      if (inputRef.current) {
        inputRef.current.value = ''
      }

      qc.invalidateQueries({ queryKey: ['expenses'] })
      qc.invalidateQueries({ queryKey: ['expenses', expenseId] })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error during upload.'
      setError(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded border bg-background p-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-muted-foreground" htmlFor="expense-receipt">
          Receipt file
        </label>
        <input
          id="expense-receipt"
          ref={inputRef}
          type="file"
          onChange={onFileChange}
          disabled={isUploading}
          className="block w-full cursor-pointer rounded border border-input bg-background text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground file:hover:bg-primary/90 disabled:cursor-not-allowed"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isUploading || !file}
        className="rounded bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
      >
        {isUploading ? 'Uploading…' : 'Upload Receipt'}
      </button>
    </form>
  )
}
