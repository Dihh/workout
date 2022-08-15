import { runMigrations } from "./migrations.js"

export const db = window.openDatabase('data', '1.0', 'data', 1 * 1024 * 1024)
runMigrations(db)