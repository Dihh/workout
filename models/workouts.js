import { db } from './index.js'

export const workout_table = {
    select: () => {
        console.log(1)
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.*, b.name as exercise_name,  c.name as category_name, c.id as category_id
                FROM workouts a 
                JOIN exercises b on a.exercise_id == b.id
                JOIN categories c on b.category_id == c.id
                `, [], (t, result) => {
                    resolve([...result.rows])
                })
            }, (e) => { })
        })
    },
    select_between_date: (initial_date, final_date) => {
        console.log(1)
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.*, b.name as exercise_name,  c.name as category_name, c.id as category_id
                FROM workouts a 
                JOIN exercises b on a.exercise_id == b.id
                JOIN categories c on b.category_id == c.id
                WHERE a.date BETWEEN ? AND ?
                `, [initial_date, final_date], (t, result) => {
                    resolve([...result.rows])
                })
            }, (e) => { })
        })
    },
    select_id: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.*, b.name as exercise_name, c.name as category_name, c.id as category_id
                FROM workouts a 
                JOIN exercises b on a.exercise_id == b.id 
                JOIN categories c on b.category_id == c.id 
                WHERE a.id = ?`, [id], (t, result) => { resolve(result.rows[0]) })
            })
        })
    },
    insert: (workout) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`INSERT INTO workouts (id, date, exercise_id, weight) VALUES (?, ?, ?, ?)`, [workout.id, workout.date, workout.exercise_id, workout.weight])
                resolve()
            })
        })
    },
    update: (workout) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`UPDATE workouts SET date = ?, exercise_id = ?, weight = ? WHERE id = ?`, [workout.date, workout.exercise_id, workout.weight, workout.id])
                resolve()
            })
        })
    },
    delete: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`DELETE FROM workouts WHERE id = ?`, [id])
                resolve()
            })
        })
    },
}