const migrations = [
    {
        version: 1,
        migration: async (db, transaction) => {
            const categories = db.createObjectStore("categories", {
                keyPath: "id"
            })
            categories.createIndex("name", "name", { unique: false })

            const exercises = db.createObjectStore("exercises", {
                keyPath: "id"
            })
            exercises.createIndex("name", "name", { unique: false })
            exercises.createIndex("category_id", "category_id", { unique: false })

            const workouts = db.createObjectStore("workouts", {
                keyPath: "id"
            })
            workouts.createIndex("date", "date", { unique: false })
            workouts.createIndex("weight", "weight", { unique: false })
            workouts.createIndex("exercise_id", "exercise_id", { unique: false })
            workouts.createIndex("date-exercise_id", ["date", "exercise_id"], { unique: false })
        }
    },
    {
        version: 2,
        migration: async (db, transaction) => {
            await renameTable(db, transaction, "workouts", "days_workouts")
        }
    },
    {
        version: 3,
        migration: async (db, transaction) => {
            await addTableColumn(db, transaction, "days_workouts", {
                "name": "executed",
                "index": "executed",
                "metadata": { unique: false },
                "default": "true"
            })
        }
    },
    {
        version: 4,
        migration: async (db, transaction) => {
            const workouts = db.createObjectStore("workouts", {
                keyPath: "id"
            })
            workouts.createIndex("name", "name", { unique: false })
        }
    },
    {
        version: 5,
        migration: async (db, transaction) => {
            const workouts = db.createObjectStore("workouts_exercises", {
                keyPath: "id"
            })
            workouts.createIndex("workout_id", "workout_id", { unique: false })
            workouts.createIndex("exercise_id", "exercise_id", { unique: false })
        }
    }
]

function renameTable(db, transaction, oldTableName, newTableName) {
    return new Promise((resolve, reject) => {
        const objectStore = db.createObjectStore(newTableName, { keyPath: 'id' });
        if (db.objectStoreNames.contains(oldTableName)) {
            const oldStore = transaction.objectStore(oldTableName);
            const indexNames = oldStore.indexNames;
            Array.from(indexNames).forEach(name => {
                const index = oldStore.index(name);
                objectStore.createIndex(index.name, index.keyPath, { unique: index.unique, multiEntry:  index.multiEntry})
            })
            oldStore.openCursor().onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    objectStore.add(cursor.value);
                    cursor.continue();
                } else {
                    db.deleteObjectStore(oldTableName);
                    resolve()
                }
            };
        } else {
            resolve()
        }
    })
}

function addTableColumn(db, transaction, table, column) {
    return new Promise((resolve, reject) => {
        if (db.objectStoreNames.contains(table)) {
            const objectStore = transaction.objectStore(table);
            if (!objectStore.indexNames.contains(column.index)) {
                objectStore.createIndex(column.name, column.index, column.metadata)
                objectStore.openCursor().onsuccess = function (event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        cursor.value[column.index] = column.default
                        objectStore.put(cursor.value);
                        cursor.continue();
                    } else {
                        resolve()
                    }
                };
            } else {
                resolve()
            }
        } else {
            resolve()
        }
    })
}

export async function runMigrations(db, transaction, version) {
    const pendingMigrations = migrations.filter(migration => migration.version > version)
    for (let migration of pendingMigrations) {
        await migration.migration(db, transaction)
    }
}