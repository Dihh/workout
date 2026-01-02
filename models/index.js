import { runMigrations } from "./migrations.js"

export const connection = window.indexedDB.open('data', 5)

class Database{
    connection = window.indexedDB.open('data', 5);
    db;
    transaction;
    DB_NAME = "data";
    constructor(){
        connection.onsuccess = (event) => {
            this.db = event.target.result
        }
        connection.onerror = (err) => {
            alert("Failed to open database")
        }
        connection.onupgradeneeded = (event) => {
            const database = event.target.result
            const transaction = event.target.transaction
            runMigrations(database, transaction, event.oldVersion)
        }
    }
}

export const database = new Database()