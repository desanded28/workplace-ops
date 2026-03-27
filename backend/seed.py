"""Seed the database with realistic Jira Cloud Migration data."""

import sqlite3
import os
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "data.db")

SCHEMA = """
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'backlog',
    assignee TEXT,
    department TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    due_date TEXT,
    blockers TEXT,
    tool TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS automations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    trigger_event TEXT NOT NULL,
    action TEXT NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS automation_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    automation_id INTEGER NOT NULL,
    fired_at TEXT NOT NULL,
    details TEXT,
    FOREIGN KEY (automation_id) REFERENCES automations(id)
);

CREATE TABLE IF NOT EXISTS integrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tool TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'connected',
    last_sync TEXT,
    items_synced INTEGER DEFAULT 0,
    icon TEXT
);

CREATE TABLE IF NOT EXISTS progress_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    week_label TEXT NOT NULL,
    week_date TEXT NOT NULL,
    backlog INTEGER NOT NULL DEFAULT 0,
    in_progress INTEGER NOT NULL DEFAULT 0,
    review INTEGER NOT NULL DEFAULT 0,
    done INTEGER NOT NULL DEFAULT 0
);
"""

TASKS = [
    # Engineering (6 tasks)
    ("Migrate Engineering project boards to Jira Cloud", "Export all active sprints, backlogs, and custom fields from Jira Server", "done", "Sarah Chen", "Engineering", "critical", -45, None, "jira"),
    ("Configure CI/CD pipeline webhooks in Jira Cloud", "Set up automated build status updates in Jira issues", "done", "Sarah Chen", "Engineering", "high", -30, None, "jira"),
    ("Set up Engineering Confluence space hierarchy", "Recreate team spaces, templates, and permission groups", "review", "Marcus Rivera", "Engineering", "high", -10, None, "confluence"),
    ("Migrate code review workflows to Jira Cloud", "Configure custom workflow for PR review tracking", "in_progress", "Sarah Chen", "Engineering", "medium", 5, None, "jira"),
    ("Build Airtable integration for release tracking", "Sync release milestones between Jira and Airtable", "in_progress", "Marcus Rivera", "Engineering", "medium", 14, None, "airtable"),
    ("Configure Engineering dashboard in Jira Cloud", "Build team velocity and sprint burndown dashboards", "backlog", "Sarah Chen", "Engineering", "low", 21, None, "jira"),

    # Marketing (5 tasks)
    ("Migrate Marketing campaign tracking to Jira Cloud", "Move campaign project boards and custom issue types", "done", "Elena Petrov", "Marketing", "critical", -40, None, "jira"),
    ("Set up Confluence spaces for Marketing briefs", "Create templates for campaign briefs, brand guidelines", "done", "Elena Petrov", "Marketing", "high", -25, None, "confluence"),
    ("Build Airtable content calendar integration", "Sync editorial calendar between Airtable and Jira", "review", "Aisha Patel", "Marketing", "high", -5, None, "airtable"),
    ("Configure Marketing approval workflows", "Set up multi-stage approval process for campaign assets", "in_progress", "Elena Petrov", "Marketing", "medium", 10, None, "jira"),
    ("Migrate social media tracking boards", "Move social scheduling and analytics boards to Cloud", "backlog", "Aisha Patel", "Marketing", "low", 28, None, "jira"),

    # Finance (5 tasks)
    ("Migrate Finance approval workflows to Jira Cloud", "Move purchase order and expense approval boards", "done", "James O'Brien", "Finance", "critical", -42, None, "jira"),
    ("Configure Airtable integrations for budget tracking", "Sync quarterly budget data between systems", "review", "James O'Brien", "Finance", "high", -8, None, "airtable"),
    ("Set up Confluence for financial documentation", "Migrate financial policies, audit trails, SOX docs", "in_progress", "Tom Mueller", "Finance", "high", 3, "Waiting for compliance review", "confluence"),
    ("Build automated invoice processing workflow", "Configure Jira automation for invoice approval routing", "backlog", "James O'Brien", "Finance", "medium", 20, None, "jira"),
    ("Migrate Finance reporting dashboards", "Recreate monthly/quarterly reporting views in Cloud", "backlog", "Tom Mueller", "Finance", "low", 30, None, "jira"),

    # HR (5 tasks)
    ("Migrate HR onboarding workflows to Jira Cloud", "Move new hire onboarding checklists and automations", "done", "Aisha Patel", "HR", "critical", -38, None, "jira"),
    ("Create Confluence spaces for HR policies", "Migrate employee handbook, benefits docs, org charts", "done", "Aisha Patel", "HR", "high", -20, None, "confluence"),
    ("Build Airtable integration for recruiting pipeline", "Sync candidate tracking between ATS and Jira", "in_progress", "Tom Mueller", "HR", "medium", 8, None, "airtable"),
    ("Configure employee offboarding automation", "Set up automated task creation for offboarding process", "backlog", "Aisha Patel", "HR", "medium", 18, None, "jira"),
    ("Migrate training management boards", "Move L&D tracking and certification boards to Cloud", "backlog", "Tom Mueller", "HR", "low", 35, None, "jira"),

    # Product (5 tasks)
    ("Migrate Product roadmap boards to Jira Cloud", "Export roadmap views, epics, and cross-team links", "done", "Marcus Rivera", "Product", "critical", -35, None, "jira"),
    ("Set up Confluence for product specs and PRDs", "Create PRD templates and product wiki structure", "review", "Marcus Rivera", "Product", "high", -12, None, "confluence"),
    ("Configure Airtable for feature request tracking", "Build integration for customer feedback pipeline", "in_progress", "Elena Petrov", "Product", "medium", 6, None, "airtable"),
    ("Build cross-team dependency tracking", "Configure advanced roadmap with team dependencies", "backlog", "Marcus Rivera", "Product", "high", 15, "Requires Jira Premium license", "jira"),
    ("Migrate beta testing feedback boards", "Move user testing and feedback collection workflows", "backlog", "Elena Petrov", "Product", "low", 25, None, "jira"),

    # Operations (6 tasks)
    ("Migrate Operations ticketing to Jira Cloud", "Move IT helpdesk and facilities request boards", "done", "Tom Mueller", "Operations", "critical", -44, None, "jira"),
    ("Set up Confluence for SOPs and runbooks", "Migrate standard operating procedures and incident docs", "done", "Tom Mueller", "Operations", "high", -28, None, "confluence"),
    ("Build Airtable integration for vendor management", "Sync vendor contacts and contract tracking", "review", "James O'Brien", "Operations", "medium", -3, None, "airtable"),
    ("Configure incident management workflow", "Set up P1-P4 incident escalation in Jira Cloud", "in_progress", "Tom Mueller", "Operations", "critical", 2, None, "jira"),
    ("Migrate asset management tracking", "Move hardware/software inventory boards to Cloud", "backlog", "James O'Brien", "Operations", "medium", 22, None, "jira"),
    ("Build automated SLA reporting", "Configure Jira SLA tracking for operations tickets", "backlog", "Tom Mueller", "Operations", "low", 32, None, "jira"),
]

