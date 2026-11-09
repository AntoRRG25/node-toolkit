// import envConfig from './envConfig.js'
// import { SqliteDb, Table } from './dbConfigs/DatabaseClient.js'
// import logger from './logger.js'

// const nameOfDb = (): string => {
//   const url = envConfig.DatabasePath
//   if (!url) return 'unknown'
//   const parts = url.split('/')
//   return parts[parts.length - 1] || 'unknown'
// }

// import { users, patients, patient_relations, history_entry,  diagnosis, treatment, sessions, log } from '../Schema/schema.js'

// // Aquí puedes definir tus esquemas de tabla para auto-crearse si no existen
// const initialTables: Table[] = [
//   users,
//   patients,
//   patient_relations,
//   history_entry,
//   diagnosis,
//   treatment,
//   sessions,
//   log
// ]

// // Calculamos la ruta. Si estamos en test usamos memoria RAM pura para mayor velocidad.
// const dbPath = envConfig.DatabasePath

// const db = new SqliteDb(dbPath, initialTables)

// async function startUp (syncing: boolean= false, reset: boolean = false){
//   const messageRestart:string = `🔄 Restarting database "${nameOfDb()}" for testing...`
//   const messageExec:string = '🧪  Database testing setup executed'
//   const messageSuccess:string = `🟢 Database SQLite initialized successfully at ${dbPath}!!`
//   try {
//     if(syncing=== true && reset === true){
//       logger.info(messageRestart)
//       console.log(messageRestart)
//       db.sync({ force: true })
//       logger.info(messageExec)
//       console.log(messageExec)
//     } else if(syncing=== true){
//       // Sincroniza (crea) las tablas definidas en initialTables si no existen
//       db.sync()
//     }
    
//     // Verificamos que la conexión funciona (síncrono)
//     db.authenticate()
//     logger.info(messageSuccess)
//     console.log(messageSuccess)
//   } catch (error) {
//     logger.error(error)
//     console.error('❌ Error starting database: ', error)
//   }
// }

// async function closeDatabase() {
//   try {
//     // Cerramos la conexión a la base de datos (síncrono)
//     db.db.close()
//     console.log(`🛑 Database SQLite disconnected successfully.`)
//   } catch (error) {
//     console.error('❌ Error closing database:', error)
//   }
// }

// export {
//     db,
//     startUp,
//     closeDatabase
// }
/*  // 1. validar DB
  await pool.query('SELECT 1')
  console.log('🟢 Database ready')*/