from pydantic import BaseModel
from typing import Optional
from enum import Enum


class TaskStatus(str, Enum):
    backlog = "backlog"
    in_progress = "in_progress"
    review = "review"
    done = "done"


class Priority(str, Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"


class Tool(str, Enum):
    jira = "jira"
    confluence = "confluence"
    airtable = "airtable"


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.backlog  # new tasks land in backlog by default
    assignee: Optional[str] = None
    department: str
    priority: Priority = Priority.medium
    due_date: Optional[str] = None
    blockers: Optional[str] = None
    tool: Tool


# all fields optional so you can PATCH just the ones you want to change
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    assignee: Optional[str] = None
    department: Optional[str] = None
    priority: Optional[Priority] = None
    due_date: Optional[str] = None
    blockers: Optional[str] = None
    tool: Optional[Tool] = None
