import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTables } from '../schema.js'
import { SqliteDb } from './DatabaseClient.js'
import { generateTypes } from './generateTypes.js'

const db = new SqliteDb(':memory:', [...createTables].reverse())
let outputDir: string
let outputPath: string

describe('generateTypes with SQLite', () => {
  beforeAll(async () => {
    const previousNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'test'
    try {
      db.sync()
    } finally {
      if (previousNodeEnv === undefined) {
        delete process.env.NODE_ENV
      } else {
        process.env.NODE_ENV = previousNodeEnv
      }
    }

    outputDir = await mkdtemp(path.join(tmpdir(), 'sqlite-generate-types-'))
    outputPath = path.join(outputDir, 'db.types.ts')
  })

  afterAll(async () => {
    try {
      db.db.close()
    } finally {
      if (outputDir) await rm(outputDir, { recursive: true, force: true })
    }
  })

  it('creates tables in dependency order and enforces the foreign key', () => {
    expect(db.db.pragma('foreign_key_list(posts)')).toHaveLength(1)
    const userId = db.db.prepare('INSERT INTO users (email) VALUES (?)').run('user@example.test').lastInsertRowid
    const user = db.db.prepare('SELECT is_active FROM users WHERE id = ?').get(userId) as { is_active: number }
    expect(user.is_active).toBe(1)

    expect(() => {
      db.db.prepare(`
        INSERT INTO posts (user_id, title, display_name, tags)
        VALUES (?, ?, ?, ?)
      `).run(999, 'Orphan post', 'Nobody', '[]')
    }).toThrow()
  })

  it('generates interfaces with SQLite column types and nullability', async () => {
    const previousNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    try {
      generateTypes(db.db, outputPath)
    } finally {
      if (previousNodeEnv === undefined) {
        delete process.env.NODE_ENV
      } else {
        process.env.NODE_ENV = previousNodeEnv
      }
    }

    const generated = await readFile(outputPath, 'utf8')

    expect(generated).toContain('export interface Users {')
    expect(generated).toContain('id: number')
    expect(generated).toContain('email: string')
    expect(generated).toContain('nickname: string | null')
    expect(generated).toContain('is_active: number')
    expect(generated).toContain('created_at: string')

    expect(generated).toContain('export interface Posts {')
    expect(generated).toContain('user_id: number')
    expect(generated).toContain('metadata: string | null')
    expect(generated).toContain('tags: string')
  })
})
