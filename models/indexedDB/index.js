import { runMigrations } from "./migrations.js"
import { categoryTable } from "./categories.js"

export class Database {
    connection;
    db;
    transaction;
    DB_NAME = "data";
    constructor(DB_NAME = this.DB_NAME) {
        this.DB_NAME = DB_NAME;
    }
    
    async connect() {
        return new Promise((resolve, reject) => {
            this.connection = window.indexedDB.open(this.DB_NAME, 5);
            this.connection.onsuccess = (event) => {
                this.db = event.target.result
                resolve(this.connection)
            }
            this.connection.onerror = (err) => {
                alert("Failed to open database")
                reject()
            }
            this.connection.onupgradeneeded = (event) => {
                const database = event.target.result
                const transaction = event.target.transaction
                runMigrations(database, transaction, event.oldVersion)
            }
        })
    }

    async close(){
        if (this.db){
            this.db.close()
        }
    }

    async delete() {
        const DBDeleteRequest = window.indexedDB.deleteDatabase(this.DB_NAME);
        return new Promise((resolve, reject) => {

            DBDeleteRequest.onerror = function (event) {
                reject(event)
            };

            DBDeleteRequest.onsuccess = function (event) {
                resolve(event)
            };

            DBDeleteRequest.onblocked = function (event) {
                reject(event)
            };
        })
    }

    category = categoryTable
}

export const database = new Database()
database.connect()