# Workplace Ops Dashboard

Internal tool for managing office operations — desk bookings, room reservations, and facility requests. Built as a full-stack app with a Python backend and React frontend.

## Features

- Desk booking with floor plan view
- Meeting room reservations with conflict detection
- Facility/maintenance request tracking
- Admin panel for managing spaces and viewing usage stats

## Stack

- **Backend:** Python, FastAPI, SQLite
- **Frontend:** React, TypeScript, Tailwind CSS
- **ORM:** Raw SQL via Python's sqlite3 (no ORM for this one — wanted to keep it lightweight)

## Running it

```bash
# seed the database
cd backend && pip install -r requirements.txt && python seed.py

# start backend
python main.py

# start frontend
cd ../frontend && npm install && npm run dev
```

## Notes

Built this as a practical exercise in CRUD-heavy apps. Most of the complexity is in the booking conflict logic — making sure you can't double-book a desk or room, handling recurring reservations, and dealing with timezone edge cases. The frontend is straightforward but I focused on making the booking flow feel fast (optimistic updates, immediate feedback).
