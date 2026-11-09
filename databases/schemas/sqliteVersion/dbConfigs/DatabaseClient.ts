import Database from 'better-sqlite3'
import { generateTypes } from './generateTypes.js'

export interface Table {
    name: string
    sql: string
    deps: string[]
}

export interface SyncOptions {
    force?: boolean
}

export interface ISqliteDb {
    path: string;
    tables: Table[];
    db: Database.Database;
    authenticate(): boolean;
    sync(options?: SyncOptions): void;
}

export class SqliteDb implements ISqliteDb {
    path: string
    tables: Table[]
    db: Database.Database

    constructor(path: string, tables: Table[]) {
        this.path = path
        this.tables = tables
        // In-memory db can be initiated passing ':memory:'
        this.db = new Database(this.path)//, { verbose: console.log }) // Remove verbose in prod if noisy
        // Enables foreign keys in SQLite
        this.db.pragma('foreign_keys = ON');
        
        // Activar modo WAL (Write-Ahead Logging) para mejor rendimiento en red/concurrencia
        this.db.pragma('journal_mode = WAL');
    }

    authenticate(): boolean {
            const stmt = this.db.prepare('SELECT 1 as status')
            const result = stmt.get()
            if (result) {
                return true
            } else {
                throw new Error('Database file could not be read properly')
            }
    }

    sync(options: SyncOptions = {}): void {
        const orderedTables = this.sortTablesByDeps(this.tables)
        const { force = false } = options

        if (force) {
            console.log('🧨 Dropping tables...')
            // Reverse order for dropping
            for (const table of [...orderedTables].reverse()) {
                // SQLite uses IF EXISTS naturally
                this.db.exec(`DROP TABLE IF EXISTS ${table.name};`)
            }
        }

        console.log('📐 Creating tables...')
        for (const table of orderedTables) {
            this.db.exec(table.sql)
        }

        console.log('✅ Sync complete')
        
        // Generate typescript definitions after sync
        generateTypes(this.db)
    }

    private sortTablesByDeps(tables: Table[]): Table[] {
        const sorted: Table[] = []
        const visited = new Set<string>()

        const visit = (table: Table) => {
            if (visited.has(table.name)) return
            visited.add(table.name)

            table.deps.forEach(depName => {
                const dep = tables.find(t => t.name === depName)
                if (!dep) throw new Error(`Missing dependency ${depName}`)
                visit(dep)
            })

            sorted.push(table)
        }

        tables.forEach(visit)
        return sorted
    }
}