AUTOMATIONS = [
    ("Auto-notify on Critical Priority", "Task priority set to critical", "Send Slack notification to #critical-alerts channel", 1),
    ("Sync Completed Tasks to Airtable", "Task moves to Done", "Create corresponding record in Airtable tracking sheet", 1),
    ("Update Confluence Migration Status", "Department reaches 75% completion", "Update Confluence migration dashboard page", 1),
    ("Auto-assign Blocker Review", "Task has blocker added", "Assign review to department lead and notify PM", 0),
    ("Weekly Progress Report", "Every Monday at 9:00 AM", "Generate and email weekly migration progress report", 1),
    ("Overdue Task Escalation", "Task passes due date", "Notify project manager and escalate priority", 1),
]

INTEGRATIONS = [
    ("jira", "Jira Cloud", "connected", 247, "jira"),
    ("confluence", "Confluence", "connected", 89, "confluence"),
    ("airtable", "Airtable", "connected", 156, "airtable"),
    ("figma", "Figma", "disconnected", 0, "figma"),
]


def seed():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SCHEMA)

    now = datetime.utcnow()

    # Seed tasks
    for title, desc, status, assignee, dept, priority, due_offset, blockers, tool in TASKS:
        due = (now + timedelta(days=due_offset)).strftime("%Y-%m-%d") if due_offset else None
        created = (now - timedelta(days=abs(due_offset) + 10)).isoformat() + "Z"
        updated = (now - timedelta(days=max(0, -due_offset) if due_offset and due_offset < 0 else 1)).isoformat() + "Z"
        conn.execute(
            "INSERT INTO tasks (title, description, status, assignee, department, priority, due_date, blockers, tool, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            (title, desc, status, assignee, dept, priority, due, blockers, tool, created, updated),
        )

    # Seed automations
    for name, trigger, action, enabled in AUTOMATIONS:
        created = (now - timedelta(days=30)).isoformat() + "Z"
        conn.execute(
            "INSERT INTO automations (name, trigger_event, action, enabled, created_at) VALUES (?,?,?,?,?)",
            (name, trigger, action, enabled, created),
        )

    # Seed automation log
    log_entries = [
        (1, 2, "Critical task escalated: Configure incident management workflow"),
        (2, 1, "Synced to Airtable: Migrate Engineering project boards"),
        (5, 0, "Weekly report generated — 62% overall completion"),
        (6, 3, "Overdue escalation: Set up Confluence for financial documentation"),
        (1, 4, "Critical task escalated: Migrate Operations ticketing"),
        (2, 5, "Synced to Airtable: Migrate HR onboarding workflows"),
        (3, 6, "Confluence updated: Engineering at 83% completion"),
        (5, 7, "Weekly report generated — 58% overall completion"),
        (6, 8, "Overdue escalation: Build Airtable content calendar"),
        (2, 9, "Synced to Airtable: Set up Confluence for SOPs"),
        (1, 10, "Critical task escalated: Migrate Finance approval workflows"),
        (5, 11, "Weekly report generated — 52% overall completion"),
        (2, 12, "Synced to Airtable: Migrate Marketing campaign tracking"),
        (6, 13, "Overdue escalation: Configure Airtable for budget tracking"),
        (3, 14, "Confluence updated: Operations at 75% completion"),
    ]
    for auto_id, days_ago, details in log_entries:
        fired = (now - timedelta(days=days_ago, hours=days_ago * 3)).isoformat() + "Z"
        conn.execute(
            "INSERT INTO automation_log (automation_id, fired_at, details) VALUES (?,?,?)",
            (auto_id, fired, details),
        )

    # Seed integrations
    sync_time = (now - timedelta(minutes=5)).isoformat() + "Z"
    for tool, display, status, items, icon in INTEGRATIONS:
        ls = sync_time if status == "connected" else None
        conn.execute(
            "INSERT INTO integrations (tool, display_name, status, last_sync, items_synced, icon) VALUES (?,?,?,?,?,?)",
            (tool, display, status, ls, items, icon),
        )

    # Seed 12 weeks of progress snapshots
    total = 32
    for w in range(1, 13):
        week_date = (now - timedelta(weeks=12 - w)).strftime("%Y-%m-%d")
        # Simulate realistic migration progress
        done = min(total, int(total * (w / 12) ** 1.3))
        review = min(total - done, max(0, int(3 + w * 0.5)))
        in_prog = min(total - done - review, max(0, int(4 + w * 0.3)))
        backlog = total - done - review - in_prog
        conn.execute(
            "INSERT INTO progress_snapshots (week_label, week_date, backlog, in_progress, review, done) VALUES (?,?,?,?,?,?)",
            (f"Week {w}", week_date, backlog, in_prog, review, done),
        )

    conn.commit()
    conn.close()
    print(f"Database seeded at {DB_PATH}")
    print(f"  Tasks: {len(TASKS)}")
    print(f"  Automations: {len(AUTOMATIONS)}")
    print(f"  Log entries: {len(log_entries)}")
    print(f"  Integrations: {len(INTEGRATIONS)}")
    print(f"  Progress snapshots: 12 weeks")


if __name__ == "__main__":
    seed()
