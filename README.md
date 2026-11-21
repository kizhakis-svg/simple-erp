# Simple ERP

A lightweight ERP for small businesses: sales invoices, purchase orders, inventory,
customers, suppliers, expenses and employees, with a dashboard.

- **Front end:** plain HTML, CSS and JavaScript (no build step)
- **Database & login:** [Supabase](https://supabase.com) with Row Level Security —
  only signed-in team members can read or write data

## Run it

Serve the folder with any static web server, for example:

```bash
python3 -m http.server 5178
```

Then open http://localhost:5178. The first account created becomes the admin;
the admin adds teammates under **Settings → Team access**.

## Configuration

`config.js` holds the Supabase project URL and its *publishable* key. That key is
meant to be public — data is protected by the database's security policies.
Never put a `service_role` / secret key in this repository.
