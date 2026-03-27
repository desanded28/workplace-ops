import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "data.db")


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # so we can access columns by name instead of index
    conn.execute("PRAGMA journal_mode=WAL")  # WAL mode = better concurrent read performance
    conn.execute("PRAGMA foreign_keys=ON")
    return conn
