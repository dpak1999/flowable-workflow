# Local JSON Server

This project uses `json-server` for local CRUD without custom API code.

Start the server:

```bash
npm run server
```

The server runs at:

```txt
http://localhost:3000
```

Available table:

```txt
/workflows
```

Each table supports the usual JSON CRUD operations:

```txt
GET    /workflows
GET    /workflows/wf-001
POST   /workflows
PUT    /workflows/wf-001
PATCH  /workflows/wf-001
DELETE /workflows/wf-001
```

Workflow rows currently use this shape:

```json
{
  "id": "wf-001",
  "name": "Employee onboarding",
  "createdAt": "2026-05-02T09:00:00.000Z"
}
```
