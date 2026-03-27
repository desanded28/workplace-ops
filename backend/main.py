"""Workplace Ops Dashboard — FastAPI Backend"""

from contextlib import asynccontextmanager
from datetime import datetime
from typing import Optional
import asyncio

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from database import get_db
from models import TaskCreate, TaskUpdate


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="Workplace Ops Dashboard API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def row_to_dict(row) -> dict:
    return dict(row) if row else None


# ---------------------------------------------------------------------------
# Tasks
# ---------------------------------------------------------------------------

@app.get("/api/tasks")
def list_tasks(
    status: Optional[str] = None,
    department: Optional[str] = None,
    priority: Optional[str] = None,
    tool: Optional[str] = None,
):
    db = get_db()
    query = "SELECT * FROM tasks WHERE 1=1"  # 1=1 so we can always append AND clauses
    params = []
    if status:
        query += " AND status = ?"
        params.append(status)
    if department:
        query += " AND department = ?"
        params.append(department)
    if priority:
        query += " AND priority = ?"
        params.append(priority)
    if tool:
        query += " AND tool = ?"
        params.append(tool)
    # sort critical stuff to the top, then most recent first within each priority
    query += " ORDER BY CASE priority WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END, created_at DESC"
    rows = db.execute(query, params).fetchall()
    db.close()
    return [row_to_dict(r) for r in rows]


@app.post("/api/tasks", status_code=201)
def create_task(task: TaskCreate):
    db = get_db()
    now = datetime.utcnow().isoformat() + "Z"
    cursor = db.execute(
        "INSERT INTO tasks (title, description, status, assignee, department, priority, due_date, blockers, tool, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        (task.title, task.description, task.status.value, task.assignee, task.department, task.priority.value, task.due_date, task.blockers, task.tool.value, now, now),
    )
    db.commit()
    row = db.execute("SELECT * FROM tasks WHERE id = ?", (cursor.lastrowid,)).fetchone()
    db.close()
    return row_to_dict(row)


@app.put("/api/tasks/{task_id}")
def update_task(task_id: int, update: TaskUpdate):
    db = get_db()
    existing = db.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if not existing:
        db.close()
        raise HTTPException(status_code=404, detail="Task not found")

    fields = []
    params = []
    for field, value in update.model_dump(exclude_none=True).items():
        # pydantic enums have a .value attr — unwrap so we store the string not the enum
        if hasattr(value, "value"):
            value = value.value
        fields.append(f"{field} = ?")
        params.append(value)

    if not fields:
        db.close()
        return row_to_dict(existing)

    fields.append("updated_at = ?")
    params.append(datetime.utcnow().isoformat() + "Z")
    params.append(task_id)

    db.execute(f"UPDATE tasks SET {', '.join(fields)} WHERE id = ?", params)
    db.commit()
    row = db.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    db.close()
    return row_to_dict(row)


