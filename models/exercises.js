import { db } from './index.js'

export const exerciseTable = {
    select: () => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.*, b.name as category_name 
                FROM exercises a 
                JOIN categories b on a.category_id == b.id`, [], (t, result) => { resolve([...result.rows]) })
            })
        })
    },
    select_id: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.*, b.name as category_name 
                FROM exercises a 
                JOIN categories b on a.category_id == b.id 
                WHERE a.id = ?`, [id], (t, result) => { resolve(result.rows[0]) })
            })
        })
    },
    insert: (exercise) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`INSERT INTO exercises (id, name, category_id) VALUES (?, ?, ?)`, [exercise.id, exercise.name, exercise.category_id])
                resolve()
            })
        })
    },
    update: (exercise) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`UPDATE exercises SET name = ?, category_id = ? WHERE id = ?`, [exercise.name, exercise.category_id, exercise.id])
                resolve()
            })
        })
    },
    delete: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`DELETE FROM exercises WHERE id = ?`, [id])
                resolve()
            })
        })
    },
}