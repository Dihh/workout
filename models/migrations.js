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
                t.executeSql('ALTER TABLE workouts RENAME TO days_workouts', [], (t, r) => { }, (t, e) => { })
            })
            localStorage.migrationVersion = 1
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