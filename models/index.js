import { createTables } from "./createTables.js"

export const db = window.openDatabase('data', '1.0', 'data', 1 * 1024 * 1024)
createTables(db)