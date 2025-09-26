* **PUT vs PATCH**: I learned that `PUT` is meant for replacing an entire resource, while `PATCH` is used for partial updates where only some fields change. This distinction helps keep API semantics clear and predictable.

* **Error handling**: Standardizing responses with a consistent `{ "error": { "message": "..." } }` shape makes it easier for clients to parse and handle errors, rather than dealing with inconsistent formats.

* **Validation**: Using Zod for update schemas ensures that invalid or empty updates are rejected early, preventing broken or incomplete data from being saved.

* **Consistency helpers**: The `ok(...)` and `err(...)` functions reduce duplication and enforce uniform success/error responses throughout the API.

* **Practical takeaway**: Building clear CRUD endpoints with proper validation and standardized responses improves both developer experience and reliability when consuming the API.


