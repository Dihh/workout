const migrations = [
    {
        version: 0,
        migration: (db) => {
            db.transaction(t => { t.executeSql('CREATE TABLE categories (id TEXT, name TEXT)') })
            db.transaction(t => { t.executeSql('CREATE TABLE exercises (id TEXT, name TEXT, category_id TEXT)') })
            db.transaction(t => { t.executeSql('CREATE TABLE workouts (id TEXT, date DATE, weight NUMBER, exercise_id TEXT)') })
            localStorage.migrationVersion = 0
        }
    },
    {
        version: 1,
        migration: (db) => {
            db.transaction(t => {
                t.executeSql('ALTER TABLE workouts RENAME TO days_workouts', [], (t, r) => {
                    localStorage.migrationVersion = 1
                }, (t, e) => {
                    console.log(e)
                })
            })
        }
    },
    {
        version: 2,
        migration: (db) => {
            db.transaction(t => {
                t.executeSql('ALTER TABLE days_workouts ADD COLUMN executed BOOLEAN', [], (t, r) => {
                    localStorage.migrationVersion = 2
                }, (t, e) => {
                    console.log(e)
                })
            })
            db.transaction(t => {
                t.executeSql('UPDATE days_workouts SET executed = true', [], (t, r) => {
                    localStorage.migrationVersion = 2
                }, (t, e) => {
                    console.log(e)
                })
            })
        }
    },
    {
        version: 3,
        migration: (db) => {
            db.transaction(t => {
                t.executeSql('CREATE TABLE workouts (id TEXT, name TEXT)', [], (t, r) => {
                    localStorage.migrationVersion = 3
                }, (t, e) => {
                    console.log(e)
                })
            })
        }
    },
    {
        version: 4,
        migration: (db) => {
            db.transaction(t => {
                t.executeSql('CREATE TABLE workouts_exercises (id TEXT, workout_id TEXT, exercise_id TEXT)', [], (t, r) => {
                    localStorage.migrationVersion = 4
                }, (t, e) => {
                    console.log(e)
                })
            })
        }
    }
]

export function runMigrations(db) {
    if (!localStorage.migrationVersion) {
        migrations[0].migration(db)
    }
    const pendingMigrations = migrations.filter(migration => migration.version > parseInt(localStorage.migrationVersion))
    pendingMigrations.forEach(migration => {
        migration.migration(db)
    });
}