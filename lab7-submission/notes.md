* **Caching by key:** `useQuery({ queryKey: ['expenses'] })` caches the list; identical keys share data across components and mounts, so re-renders don’t refetch unless the cache is stale or invalidated.

* **Staleness & refetching:** By default data is “stale” immediately; navigating back to the page or focusing the tab triggers background refetches. Tune with `staleTime` to reduce network chatter when your data rarely changes.

* **Invalidation after mutations:** After `create/delete/update`, call `queryClient.invalidateQueries({ queryKey: ['expenses'] })` to mark the list stale and refetch it—this keeps the UI consistent without manual state wiring.

* **Optimistic updates + rollback:** Use `onMutate` to update the cache instantly (snappy UX), `onError` to roll back if the server fails, and `onSettled` to re-sync. Beware ID collisions and ensure your optimistic shape matches server responses.

* **Common gotchas:** Don’t mix absolute URLs that bypass your dev proxy (leads to CORS and mismatched cookies). Keep **query keys stable** (avoid inline objects/functions) to prevent accidental cache misses. Handle errors in `useMutation` and `useQuery` to avoid silent failures.

