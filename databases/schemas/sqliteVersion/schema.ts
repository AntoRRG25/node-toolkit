

export const createTables = [
  {
    name: 'users',
    sql: `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      nickname TEXT,
      is_active BOOLEAN NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    deps: [],
  },
  {
    name: 'posts',
    sql: `CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      display_name TEXT NOT NULL,
      metadata TEXT,
      tags TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
    );`,
    deps: ['users'],
  },
]
