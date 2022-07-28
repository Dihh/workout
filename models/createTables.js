export function createTables(db) {
    db.transaction(t => { t.executeSql('CREATE TABLE categories (id TEXT, name TEXT)') })
    db.transaction(t => { t.executeSql('CREATE TABLE exercises (id TEXT, name TEXT, category_id TEXT)') })
    db.transaction(t => { t.executeSql('CREATE TABLE workouts (id TEXT, date DATE, weight NUMBER, exercise_id TEXT)') })
}