@app.delete("/api/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    db = get_db()
    existing = db.execute("SELECT id FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if not existing:
        db.close()
        raise HTTPException(status_code=404, detail="Task not found")
    db.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    db.commit()
    db.close()


@app.get("/api/tasks/stats")
def task_stats():
    db = get_db()
    rows = db.execute("SELECT * FROM tasks").fetchall()
    db.close()

    tasks = [row_to_dict(r) for r in rows]
    total = len(tasks)
    done = sum(1 for t in tasks if t["status"] == "done")
    today = datetime.utcnow().strftime("%Y-%m-%d")
    overdue = sum(1 for t in tasks if t["due_date"] and t["due_date"] < today and t["status"] != "done")

    # rough avg completion time — uses updated_at as a proxy for "done date"
    completion_days = []
    for t in tasks:
        if t["status"] == "done" and t["created_at"] and t["updated_at"]:
            try:
                c = datetime.fromisoformat(t["created_at"].rstrip("Z"))
                u = datetime.fromisoformat(t["updated_at"].rstrip("Z"))
                completion_days.append((u - c).days)
            except ValueError:
                pass
    avg_days = round(sum(completion_days) / len(completion_days), 1) if completion_days else 0

    # By department
    depts: dict[str, dict] = {}
    for t in tasks:
        d = t["department"]
        if d not in depts:
            depts[d] = {"total": 0, "done": 0}
        depts[d]["total"] += 1
        if t["status"] == "done":
            depts[d]["done"] += 1

    by_dept = [{"department": k, "total": v["total"], "done": v["done"], "rate": round(v["done"] / v["total"] * 100, 1) if v["total"] else 0} for k, v in depts.items()]

    # By tool
    tools: dict[str, int] = {}
    for t in tasks:
        tools[t["tool"]] = tools.get(t["tool"], 0) + 1

    by_tool = [{"tool": k, "count": v} for k, v in tools.items()]

    return {
        "total": total,
        "completed": done,
        "completion_rate": round(done / total * 100, 1) if total else 0,
        "overdue": overdue,
        "avg_completion_days": avg_days,
        "by_department": by_dept,
        "by_tool": by_tool,
    }


# ---------------------------------------------------------------------------
# Automations
# ---------------------------------------------------------------------------

@app.get("/api/automations")
def list_automations():
    db = get_db()
    rows = db.execute("SELECT * FROM automations ORDER BY id").fetchall()
    db.close()
    return [row_to_dict(r) for r in rows]


@app.put("/api/automations/{auto_id}/toggle")
def toggle_automation(auto_id: int):
    db = get_db()
    existing = db.execute("SELECT * FROM automations WHERE id = ?", (auto_id,)).fetchone()
    if not existing:
        db.close()
        raise HTTPException(status_code=404, detail="Automation not found")
    new_val = 0 if existing["enabled"] else 1
    db.execute("UPDATE automations SET enabled = ? WHERE id = ?", (new_val, auto_id))
    db.commit()
    row = db.execute("SELECT * FROM automations WHERE id = ?", (auto_id,)).fetchone()
    db.close()
    return row_to_dict(row)


@app.get("/api/automations/log")
def automation_log():
    db = get_db()
    rows = db.execute("""
        SELECT al.id, al.automation_id, a.name as automation_name, al.fired_at, al.details
        FROM automation_log al
        JOIN automations a ON al.automation_id = a.id
        ORDER BY al.fired_at DESC
        LIMIT 50
    """).fetchall()
    db.close()
    return [row_to_dict(r) for r in rows]


# ---------------------------------------------------------------------------
# Integrations
# ---------------------------------------------------------------------------

@app.get("/api/integrations")
def list_integrations():
    db = get_db()
    rows = db.execute("SELECT * FROM integrations ORDER BY id").fetchall()
    db.close()
    return [row_to_dict(r) for r in rows]


@app.post("/api/integrations/{tool}/test")
async def test_integration(tool: str):
    await asyncio.sleep(0.5)  # fake latency so the UI loading state actually shows up
    db = get_db()
    row = db.execute("SELECT * FROM integrations WHERE tool = ?", (tool,)).fetchone()
    db.close()
    if not row:
        raise HTTPException(status_code=404, detail="Integration not found")
    if row["status"] == "disconnected":
        raise HTTPException(status_code=503, detail=f"{row['display_name']} is not connected. Configure credentials to enable.")
    return {"success": True, "message": f"{row['display_name']} connection verified successfully"}


# ---------------------------------------------------------------------------
# Reports
# ---------------------------------------------------------------------------

@app.get("/api/reports/progress")
def get_progress():
    db = get_db()
    rows = db.execute("SELECT * FROM progress_snapshots ORDER BY week_date").fetchall()
    db.close()
    return [row_to_dict(r) for r in rows]


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.get("/health")
def health():
    return {"status": "ok", "service": "workplace-ops-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8007, reload=True)
