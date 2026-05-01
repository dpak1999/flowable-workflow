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

Available starter tables:

```txt
/workflows
/forms
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

Edit `db.json` to add more top-level arrays. Each array becomes a table-like resource automatically.
